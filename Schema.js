const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const validator = require('validator');

const studentSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            default:'user'
        },
        email:{
            type:String,
            required:true,
            lowercase:true,
            validate:(value)=>{
                return validator.isEmail(value)
            }
        },
        mobile:{
            type:String,
            default:"000-000000"
        },
        mentor:{
            type:ObjectId,
            default:null
        },
        createdAt:{
            type:Date,
            default:Date.now
        }
    },
    {
        writeConcern: {
          j: true,
          wtimeout: 2000
        }
    }
)

const StudentDetails = mongoose.model('students',studentSchema);

const mentorSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            default:'user'
        },
        email:{
            type:String,
            required:true,
            lowercase:true,
            validate:(value)=>{
                return validator.isEmail(value)
            }
        },
        mobile:{
            type:String,
            default:"000-000000"
        },
        students:{
            type:Array,
            default:[]
        },
        createdAt:{
            type:Date,
            default:Date.now
        }
    },
    {
        writeConcern: {
          j: true,
          wtimeout: 2000
        }
    }
)

const MentorDetails = mongoose.model('mentors',mentorSchema);

module.exports = {StudentDetails,MentorDetails};