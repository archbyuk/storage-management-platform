"use client";

import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { useCallback, useState } from "react";
import { MAX_FILE_SIZE } from "@/constants/index";
import { convertFileToUrl, getFileType } from "@/lib/utils";
import Thumbnail from "@/components/main/thumbnail";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"
import { uploadFile } from "@/lib/action/file.action";
import { usePathname } from "next/navigation";

interface FileUploaderProps {
    accountId: string;
    ownerId: string;
}

export default function FileUploader( { accountId, ownerId }: FileUploaderProps ) {
    const [files, setFiles] = useState<File[]>([]);
    const path = usePathname();         // get the current path to upload files to the correct directory

    const onDrop = useCallback( 
        // onDrop function to handle file selection and upload
        async ( acceptedFiles: File[] ) => {    // acceptedFiles is an array of files selected by the user (provided by react-dropzone)
            setFiles(acceptedFiles);    // set the files state with the accepted files
            console.log("Files accepted:", acceptedFiles);

            const uploadPromises = acceptedFiles.map(async (file) => {
                if (file.size > MAX_FILE_SIZE) {
                    setFiles((prevFiles) => prevFiles.filter((f) => f.name !== file.name))
                    
                    // show a toast notification if the file is too large
                    return (
                        toast (
                            <p className="body-2 text-light-100">
                                <span className="font-semibold">
                                    {file.name}
                                </span> is too large. Max file size is 50MB.
                            </p>, { className: "error-toast" }
                        )
                    );
                }

                // upload the file to the Appwrite storage bucket - and delete file object array
                return uploadFile( { file, ownerId, accountId, path } ).then(
                    (uploadFile) => {
                        if (uploadFile) {
                            console.log('uploaded file:', uploadFile);
                            setFiles((prevFiles) =>
                                prevFiles.filter((f) => f.name !== file.name)
                            );
                        }
                    }
                )
            }
        );

        // wait for all file uploads to complete
        await Promise.all(uploadPromises);

    }, [ ownerId, accountId, path])

    // react-dropzone hooks: files selected, file upload progress, and file upload errors / drag-and-drop functionality
    // getRootProps: provides the props for the dropzone area (triggering the file selection)
    // getInputProps: provides the props for the input element (file selection)
    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    const handleRemoveFile =  (e: React.MouseEvent <HTMLImageElement, MouseEvent>, fileName: string) => {
        e.stopPropagation();            // prevent the click event from propagating to the parent element

        // remove the file from the files state(objects array by useState)
        setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
    }

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

                                    <div className="preview-item-name">
                                        {file.name}
                                        <Image
                                            src="/assets/icons/file-loader.gif"
                                            width={80}
                                            height={26}
                                            alt="Loader"
                                        />
                                    </div>
                                
                                </div>

                                <Image
                                    src="/assets/icons/remove.svg"
                                    width={24}
                                    height={24}
                                    alt="Remove"
                                    onClick={(e) => handleRemoveFile(e, file.name)}
                                />
                            </li>
                        )
                    })}
                </ul>
            
            )}

        </div>
    )
}