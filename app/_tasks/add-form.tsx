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
    <div className="mb-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative group">
                    <Input
                      placeholder="What needs to be done?"
                      className="h-14 pl-5 pr-16 bg-white border-2 border-gray-100 rounded-2xl focus-visible:ring-black focus-visible:border-black transition-all text-base shadow-sm group-focus-within:shadow-md"
                      {...field}
                      disabled={loading}
                    />

                    <Button
                      type="submit"
                      variant={"default"}
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-xl bg-black text-white hover:bg-gray-800 transition-all hover:scale-105 active:scale-95"
                      disabled={loading || !field.value}
                    >
                      <PlusIcon className="w-5 h-5" />
                    </Button>
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>

  );
}

export default AddForm;