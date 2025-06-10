import { cn, formatDateTime } from "@/lib/utils";

interface DateTimeProps {
    date: string;
    className?: string;
}

export default function FormattedDateTime( { date, className}: DateTimeProps) {
    
    return(
        <p className={cn("body-1 text-light100", className)}>
            { formatDateTime(date) }
        </p>
    )
}