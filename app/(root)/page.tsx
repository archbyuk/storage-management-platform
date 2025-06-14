import Link from "next/link";
import Image from "next/image";
import DashboardChart from "@/components/main/dashboard-chart";
import { getFiles, getTotalSpaceUsed } from "@/lib/action/file.action"
import { convertFileSize, getUsageSummary } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import FormattedDateTime from "@/components/main/format-date-time";
import Thumbnail from "@/components/main/thumbnail";
import { Models } from "node-appwrite";
import ActionDropdown from "@/components/main/action-dropdown";

export default async function Dashboard() {
    const [files, totalSpace] = await Promise.all(
        [
            getFiles ( 
                { types: [], limit: 10 } 
            ),
            getTotalSpaceUsed(),
        ]
    )
    // console.log("Total space used: ", totalSpace);

    // If totalSpace is available, get the usage summary: This is preventing errors if totalSpace is null or undefined
    const usageSummary = totalSpace ? getUsageSummary( { totalSpace }) : [];

    // console.log("Files fetched: ", usageSummary);
    
    return (
        <div className="dashboard-container">
            
            {/* left section: available storage UI */}
            <section>
                {/* To avoid TypeScript warnings that totalSpace may be undefined */}
                {/* we modified it to be safer to access using optional chaining and a default value of 0 */}
                <DashboardChart used={totalSpace?.used ?? 0} /> 

                <ul className="dashboard-summary-list">
                    {usageSummary.map(
                        (summary) => (
                            <Link
                                href={summary.url}
                                key={summary.title}
                                className="dashboard-summary-card"
                            >
                                <div className="space-y-4">
                                    <div className="flex jusetify-between gap-3">
                                        <Image
                                            src={summary.icon}
                                            width={100}
                                            height={100}
                                            alt="uploaded image"
                                            className="summary-type-icon"
                                        />
                                        
                                        <h4 className="summary-type-size">
                                            {convertFileSize(summary.size) || 0}
                                        </h4>
                                    </div>

                                    <h5 className="summary-type-title">
                                        {summary.title}
                                    </h5>

                                    <Separator className="bg-light-400" />
                                    
                                    <FormattedDateTime
                                        date={summary.latestDate}
                                        className="text-center"
                                    />
                                </div>
                            </Link>
                        )
                    )}
                </ul>
            </section>

            {/* right section: recent files UI */}
            <section className="dashboard-recent-files">
                <h2 className="h3 xl:h2 text-light-100">
                    Recent files uploaded
                </h2>
                {
                    // Safely check length: fallback to [] if files or documents is undefined
                    (files?.documents ?? []).length > 0 ? 
                        (
                            <ul className="mt-5 flex flex-col gap-5">
                                {files?.documents.map(
                                    (file: Models.Document) => (
                                        <Link
                                            href={file.url}
                                            target="_blank"
                                            className="recent-file-link flex items-center gap-3 p-4"
                                            key={file.$id}
                                        >
                                        
                                            <Thumbnail
                                                type={file.type}
                                                extension={file.extension}
                                                url={file.url}
                                            />

                                            <div className="recent-file-details flex w-full items-center justify-between">
                                                
                                                {/* 왼쪽: 텍스트 정보와 드롭다운 수평 정렬 */}
                                                <div className="flex items-center justify-between w-full">
                                                    <div className="flex flex-col gap-1">
                                                        <p className="recent-file-name truncate">
                                                            {file.name}
                                                        </p>
                                                        <FormattedDateTime
                                                            date={file.$createdAt}
                                                            className="caption"
                                                        />
                                                    </div>

                                                    <ActionDropdown file={file} />
                                                </div>
                                            </div>
                                        </Link>
                                    )
                                )}
                            </ul>
                        ) : (
                            <p className="empty-list">No files uploaded</p>
                        )
                }
            </section>

        </div>
    )
}