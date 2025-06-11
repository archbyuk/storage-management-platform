import { StringValidation } from "zod";

declare export type FileType = "document" | "image" | "video" | "audio" | "other";

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