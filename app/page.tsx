'use client';

import FormData from "./_create/formData";
import TaskList from "@/components/TaskList";
import { useUser } from "@/lib/userContext";

const Page = () => {
  const { user, loading, logout } = useUser();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Welcome, {user.name}!</h1>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      <FormData />
      <TaskList />
    </div>
  );
}

export default Page;