import dbConnect from "@/lib/dbConnect";
import { NextRequest,NextResponse } from "next/server";
import { verifySchema } from "@/Schemas/verify.schemas";
import { User } from "@/models/user.model";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmails";

export async function POST(request:NextRequest){
    dbConnect();

    try {
        console.log("request ji ayegi",request)
        
        const codeSchema = verifySchema.safeParse(await request.json());
        console.log(codeSchema)
        if(!codeSchema.success){
            return NextResponse.json({
                success:false,
                message:"code not found: " + (codeSchema.error.format().verifyCode?._errors || [])
            },{status:400})
        }

        const {username} = codeSchema.data;

        //now to get the actual uncode and trimed value us=rl shouldnbe pass to this
        //sice username can have some extra spaces 
      const decodeUsername=   decodeURIComponent(username)
     const user =  await User.findOne(
        {username: decodeUsername,
         isVerified:false
        }
      )

      if(!user){
        return NextResponse.json({
            success:false,
            message:"user not found: " ,
      })}

    // const isCodeValid = user.verifyCode === verifyCode;

  
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() +1) //increase expiry by 1 hour
                            
        user.verifyCode = verifyCode;
        user.verifyCodeExpiry = expiryDate;
        await user.save(); //user creeated

        //send verification email:
       const emailResponse = await sendVerificationEmail(user.username,user.email,verifyCode)
       console.log("emailResponse",emailResponse)
    //    if(!emailResponse.success){
    //      return NextResponse.json(
    //          {
    //              success: false,
    //              message:emailResponse.message
    //          },
    //          {status:400}
    //      )
    //    }


        return NextResponse.json({
            success:true,
            message:"code resend successfully" ,
      })
    
        
    } catch (error) {
        console.error('Error occuring while verify the otpcode',error)
        return NextResponse.json({
            success:false,
            messgae:"Error while verify the otpcode",
        },
    {status:500})
    }
}