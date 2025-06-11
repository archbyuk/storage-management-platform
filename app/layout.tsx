import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";

const poppins = Poppins({
    subsets: ["latin"],
    variable: "--font-poppins",
    display: "swap",
     weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
})

export const metadata: Metadata = {
    title: "Google Drive clone",
    description: "The only storage solution you",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  
    return (
        <html lang="en">
            <body className={`${poppins.variable} antialiased`} >
                {/* make the toast message visible on all pages */}
                <Toaster />
                {children}
            </body>
        </html>
    );
}
