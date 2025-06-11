"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"

import { verifySercet, sendEmailOTP } from "@/lib/action/user.action";

import { useState } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

  
export default function OtpModal({ accountId, email }: {accountId: string, email: string}) {
    const [isOpen, setIsOpen] = useState(true);
    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsLoading(true);

        console.log({accountId, otp})

        try {
            const sessionId = await verifySercet(
                {accountId, otp}
            )

            console.log('Session ID:', sessionId);

            if (sessionId) {
                router.push('/')
            }
        }
        
        catch (error) {
            console.error("Error verifying OTP:", error);
        }
        
    }
    
    const handleResendOtp = async() => {
        await sendEmailOTP({ email });
    }

    return(
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            
            <AlertDialogContent className="shad-alert-dialog"> 
                {/* OTP modal header */}
                <AlertDialogHeader  className="relative flex justify-center">
                    
                    <AlertDialogTitle className="h2 text-center">
                        Enter OTP
                        
                        <Image
                            src="assets/icons/close-dark.svg"
                            alt="Close"
                            width={20}
                            height={20}
                            onClick={() => setIsOpen(false)}
                            className="otp-close-button"
                        />
                    </AlertDialogTitle>
                    
                    <AlertDialogDescription className="subtitle-2 text-center text-light-100">
                        We&apos;ve sent a code to {""}
                        <span className="pl-1 text-brand">{email}</span>
                    </AlertDialogDescription>
                
                </AlertDialogHeader>

                {/* OTP modal input */}
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                    
                    <InputOTPGroup className="shad-otp">
                        <InputOTPSlot index={0} className="shad-otp-slot"/>
                        <InputOTPSlot index={1} className="shad-otp-slot"/>
                        <InputOTPSlot index={2} className="shad-otp-slot"/>
                        <InputOTPSlot index={3} className="shad-otp-slot"/>
                        <InputOTPSlot index={4} className="shad-otp-slot"/>
                        <InputOTPSlot index={5} className="shad-otp-slot"/>
                    </InputOTPGroup>
                
                </InputOTP>
                
                <AlertDialogFooter>
                    

                    <div className="flex w-full flex-col gap-4">
                        <AlertDialogAction className="modal-submit-button h-12" onClick={handleSubmit} type="button">
                            Submit
                            {isLoading && (
                                <Image
                                    src="/assets/icons/loader.svg"
                                    alt="Loading..."
                                    width={24}
                                    height={24}
                                    className="ml-2 animate-apin"
                                />
                            )}
                        </AlertDialogAction>

                        <div className="subtitle-2 mt-2 text-center text-light-100">
                            Didn&apos;t get a code? 
                            <Button type="button" variant="link" className="pl-1 text-brand" onClick={handleResendOtp}>
                                Click to resent
                            </Button>
                        </div>
                    </div>              
                
                </AlertDialogFooter>
            
            </AlertDialogContent>
        </AlertDialog>
    )
}