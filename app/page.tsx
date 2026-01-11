'use client';

import TaskList from "@/components/TaskList";
import { useUser } from "@/lib/context/user-provider";
import Qoute from "./_tasks/qoute";
import AddForm from "./_tasks/add-form";

const Page = () => {
  const { user, loading } = useUser();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please log in</div>;
  }

  return (
    <div className="mt-2 space-y-2">
      <Qoute/>
      <AddForm />
      <TaskList />
    </div>
  );
}

export default Page;