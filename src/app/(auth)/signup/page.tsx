'use client'

import React, { useEffect, useState } from 'react'
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
import { signupSchema } from '@/Schemas/signup.schemas'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useDebounceCallback } from 'usehooks-ts'
import { useRouter } from 'next/navigation'
import axios, { AxiosError } from "axios"
import { apiResponse } from '@/types/ApiResponse'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
// import { useSession } from 'next-auth/react'

function SignupPage() {
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('')
  const [isCheckingUsername, setisCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debounced = useDebounceCallback(setUsername, 4000);
  const { toast } = useToast();
  const router = useRouter()
  
  //zod implemetation


  const register = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: '',
      email: '',
      password: ''
    }
  })

  console.log("register",register);
  console.log("useForm()",useForm());
  useEffect(() => {
    const checkUSernameUnique = async () => {
      if (username) {//username is debounced username
        setisCheckingUsername(true);
        setUsernameMessage('');
       try {
         const response = await axios.get<apiResponse>(`/api/usernameUnique?username=${username}`)
        //  console.log(response.data.message)
         setUsernameMessage(response.data.message)
       } catch (error) {
         const axiosError = error as AxiosError<apiResponse>
         setUsernameMessage(axiosError.response?.data.message || 'Error checking the username')
       } finally{
        setisCheckingUsername(false)
       }
      }
    }
    checkUSernameUnique()

   
  }, [username])

  const onSubmit: SubmitHandler<z.infer <typeof signupSchema>> = async(data) => {
    // console.log(data);
    setIsSubmitting(true);
    
    try {
    const response =  await axios.post<apiResponse>('/api/signup',data)
     toast({
      title:'Successfully signup'
     })
    //  console.log("response0-",response.data.message)
    const username = response.data?.message
      router.push(`/verify/${username}`)
     setIsSubmitting(false)
    } catch (error) {
      // console.error('Error in signup of User',error)
      const axiosError = error as AxiosError<apiResponse>;
      setUsernameMessage(axiosError.response?.data.message || 'Error submiting the form')
      toast({
        title:'Signup failed',
        variant:'destructive'
      })
      setIsSubmitting(false)
    }
  }

  /*
  const handleGoogleSignup = async () => {
    setIsSubmitting(true);
    const result = await signIn('google', { redirect: false })
    console.log("rsulttt",result)
    if (result?.error) {
      toast({
        title: "Signup Failed",
        description: "Failed to sign up with Google",
        variant: "destructive"
      })
      setIsSubmitting(false)
    } else if (result) {
      toast({
        title:'Successfully signup',
       })
       router.replace('/')
      //  router.replace(`/verify/${data?.user.username}`)
       setIsSubmitting(false)
      router.push('/')
    } else {
      setIsSubmitting(false)
    }
  }*/



  return (
   <>
   <div className='flex justify-center items-center min-h-screen bg-gray-100'>
     <div className='bg-white p-8 max-w-md w-full space-y-8 rounded-lg shadow-md'>
      <div className='text-center'>
        <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>
          Join Mystrey Message
        </h1>
        <p className='mb-4'> Sign up to start your anyonymus adventure</p>
        <Form {...register}>
          <form onSubmit={register.handleSubmit(onSubmit)} className = "space-y-6">
            <FormField
             control={register.control}
             name='username'
             render = {({field}) => (
              <FormItem>
                <FormLabel>Username:</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your username"  {...field} onChange={(e)=> {field.onChange(e); debounced(e.target.value)}} />
                </FormControl>
                {isCheckingUsername && <Loader2 className='animate-spin'/>}
                <p className={`text-sm ${usernameMessage === 'username is unique' ? 'text-green-500' : 'text-red-500'}`} >{usernameMessage}</p>
                <FormMessage/>
              </FormItem>
              
             )}
            />
            <FormField
             control={register.control}
             name='email'
             render = {({field}) => (
              <FormItem>
                <FormLabel>Email:</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your emial" {...field} name='email' />
                </FormControl>
                <FormMessage/>
              </FormItem>
              
             )}
            />
                <FormField
             control={register.control}
             name='password'
             render = {({field}) => (
              <FormItem>
                <FormLabel>Password:</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your password" {...field} name='password' type='password' />
                </FormControl>
                <FormMessage/>
              </FormItem>
              
             )}
            />
            <Button type='submit' disabled={isSubmitting} >{isSubmitting?<><Loader2 className='mr-2 h-4 w-4 animate-spin' />Please wait</>:"Signup"}</Button>
            
          </form>

        </Form>
        {/* <Button onClick={handleGoogleSignup} className="w-full mt-4" disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className='mr-2 h-4 w-4 animate-spin' />Please wait</> : "Sign up with Google"}
            </Button> */}
        <div>
          <p>
            Already a member ?{''}
            <Link href={'/login'} className='text-blue-600 hover:text-blue-800'>Login</Link>
          </p>
        </div>
      </div>
     </div>

   </div>
   </>
  )
}

export default SignupPage

/*
Hook form that use uncrolled state
      import { useForm, Controller } from 'react-hook-form';
import { Input } from 'some-ui-library'; // Example: a third-party input component

function AdvancedForm() {
  const { control, handleSubmit } = useForm();
  const onSubmit = data => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="username"
        control={control}
        render={({ field }) => (
          <div>
            <label>Username:</label>
            <Input {...field} placeholder="Enter your username" />
          </div>
        )}
      />
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <div>
            <label>Email:</label>
            <Input {...field} placeholder="Enter your email" />
          </div>
        )}
      />
      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <div>
            <label>Password:</label>
            <Input type="password" {...field} placeholder="Enter your password" />
          </div>
        )}
      />
      <button type="submit">Submit</button>
    </form>
  );
}








/// form that unconrolled state

import { useForm } from 'react-hook-form';

function SimpleForm() {
  const { register, handleSubmit } = useForm();
  const onSubmit = data => console.log(data);

  // Define your onChange handler function
  const handleInputChange = event => {
    // You can access the input value using event.target.value
    console.log(event.target.value);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Username:</label>
        {/* Add the onChange event handler to the input
        <input
          {...register("username")}
          placeholder="Enter your username"
          onChange={handleInputChange} // Call handleInputChange when the input changes
        />
      </div>
      <div>
        <label>Email:</label>
        <input {...register("email")} placeholder="Enter your email" />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" {...register("password")} placeholder="Enter your password" />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}



*/