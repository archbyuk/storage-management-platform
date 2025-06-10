"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Models } from "node-appwrite";
import { useRouter } from "next/navigation";
import Thumbnail from "./thumbnail";
import FormattedDateTime from "./format-date-time";
import { useDebounce } from "use-debounce";

export default function Search () {
    const [query, setQuery] = useState("");                             // State to manage the search query (Input value)
    const [open, setOpen] = useState(false);                            // State to manage the visibility of the search results
    const [results, setResults] = useState<Models.Document[]>([]);      // State to manage the search results from the database
    
    const router = useRouter();
    const [debouncedQuery] = useDebounce(query, 300);                   // Custom hook to debounce the search query input (not defined in this snippet)

    const handleClickItem = (file: Models.Document) => {
        setOpen(false);         // Close the search results when an item is clicked
        setResults([]);         // Clear the search results
        
        // Use router.push to navigate to the corresponding file type page
        // The URL includes the current search query as a query parameter ( ?query = ... )
        // This is used by the receiving page component to fetch and display matching files
        router.push(
            `/${file.type === "video" || file.type === "audio" ? "media" : file.type + "s"}?query=${query}`,
        )
    }

    useEffect(() => {
        const fetchFiles = async () => {
            if (debouncedQuery.length < 0) {
                setResults([]); // Reset results if query is too short
                return;
            }
        }
    },[])
  
    return (
        <div className="search">
            <div className="search-input-wrapper">
                <Image
                    src="/assets/icons/search.svg"
                    alt="Search"
                    width={24}
                    height={24}
                />

                <Input
                    value={query}
                    placeholder="Search..."
                    className="search-input"
                    onChange={(e) => setQuery(e.target.value)}
                />

                {open && (
                    <ul className="search-results">
                        {results.length > 0 ? (
                            results.map(
                                (file) => (
                                    <li
                                        className="flex items-center justify-between"
                                        key={file.$id}
                                        onClick={() => handleClickItem(file)}
                                    >
                                        <div className="flex cursor-pointer items-center gap-4">
                                            <Thumbnail
                                                type={file.type}
                                                extension={file.extension}
                                                url={file.url}
                                                className="size-9 min-w-9"
                                            />
                                            <p className="subtitle-2 line-clamp-1 text-light-100">
                                                { file.name }
                                            </p>
                                        </div>

                                        <FormattedDateTime
                                            date={file.$createdAt}
                                            className="caption text-light-200 line-clamp-2"
                                        />
                                    </li>
                                )
                            )
                        ) : (
                            <p className="empty-result">No files found</p>
                        )}
                    </ul>
                )}
            </div>
        </div>
    )
}
