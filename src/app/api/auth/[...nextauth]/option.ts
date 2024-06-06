import bcrypt from "bcryptjs"
import dbConnect from "@/lib/dbConnect";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from 'next-auth';
import { User } from "@/models/user.model";
import GoogleProvider from "next-auth/providers/google";

//provider is an array in which each object represent a way of authentication 
export const authOptions:NextAuthOptions  = {
    providers:[
        //credentialProvider do these things: validate email/password,handle auth flow,and do authentication
        CredentialsProvider({
            id:"credentials",
            name:"Credentials",
            credentials: {
                email: { label: "Email", type: "text"},
                password: { label: "Password", type: "password" }
              },
              async authorize(credentials:any):Promise<any>{
                // to acces data we use credentials.identifier.username
                await dbConnect()
                try {
                    //  console.log("credentials provider ",credentials)
                  const user =  await User.findOne({
                        $or:[
                            {email:credentials.identifier},
                            {username:credentials.identifier}
                        ]
                    })

                    // console.log("user is:",user)

                    if(!user){
                        throw new Error("no user found with this email")
                    }
                    
                    if(!user?.isVerified){
                        throw new Error("Please verify your account before login")
                    }

                  const passwordCheck =  await bcrypt.compare(credentials.password,user.password)
                  if(passwordCheck){
                    // console.log("passord check success")
                    // console.log("user returned bu credential",user)
                    return user// this data is prsesnt in the token(jwt)
                    
                  }
                  else{
                    throw new Error("in correct password")
                }
                
               
                } catch (error:any) {
                    throw new Error(error)
                }
              },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
            async profile(profile) {
                // console.log('profile of google auth',profile)
                await dbConnect();

              let user =  await User.findOne({
                    email:profile.email
                })

                // console.log('google user',user);

                if(!user){

                   /* // console.log("username :",profile.email.split('@')[0])
                    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
                    const expiryDate = new Date();
                    expiryDate.setHours(expiryDate.getHours() +1)
                    user = await User.create({
                        email: profile.email,
                        username: profile.email.split('@')[0], // Or generate a unique username
                        verifyCode:verifyCode,
                        verifyCodeExpiry:expiryDate,
                        isVerified:false,
                        isAcceptingMessage:true,
                        messages:[]
                      });


                      const emailResponse = await sendVerificationEmail(profile.email.split('@')[0],profile.email,verifyCode)

                      if(!emailResponse.success){
                        throw new Error("mail send failure")    
                    
                      }     */
                      throw new Error("login failure")   
                }
                const userDetail = {
                    id: user._id.toString(),
                    email:user.email,
                    username:user.username,
                }

                //  console.log("user data returnd by goole auth ",userDetail)

                return userDetail;// this data is prsesnt in the token(jwt)
            },
          })
    ],
    callbacks:{
        //this is the user we return in providers/credentials
        async jwt({ token, user }) {
            //inserting user in token
            //instead of using jwt verify and insert data there we insert that data in the token 
            //  console.log("token befre upgradation",token)
            // console.log("callback jwt user",user)
            if(user){

                //we no easily insert any dat that we difine in types/next-auth.d.ts
                token._id = user._id?.toString(),
                token.isVerified = user.isVerified,
                token.isAcceptingMessages = user.isAcceptingMessages,
                token.username = user.username
            }
            // console.log("tokeen",token)
            //  console.log("token after upgration ",token)
            return token
          },
        async session({ session, token }) {
            // console.log("session token ",token)
            // console.log("session before upgration ",session)
            if(token){
               session.user._id = token._id?.toString(),
               session.user.isVerified = token.isVerified,
               session.user.isAcceptingMessages = token.isAcceptingMessages,
               session.user.username = token.username
            }
            //  console.log("session",session)
            // console.log("session after upgration ",session)
            
            return session
        },
    },
    pages :{
        signIn:'/login' // redirect url 
    },
    session:{
        strategy:"jwt" // it mean session will conatin data of jwt token
    },
    secret: process.env.NEXTAUTH_SECRET
}


/*
credentialProvider-> require id,name,schema(feilds)
   when a user do singin("credential") in it triggers this provider
   Now in schema we have to provide an authorize function which validate and authorizes the user based on the credentials
   this fnction take the credential provided by the user and do all the logic inside it
   insid eit all db querey of existance work and finally it retuns a user object
   after i get the user obj it mean the user is successfully authenticated and next auth genertae access token using jwt contain the infromation of the user and its session and this token is sent to client side in cookie form


googlePRovider->   when using goole provider w eneed to pass client id and client secret  
                    whena user try to click on signin with goole it autheticate and redirct to google auuh page and user have to grant a consent and when consent is uccess google redirect it to the callback url
                   now next auth receive the code and now next auth exchanges the received authorization code with Google's OAuth 2.0 token endpoint by making a secure HTTP request.
                    authorization code, client ID, client secret, redirect URI, and any other required parameters.
                    Google's token endpoint validates the authorization code and issues an access token and, optionally, a refresh token in the response.
                    now after reciving token next js make a req to goole api and receive a user obj 
                    in this user obj we get email name, and profile photo . and this data is called profile which we can further manipulate
                    all thsi action i sdone on server side for sequrity purpose

callbacks-> through callbacks we can customize the data retund by providers like customize jwt token session etc but when usign other provider like google etc e did not need them i mean we can provide to xutomize but customiztion can be done by profile
            1> jwt callback-> when usign credential we often recive a token from the provider(credential) in user data is present now we can customize this data in jwt callback
                             basically it customize the token data
            2> session-> basically when a user authenticate next auth create a session and each session has a unique id and some other property like expiry date . the data present int he token is directly transferd to session      
                        basically jab bhi koi user autheticate krta hai to next auth ek session banata hai jsime vo ski expiry date and token ka data dal deta hai abb vohi session sara kam krta hai jaise jase hi user autheticate pura vo session token hi jata hai forntend me mtl cookie ke form me store hota hai abb
                        jab bhi ham uss data ki jarurat hoti hai to hame vo milta hai use/sesion se and vo useSession cookie se vo token nikalta haia nd data hame deta hai bss           

                
Token->initally the tken genertaed by next auth  conatins that data which we gave in credential ex: if a user is login with email initially token will only cinatin id of that ser and email;
        that why we have to modify token in callback 
session aslo initalluy conatin that dat which token cinatin but we have to modify it with upgraed token


flow - jsie hi login hua to jo hamne dtaa dala inpt me vahi token and session me hotahai abb token me vo hamne dala wala and sesision me token ka to fir us data ko hame update krnahota hai on the basis og the data provided by the providers
token- > input data
session - token data

token -> updated by providers data
session -> updated by token data which was updated y session data



*/

