
/*
export async function sendVerificationEmail(
    username:string,
    email:string,
    verifyCode:string,
): Promise<apiResponse>{
    try {

      const data =  await resend.emails.send({
            from: 'devheinji@gmail.com',
            to:email,
            subject: 'hello world',
            react: VerificationEmail({username,otp:verifyCode}),
          });
          console.log(email)
          console.log("data:",data)
        return {
            success:true,
            message:" verification email sent successfully"
        }
    } catch (error) {
        console.error("Error sending Verififcation email",error);
        return {
            success:false,
            message:"Failed to send verification email"
        }
    }
}*/
// src/helpers/sendVerificationEmails.ts


// import ReactDOMServer from 'react-dom/server';
import nodemailer from 'nodemailer';

export async function sendVerificationEmail(username: string, email: string, verifyCode: string) {
  try {

    console.log('MAILER_USER:', process.env.MAILER_USER);
console.log('MAILER_PASS:', process.env.MAILER_PASS);


    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASS,
      },
    });

    // const emailHtml = ReactDOMServer.renderToStaticMarkup(
    //   VerificationEmail ({username,otp:verifyCode})
    // );

    const mailOptions = {
      from: 'devheinji@gmail.com',
      to: email,
      subject: 'Verification Code',
      html: `
    
         
            <h2>Hello ${username},</h2>
            <p>
              Thank you for registering. Please use the following verification code to
              complete your registration:
            </p>
            <p>${verifyCode}</p>
            <p>If you did not request this code, please ignore this email.</p>
             <a href={${process.env.DOMAIN}/verify/${username}} style="color: #61dafb;">Verify here</a> 
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('info', info);
    return info;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
