'use client'

import React, { useState } from 'react'
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { loginSchema } from '@/Schemas/login.schemas'
import { signIn } from 'next-auth/react'

function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  let { toast } = useToast();
  const router = useRouter()

  const register = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '',
      password: ''
    }
  })

  const onSubmit: SubmitHandler<z.infer<typeof loginSchema>> = async (data) => {
    setIsSubmitting(true);

    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password
    })

    // console.log("result:", result);
    if (result?.url) {
      setIsSubmitting(false)
      toast({
        title: "Login succesfully",
      })
       router.push('/')
    }

    if (result?.error) {
      if (result.error === "CredentialSignin") {
        toast({
          title: "Login Failed",
          description: "Incorrect username or password",
          variant: "destructive"
        })
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive"
        })
        setIsSubmitting(false)
        router.push('/login')
      }
    }
    
  }

  /*
  const handleGoogleSignin = async () => {
    setIsSubmitting(true);
    const result = await signIn('google', {redirect:false})

    console.log("result:", result);

    if (result?.error) {
      console.log("nahi")
      toast({
        title: "Login Failed",
        description: "Failed to sign in with Google",
        variant: "destructive"
      })
      setIsSubmitting(false)
      router.push('/login')


    } else if (result?.url) {
      toast({
        title: "Login successfully",
      })
      console.log("hogya")
      setIsSubmitting(false)
      router.push('/')
    } else {
      setIsSubmitting(false)
    }
  }
*/

  return (
    <>
      <div className='flex justify-center items-center min-h-screen bg-gray-100'>
        <div className='bg-white p-8 max-w-md w-full space-y-8 rounded-lg shadow-md'>
          <div className='text-center'>
            <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>
              Join Mystrey Message
            </h1>
            <p className='mb-4'> Login to start your anonymous adventure</p>
            <Form {...register}>
              <form onSubmit={register.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={register.control}
                  name='identifier'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email/Username:</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your email or username" {...field} name='identifier' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={register.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password:</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your password" {...field} name='password' type='password' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type='submit' disabled={isSubmitting}>
                  {isSubmitting ? <><Loader2 className='mr-2 h-4 w-4 animate-spin' />Please wait</> : "Login"}
                </Button>
            <Button onClick={()=>signIn("google")} className="w-full mt-4" disabled={isSubmitting} type="submit" >
              {/* {isSubmitting ? <><Loader2 className='mr-2 h-4 w-4 animate-spin' />Please wait</> : "Sign in with Google"} */}
              {isSubmitting ? <><Loader2 className='mr-2 h-4 w-4 animate-spin' />Please wait</> : "Google"}

            </Button>
              </form>
            </Form>
            <div>
              <p>
                Not have an account?{' '}
                <Link href={'/signup'} className='text-blue-600 hover:text-blue-800'>Sign up</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default LoginPage
