import { authOptions } from "../auth/[...nextauth]/option";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import { NextRequest,NextResponse } from "next/server";
import { User } from "@/models/user.model";
import mongoose from "mongoose";

export async function GET(){
    dbConnect();

   const session = await getServerSession(authOptions);
//    console.log("inacepting in getmessage",session)
   const userSession = session?.user;
//    console.log("session",session)
   if(!userSession){
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

   try { 
       // console.log("inside try")
       const user = await User.aggregate([
           {
               $match:{
                   $or:[{_id:new mongoose.Types.ObjectId(userSession._id)},
                    { email:userSession.email}
                ]
            }, 
        },
        {
            $unwind:"$messages"            
        },
        {
            $sort:{
                'messages.createdAt':-1
            }
        },
        {$group:{
            _id:'$_id',
            messages:{
                $push:'$messages'
            }
        }}
        
        
        /**
         
        { "_id": 1, "messages": "Hello" },
        { "_id": 1, "messages": "How are you?" },
        
            {
        "_id": 1,
        "messages": ["Hello", "How are you?"]
         },
         */
    ])
    // console.log("getmessage", user[0].messages)
    // console.log("completed almost all try try",user)


    if(!user || user.length === 0){
        return NextResponse.json(
            {
                message:"user not found",
                success:false
            },
            {
                status:401
            }
        )
    }
    // console.log("user is:",user[0].messages)

    return NextResponse.json(
        {
            success:true,
            messages:user[0].messages
        },
        {
            status:200
        }
    )
   } catch (error) {
    console.error("error while getting the messages:",error);
    return NextResponse.json({
        success:false,
        message:"failed to update user status to accept messages:"
    },{
        status:500
    })
   }
}