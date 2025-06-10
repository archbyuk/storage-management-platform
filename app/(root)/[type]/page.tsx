import { getFileTypesParams } from "@/lib/utils";
import Sort from "@/components/main/sort";
import { getFiles } from "@/lib/action/file.action";

export default async function Page({ params }: SearchParamsProps ) {
    const { type } = await params;
    const searchText = await 

    const types = getFileTypesParams(type);
    const files = getFiles( {
        types, searchText, sort
    } )

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
            {/* {files.total > 0 ? (
                
            )} */}

        </div>
    )
}