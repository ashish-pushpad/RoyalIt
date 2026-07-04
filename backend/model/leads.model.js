import mongoose from "mongoose";

const leadsSchema = new mongoose.Schema({

    customerName:{
        type:String,
        trim:true,
        require:true
    },
    phone:{
        type:Number,
        require:true,
        unique:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    leadSource:{
        type:String,
        require:true,
        trim:true
    } ,
    message:{
        type:String,
        require:true,
        trim:true
    } ,
    status:{
        type:String,
        require:true,
        enum:["new","in-progress","follow-up","converted","lost"],
        default:"new"
    } ,
    followUpDate:{
        type:String,
        require:true,
        trim:true
    } ,
    assignedEmployee:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Employe",
        require:true
    }
},{timestamps:true})


const Leads = mongoose.model("Leads",leadsSchema)


export default Leads