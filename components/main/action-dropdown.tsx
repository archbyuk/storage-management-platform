'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { dropDownItems } from "@/constants";
import { Models } from "node-appwrite";
import { constructDownloadUrl } from "@/lib/utils";
import { renameUploadedFile, updateFileShareUsers, deleteUploadedFile } from "@/lib/action/file.action";

// import UI components
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger, 
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileDetails, ShareInput } from "@/components/main/ac_dropdown-items/detail-dropdown";


interface ActionDropdownProps {
    file: Models.Document;
}

export default function ActionDropdown( { file }: ActionDropdownProps) {
    const [modalOpen, setModalOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [action, setAction] = useState<ActionType | null>(null);      // for the action to detail menu modal
    const [name, setName] = useState(file.name);
    const [emails, setEmails] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const path = usePathname();                                         // get the current path

    // This function closes all modals and resets the state
    const closeAllModals = () => {
        setModalOpen(false);
        setIsDropdownOpen(false);
        setAction(null);
        setName(file.name);
        setEmails([]);

        // console.log("Modal closed and state reset");
    };

    // Troubleshooting: When using Shadcn Ui Dropdown or Dialog, due to state transition instability Pointer Event: None remains on <body>, preventing clicks
    // Processing: Both Dropdown and Modal detect the point, so Pointer Event: Auto-Recover is processed
    // Solution: When the action is details, rename, share, or delete, set Pointer Event: Auto on <body>
    useEffect(() => {
        if (
          action?.value === "details" ||
          action?.value === "rename"  ||
          action?.value === "share"   ||
          action?.value === "delete"
        ) {
          document.body.style.pointerEvents = "auto";
        }
      }, [action?.value]);

    // This function handles the action based on the selected action type
    const handleAction = async () => {
        if (!action) return;

        setIsLoading(true);
        
        let success = false;

        // Define the action handlers based on the selected action
        const actions = {
            
            // action.value === "rename"
            rename: async () => {
                return await renameUploadedFile (
                    { fileId: file.$id, name, extension: file.extension, path }
                )
            },

            // action.value === "share"
            share: async () => {
                return await updateFileShareUsers (
                    { fileId: file.$id, emails, path }
                )
            },

            // action.value === "delete"
            delete: async () => {
                return await deleteUploadedFile(
                    { fileId: file.$id, bucketFileId: file.bucketFileId, path }
                )
            }

        }
        
        const result = await actions[action.value as keyof typeof actions]();
        // console.log("Action result: ", result);
        success = !!result;
        // console.log("Action success: ", success);
        
        if (success) {
            setTimeout(() => {
              closeAllModals();  // 렌더 사이클 이후에 닫기
            }, 0);
          }

        setIsLoading(false);
    }

    // This function handles the removal of a user from the share list
    const handleRemoveUser = async(email: string) => {
        const updatedEmails = emails.filter(
            (item) => item !== email
        )

        // If file deletion is successful, update the share users state(delete the user from the share list)
        const success = await updateFileShareUsers(
            {
                fileId: file.$id,
                emails: updatedEmails,
                path: path
            }
        )

        if (success) {
            setEmails(updatedEmails);
        }
        
        // close the modal after removing the user
        closeAllModals();
    }


    // This function renders the action modal based on the selected action
    const renderActionModal = () => {
        if (!action) return null;

        const { value, label } = action;        // destructure the action object

        return(
            <DialogContent className="shad-dialog button">
                
                {/* Description readable only by pad reader */}
                <DialogDescription className="sr-only">
                    {action.label}: 
                </DialogDescription>

                {/*  Render the action detail modals */}
                <DialogHeader className="flex flex-col gap-3">
                    <DialogTitle className="text-center text-light-100">
                        {label}
                    </DialogTitle>

                    {value === "rename" && (
                        <Input type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    )}

                    {value === "details" && (
                        <FileDetails 
                            file={file} 
                        />
                    )}

                    {value === "share" && (
                        <ShareInput 
                            file={file} 
                            onInputChange={setEmails} 
                            onRemove={handleRemoveUser}
                        />
                    )}

                    {value === "delete" && (
                        <p className="delete-confirmation">
                            Are you sure you want to delete{` `}
                            <span className="delete-file-name">{file.name}</span>
                            ?
                        </p>
                    )}
                </DialogHeader>
                
                {/* Render the action button based on the action type */}
                {["rename", "share", "delete"].includes(value) && (
                    <DialogFooter>
                        <Button className="modal-cancel-button" onClick={closeAllModals}>
                            Cancel
                        </Button>

                        <Button className="modal-submit-button" onClick={handleAction}>
                            <p className="capitalize">{value}</p>
                            {isLoading && (
                                <Image
                                    src="/assets/icons/loader.svg"
                                    alt="loader"
                                    width={24}
                                    height={24}
                                    className="animate-spin"
                                />
                            )}
                        </Button>
                    </DialogFooter>
                )}
            
            </DialogContent>
        )
    }

    return (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                
                <DropdownMenuTrigger className="shad-no-focus">
                    <Image
                        src="/assets/icons/dots.svg"
                        alt="dots"
                        width={34}
                        height={34}
                    />
                </DropdownMenuTrigger>
                
                {/* Dropdown UI that appears when you click the drop-down menu */}
                <DropdownMenuContent>
                    <DropdownMenuLabel className="max-w-[200px] truncate">
                        {file.name}
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />
                    
                    {/* Dropdown menu rendering */}
                    {dropDownItems.map(
                        (dropdownItem) => (
                            <DropdownMenuItem 
                                key={dropdownItem.value} 
                                className="shad-dropdown-item" 
                                onClick={() => {
                                    // ex: "rename", "share", "delete", "details"
                                    setAction(dropdownItem);
                                    
                                    // if the action is rename, share, delete or details, open the details modal
                                    if (["rename", "share", "delete", "details"].includes(dropdownItem.value)) {
                                        setModalOpen(true);
                                    }
                                }}
                            >
                                {dropdownItem.value === "download" ? (
                                    <Link
                                        href={constructDownloadUrl(file.bucketFileId)}
                                        download={name}
                                        className="flex items-center gap-2"
                                    >
                                        <Image
                                            src={dropdownItem.icon}
                                            alt={dropdownItem.label}
                                            width={30}
                                            height={30}
                                        />
                                        {dropdownItem.label}
                                    </Link>
                                ):( 
                                    <div className="flex items-center gap-2">
                                        <Image
                                            src={dropdownItem.icon}
                                            alt={dropdownItem.label}
                                            width={30}
                                            height={30}
                                        />
                                        {dropdownItem.label}
                                    </div>   
                                )}
                                
                            </DropdownMenuItem>
                        )
                    )}
                </DropdownMenuContent>

            </DropdownMenu>
            { renderActionModal() }
        </Dialog>    
    )
}   