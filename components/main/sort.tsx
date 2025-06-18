"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { sortTypes } from "@/constants";
import { usePathname, useRouter } from "next/navigation";

export default function Sort() {
    const pathname = usePathname();
    const router = useRouter();

    const handleSort = (value: string) => {
        router.push(`${pathname}?sort=${value}`);    // update the sort query parameter
    }

    return(
        <Select onValueChange={handleSort} defaultValue={sortTypes[0].value}>
            <SelectTrigger className="sort-select">
                <SelectValue placeholder={ sortTypes[0].value }/>
            </SelectTrigger>
            <SelectContent className="sort-select-content">
                {sortTypes.map(
                    (sort) => (
                        <SelectItem
                            key={sort.label}
                            value={sort.value}
                            className="shad-select-item"    
                        >
                            {sort.label}
                        </SelectItem>
                    )
                )}
            </SelectContent>
        </Select>
    )
}