import DashboardChart from "@/components/main/dashboard-chart";
import { getFiles, getTotalSpaceUsed } from "@/lib/action/file.action"
import { getUsageSummary } from "@/lib/utils";

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
    if (totalSpace) {
        const usageSummary = getUsageSummary (
            { totalSpace }
        );
    }
    
    return (
        <div className="dashboard-container">
            
            {/* left section: available storage UI */}
            <section>
                {/* To avoid TypeScript warnings that totalSpace may be undefined */}
                {/* we modified it to be safer to access using optional chaining and a default value of 0 */}
                <DashboardChart used={totalSpace?.used ?? 0} /> 

                <ul className="dashboard-summary-list">

                </ul>
            </section>

            {/* right section: recent files UI */}
            <section className="dashboard-recent-files">
                second section
            </section>

        </div>
    )
}

// Total space used:  {
//     image: { size: 161417, latestDate: '2025-06-13T01:45:13.724+00:00' },
//     document: { size: 68823208, latestDate: '2025-06-13T03:00:04.626+00:00' },
//     video: { size: 0, latestDate: '' },
//     audio: { size: 0, latestDate: '' },
//     other: { size: 0, latestDate: '' },
//     used: 68984625,
//     all: 2147483648
//   }

// declare interface GetFilesProps {
//     types: FileType[];
//     searchText?: string;
//     sort?: string;
//     limit?: number;
// }

// Files fetched:  {
        //     total: 4,
        //     documents: [
        //       {
        //         name: 'dg.pdf.pdf',
        //         url: 'https://cloud.appwrite.io/v1/storage/buckets/6826f2cb001e3b3f7f21/files/6848e97d001ed6ebad33/view?project=6826ee41003c157cceca',
        //         type: 'document',
        //         bucketFileId: '6848e97d001ed6ebad33',
        //         accountId: '683190320001f514d344',
        //         extension: 'pdf',
        //         size: 181000,
        //         users: [Array],
        //         '$id': '6848e97e003bac0fc9ba',
        //         '$createdAt': '2025-06-11T02:27:11.134+00:00',
        //         '$updatedAt': '2025-06-13T01:54:33.585+00:00',
        //         '$permissions': [],
        //         owner: [Object],
        //         '$databaseId': '6826f0420018f99dd1ae',
        //         '$collectionId': '6826f1990005284e69ff'
        //       },
        //       {
        //         name: '테스트.pdf',
        //         url: 'https://cloud.appwrite.io/v1/storage/buckets/6826f2cb001e3b3f7f21/files/6848ec8b0004806de94e/view?project=6826ee41003c157cceca',
        //         type: 'document',
        //         bucketFileId: '6848ec8b0004806de94e',
        //         accountId: '683190320001f514d344',
        //         extension: 'pdf',
        //         size: 47791949,
        //         users: [Array],
        //         '$id': '6848ec9d0027b9d52691',
        //         '$createdAt': '2025-06-11T02:40:29.905+00:00',
        //         '$updatedAt': '2025-06-12T09:16:45.853+00:00',
        //         '$permissions': [],
        //         owner: [Object],
        //         '$databaseId': '6826f0420018f99dd1ae',
        //         '$collectionId': '6826f1990005284e69ff'
        //       },