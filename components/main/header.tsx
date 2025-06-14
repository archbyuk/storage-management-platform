import Search from "@/components/main/search";
import FileUploader from "@/components/main/file-uploader";
import LogoutConfirmButton from "@/components/main/confirm/logout-confirm";

export default function Header ( { userId, accountId }: UserInfo ) {
    
    return (
        <header className="header">
            <Search/>
            
            <div className="header-wrapper">
                <FileUploader ownerId={userId} accountId={accountId} />

                {/* Server action Signout component */}
                <LogoutConfirmButton />
            </div> 
        </header>
    )
}