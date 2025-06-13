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

// Convert file size from bytes to human-readable format
export const convertFileSize = (fileSize: number, digits?: number) => {
    if (fileSize < 1024) {
        return fileSize + " Bytes";                // Less than 1 KB, show in Bytes
    } 
    
    else if (fileSize < 1024 * 1024) {
        const sizeInKB = fileSize / 1024;
        return sizeInKB.toFixed(digits || 1) + " KB"; // Less than 1 MB, show in KB
    } 
    
    else if (fileSize < 1024 * 1024 * 1024) {
        const sizeInMB = fileSize / (1024 * 1024);
        return sizeInMB.toFixed(digits || 1) + " MB"; // Less than 1 GB, show in MB
    } 
    
    else {
        const sizeInGB = fileSize / (1024 * 1024 * 1024);
        return sizeInGB.toFixed(digits || 1) + " GB"; // 1 GB or more, show in GB
    }
    
  };

// Get the file icon based on the file type or extension
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
            return "/assets/icons/file-svg.svg";
        case "jpg":
        case "jpeg":
        case "png":
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
    return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET}/files/${bucketFileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
};

// Get file types based on the type parameter
export const getFileTypesParams = (type: string): FileType[] => {
    switch (type) {
        case "documents":
            return ["document"];
        case "images":
            return ["image"];
        case "media":
            return ["video", "audio"];
        case "others":
            return ["other"];
        default:
            return ["document"];
    }
}

export const formatDateTime = (isoString: string | null | undefined) => {
    if (!isoString) return "-"

    const date = new Date(isoString);               // Convert ISO string to Date object

    // Get hours and adjust for 12-hour format
    let hours = date.getHours();                    // Get hours from the date object from javaScript Date API
    const minutes = date.getMinutes();              // Get minutes from the date object from javaScript Date API
    const period = hours >= 12 ? "PM" : "AM";       // Determine AM/PM period

    hours = hours % 12;                             // Convert to 12-hour format for display

    const time = `${hours}:${minutes.toString().padStart(2, "0")}${period}`;
    const day = date.getDate();                     // Get day of the month from the date object from javaScript Date API
    const monthName = [
        "January", "February", "March", "April",
        "May", "June", "July", "August",
        "September", "October", "November", "December"
    ];

    const month = monthName[date.getMonth()];       // Get month name from the date object from javaScript Date API

    // example: "2:30PM, 15 March"
    return `${time}, ${day} ${month}`;              // Return formatted data and time string

}

// Construct download URL for Appwrite files
export const constructDownloadUrl = (bucketFileId: string) => {
    return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET}/files/${bucketFileId}/download?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
}

interface FileTypeSpace {
    size: number;
    latestDate: string;
}
  
interface TotalSpaceUsed {
    image: FileTypeSpace;
    document: FileTypeSpace;
    video: FileTypeSpace;
    audio: FileTypeSpace;
    other: FileTypeSpace;
    used: number;
    all: number;
}

//   image: { size: 161417, latestDate: '2025-06-13T01:45:13.724+00:00' },
//   document: { size: 68823208, latestDate: '2025-06-13T03:00:04.626+00:00' },
//   video: { size: 0, latestDate: '' },
//   audio: { size: 0, latestDate: '' },
//   other: { size: 0, latestDate: '' },
//   used: 68984625,
//   all: 2147483648

export const getUsageSummary = ( { totalSpace } : { totalSpace: TotalSpaceUsed } ) => {
    // This function constructs a summary of the total space used by different file types
    if (!totalSpace) return [];
    return [
        {
          title: "Documents",
          size: totalSpace.document.size,
          latestDate: totalSpace.document.latestDate,
          icon: "/assets/icons/file-document-light.svg",
          url: "/documents",
        },
        {
          title: "Images",
          size: totalSpace.image.size,
          latestDate: totalSpace.image.latestDate,
          icon: "/assets/icons/file-image-light.svg",
          url: "/images",
        },
        {
          title: "Media",
          size: totalSpace.video.size + totalSpace.audio.size,
          latestDate:
            totalSpace.video.latestDate > totalSpace.audio.latestDate
              ? totalSpace.video.latestDate
              : totalSpace.audio.latestDate,
          icon: "/assets/icons/file-video-light.svg",
          url: "/media",
        },
        {
          title: "Others",
          size: totalSpace.other.size,
          latestDate: totalSpace.other.latestDate,
          icon: "/assets/icons/file-other-light.svg",
          url: "/others",
        },
    ];
};

// Calculate the percentage of used space based on the total size (2GB)
export const calculatePercentage = (sizeInBytes: number) => {
    const totalSizeInBytes = 2 * 1024 * 1024 * 1024;        // 2GB in bytes
    const percentage = (sizeInBytes / totalSizeInBytes) * 100;
    
    return Number(percentage.toFixed(2));
};