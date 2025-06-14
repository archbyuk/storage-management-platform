"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import UserDetails from "@/components/main/modal/user-details";
import { usePathname, useRouter } from "next/navigation";
import { navItems } from "@/constants/index";
import { cn } from "@/lib/utils";


interface SideBarProps {
    fullName: string;
    email: string;
    avatar: string;
    // createdAt: string;
    // totalFiles: number;
}

export default function SideBar( { fullName, email, avatar }: SideBarProps) {
    const [userInfoOpen, setUserInfoOpen] = useState(false);
   
    const pathname = usePathname();
    const router = useRouter();

    return (
        <aside className="sidebar">
            
            <Link href="/">
                {/* web sidebar */}
                <Image
                    src="/assets/icons/logo-full-brand.svg"
                    alt="logo"
                    width={160}
                    height={30}
                    className="hidden h-auto lg:block hover:cursor-pointer"
                    onClick={() => router.push("/")}
                    // style={ 
                    //     {height: "auto", width: "auto"}
                    // }
                />

                {/* mobile sidebar */}
                <Image
                    src="/assets/icons/logo-brand.svg"
                    alt="logo"
                    width={52}
                    height={52}
                    className="lg:hidden"
                />
            </Link>

            {/* web: navigation  */}
            <nav className="sidebar-nav">
                <ul className="flex flex-1 flex-col gap-6">
                    {navItems.map(( { url, name, icon } ) => (
                        <Link key={ name } href={ url } className="lg:w-full">
                            <li className={cn(
                                    "sidebar-nav-item", 
                                    pathname ===url && "shad-active",
                                )}
                            >
                                <Image
                                    src={icon}
                                    alt={name}
                                    width={24}
                                    height={24}
                                    className={cn(
                                        "nav-icon",
                                        pathname === url && "nav-icon-active",
                                    )}
                                />
                                <p className="hidden lg:block">{ name }</p>
                            </li>
                        </Link>
                    ))}
                </ul>
            </nav>

            <Image
                src="/assets/images/files-2.png"
                alt="logo"
                width={506}
                height={418}
                className="w-full"
            />

            <div className="sidebar-user-info sidebar-user-info-interactions" onClick={() => setUserInfoOpen(true)}>
                <Image
                   src={ avatar }
                   alt="Avatar"
                   width={44}
                   height={44}
                   className="sidebar-user-avatar" 
                />

                <div className="hidden lg:block">
                    <p className="subtitle-2 capitalize">{ fullName }</p>
                    <p className="caption">{ email }</p>
                </div>
            </div>

            {/* User details info component */}
            <UserDetails
                isOpen={userInfoOpen}
                onClose={() => setUserInfoOpen(false)}
            />

        </aside>
    )
}