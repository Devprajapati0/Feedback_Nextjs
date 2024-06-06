import dbConnect from "@/lib/dbConnect";
import { usernameScheam } from "@/Schemas/signup.schemas";
import { NextRequest, NextResponse } from "next/server";
import { User } from "@/models/user.model";


export async function GET(request:NextRequest){

    dbConnect();

    
    try {
        //querey parameters
        const {searchParams} = new URL(request.url);
        // console.log('new url',new URL(request.url))
        // console.log("searchParams",searchParams)
        const queryParam = {username:searchParams.get("username")};

        const validationSchema = usernameScheam.safeParse(queryParam);
     
        
        if(!validationSchema.success){
            console.log("validationSchema",validationSchema)
            const errors = validationSchema.error.format().username?._errors
            // console.log("error",errors)
            return NextResponse.json({
                success:false,
                message:errors
            },{status:400})
        }

        const {username} = validationSchema.data
    

     const userExisted =  await User.findOne({
            username,
            isVerified:true
        })

        if(userExisted){
            return NextResponse.json({
                success:false,
                message:"username is already taken: "
            },{status:400})
        }

        return NextResponse.json({
            success:false,
            message:"username is unique"
        },{status:200})

    } catch (error) {
        console.error('Error occuring while verify the username',error)
        return NextResponse.json({
            success:false,
            messgae:"Error while verify the username",
        },
    {status:500})
    }
}