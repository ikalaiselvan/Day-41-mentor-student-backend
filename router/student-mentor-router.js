import express from "express";
import { client } from "../index.js";

const router = express.Router();

// 1. API for create mentor :
router.post("/mentor", async (req, res) => {
  const payload = req.body;

  const existingMentor = await client
    .db("guvi")
    .collection("mentor")
    .findOne({ mentorName: payload.mentorName });

  if (existingMentor) {
    return res.status(401).send({ message: "Mentor already exist..." });
  }

  const response = await client
    .db("guvi")
    .collection("mentor")
    .insertOne(payload);

  res.status(201).send({ response: response });
});

// 2. API for create student :
router.post("/student", async (req, res) => {
  const payload = req.body;

  const existingStudent = await client
    .db("guvi")
    .collection("student")
    .findOne({ studentName: payload.studentName });

  if (existingStudent) {
    return res.status(401).send({ message: "student aldready exist..." });
  }

  const response = await client
    .db("guvi")
    .collection("student")
    .insertOne(payload);
  res
    .status(201)
    .send({ message: "student added successfully ...", response: response });
});

// 3. API for to assign a student to mentor :
router.post("/assign-student", async (req, res) => {
  const payload = req.body;

  const existingMentor = await client
    .db("guvi")
    .collection("mentor")
    .findOne({ mentorName: payload.mentorName });

  if (existingMentor) {
    let payStudents = payload.students
    let existStudents = existingMentor.students;

    for (let i of payStudents) {
      if (!existStudents.includes(i)) {
        existStudents.push(i);        
      }
    }
    const updatedData = await client
      .db("guvi")
      .collection("mentor")
      .updateOne(
        { mentorName: payload.mentorName },
        { $set: { students: existStudents } }
      );
    return res.send({message: "student assigned successfully ...", students: existStudents, result : updatedData });
  } else {
    res.status(401).send({ message: "mentor not in a list ..." });
  }
});

// API for assign or change mentor for particular student :
router.post("/assign-mentor", async (req, res)=>{
    const {studentName, mentorName} = req.body;

    const result = await client.db("guvi").collection("student").updateOne({studentName, studentName},{$set: {mentorName:mentorName}});
    if(result.matchedCount === 0){
        return res.status(401).send({message : "student not exist ..."})
    }
    res.send({message : "mentor assigned successfully ...",result: result})
})


// API for show all students for particular mentor :

router.post("/show-students",async (req, res)=>{
    const {mentorName} = req.body;

    const result = await client.db("guvi").collection("student").find({mentorName : mentorName}, {$set : {studentName: 1}}).toArray();
    res.send({result: result})
})

export default router;
