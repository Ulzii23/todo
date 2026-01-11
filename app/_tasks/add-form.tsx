"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"



import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useTasks } from '@/lib/context/tasks-provider'
import { PlusIcon } from "lucide-react"

const formSchema = z.object({
  title: z.string().min(1, { message: 'Task title is required' }),
})


const AddForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: '' },
  })

  // 2. Define a submit handler.
  const { addTask, taskAt, loading } = useTasks();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    addTask({ title: values.title, task_at: taskAt }).then(() => {
      form.reset();
    });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="Add task"
                    className="pr-24 bg-white" // space for button
                    {...field}
                    disabled={loading}
                  />

                  <Button
                    type="submit"
                    variant={"default"}
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8"
                    disabled={loading}
                  >
                    <PlusIcon />
                  </Button>
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>

  );
}

export default AddForm;