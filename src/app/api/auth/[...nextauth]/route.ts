import NextAuth from "next-auth/next";
import { authOptions } from "./option";

const handler = NextAuth(authOptions);

// in route.ts only file name GET,POST,PATCH files can only be exported these are the verbs
export {handler as GET, handler as POST}

// handler basically recives the incming request and provide a response
//In the context of Next.js and serverless functions, a "handler" typically refers to a function that receives incoming HTTP requests and provides a response. This function is responsible for processing the request, performing any necessary logic, and generating a response to send back to the client.

//folder structure use dynamic route because it hadnle many req like /auth/signup,/auth/signout etc