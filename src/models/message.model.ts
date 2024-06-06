import mongoose ,{Schema,Document} from "mongoose"

export interface Messages extends Document{
    content:string,
    createdAt: Date
}

export const messageSchema:Schema<Messages> =new Schema({
    content:{
        type: String,
        required:true,
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now()
    }
})

export const Message =mongoose.models.messages ||  mongoose.model('messages',messageSchema)