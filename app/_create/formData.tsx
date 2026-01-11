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


const FormData = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: '' },
  })

  // 2. Define a submit handler.
  const { addTask, taskAt } = useTasks();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await fetch('/api/task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: values.title, task_at: taskAt }),
      });

      if (res.ok) {
        const created = await res.json();
        form.reset();
        if (addTask) addTask(created);
      } else {
        console.error('Failed to create task');
      }
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="New task"
                    className="pr-24" // space for button
                    {...field}
                  />

                  <Button
                    type="submit"
                    variant={"default"}
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8"
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

export default FormData;