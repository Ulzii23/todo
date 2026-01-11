'use client';

import FormData from "./_tasks/formData";
import TaskList from "@/components/TaskList";
import { useUser } from "@/lib/context/user-provider";
import Qoute from "./_tasks/qoute";

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
      <div className="mb-2">
      <Qoute/>
      </div>

      <FormData />
      <TaskList />
    </div>
  );
}

export default Page;