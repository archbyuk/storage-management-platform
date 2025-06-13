import Image from "next/image";
import { cn, getFileIcon } from "@/lib/utils";

interface TumbnailProps {
    type: string;
    extension: string;
    url: string;
    className?: string
    imageClassName?: string;
}

export default function Thumbnail( { type, extension, url, className, imageClassName }: TumbnailProps) {
    const isImage = type === "image" && !["svg", "png", "jpg", "jpeg"].includes(extension.toLowerCase());

    return (
        <figure className={cn("thumbnail", className)}>
            <Image
                src={isImage ? url : getFileIcon(type, extension)}
                alt="File thumbnail"
                width={100}
                height={100}
                className={cn(
                    "size-8 object-contain", 
                    imageClassName,
                    isImage && "thumbnail-image rounded-full"
                )}
            />
        </figure>
    )
}