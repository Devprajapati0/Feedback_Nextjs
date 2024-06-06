import { Messages } from "@/models/message.model";

export interface apiResponse {
    success:boolean,
    message:string,
    isAcceptingMessage ?: boolean,
    messages ?:Messages[]
}