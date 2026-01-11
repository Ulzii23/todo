import { useState, useEffect, use } from "react";

const url = "https://dummyjson.com/quotes/random";

const Qoute = () => {
    const [quote, setQuote] = useState<string>("");
    const fetchQoute = async () => {
        try {
            const response = await fetch(url); 
            const data = await response.json();
            setQuote(data.quote);
        } catch (error) {
            console.error("Error fetching the quote:", error);
        }
    };
    useEffect(() => {
        fetchQoute();
    }, []);
    return (
        <div>
            {quote && <p className="italic text-sm text-center">"{quote}"</p>}
        </div>
    );
}

export default Qoute;