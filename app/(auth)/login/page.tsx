import FormData from "./formData";
import Link from "next/link";

const Page = () => {
    return (
        <div>
            <FormData />
            <div className="mt-4">
                No account? <Link href="/register" className="text-blue-500">Register</Link>
            </div>
        </div>
    );
}

export default Page;