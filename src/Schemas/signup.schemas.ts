import {z} from "zod"

export const signupSchema = z.object({
    username: z.string().min(2,"username must conatin 2 letters")
                        .max(20,"username must be no more 20 letters")
                         .regex(/^[a-zA-Z0-9_]+$/,"username should not have special characters"),

   email: z.string().email({message:'Invalid email'}),
    password: z.string().min(6,{message:"password must be of minimum 6 characters"})     
                        .max(12,{message:"password must be of minimum 6 characters"}),                            
})

export const usernameScheam  = z.object({
    username: z.string().min(2,"username must conatin 2 letters")
    .max(20,"username must be no more 10 letters")
    .regex(/^[a-zA-Z0-9_]+$/," *username should not have special characters")
})