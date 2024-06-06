'use client'
import { SessionProvider } from 'next-auth/react'
function Authprovider({children}:{children:React.ReactNode}) {
  return (
    <SessionProvider>
        {children}
    </SessionProvider>
  )
}

export default Authprovider