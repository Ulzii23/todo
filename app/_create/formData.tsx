"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"



import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useTasks } from '@/lib/tasksContext'

const formSchema = z.object({
    name: z.string().min(1, { message: 'Task name is required' }),
})


const FormData = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { name: '' },
    })

    // 2. Define a submit handler.
    const { addTask } = useTasks();

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const res = await fetch('/api/task', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: values.name }),
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
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Task</FormLabel>
                            <FormControl>
                                <Input placeholder="New task" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    );
}

export default FormData;