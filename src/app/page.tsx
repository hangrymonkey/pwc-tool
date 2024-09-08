"use client"; 

import Image from "next/image";
import { Button } from "@/components/ui/button";
import FormGenerator from "./form-generator";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import UploadDoc from "./othercomp/UploadDoc";
import BizForm from "./othercomp/temp";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";


const formSchema = z.object({
  emailAddress: z.string().email(),
  password: z.string().min(3), 
  passwordConfirm: z.string()
}).refine((data) => {
  return data.password === data.passwordConfirm
});

export default function Home() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailAddress: "",
    },
  });

  const handleSubmit = () => {};
      // <Form {...form}>
      //   <form onSubmit={form.handleSubmit(handleSubmit)}>
      //     <FormField
      //       control={form.control}
      //       name="emailAddress"
      //       render={({ field }) => {
      //         return (
      //           <FormItem>
      //             <FormLabel>Email Address</FormLabel>
      //             <FormControl>
      //               <Input
      //                 placeholder="Email address"
      //                 type="email"
      //                 {...field}
      //               />
      //             </FormControl>
      //             <FormMessage />
      //           </FormItem>
      //         );
      //       }}
      //     />
      //     <Button type="submit">Submit</Button>
      //   </form>
      // </Form>

      // <FormGenerator />
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-3">
      <MaxWidthWrapper>
      <header className="text-black py-10 text-left">
        <h1 className="text-4xl font-bold">Self-Review Tool for Tax</h1>
      </header>
      <UploadDoc />
      </MaxWidthWrapper>
    </main>
  );
}
