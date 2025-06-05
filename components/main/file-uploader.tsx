"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { useCallback, useState } from "react";
import { MAX_FILE_SIZE } from "@/constants/index";
import { getFileType } from "@/lib/utils";

interface FileUploaderProps {
    accountId: string;
    ownerId: string;
}

export default function FileUploader( { accountId, ownerId }: FileUploaderProps ) {
    const [files, setFiles] = useState<File[]>([]);

    const onDrop = useCallback( 
        async ( acceptedFiles: File[] ) => {
            setFiles(acceptedFiles);    // set the files state with the accepted files

            // if (file.size > MAX_FILE_SIZE) {

            // }

            
    }, [])

    // react-dropzone hooks: files selected, file upload progress, and file upload errors / drag-and-drop functionality
    // getRootProps: provides the props for the dropzone area (triggering the file selection)
    // getInputProps: provides the props for the input element (file selection)
    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <div { ...getRootProps() } className="cursor-pointer">
            {/* open Finder or Windows File Explorer */}
            <input { ...getInputProps() } />
            <Button type="button" className="uploader-button">
                <Image
                    src="/assets/icons/upload.svg"
                    alt="Upload"
                    width={24}
                    height={24}
                />
                <p>Upload</p>
            </Button>

            {files.length > 0 && (
                <ul className="uploader-preview-list">
                    <h4 className="h4 text-light-100">Uploading</h4>

                    {files.map((file, index) => {
                        const { type, extension } = getFileType(file.name);

                        return (
                            <li key={`${file.name} - ${index}`} className="uploader-preview-item">
                                <div className="flex items-center gap-3">
                                    <Thumbnail
                                        type={type}
                                        extension={extension}
                                        url={convertFileToUrl(file)}
                                    />
                                </div>
                            </li>
                        )
                    })}

                </ul>
            )}

        </div>
    )
}