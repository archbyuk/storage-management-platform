"use server";

import { createAdminClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { InputFile } from "node-appwrite/file";
import { ID, Models, Query } from "node-appwrite";
import { revalidatePath } from "next/cache";

import { constructFileUrl, getFileType, parseStringify } from "@/lib/utils";
import { getCurrentUser } from "./user.action";

const handleError = (error: unknown, message: string) => {
    console.log(error, message);
    throw error;
};

export const uploadFile = async ( { file, ownerId, accountId, path }: UploadFileProps) => {
    // Create an admin client to interact with Appwrite services
    const { storage, databases } = await createAdminClient();

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
        console.log("File document to be created: ", fileDoucment);

        // Create a new document in the specified collection to store the file metadata
        const newFile = await databases
            .createDocument (
                appwriteConfig.databaseId,
                appwriteConfig.filesCollectionId,
                ID.unique(),
                fileDoucment
            )
        
            .catch(async (error: unknown) => {
                await storage.deleteFile (
                    appwriteConfig.bucketId, 
                    bucketFile.$id
                )
                handleError(error, "Failed to create file document");
            }
        )
        console.log("New file document created: ", newFile);

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
    console.log("Current user: ", currentUser);
    console.log("Check queries: ", queries);

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

        queries.push(
            orderBy === "asc" ? Query.orderAsc(sortBy) : Query.orderDesc(sortBy)
        )
    };

    console.log("Final queries: ", queries);

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

        console.log("Queries to fetch files: ", queries);

        const files = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.filesCollectionId,
            queries,
        );

        console.log("Files fetched: ", files );

        return parseStringify(files);       // Return the fetched files as a parsed JSON object
    }

    catch (error) {
        handleError(error, "Failed to get files");
    }
}