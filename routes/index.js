var express = require('express');
var router = express.Router();
var {dbUrl} = require('../dbConfig');
const mongoose = require('mongoose');
const {MentorDetails, StudentDetails} = require('../Schema')

mongoose.connect(dbUrl);

//creating a new mentor
router.post('/create-mentor',async(req,res)=>{
    try {
      const mentor = await MentorDetails.findOne({email:req.body.email})
     
      if(mentor)
      {
        res.send({
            statusCode:400,
            message:"Mentor Already exists"
          })
      }
      else{
        if(req.body.name)
        {
          const details = await MentorDetails.create(req.body)
          res.send({
            statusCode:200,
            message:"Mentor has been created successfully"
          })
        }
        else{
          res.send({
            statusCode:400,
            message:"Please provide mentor name"
          })
        }
      }
    } catch (error) {
      console.log(error)
      res.send({
        statusCode:500,
        message:"Internal Server Error",
        error:error
      })
    }

})

//creating a new student
router.post('/create-student',async(req,res)=>{
    try {
      const student = await StudentDetails.findOne({email:req.body.email})
     
      if(student)
      {
        res.send({
            statusCode:400,
            message:"Student already exists"
          })
      }
      else{
        if(req.body.name)
        {
          const details = await StudentDetails.create(req.body)
          res.send({
            statusCode:200,
            message:"Student has been created successfully"
          })
        }
        else
        {
          res.send({
            statusCode:400,
            message:"Please provide student name"
          })
        }
      }
    } catch (error) {
      console.log(error)
      res.send({
        statusCode:500,
        message:"Internal Server Error",
        error:error
      })
    }

})

//assigning a students to mentor
router.post('/assign-student',async(req,res)=>{
  try {
    
    const mentordetail = await MentorDetails.findById(req.body.mentorID);
    if(mentordetail)
    {
      const studentdetail = await StudentDetails.find({_id: {"$in":req.body.studentID}});
      if(studentdetail)
      {
        let sdetails = studentdetail.filter((s)=>{return s.mentor==null}).map((s)=>{
          s.mentor = req.body.mentorID;
          mentordetail.students.push(String(s._id));
          return s;
          });

        sdetails.forEach(async(s)=>{
          const stu = await StudentDetails.replaceOne({_id:String(s._id)},s);
        })
        //console.log(sdetails,mentordetail);
        const men = await MentorDetails.replaceOne({_id:req.body.mentorID},mentordetail);
        res.send({
          statusCode:200,
          message:"Updated successfully"
        })
      }
      else
      {
        res.send({
          statusCode:400,
          message:"Mentor does not exist"
        })
      }
    }
    else{
      res.send({
        statusCode:400,
        message:"Student does not exist"
      })
    }
  } catch (error) {
    console.log(error)
    res.send({
      statusCode:500,
      message:"Internal Server Error",
      error:error
    })
  }
})

//assigning or updating the mentor for a student
router.post('/assign-mentor',async(req,res)=>{
  try {
    
    const studentdetail = await StudentDetails.findById(req.body.studentID);
    //console.log(studentdetail);
    if(studentdetail)
    {
      const mentordetail = await MentorDetails.findById(req.body.mentorID);

      if(mentordetail)
      {
        studentdetail.mentor = req.body.mentorID;
        mentordetail.students.push(req.body.studentID);
        //console.log(mentordetail,studentdetail);
        const stu = await StudentDetails.replaceOne({_id:req.body.studentID},studentdetail);
        const men = await MentorDetails.replaceOne({_id:req.body.mentorID},mentordetail);

        res.send({
          statusCode:200,
          message:"Updated successfully"
        })
      }
      else
      {
        res.send({
          statusCode:400,
          message:"Mentor does not exist"
        })
      }
    }
    else{
      res.send({
        statusCode:400,
        message:"Student does not exist"
      })
    }
  } catch (error) {
    console.log(error)
    res.send({
      statusCode:500,
      message:"Internal Server Error",
      error:error
    })
  }
})

//To get all the students
router.get('/students',async(req,res)=>{
  try {
    const students = await StudentDetails.find()
   
    res.send({
      statusCode:200,
      students
      })

  } catch (error) {
    console.log(error)
    res.send({
      statusCode:500,
      message:"Internal Server Error",
      error:error
    })
  }
})

//To get all the mentors
router.get('/mentors',async(req,res)=>{
  try {
    const mentors = await MentorDetails.find()
   
    res.send({
      statusCode:200,
      mentors
      })

  } catch (error) {
    console.log(error)
    res.send({
      statusCode:500,
      message:"Internal Server Error",
      error:error
    })
  }
})

//To get all the students assigned for a mentor
router.get('/mentor/:id',async(req,res)=>{
  try {
    const students = await StudentDetails.find({mentor:req.params.id})
   
    res.send({
      statusCode:200,
      students
      })

  } catch (error) {
    console.log(error)
    res.send({
      statusCode:500,
      message:"Internal Server Error",
      error:error
    })
  }
})

module.exports = router;
