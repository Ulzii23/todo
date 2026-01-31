import { useState, useEffect } from "react";
import { Quote as QuoteIcon } from "lucide-react";

const url = "https://dummyjson.com/quotes/random";

const Qoute = () => {
    const [quote, setQuote] = useState<string>("");
    const [author, setAuthor] = useState<string>("");

    const fetchQoute = async () => {
        try {
            const response = await fetch(url);
            const data = await response.json();
            setQuote(data.quote);
            setAuthor(data.author);
        } catch (error) {
            console.error("Error fetching the quote:", error);
        }
    };

    useEffect(() => {
        fetchQoute();
    }, []);

    if (!quote) return null;

    return (
        <div className="relative p-6 py-8 bg-primary text-primary-foreground rounded-3xl overflow-hidden mb-4 shadow-lg">
            <QuoteIcon className="absolute top-2 left-2 w-12 h-12 opacity-15" />
            <p className="text-lg font-medium leading-tight relative z-10">
                {quote}
            </p>
            {author && <p className="mt-2 text-xs opacity-70 font-medium">— {author}</p>}
        </div>
    );
}

export default Qoute;