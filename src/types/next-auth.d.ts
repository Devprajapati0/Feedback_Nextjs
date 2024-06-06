import 'next-auth'
import { DefaultSession } from 'next-auth'

//re declaring the types given by next-auth t
declare module 'next-auth'{
    //reclaring the User interface of next-auth using interface
    interface User{
        _id?:string,
        isVerified?:boolean,
        isAcceptingMessages?:boolean,
        username?:string
    }

    //her default session means that when we get session it always will contain a user key wheater that user contain value or not
    interface Session{
        user:{
            _id?:string,
            isVerified?:boolean,
            isAcceptingMessages?:boolean,
            username?:string
        } & DefaultSession['user']
    }
}
//alternate

declare module 'next-auth/jwt'{
    interface JWT{
        _id?:string,
        isVerified?:boolean,
        isAcceptingMessages?:boolean,
        username?:string
    }
}