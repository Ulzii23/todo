'use client';

import FormData from "./_create/formData";
import TaskList from "@/components/TaskList";
import { useUser } from "@/lib/context/user-provider";

const Page = () => {
  const { user, loading } = useUser();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please log in</div>;
  }

  return (
    <div className="mt-2">
      <FormData />
      <TaskList />
    </div>
  );
}

export default Page;