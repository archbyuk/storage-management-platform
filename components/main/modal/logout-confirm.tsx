"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SignOutUser } from "@/lib/action/user.action";
import Image from "next/image";

export default function LogoutConfirmButton(){
  const [open, setOpen] = useState(false);

    return (
        <>
            {/* Logout Button: Web */}
            <Button onClick={() => setOpen(true)} className="sign-out-button">
                <Image 
                    src="/assets/icons/logout.svg" 
                    alt="로그아웃" 
                    width={24} 
                    height={24} 
                    className="w-6"
                />
            </Button>

            {/* Logout Button: Mobile */}
            <Button onClick={() => setOpen(true)} className="mobile-sign-out-button">
                <Image 
                    src="/assets/icons/logout.svg" 
                    alt="로그아웃" 
                    width={24} 
                    height={24} 
                    className="w-6"
                />
                <p>Logout</p>
            </Button>
        
            {/* Dialog for logout confirmation */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="logout-confirm">
                    <DialogHeader>
                        <DialogTitle className="text-center">로그아웃 하시겠습니까?</DialogTitle>
                    </DialogHeader>
                    
                    <p className="subtitle-2 text-light-100">현재 세션이 종료되며, 다시 로그인해야 합니다.</p>
                    
                    <DialogFooter>
                        
                        <Button type="button" onClick={() => setOpen(false)} className="logout-confirm-cancel">
                            취소
                        </Button>
                        
                        <form action={SignOutUser}>
                            <Button type="submit" className="logout-confirm-submit">
                                로그아웃
                            </Button>
                        </form>

                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}