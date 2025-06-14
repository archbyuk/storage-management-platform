import Image from 'next/image';
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export interface UserDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  fullName: string;
  email: string;
  avatar: string;
  createdAt: string;
  totalFiles: number;
}

interface DetailRowProps {
  label: string;
  children: React.ReactNode;
}

function DetailRow({ label, children }: DetailRowProps) {
  return (
    <div className="user-info-modal-row">
      <span className="user-info-modal-label">{label}</span>
      <span className="user-info-modal-value">{children}</span>
    </div>
  );
}

export default function UserDetails(
    { isOpen, onClose, fullName, email, avatar, createdAt, totalFiles }: UserDetailsProps ) {
        
        const userDetails = [
            { label: 'Full Name', value: fullName },
            { label: 'Email', value: email },
            { 
                label: 'Avatar', 
                value: (
                    <Image 
                        src={avatar} 
                        alt="User avatar" 
                        width={44} 
                        height={44} 
                        className="rounded-full" 
                    />
                )
            },
            { label: 'Account Creation Date', value: new Date(createdAt).toLocaleDateString() },
            { label: 'Total Files', value: totalFiles.toLocaleString() },
        ];

        return (
            <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
                <DialogOverlay className="user-info-modal-overlay" />
                
                <DialogContent className="user-info-modal">
                    <DialogHeader>
                        <DialogTitle className="user-info-modal-header">
                            User Details
                        </DialogTitle>
                    </DialogHeader>
                
                    <div>
                        {userDetails.map(
                            ({ label, value }) => (
                                <DetailRow key={label} label={label}>
                                    {value}
                                </DetailRow>
                            )
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        );
    }