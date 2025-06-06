import Image from "next/image";
import { cn, getFileIcon } from "@/lib/utils";

interface TumbnailProps {
    type: string;
    extension: string;
    url: string;
}

export default function Thumbnail( { type, extension, url }: TumbnailProps) {
    const isImage = type === "image" && extension !== "svg";

    return (
        <figure className="thumbnail">
            <Image
                src={isImage ? url : getFileIcon(type, extension)}
                alt="File thumbnail"
                width={100}
                height={100}
                className={cn(
                    "size-8 object-contain", 
                    isImage && "thumbnail-image"
                )}
            />
        </figure>
    )
}