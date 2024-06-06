import { NextRequest,NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs"
import { sendVerificationEmail } from "@/helpers/sendVerificationEmails";
import { signupSchema } from "@/Schemas/signup.schemas";
import { User } from "@/models/user.model";

export async function POST(request:NextRequest){
    await dbConnect();

    const signupData = signupSchema.safeParse( await request.json());

    if(!signupData.success){
        return NextResponse.json(
            {
                success:false,
                message:"Wrong credentials"
            },   
            {status:400}
        )
    }

    try {
        
     const existingUserVerifiedByUsername =  await User.findOne({
            username:signupData.data.username,
            isVerified:true
        })
     
        if(existingUserVerifiedByUsername){
            return NextResponse.json(
                {
                    success: false,
                    message:"Username is already existing"
                },
                {status:400}
            )
        }

        const existingUserByEmail = await User.findOne({
            email:signupData.data.email
        })
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return NextResponse.json(
                    {
                        success: false,
                        message:"user already exist with this email"
                    },
                    {status:400}
                )
            }
            else{
                const hashedPassword = await bcrypt.hash(signupData.data.password,10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUserByEmail.save()
            }
        }

        else{
           const hashedPassword = await bcrypt.hash(signupData.data.password,10);
           const expiryDate = new Date();
           expiryDate.setHours(expiryDate.getHours() +1) //increase expiry by 1 hour

           const user = new User(
            {
                username:signupData.data.username,
                email:signupData.data.email,
                password:hashedPassword,
                verifyCode:verifyCode,
                verifyCodeExpiry:expiryDate,
                isVerified:false,
                isAcceptingMessage:true,
                messages:[]
                
            }
           )

           await user.save(); //user creeated

        }
           //send verification email:
          const emailResponse = await sendVerificationEmail(signupData.data.username,signupData.data.email,verifyCode)
          console.log("emialResponse",emailResponse)

          //if success

          return NextResponse.json(
            {
                success: false,
                message: signupData.data.username,
            },
            {status:201}
        )



    } catch (error) {
        console.error("Error registering user",error);
    return NextResponse.json(
        {
            success:false,
            message:"Error while registration"
        },
        {status:500}
    )
    }
}
