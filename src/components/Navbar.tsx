'use client'
import React from 'react'
import Link from 'next/link'
import { useSession,signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from '@react-email/components'
import { useRouter } from 'next/navigation'
const Navbar = () => {
    const {data: session} = useSession();
    console.log("data",session);
    const router = useRouter()
    const user:User = session?.user as User


  return (
   <nav className='p-4 md:p-6 shadow-md'>
      <div className='container mx-auto flex flex-col md:flex-row justify-between items-center' >
        <Link className='text-xl font-bold mb-4 md:mb-0' href={'/'}>Mystry Message</Link>
        {
            
                session ? (
                  <>
                    <span className='mr-4' >Welcome,{user?.username || user?.email}</span>
                    <Button className='w-full md:w-auto' onClick={()=>router.push('/dashboard')}>Dashboard</Button>
                    <Button className='w-full md:w-auto' onClick={()=>signOut()}>Logout</Button></>
                ):(
                  <button className='text-xl font-bold mb-4 md:mb-0'onClick={()=>(router.push('/signup'))}>Signup</button>

                )
            
        }
      </div>
   </nav>
  )
}

export default Navbar