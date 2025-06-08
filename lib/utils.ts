import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

// This function is used to parse and stringify data
export const parseStringify = <T>(data: T): T => {
    return JSON.parse(JSON.stringify(data));
}

// This function is defined to get the file type based on the file name extension
export const getFileType = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();

    if (!extension) return { type: "other", extension: "" };

    // Check for files types
    const documentExtensions = [
        "pdf", "doc", "docx", "txt", "xls", "xlsx",
        "csv", "rtf", "ods", "ppt", "odp", "md", "html",
        "htm", "epub", "pages", "fig", "psd", "ai", "indd",
        "xd", "sketch", "afdesign", "afphoto", "afphoto",
    ];
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"];
    const videoExtensions = ["mp4", "avi", "mov", "mkv", "webm"];
    const audioExtensions = ["mp3", "wav", "ogg", "flac"];
    
    // Check if the extension is in the respective arrays
    if (documentExtensions.includes(extension)) return { type: "document", extension };
    if (imageExtensions.includes(extension)) return { type: "image", extension };
    if (videoExtensions.includes(extension)) return { type: "video", extension };
    if (audioExtensions.includes(extension)) return { type: "audio", extension };

    return { type: "other", extension };
}

// Convert a file object into a temporary URL usable by the browser
export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

export const getFileIcon = (type: string | FileType, extension: string | undefined) => {
    
    switch (extension) {
        // Document
        case "pdf":
          return "/assets/icons/file-pdf.svg";
        case "doc":
          return "/assets/icons/file-doc.svg";
        case "docx":
          return "/assets/icons/file-docx.svg";
        case "csv":
          return "/assets/icons/file-csv.svg";
        case "txt":
          return "/assets/icons/file-txt.svg";
        case "xls":
        case "xlsx":
          return "/assets/icons/file-document.svg";
        // Image
        case "svg":
          return "/assets/icons/file-image.svg";
        // Video
        case "mkv":
        case "mov":
        case "avi":
        case "wmv":
        case "mp4":
        case "flv":
        case "webm":
        case "m4v":
        case "3gp":
          return "/assets/icons/file-video.svg";
        // Audio
        case "mp3":
        case "mpeg":
        case "wav":
        case "aac":
        case "flac":
        case "ogg":
        case "wma":
        case "m4a":
        case "aiff":
        case "alac":
          return "/assets/icons/file-audio.svg";
    
        default:
          switch (type) {
            case "image":
              return "/assets/icons/file-image.svg";
            case "document":
              return "/assets/icons/file-document.svg";
            case "video":
              return "/assets/icons/file-video.svg";
            case "audio":
              return "/assets/icons/file-audio.svg";
            default:
              return "/assets/icons/file-other.svg";
          }
    }
}

// APPWRITE URL UTILS
// Construct appwrite file URL - https://appwrite.io/docs/apis/rest#images
export const constructFileUrl = (bucketFileId: string) => {
    return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET}/files/${bucketFileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`;
};


// Get file types based on the type parameter
export const getFileTypesParams = (type: string): FileType[] => {
    switch (type) {
        case "document":
            return [ "document" ];
        case "image":
            return [ "image" ];
        case "video":
            return [ "video", "audio" ];
        default:
            return [ "other" ];
    }
}