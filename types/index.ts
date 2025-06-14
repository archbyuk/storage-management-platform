declare type FileType = "document" | "image" | "video" | "audio" | "other";

declare interface UserInfo {
    userId: string;
    accountId: string;
}

declare interface UploadFileProps {
    file: File;
    ownerId: string;
    accountId: string;
    path: string;
}

interface SegmentParams {
    type: string;
}

declare interface SearchParamsProps {
    params: Promise<SegmentParams>;
    searchParams?: Promise<
        {
            [url: string]: string | string[] | undefined;
        }
    >
}

declare interface GetFilesProps {
    types: FileType[];
    searchText?: string;
    sort?: string;
    limit?: number;
}

declare interface ActionType {
    label: string;
    icon: string;
    value: string;
}