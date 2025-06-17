import Header from "@/components/main/header";
import MobileNavigation from "@/components/main/mobile-nav";
import SideBar from "@/components/main/side-bar";
import { getCurrentUser } from "@/lib/action/user.action";
import { redirect } from "next/navigation";
import UserInitializer from "@/components/main/client-store/user-initializser";

// 이건 무슨뜻? 블로그 작성해보기
export const dynamic = "force-dynamic";

export default async function Pagelayout({ children }: { children: React.ReactNode }) {

    const currentUser = await getCurrentUser();

    if (!currentUser) {
        redirect("/sign-in");
    }

    return (
        <main className="flex h-screen">
            <SideBar
                fullName={currentUser.fullName}
                avatar={currentUser.avatar}
                email={currentUser.email}
            />

            <UserInitializer
                user={{
                    fullName: currentUser.fullName,
                    email: currentUser.email,
                    avatar: currentUser.avatar,
                    createdAt: currentUser.$createdAt,
                    totalFiles: currentUser.files.length || 0,
                }}
            />
            
            <section className="flex h-full flex-1 flex-col">
                
                <MobileNavigation 
                    fullName={currentUser.fullName} 
                    avatar={currentUser.avatar} 
                    email={currentUser.email} 
                    accountId={currentUser.accountId}
                    $id={currentUser.$id}
                /> 
                <Header 
                    userId={currentUser.$id} 
                    accountId={currentUser.accountId} 
                />
                <div className="main-content">
                    {children}
                </div>
            
            </section>
        </main>
    )
}
