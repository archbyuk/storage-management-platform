'use client';

import { Models } from "node-appwrite";
import { useState } from "react";
import Image from "next/image";
import { dropDownItems } from "@/constants";

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
                            <DropdownMenuItem key={dropdownItem.value} className="shad-dropdown-item" onClick={}>

                            </DropdownMenuItem>
                        )
                
                    )}
                </DropdownMenuContent>
            
            </DropdownMenu>
        </Dialog>    
    )
}   