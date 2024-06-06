import { authOptions } from "../auth/[...nextauth]/option";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";

import { NextRequest,NextResponse } from "next/server";
import { acceptMessagesSchema } from "@/Schemas/acceptmessages.schemas";
import {User } from "@/models/user.model";

export async function POST(request:NextRequest){
    await dbConnect();
    const session =await getServerSession(authOptions);
    // console.log("session",session)
    // console.log("inacepting in accept message",session)
    const user = session?.user;

    if(!session || !session.user){
        return NextResponse.json(
            {
                message:"user is not logined",
                success:false
            },
            {
                status:401
            }
        )
    }

    const messageData = acceptMessagesSchema.safeParse(await request.json());
    if(!messageData.success){
        return NextResponse.json(
            {
                message:"wrong credential cannot find value" +( messageData.error.format().acceptMessages?._errors || []),
                success:false
            },
            {
                status:400
            }
        )
    }

    const {acceptMessages} = messageData.data;
    // console.log(acceptMessages)
    
    try {
        
        const updatedUserFound = await User.findOneAndUpdate(
            {
                $or:[
                    {_id: user?._id},
                    {email:user?.email}
                ]
            },
            {
                $set:{
                    isAcceptingMessage:acceptMessages
                }
            },
            {
                new:true
            }
        )

        if(!updatedUserFound){
            return NextResponse.json({
                success:false,
                message:"updated failed : in acceppting messages"
            },{
                status:401
            })
        }

        return NextResponse.json({
            success:false,
            message:"message acceptance statusupdated successfully",
            user:updatedUserFound
        },{
            status:200
        })
    } catch (error) {
        console.error("failed to update user status to accept messages:",error);
        return NextResponse.json({
            success:false,
            message:"failed to update user status to accept messages:"
        },{
            status:500
        })
    }
}

export async function GET(request:NextRequest){
    dbConnect();
    const session = await getServerSession(authOptions);
    // console.log("inacepting",session)

   if(!session?.user){
    return NextResponse.json(
        {
            message:"user is not logined",
            success:false
        },
        {
            status:404
        }
    )
   }

   try {

   const userFound = await User.findOne({
        $or:[
            {email:session?.user.email},
            {_id:session?.user._id}
        ]
    })

    if(!userFound){
        return NextResponse.json(
            {
                message:"user not found while sending a respnse og accepting message",
                success:false
            },
            {
                status:401
            }
        )
    }
    // console.log("user ofund",userFound)

    return NextResponse.json(
        {
            message:"is accepting message response send get successfully",
            success:true,
            isAcceptingMessage:userFound.isAcceptingMessage
        },
        {
            status:200
        }
    )
    
   } catch (error) {
    console.error("error ocured while receving the response of accepting message:",error);
    return NextResponse.json({
        success:false,
        message:"error ocured while receving the response of accepting message"
    },{
        status:500
    })
   }
}