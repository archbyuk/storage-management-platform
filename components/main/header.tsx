"use client";

import { Button } from "../ui/button";
import Image from "next/image";
import Search from "./search";

export default function Header () {
  return (
    <header className="header">
        <Search/>
        <div className="header-wrapper">
            FileUpLoader
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
