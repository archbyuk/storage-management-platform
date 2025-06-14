import { Models } from "node-appwrite";
import Link from "next/link";
import Thumbnail from "@/components/main/thumbnail";
import FormattedDateTime from "@/components/main/format-date-time";
import { convertFileSize } from "@/lib/utils";
import ActionDropdown from "@/components/main/action-dropdown";

export default function FileCard({ file }: { file: Models.Document }) {
    // console.log("File Card: ", file);
    
    return(
        // target="_blank" opens the link in a new tab
        <Link href={file.url} target="_blank" className="file-card">
            {/* file image */}
            <div className="flex justify-between"> 
                <Thumbnail
                    type={file.type}
                    extension={file.extension}
                    url={file.url}
                    className="!size-20"
                    imageClassName="!size-11"
                />

                <div className="flex flex-col items-end justify-between">
                    <ActionDropdown file={file} />
                    <p className="body-1">
                        {convertFileSize(file.size)}
                    </p>
                </div>
            </div>

            {/* file info */}
            <div className="file-card-details">
                <p className="subtitle-2">
                    {file.name}
                </p>
                
                <FormattedDateTime
                    date={file.$createdAt}
                    className="body-2 text-light-100"
                />

                <p className="caption line-clamp-1 text-light-200">
                    By: {file.owner.fullName || file.owner.email}   
                </p>
            </div>
        </Link>
    )
}