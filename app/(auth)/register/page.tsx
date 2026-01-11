import FormData from "./formData";
import Link from "next/link";

const Page = () => {
    return (
        <div>
            <FormData />
            <div className="mt-4">
                Have an account? <Link href="/login" className="text-blue-500">Login</Link>
            </div>
        </div>
    );
}

export default Page;