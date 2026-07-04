import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({

    name:{
        type:String,
        trim:true,
        require:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true,
    } ,
    role:{
        type:String,
        require:true,
        enum:["user","admin"],
        default:"user"
    } ,

},{timestamps:true});

userSchema.pre("save",async function () {
   if (!this.isModified("password")) {
    return ; 
  }

  try {
    this.password = await bcrypt.hash(this.password, 10);

  } catch (error) {
     console.log("error to hash password");
     return error;
  }
})


userSchema.methods.generateAccessToken = function (){
    const payload={
        name:this.name,
        email:this.email,
        role:this.role
    }
    const token =jwt.sign(payload,process.env.JWT_ACCESS_TOKEN_SECRATE,{
    expiresIn: "15m" 
  })
    return token
}


const User = mongoose.model("User",userSchema)


export default User