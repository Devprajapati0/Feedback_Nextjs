import mongoose ,{Schema,Document} from "mongoose"
import { messageSchema ,Messages} from "./message.model"

//here dicument denotes a single document that wikk be stored in mongodb
// this document provides varius mthod to interact with mongodb
interface User extends Document{
    username:string,
    email:string,
    password:string,
    verifyCode:string,
    verifyCodeExpiry:Date,
    isVerified:boolean
    isAcceptingMessage:boolean,
    messages:Messages[]
    createdAt: Date
}

const userSchema:Schema<User> =new Schema({
    username:{
        type:String,
        required:[true,"usernmae is required"],
        trim:true,
        lowercase:true,
        unique:true
    },
    email:{
        type:String,
        required:[true,"email is required"],
        unique:true,
        // match:[/.+\@.+\..+/,'please use a valid email']
    },
    password:{
        type:String,
        required:[true,"password is required"],
        min:[6,"password should contain atleast 6 letters"],
        max:[12,"password should contain atleast 6 letters"]
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    verifyCode:{
        type:String,
        required:[true,"verify code is required"],
        
    },
    verifyCodeExpiry:{
        type:Date,
        required:[true,"verify code expiry is required"],
    },
    isAcceptingMessage:{
        type:Boolean,
        default:true

    },
    messages:[messageSchema],
    createdAt:{
        type:Date,
        required:true,
        default:Date.now()
    }
})

export const User = mongoose.models.User as mongoose.Model<User> ||  mongoose.model<User>('User',userSchema)

