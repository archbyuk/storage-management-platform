'use client';

import { Models } from "node-appwrite";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { dropDownItems } from "@/constants";
import { constructDownloadUrl } from "@/lib/utils";
import { ActionType } from "@/types";

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

interface ActionDropdownProps {
    file: Models.Document;
}

export default function ActionDropdown( { file }: ActionDropdownProps) {
    const [modalOpen, setModalOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [action, setAction] = useState<ActionType | null>(null);      // for the action to detail menu modal

    useEffect(() => {
        console.log(action) 
        console.log(setModalOpen)
    }, [action])

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
        </Dialog>    
    )
}   