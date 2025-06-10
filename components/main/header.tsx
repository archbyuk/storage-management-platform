"use client";

import { Button } from "../ui/button";
import Image from "next/image";
import Search from "./search";
import FileUploader from "./file-uploader";
import { useEffect } from "react";

export default function Header ( { userId, accountId }: { userId: string; accountId: string }) {

    useEffect (() => {
        console.log("Header component mounted: ", { userId, accountId });
    },[])

    return (
        <header className="header">
            <Search/>
            
            <div className="header-wrapper">
                <FileUploader ownerId={userId} accountId={accountId} />
                <form>
                    <Button className="sign-out-button" type="submit">
                        <Image
                            src="assets/icons/logout.svg"
                            alt="Sign Out"
                            width={24}
                            height={24}
                            className="w-6" 
                        />
                    </Button>
                </form>
            </div> 
        </header>
    )
}
