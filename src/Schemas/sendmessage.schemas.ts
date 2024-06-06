import {z} from "zod"

export const sendMessageSchema = z.object({
    content:z.string()
})