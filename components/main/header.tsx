"use client";

import { useEffect } from "react";
import Image from "next/image";
import { SignOutUser } from "@/lib/action/user.action";
import { Button } from "@/components/ui/button";
import Search from "@/components/main/search";
import FileUploader from "@/components/main/file-uploader";

export default function Header ( { userId, accountId }: { userId: string; accountId: string }) {

    useEffect (() => {
        console.log("Header component mounted: ", { userId, accountId });
    },[])

    const handleSignOut = async () => {
        await SignOutUser();
    }
    return (
        <header className="header">
            <Search/>
            
            <div className="header-wrapper">
                <FileUploader ownerId={userId} accountId={accountId} />
                <form action={handleSignOut}>
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
