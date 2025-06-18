"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { constructFileUrl, getFileType, parseStringify } from "@/lib/utils";
import { getCurrentUser } from "@/lib/action/user.action";
import { InputFile } from "node-appwrite/file";
import { ID, Models, Query } from "node-appwrite";

const handleError = (error: unknown, message: string) => {
    console.log(error, message);
    throw error;
};

export const uploadFile = async ( { file, ownerId, accountId, path }: UploadFileProps) => {
    // Create an admin client to interact with Appwrite services
    const { storage, databases } = await createAdminClient();

    // console.log("Uploading file: ", file);

    try {
        const inputFile = InputFile.fromBuffer(file, file.name);        // Create an Appwrite-specific InputFile object using the file buffer and name

        // Upload the file to the specified bucket in Appwrite storage
        const bucketFile = await storage.createFile (
            appwriteConfig.bucketId,
            ID.unique(),
            inputFile,
        )

        // Create a file document object to store metadata about the uploaded file
        const fileDoucment = {
            type: getFileType(bucketFile.name).type,
            name: bucketFile.name,
            url: constructFileUrl(bucketFile.$id),
            extension: getFileType(bucketFile.name).extension,
            size: bucketFile.sizeOriginal,
            owner: ownerId,
            accountId,
            users: [],
            bucketFileId: bucketFile.$id,
        }
        // console.log("File document to be created: ", fileDoucment);

        // Create a new document in the specified collection to store the file metadata
        const newFile = await databases
            .createDocument (
                appwriteConfig.databaseId,
                appwriteConfig.filesCollectionId,
                ID.unique(),
                fileDoucment,
            )
        
            .catch(async (error: unknown) => {
                await storage.deleteFile (
                    appwriteConfig.bucketId, 
                    bucketFile.$id
                )
                handleError(error, "Failed to create file document");
            }
        )
        // console.log("New file document created: ", newFile);

        // Re-Render the page to reflect the new file upload
        revalidatePath(path);
        return parseStringify(newFile); // Return the newly created file document as a parsed JSON object
    }
    
    catch (error) {
        handleError(error, "Failed to upload file");
    }
    
}

interface CreateQueriesProps {
    currentUser: Models.Document;
    types: string[];
    searchText?: string;
    sort: string | undefined;
    limit?: number;
}

// Generates a list of Appwrite Query objects based on the current user context
const createQueries = ( { currentUser, types, searchText, sort, limit }: CreateQueriesProps ) => {
    const queries = [
        Query.or (
            [
                Query.equal("owner", currentUser.$id),
                Query.contains("users", currentUser.email)
            ]
        )
    ]
    // console.log("Current user: ", currentUser);
    // console.log("Check queries: ", queries);

    if (types.length > 0) queries.push(
        Query.equal("type", types)
    );
    
    if (searchText) queries.push(
        Query.contains("name", searchText)
    );
    
    if (limit) queries.push(
        Query.limit(limit)
    );

    if (sort) {
        const [sortBy, orderBy] = sort.split("-");

        const sortField = sortBy === "createdAt" ? "$createdAt" : sortBy;

        queries.push (
            orderBy === "asc" ? Query.orderAsc(sortField) : Query.orderDesc(sortField)
        );
    };

    // console.log("Final queries: ", queries);

    return queries;
}

// Fetches file documents from Appwrite Database based on filtering, search, sorting, and limit criteria.
export const getFiles = async ( { types, searchText, sort, limit }: GetFilesProps ) => {
    const { databases } = await createAdminClient();

    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) throw new Error("User not authenticated");

        // Create queries based on the current user context and provided parameters
        const queries = createQueries( {
            currentUser, types, searchText, sort, limit,
        } );

        // console.log("Queries to fetch files: ", queries);

        const files = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.filesCollectionId,
            queries,
        );

        // console.log("Files fetched: ", files );

        return parseStringify(files);       // Return the fetched files as a parsed JSON object
    }

    catch (error) {
        handleError(error, "Failed to get files");
    }
}

export const getTotalSpaceUsed = async () => {
    const { databases } = await createAdminClient();

    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User not authenticated");

    try {
        // Fetch all file documents owned by the current user
        const files = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.filesCollectionId,
            [Query.equal("owner", [currentUser.$id])],  // filter by owner ID
        )

        // totalSpace object to hold the total space used by each file type
        // The reason for initializing size: 0 and latestData: "" is to correctly calculate accumulated data from the initial state
        const totalSpace = {
            image: { size: 0, latestDate: "" },
            document: { size: 0, latestDate: "" },
            video: { size: 0, latestDate: "" },
            audio: { size: 0, latestDate: "" },
            other: { size: 0, latestDate: "" },
            used: 0,
            all: 2 * 1024 * 1024 * 1024     // 2GB total space
        }
        
        // console.log('Files fetched: ', files);

        files.documents.forEach(
            (file) => {
                const fileType = file.type as FileType;     // Explicitly type assertion
                
                totalSpace[fileType].size += file.size;     // Accumulates the size values ​​of objects that match the file type.
                totalSpace.used += file.size;               // Total usage is also accumulated (sum of all types)

                if ( !totalSpace[fileType].latestDate || "" || new Date(file.$updatedAt) > new Date(totalSpace[fileType].latestDate) ) {
                    totalSpace[fileType].latestDate = file.$updatedAt;      // Update the latest date if the current file is newer
                }
            }
        )
        // console.log("Total space used: ", totalSpace);
        return parseStringify(totalSpace);      // Return the total space used as a parsed JSON object
    }

    catch (error) {
        handleError(error, "Failed to get total space used");
    }

}

interface UpdateFileShareUsersProps {
    fileId: string;
    emails: string[];
    path: string;
}

// Updates the list of users who can access a shared file by modifying the 'users' field in the file document.
export const updateFileShareUsers = async( { fileId, emails, path }: UpdateFileShareUsersProps) => {
    const { databases } = await createAdminClient();

    try {
        const updateShareUser = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.filesCollectionId,
            fileId,
            { users: emails }
        );

        revalidatePath(path);       // Re-Render the page to reflect the updated file share users (for UI update)

        console.log("Updated file share users: ", updateShareUser);

        return parseStringify(updateShareUser);
    }

    catch (error) {
        handleError(error, "Failed to update file share users");
    }
}

interface RenameFileProps {
    fileId: string;
    name: string;
    extension: string;
    path: string;
}

// Renames a file by updating its name and extension in the file document.
export const renameUploadedFile = async ( { fileId, name, extension, path}: RenameFileProps ) => {
    const { databases } = await createAdminClient();

    try {
        const newName = `${name}.${extension}`;
        const updatedFile = await databases.updateDocument (
            appwriteConfig.databaseId,
            appwriteConfig.filesCollectionId,
            fileId,
            { name: newName }       // Update the file document with the new name
        )

        revalidatePath(path);       // Re-Render the page to reflect the renamed file
        
        return parseStringify(updatedFile);       // Return the updated file document as a parsed JSON object
    }

    catch (error) {
        handleError(error, "Failed to rename file");
    }

}

interface DeleteFileProps {
    fileId: string;
    bucketFileId: string;
    path: string;
}

export const deleteUploadedFile = async ( { fileId, bucketFileId, path }: DeleteFileProps ) => {
    const { storage, databases } = await createAdminClient();

    try {
        const deletedFile = await databases.deleteDocument (
            appwriteConfig.databaseId,
            appwriteConfig.filesCollectionId,
            fileId,            
        )

        // Delete the file from Appwrite storage
        if (deletedFile) {
            await storage.deleteFile(
                appwriteConfig.bucketId, bucketFileId
            );
        }

        revalidatePath(path);

        return parseStringify({ status: "success" });
    }

    catch (error) {
        handleError(error, "Failed to delete file");
    }
}