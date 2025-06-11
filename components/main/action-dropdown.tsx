'use client';

import { Models } from "node-appwrite";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { dropDownItems } from "@/constants";
import { constructDownloadUrl } from "@/lib/utils";

// import UI components
import {
    Dialog,
    DialogContent,
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

    const handleRemoveUser = async(email: string) => {
        const updatedEmails = emails.filter(
            (item) => item !== email
        )

        // Share Type에 공유할 이메일 입력하고 업데이트 하는 로직부터 다시 시작하면 됨.
        // const success = await updateFileUsers(
        //     {
        //         fileId: file.$id,
        //         emails: updatedEmails
        //         path,
        //     }
        // )
    }


    const renderActionModal = () => {
        if (!action) return null;

        const { value, label } = action;        // destructure the action object

        return(
            <DialogContent className="shad-dialog button">
                <DialogHeader className="flex flex-col gap-3">
                    <DialogTitle className="text-center text-light-100">
                        {label}
                    </DialogTitle>
                </DialogHeader>

                {value === "rename" && (
                    <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                )}

                {value === "details" && (
                    <FileDetails file={file} />
                )}

                {value === "share" && (
                    <ShareInput file={file} onInputChange={setEmails} onRemove={handleRemoveUser}/>
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
                    <DropdownMenuLabel>
                        {file.name}
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />
                    
                    {/* Dropdown menu rendering */}
                    {dropDownItems.map(
                        (dropdownItem) => (
                            <DropdownMenuItem key={dropdownItem.value} className="shad-dropdown-item" 
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
                                        download={file.name}
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