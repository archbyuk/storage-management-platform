import Image from 'next/image';
import { Models } from 'node-appwrite';
import { convertFileSize, formatDateTime } from '@/lib/utils';
import Thumbnail from '@/components/main/thumbnail';
import FormattedDateTime from '@/components/main/format-date-time';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface FileDetailsProps {
    file: Models.Document;
    onInputChange?: React.Dispatch<React.SetStateAction<string[]>>;
    onRemove?: (email: string) => void;
}

// This component displays the details of a file, including its thumbnail, format, size, owner, and last edit date.
const ImageThumbnail = ( { file }: FileDetailsProps) => {
    
    return (
        <div className="file-details-thumbnail">
            <Thumbnail 
                type={file.type} 
                extension={file.extension} 
                url={file.url} 
            />
            <div className="flex flex-col">
                <p className="subtitle-2 mb-1">{file.name}</p>
                <FormattedDateTime date={file.$createdAt} className="caption" />
            </div>
        </div>    
    )
}


// ======================== Dropdown value from here === "detail" ======================== //

interface DetailRowProps {
    label: string;
    value: string;
}

// This component renders a row with a label and a value, used to display file details.
const DetailRow = ( { label, value }: DetailRowProps) => {
    
    return (
        <div className="flex">
            <p className="file-details-label text-left">{label}</p>
            <p className="file-details-value text-left">{value}</p>
        </div>
    )
}

// This component displays the details of a file, including its thumbnail, format, size, owner, and last edit date.
export const FileDetails = ( { file }: FileDetailsProps) => {
    
    return (
        <>
            <ImageThumbnail file={file} />
            <div className="space-y-4 px-2 pt-2">
                <DetailRow label="Format:" value={file.extension} />
                <DetailRow label="Size:" value={convertFileSize(file.size)} />
                <DetailRow label="Owner:" value={file.owner.fullName} />
                <DetailRow label="Last edit:" value={formatDateTime(file.$updatedAt)} />
            </div>
        </>
    )
}


// ======================== Dropdown value from here === "share" ======================== //


export const ShareInput = ( { file, onInputChange, onRemove }: FileDetailsProps) => {
    
    // console.log("Share Input: ", file);

    return (
        <>
            <ImageThumbnail file={file} />

            <div className="share-wrapper">
                <p className="subtitle-2 pl-1 text-light-100">
                    Share file with other users
                </p>

                <Input
                    type="email"
                    placeholder="Enter email address"
                    className="share-input-field"
                    onChange={(e) => onInputChange?.(e.target.value.trim().split(","))}
                />

                <div className="pt-4">
                    <div className="flex justify-between">
                        <p className="subtitle-2 text-light-100">Shared with</p>
                        <p className="subtitle-2 text-light-200">{file.users.length} users</p>
                    </div>

                    <ul className="pt-2">
                        {file.users.map(
                            (email: string) => (
                                <li
                                    key={email}
                                    className="flex items-center justify-between gap-2"
                                >
                                    <p className="subtitle-2">{email}</p>
                                    
                                    <Button
                                        onClick={() => onRemove?.(email)}
                                        className="share-remove-user"
                                    >
                                        <Image
                                            src="/assets/icons/remove.svg"
                                            alt="Remove"
                                            width={24}
                                            height={24}
                                            className="remove-icon"
                                        />
                                    </Button>
                                </li>
                            )
                        )}
                    </ul>
                </div>
                
            </div>
        </>
    )
}