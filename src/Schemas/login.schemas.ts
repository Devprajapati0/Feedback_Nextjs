import {z} from "zod"


const usernameSchema = z.string()
    .min(2, { message: "Username must contain at least 2 letters" })
    .max(20, { message: "Username must be no more than 20 letters" })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "Username should not have special characters" });

const emailSchema = z.string()
    .regex(/^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/, { message: "Invalid email format" });


export const loginSchema = z.object({
    identifier: usernameSchema.or(emailSchema),
    password: z.string().min(6,{message:"password must be of minimum 6 characters"})     
                        .max(12,{message:"password must be of minimum 6 characters"}),                            
})