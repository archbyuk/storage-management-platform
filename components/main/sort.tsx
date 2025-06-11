"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { sortTypes } from "@/constants";


export default function Sort() {

    return(
        <Select>
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