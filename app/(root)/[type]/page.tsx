import { getFileTypesParams } from "@/lib/utils";
import Sort from "@/components/main/sort";

export default async function Page({ params }: SearchParamProps ) {
    const { type } = await params;

    const types = getFileTypesParams(type);

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

        </div>
    )
}