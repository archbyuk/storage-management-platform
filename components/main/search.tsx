"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Models } from "node-appwrite";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Thumbnail from "./thumbnail";
import FormattedDateTime from "./format-date-time";
import { useDebounce } from "use-debounce";
import { getFiles } from "@/lib/action/file.action";
import { toast } from "sonner";

export default function Search () {
    const [query, setQuery] = useState("");                             // State to manage the search query (Input value)
    const [open, setOpen] = useState(false);                            // State to manage the visibility of the search results
    const [results, setResults] = useState<Models.Document[]>([]);      // State to manage the search results from the database
    
    const router = useRouter();
    const [debouncedQuery] = useDebounce(query, 300);                   // Custom hook to debounce the search query input (not defined in this snippet)
    const path = usePathname();                                         // Get the current path to navigate to the correct directory

    const searchParams = useSearchParams();                             // Get the search parameters from the URL
    const searchQuery = searchParams.get("query") || "";                // Get the search query from the URL parameters, default to an empty string, ex: ?query=searchTerm

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
            // Check if the debounced query is empty
            if (debouncedQuery.length === 0) {
                setResults([]);        // Reset results if query is too short
                setOpen(false);        // Close search results
                
                return router.push(path)        // Navigate to the current path without query
            }
            
            try{
                // Fetch files from the database based on the debounced query
                const files = await getFiles(
                    { 
                        types: [], 
                        searchText: debouncedQuery 
                    }
                )
                setResults(files?.documents || []);     // Update the results state with the fetched files or set an empty array if files is undefined
                setOpen(true);                          // Open the search results
            }

            // Handle any errors that occur during the fetch operation
            catch(error) {
                console.error('Error fetching files:', error);      // Throw an error if fetching files fails
                toast.error('파일 검색 중 오류가 발생했습니다');
            }

        };

        // Call the fetchFiles function to perform the search
        fetchFiles();

    },[debouncedQuery]);

    useEffect(() => {
        if(!searchQuery) {
            setQuery("");       // Reset query if no search query is present
        }
    },[searchQuery]);
  
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
