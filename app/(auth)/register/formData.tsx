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

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    email: z.email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(4, {
        message: "Password must be at least 4 characters.",
    }),
})


const FormData = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            password: "",
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify(values)
        });
        const data = await response.json();
        console.log(data);
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>name</FormLabel>
                            <FormControl>
                                <Input placeholder="shadcn" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="shadcn" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} />
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