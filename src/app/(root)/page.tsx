"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"; // Assuming these are correctly imported
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea"; // Assuming these are correctly imported
import { zodResolver } from "@hookform/resolvers/zod";

// Updated form schema to handle multiple emails
const formSchema = z.object({
  email: z
    .string()
    .refine((value) => {
      // Split the string by commas and validate each email
      const emails = value.split(",").map((email) => email.trim());
      return emails.every((email) => z.string().email().safeParse(email).success);
    }, { message: "One or more email addresses are invalid." }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters long." })
    .max(500, { message: "Message must be at most 500 characters long." }),
});

const CreateEvent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      message: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const emails = data.email.split(",").map((email) => email.trim());
    const message = data.message;

    try {
      for (const email of emails) {
        const formData = new FormData();
        formData.append("email", email);
        formData.append("message", message);

        const response = await fetch("/api", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`response status: ${response.status}`);
        }

        const responseData = await response.json();
        console.log(responseData["message"]);
      }

      alert("Messages successfully sent");
    } catch (err) {
      console.error(err);
      alert("Error, please try resubmitting the form");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 dark:bg-zinc-950 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left">Send Email</h3>
      </section>

      <div className="wrapper my-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <div className="flex flex-col gap-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Your Email"
                        {...field}
                        className="input-field text-black"
                        autoComplete="given-Email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col gap-5 md:flex-row">
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl className="h-72 dark:bg-gray-700">
                      <Textarea
                        placeholder="Description"
                        {...field}
                        className="textarea rounded-2xl text-black"
                        autoComplete="given-description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" size="lg" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send"}
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
};

export default CreateEvent;
