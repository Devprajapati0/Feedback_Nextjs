import { NextRequest,NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/option";
import { User } from "@/models/user.model";
import { Message } from "@/models/message.model";



export async function DELETE(request:NextRequest,{params}:{
    params:{
        id:string
    }
}){
    dbConnect()

    console.log("params",params)
    const session =await getServerSession(authOptions)
    const user = session?.user

    if(!session ||!user){
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
       const {id} = params;

     const updatedResult =  await User.updateOne({
        $or:[
            { _id:user._id},
            {email:user.email}
        ]},
      {
        $pull:{messages:{
            _id:id
        }}
    })

    
    if(!updatedResult){
        return NextResponse.json({
            message:"message not found or already deleted",
            success:false,
        },{status:400})
    }
    
     await Message.deleteOne({
         _id:id
     })
     

    return NextResponse.json({
        message:"deleted successfully",
        success:true,
    },{status:200})

    } catch (error) {
        console.error("error ocured while deleting the message",error);
        return NextResponse.json({
            success:false,
            message:"error ocured while deleting the message"
        },{
            status:500
        })
    }
}