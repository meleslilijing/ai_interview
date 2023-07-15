'use client'
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from 'next/navigation'
import { ReloadIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

import { Input } from "@/components/ui/input";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

var CryptoJS = require("crypto-js");

const NAME = "Login"
const PWD_INPUT_TYPE = process.env.NODE_ENV === 'production' ? 'password' : 'text'

const schema = process.env.NODE_ENV === 'production' ? z.object({
  username: z.string().trim().email(),
  password: z.string().trim().min(7, {
    message: "Password must be at least 7 characters.",
  }).max(15, {
    message: "Password must be maximum 15 characters.",
  })
}) : z.object({
  username: z.string().trim(),
  password: z.string().trim(),
})

const Login = () => {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const Router = useRouter()

  const form = useForm<z.infer<typeof schema>>({
    resolver: async (data, context, options) => {
      return zodResolver(schema)(data, context, options);
    },
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const {
    handleSubmit,
  } = form;

  async function onSubmit(values: z.infer<typeof schema>) {
    const { username, password } = values
    const url = "/auth/api/signin"
    setLoading(true)

    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          username,
          password: CryptoJS.MD5(password).toString()
        }),
        headers: {
          "Content-Type": "application/json; charset=UTF-8;"
        }
      })
      setLoading(false)
      const data = await response.json()
      const { status, message } = data

      if (status === 200) {
        alert(`Login success: ${message}`)
        // toast({title: "Login success", description: message})
        Router.push('/')
      } else {
        alert(`Login failded: ${message}`)
        // toast({title: "Login failded", description: message})
      }
    } catch (err: any) {
      setLoading(false)
      
    }
  }

  const Btn = loading ? (<Button variant={"outline"} disabled>
    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />Please wait</Button>)
    : <Button variant={"outline"} type="submit">{NAME}</Button>

  return (
      <Card>
        <CardHeader>
          <CardTitle>{NAME}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="username" {...field} type="text" />
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
                    <FormLabel>password</FormLabel>
                    <FormControl>
                      <Input placeholder="password" {...field} type={PWD_INPUT_TYPE} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {Btn}
            </form>
          </Form>
        </CardContent >
      </Card>
  );
};

export default Login;
