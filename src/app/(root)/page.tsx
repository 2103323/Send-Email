"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Email options
const emailOptions: { [key: string]: { subject: string; message: string } } = {
  welcome: {
    subject: "Welcome",
    message: "Welcome to our service! We are glad to have you on board.",
  },
  reminder: {
    subject: "Reminder",
    message: "This is a reminder for your upcoming appointment.",
  },
  promotion: {
    subject: "Promotion",
    message: "<p>Get 50% off on all items!</p>",
  },
};

// Updated form schema to handle multiple emails
const formSchema = z.object({
  emailType: z.string().nonempty({ message: "Email type is required." }),
  email: z
    .string()
    .refine(
      (value) => {
        const emails = value.split(",").map((email) => email.trim());
        return emails.every((email) => z.string().email().safeParse(email).success);
      },
      { message: "One or more email addresses are invalid." }
    ),
  name: z
    .string()
    .refine(
      (value) => {
        const names = value.split(",").map((name) => name.trim());
        return names.every((name) => name.length > 0);
      },
      { message: "One or more names are invalid." }
    )
    .optional(),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters long." })
    .max(50000000000000, {
      message: "Message must be at most 50000000000000 characters long.",
    }),
});

const CreateEvent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showHtmlMessage, setShowHtmlMessage] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailType: "",
      email: "",
      name: "",
      message: "",
    },
  });

  const handleEmailTypeChange = (value: string) => {
    const selectedOption = emailOptions[value];
    if (selectedOption) {
      form.setValue("email", "");
      form.setValue("message", selectedOption.message);
      setShowHtmlMessage(value === "promotion");
    }
  };

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const emailType = data.emailType;
    const emails = data.email.split(",").map((email) => email.trim());
    const message = data.message;

    try {
      for (const email of emails) {
        const formData = new FormData();
        formData.append("emailType", emailType);
        formData.append("email", email);
        formData.append("message", message);

        if (emailType === "promotion") {
          const name = data.name?.split(",").map((name) => name.trim()) || [];
          formData.append("name", name.join(","));
        }

        const response = await fetch("/api", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`response status: ${response.status}`);
        }

        const responseData = await response.json();
        console.log(responseData.message);
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
                name="emailType"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleEmailTypeChange(value);
                        }}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Email Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(emailOptions).map((key) => (
                            <SelectItem key={key} value={key}>
                              {emailOptions[key].subject}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                    <FormControl>
                      <Input
                        placeholder="Enter emails separated by commas"
                        {...field}
                        className="input-field text-black"
                        autoComplete="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {showHtmlMessage && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Enter names separated by commas"
                        {...field}
                        className="input-field text-black"
                        autoComplete="name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex flex-col gap-5 md:flex-row">
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl className="h-72 dark:bg-gray-700">
                      {showHtmlMessage ? (
                        <Textarea
                          placeholder="HTML Message"
                          {...field}
                          className="textarea rounded-2xl text-black"
                          autoComplete="message"
                        />
                      ) : (
                        <Textarea
                          placeholder="Write Message"
                          {...field}
                          className="textarea rounded-2xl text-black"
                          autoComplete="message"
                        />
                      )}
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
