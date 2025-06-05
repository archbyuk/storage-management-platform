import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

// This function is used to parse and stringify data
export const parseStringify = <T>(data: T): T => {
    return JSON.parse(JSON.stringify(data));
}

export const getFileType = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
}