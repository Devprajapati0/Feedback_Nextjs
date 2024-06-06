'use client'

import { acceptMessagesSchema } from "@/Schemas/acceptmessages.schemas";
import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Messages } from "@/models/message.model"
import { apiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod"

function Dashboardpage() {
  const [messages,setMessages] = useState<Messages[]>([]);
  const [isLoading,setIsLoading] = useState<boolean>(false);
  const [isSwitchLoading,setIsSwitchLoading] = useState<boolean>(false);
  let {toast} = useToast();

  const handleDelete = (messageId:string)=>{
    setMessages(messages.filter((message)=>message._id !== messageId));
  }

  const {data:session} = useSession();
   console.log("useSession",useSession())
   console.log("useSession",useSession().data)

  // console.log("datasessiondadh",session)

 

  const form = useForm<z.infer <typeof acceptMessagesSchema>>({
    resolver: zodResolver(acceptMessagesSchema),
  })
  const {register,watch,setValue} = form
  
  const acceptMessages = watch('acceptMessages')

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true)
    try {
     const response = await axios.get<apiResponse>('/api/acceptMessage')
      setValue('acceptMessages',response.data.isAcceptingMessage!)
    } catch (error) {
      const axiosError = error as AxiosError<apiResponse>
      toast({
        title:"Error",
        description: axiosError.response?.data.message || "Failed to fetch message settings",
        variant:"destructive"
      })
    }
    finally{
      setIsSwitchLoading(false)
    }
  },[setValue,toast])

  const fetchMessages = useCallback(async(refresh: boolean = false)=>{
    setIsLoading(true)
    setIsSwitchLoading(true)

    try {
      const response = await axios.get<apiResponse>('/api/getMessages');
      setMessages(response.data.messages || [])

      if(refresh){
        toast({
          title:"Refreshed messages",
          description:"showing latest messages"
        })
      }
   
    } catch (error) {
      toast({
        title:'Error',
        description: 'Failed to get all the messages ',
        variant:"destructive"
      })
    }
    finally{
      setIsLoading(false)
      setIsSwitchLoading(false)
    }
  },[setMessages,toast])

  useEffect(()=>{
    if(!session || !session.user) return
    fetchMessages()
    fetchAcceptMessages()
  },[session,fetchAcceptMessages,fetchMessages,setValue])

  //handle switch change
  const handleSwitchChange = async() => {
    try {
      const response = await axios.post<apiResponse>('/api/acceptMessage',{
        acceptMessages: !acceptMessages
      })
      setValue("acceptMessages",!acceptMessages)
      toast({
        title: response.data.message
      })
    } catch (error) {
      const axiosError = error as AxiosError<apiResponse>
      toast({
        title:"Error",
        description: axiosError.response?.data.message || "Failed to fetch message settings",
        variant:"destructive"
      })
    }
  }

  //const baseUrl = window.location.origin;

  // const baseUrl = req.protocol + '://' + req.get('host');

  //const baseUrl = router.basePath;

  /*const url = new URL('http://example.com/path/to/page');
    const baseUrl = `${url.protocol}//${url.hostname}`; */

    //const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    console.log("window",window)
    const user:User = session?.user as User || ''
    // console.log(session)
    // console.log("user susnshc",user)
    const baseUrl = `${window.location.origin}`;
    const profileUrl = `${baseUrl}/u/${user.username}`

    const copyToClipBoard = ()=>{
      navigator.clipboard.writeText(profileUrl)
      toast({
        title:"successfully copied"
      })
    }

  if(!session || !session.user){
    return (
      <>
      <div>Please login </div>
      <span> <Link href={'/login'} ><Button className='w-full md:w-auto'>Login</Button></Link></span>
      </>
    )
  }


  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full mzx-w-6xl" >
      <h1 className="text-4xl font-bold mb-4" > User Dashboard</h1>

      <div className="mb-4" >
        <h2 className="text-lg font-semibold mb-2" >
          Copy your unique Link
        </h2>{' '}
        <div className="flex items-center">
          <input type="text" value={profileUrl} disabled className="input input-bordered w-full p-2 mr-2" />
          <button onClick={copyToClipBoard} >Copy</button>
        </div>
      </div>

      <div className="mb-4" >
        <Switch 
         {...register('acceptMessages')}
         checked = {acceptMessages}
         onCheckedChange={handleSwitchChange}
         disabled = {isSwitchLoading}
         />
         <span className="ml-2">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
         </span>
      </div> 

      <Separator />

      <Button className="mt-4" variant={"outline"} onClick={(e)=>{
        e.preventDefault();
        fetchMessages(true)
      }} >{isLoading ? (<Loader2 className="h-4 animate-spin" />) :(<RefreshCcw className="h-4 w-4" />)}</Button>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6" >
        {
          messages.length > 0 ? (
            messages.map((message,index) => (
              <MessageCard
                key={message._id}
                message={message}
                onMessageDelete={handleDelete}
              />
            ))
          ):( "No messages to Display")
        }
      </div>
    </div>
  )
}

export default Dashboardpage