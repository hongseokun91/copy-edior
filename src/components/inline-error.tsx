import { AlertCircle } from "lucide-react";

interface InlineErrorProps {
    message?: string;
}

export function InlineError({ message }: InlineErrorProps) {
    if (!message) return null;

    return (
        <div className="flex items-center gap-1 mt-1.5 text-sm text-destructive font-medium animate-in fade-in slide-in-from-top-1">
            <AlertCircle className="h-4 w-4" />
            <span>{message}</span>
        </div>
    );
}
