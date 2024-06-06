'use client'
import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { apiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import { verifySchema } from '@/Schemas/verify.schemas';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import z from "zod"

function Verifypage() {
    const router = useRouter();
    const params = useParams<{ username: string }>()
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false)

    const register = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues:{
            username:'',
            verifyCode:''
        }
    })

    const resendEmail = async() => {
        try {
            const response = await axios.post('/api/resendEmail', {
                username: params.username,
            })

            toast({
                title: "Successfully resent email",
                description: response.data.message
            })

            router.push('')
        } catch (error) {
            console.error("Error while resending the code", error);
            const axiosError = error as AxiosError<apiResponse>;
            toast({
                title: 'Email resend failed',
                description: axiosError.response?.data.message,
                variant: 'destructive'
            })

        }
    }

    const onSubmit: SubmitHandler<z.infer<typeof verifySchema>> = async(data) => {
        setIsSubmitting(true)
        try {
            const response = await axios.post('/api/verifyCode', {
                username: params.username,
                verifyCode: data.verifyCode
            })
            toast({ title: response.data.message });
            router.push('/');
        } catch (error) {
            console.error("Error while verifying the code", error);
            const axiosError = error as AxiosError<apiResponse>;
            toast({
                title: 'Verify code failed',
                description: axiosError.response?.data.message,
                variant: 'destructive'
            })
        }
        finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-100'>
            <div className='w-full max-w-md p-8 space-y-8 bg-slate-100 rounded-lg shadow-md' >
                <div className='text-center'>
                    <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>
                        Verify Your Account
                    </h1>
                    <p className='mb-4' > Enter the verification code sent to your email</p>
                        <Form {...register}>
                            <form className='space-y-6' onSubmit={register.handleSubmit(onSubmit)}>
                                <FormField
                                    control={register.control}
                                    name='verifyCode'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Verification Code:</FormLabel>

                                                <Input placeholder="Enter the code"  {...field} />
                                            <FormMessage />
                                        </FormItem>

                                    )}
                                />
                                  <Button type='submit' disabled={isSubmitting} >{isSubmitting?<><Loader2 className='mr-2 h-4 w-4 animate-spin' />Please wait</>:"verify"}</Button>
                                  <button className="ml-4 bg-slate-800 text-black hover:bg-slate-900  font-semibold hover:text-white py-2 px-3 rounded-md border border-black" onClick={resendEmail}>Resend</button>
                            </form>
                        </Form>

                </div>
            </div>

        </div>
    )
}

export default Verifypage;
