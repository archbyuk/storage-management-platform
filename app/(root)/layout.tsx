import Header from "@/components/main/header";
import MobileNavigation from "@/components/main/mobile-nav";
import SideBar from "@/components/main/side-bar";

import { getCurrentUser } from "@/lib/action/user.action";
import { redirect } from "next/navigation";

// 이건 무슨뜻? 블로그 작성해보기
export const dynamic = "force-dynamic";

export default async function Pagelayout({ children }: { children: React.ReactNode }) {

    const currentUser = await getCurrentUser();

    // console.log("Current User:", currentUser);

    if (!currentUser) {
        redirect("/sign-in");
    }

    // Currnet User console example:
    // Current User: {
    //     fullName: 'jinuk',
    //     email: 'jinuk.work@gmail.com',
    //     avatar: 'https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvcGYtaWNvbjQtamlyMjA2NC1wb3ItbC5qcGc.jpg',
    //     accountId: '683190320001f514d344',
    //     '$id': '683f9726001819522e2a',
    //     '$createdAt': '2025-06-04T00:45:26.741+00:00',
    //     '$updatedAt': '2025-06-04T00:45:26.741+00:00',
    //     '$permissions': [],
    //     files: [],
    //     '$databaseId': '6826f0420018f99dd1ae',
    //     '$collectionId': '6826f0620032a73a29c3'
    //   }

    return (
        <main className="flex h-screen">
            <SideBar
                fullName={currentUser.fullName}
                avatar={currentUser.avatar}
                email={currentUser.email}
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
