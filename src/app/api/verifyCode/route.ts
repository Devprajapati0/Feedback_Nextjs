import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { verifySchema } from "@/Schemas/verify.schemas";
import { User } from "@/models/user.model";

export async function POST(request: NextRequest) {
    try {
        await dbConnect(); // Ensure the database connection is awaited

        const codeSchema = verifySchema.safeParse(await request.json());

        if (!codeSchema.success) {
            const errors = codeSchema.error.format().verifyCode?._errors || [];
            return NextResponse.json({
                success: false,
                message: "Code not valid: " + errors.join(", "),
            }, { status: 400 });
        }

        const { username, verifyCode } = codeSchema.data;

        const decodedUsername = decodeURIComponent(username.trim()); // Trim extra spaces
        const user = await User.findOne({ username: decodedUsername });

        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User not found",
            }, { status: 404 });
        }

        const isCodeValid = user.verifyCode === verifyCode;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if (isCodeNotExpired && isCodeValid) {
            user.isVerified = true;
            await user.save();

            return NextResponse.json({
                success: true,
                message: "Code verified",
            }, { status: 200 });
        } else if (!isCodeNotExpired) {
            return NextResponse.json({
                success: false,
                message: "Code expired",
            }, { status: 400 });
        } else {
            return NextResponse.json({
                success: false,
                message: "Code is invalid",
            }, { status: 400 });
        }
    } catch (error) {
        console.error('Error occurred while verifying the OTP code', error);
        return NextResponse.json({
            success: false,
            message: "Error while verifying the OTP code",
        }, { status: 500 });
    }
}
