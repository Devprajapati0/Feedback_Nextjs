import {z} from "zod"

export const messageSchema = z.object({
    username:z.string(),
    content: z.string().min(10,{message:"message must contain atleast 10 characters"})
                       .max(300,{message:"message must contain atmost 300 characters"})
})