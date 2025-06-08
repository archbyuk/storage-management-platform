declare type FileType = "document" | "image" | "video" | "audio" | "other";

declare interface UploadFileProps {
    file: File;
    ownerId: string;
    accountId: string;
    path: string;
}

interface SegmentParams {
    type: string;
}

declare interface SearchParamProps {
    params: Promise<SegmentParams>;
    searchParams?: {}
}

declare interface GetFilesProps {
    types: FileType[];
    searchText: string;
    sort?: string;
    limit?: number;
}