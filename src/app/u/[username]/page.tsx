"use client"
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import axios, { AxiosError } from 'axios';
import { useParams } from 'next/navigation';
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { sendMessageSchema } from '@/Schemas/sendmessage.schemas';
import { useToast } from '@/components/ui/use-toast';
import { apiResponse } from '@/types/ApiResponse';
import * as z from "zod"
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Textarea } from "@/components/ui/textarea"
import { useChat } from 'ai/react';
import { useCompletion } from 'ai/react';
import { Separator } from '@radix-ui/react-separator';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const specialChar = '||';

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};


const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

const Upage = () => {
  const params = useParams<{username:string}>() ;
  const { complete,
    completion, 
    isLoading: isSuggestLoading,
    error,} = useCompletion({
    api:'/api/suggestMessages',
    initialCompletion: initialMessageString,
  })
  const form = useForm<z.infer <typeof sendMessageSchema>>({
    resolver:zodResolver(sendMessageSchema),
  });

  const content = form.watch('content');

  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  };

  const {toast} = useToast()
  const onSubmit: SubmitHandler<z.infer<typeof sendMessageSchema>> =async(data) => {
    try {
      console.log("form data",data)
    const response =  await axios.post<apiResponse>('/api/sendMessage',{
        username:params.username,
        content
      })
      toast({
        title: 'Message sent',
        description: response.data.message
      })
    } catch (error) {
      console.error("Error while sending", error);
      const axiosError = error as AxiosError<apiResponse>;
      toast({
          title: 'send message failed',
          description: axiosError.response?.data.message,
          variant: 'destructive'
      })
    }
  }
  
  const fetchSuggestedMessages = async () => {
    try {
      complete('');
    } catch (error) {
      console.error('Error fetching messages:', error);
      // Handle error appropriately
    }
  };

  return (
    <div className='container mx-auto my-8 p-6 bg-white rounded max-w-4xl'>
          <h1 className="text-4xl font-bold mb-6 text-center">
        Public Profile Link
      </h1>
      <Form {...form} >
        <form action="" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
          name='content'
          control={form.control}
          render={({field})=>(
            <FormItem>
              <FormLabel>Send the Anonymous message to @{params.username}</FormLabel>
              <FormControl>
                <Textarea placeholder='Enter your username' {...field} />
              </FormControl>
            </FormItem>
          )}
          />
          <Button type='submit' >Send</Button>
        </form>
      </Form>
      
<div className="space-y-4 my-8">
        <div className="space-y-2">
          <Button
            onClick={fetchSuggestedMessages}
            className="my-4"
            disabled={isSuggestLoading}
          >
            Suggest Messages
          </Button>
          <p>Click on any message below to select it.</p>
        </div>
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Messages</h3>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            {error ? (
              <p className="text-red-500">{error.message}</p>
            ) : (
              parseStringMessages(completion).map((message, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="mb-2"
                  onClick={() => handleMessageClick(message)}
                >
                  {message}
                </Button>
              ))
            )}
          </CardContent>
        </Card>
      </div>
      
      
      <Separator className="my-6" />
      <div className="text-center">
        <div className="mb-4">Get Your Message Board</div>
        <Link href={'/signup'}>
          <Button>Create Your Account</Button>
        </Link>
      </div>
    </div>

      
  
  )
}

export default Upage


/*
 */