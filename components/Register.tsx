'use client'
import { useForm } from "react-hook-form";

import { ReloadIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Input } from "@/components/ui/input";
import { useState } from 'react'
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
// import { useRouter } from "next/router";
import { useRouter } from 'next/navigation'

var CryptoJS = require("crypto-js")

const NAME = 'Register'


let schema = process.env.NODE_ENV === 'production' ? z.object({
  username: z.string().trim().email(),
  password: z.string().trim().min(7, {
    message: "Password must be at least 7 characters.",
  }).max(15, {
    message: "Password must be maximum 15 characters.",
  }),
  repassword: z.string().trim().min(7, {
    message: "Password must be at least 7 characters.",
  }).max(15, {
    message: "Password must be maximum 15 characters.",
  })
}).refine((data) => data.password === data.repassword, {
  message: "Password doesn't match",
  path: ["repassword"]
}) : z.object({
  username: z.string().trim(),
  password: z.string().trim(),
  repassword: z.string().trim()
}).refine((data) => data.password === data.repassword, {
  message: "Password doesn't match",
  path: ["repassword"]
})

const Register = () => {
  const [loading, setLoading] = useState(false)
  const Router = useRouter()
  const form = useForm<z.infer<typeof schema>>({
    resolver: async (data, context, options) => {
      return zodResolver(schema)(data, context, options);
    },
    defaultValues: {
      username: "",
      password: "",
      repassword: ""
    },
  });

  const {
    handleSubmit,
  } = form;

  async function onSubmit(values: z.infer<typeof schema>) {
    const {username, password} = values

    const url = "/auth/api/signup"

    setLoading(true)
    try {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=UTF-8;' },
        body: JSON.stringify({ 
          username,
          password: CryptoJS.MD5(password).toString()
        })
      };
      const response = await fetch(url, requestOptions)

      setLoading(false)
      const data = await response.json()
      const {status, message} = data

      if (status === 200) {
        alert(`Register success: ${message}`)
        Router.push('/')
      } else {
        alert(`Register failded: ${message}`)
      }
    } catch(err: any) {
      console.error(err)
      setLoading(false)
    }
  }

  const Btn = loading ? (<Button variant={"outline"} disabled>
  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />Please wait</Button>)
  : <Button variant={"outline"} type="submit">{ NAME }</Button>

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
                      <Input placeholder="username by email" {...field} />
                    </FormControl>
                    <FormDescription>Register by email</FormDescription>
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
                      <Input placeholder="password" {...field} />
                    </FormControl>
                    <FormDescription>set password</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="repassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>repassword</FormLabel>
                    <FormControl>
                      <Input placeholder="confirm password" {...field} />
                    </FormControl>
                    <FormDescription>set password</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              { Btn }
            </form>
          </Form>
        </CardContent >
      </Card>
    )
}

export default Register