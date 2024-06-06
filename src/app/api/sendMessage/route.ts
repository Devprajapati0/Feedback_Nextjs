import dbConnect from "@/lib/dbConnect";
import { Message } from "@/models/message.model";
import { User } from "@/models/user.model";
import { messageSchema } from "@/Schemas/message.schemas";
import { NextRequest,NextResponse } from "next/server";

export async function POST(request : NextRequest){
    dbConnect();

    try {
        const messgaeSendByRandomUsers = messageSchema.safeParse(await request.json());
        // console.log("messgaeSendByRandomUsers",messgaeSendByRandomUsers)
        if(!messgaeSendByRandomUsers.success){
            return NextResponse.json(
                {
                    message:"wrong content send by people"+(messgaeSendByRandomUsers.error.format().content?._errors || ''),
                    success:false
                },
                {
                    status:401
                }
            )
        }

        const {username,content} = messgaeSendByRandomUsers.data;

        const userFound = await User.findOne({
            username
        })

        if(!userFound){
            return NextResponse.json(
                {
                    message:"user  not found",
                    success:false
                },
                {
                    status:401
                }
            )
        }

        if(!userFound.isAcceptingMessage){
             return NextResponse.json(
            {
                message:"useris not accepting message",
                success:false
            },
            {
                status:403
            }
        )

    }
        const message = new Message({
            content:content,
            createdAt:Date.now()
        })

        message.save();
        // console.log("message",message)

        userFound.messages.push(message);
        
        userFound.save();
        // console.log("userFound.messages",userFound.messages)

        return NextResponse.json(
            {
                message:"message sent successfully",
                success:true
            },
            {
                status:200
            }
        )
        
 
       
    
    } catch (error) {
        console.error("error while creating messages:",error);
        return NextResponse.json({
            success:false,
            message:"error while creating messages::"
        },{
            status:500
        })
    }
}