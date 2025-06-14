import { getFileTypesParams } from "@/lib/utils";
import Sort from "@/components/main/sort";
import { getFiles } from "@/lib/action/file.action";
import { Models } from "node-appwrite";
import FileCard from "@/components/main/file-card";

export default async function Page({ searchParams, params }: SearchParamsProps ) {
    // Extracting the type from the URL parameters
    const type = (
        (await params)?.type as string
    ) || "";
    
    // Extracting search parameters
    const searchText = (
        (await searchParams)?.query as string
    ) || "";
    
    // Extracting sort parameter
    const sort = (
        (await searchParams)?.sort as string
    ) || "";

    const types = getFileTypesParams(type);     // Convert the type string to an array of FileType

    // console.log('Type: ', types);
    
    const files = await getFiles({
        types, 
        searchText, 
        sort
    }) || { total: 0, documents: [] };          // Fetch files from the database based on the type, search text, and sort criteria

    // console.log("Files fetched: ", files);

    return(
        <div className="page-container">
            
            <section className="w-full">
                <h1 className="h1 capitalize">
                    {type}
                </h1>

                <div className="total-size-section">
                    <p className="body-1">
                        Total: <span>0 MB</span>
                    </p>

                    <div className="sort-container">
                        <p className="body-1 hidden text-light-100 sm:block">Sory by:</p>

                        <Sort/>
                    </div>
                </div>
            </section>

            {/* Render the files */}
            {files.total > 0 ? (
                <section className="file-list">
                    {files.documents.map(
                        // The type of file is Models.Document, which is provided by the Appwrite SDK
                        (file: Models.Document) => (
                            <FileCard 
                                key={file.$id} 
                                file={file}
                            />
                        )
                    )}
                </section>
            ) : (
                <p className="empty-list">No files uploaded</p>
            )}
        </div>
    )
}