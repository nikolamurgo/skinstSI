const express = require("express");
const { ObjectId } = require("mongodb");

module.exports = (db) => {
  const router = express.Router();
  const classesCollection = db.collection("classes");

      router.post('/new-class', async (req, res) =>{
          const newClass = req.body;
          const result = await classesCollection.insertOne(newClass);
          res.send(result);
      })
  
      router.get('/classes', async (req,res) =>{
          const query = {status: 'approved'}
          const result = await classesCollection.find().toArray()
          res.send(result)
      })
  
      router.get('/classes/:email', async (req,res) =>{
          const email = req.params.email
          const query = {instructorEmail: email}
          const result = await classesCollection.find(query).toArray()
          res.send(result)
      })
  
      // manage classes
      router.get('/classes-manage', async (req,res) =>{
        const result = await classesCollection.find().toArray()
        res.send(result)
      })
  
      // update classes status and reason
      router.patch('/change-status/:id', async (req,res) =>{
        const id = req.params.id
        const status = req.body.status
        const reason = req.body.reason
        const filter = {_id: new ObjectId(id)}
        const options = {upsert: true}
        const updateDoc = {
          $set: {
            status: status,
            reason: reason,
          },
        }
        const result = await classesCollection.updateOne(filter,updateDoc,options)
        res.send(result)
      })
  
      // get apprived class
      router.get('/approved-classes', async (req,res)=>{
        const query = {status: 'approved'}
        const result = await classesCollection.find(query).toArray()
        res.send(result)
      })
      //get single class details
      router.get('/class/:id', async (req,res) =>{
        const id = req.params.id
        const query = {_id: new ObjectId(id)}
        const result = await classesCollection.findOne(query)
        res.send(result)
      })
  
      // update class details
      router.put('/update-class/:id', async (req,res) =>{
        const id = req.params.id
        const updateClass = req.body
        const filter = {_id: new ObjectId(id)}
        const options = {upsert: true}
        const updateDoc = {
          $set: {
            name: updateClass.name,
            description: updateClass.description,
            price: updateClass.price,
            availableSeats: parseInt(updateClass.availableSeats) || 0,
            videolink: updateClass.videolink,
            status: "pending",
          }
        }
        const result = await classesCollection.updateOne(filter,updateDoc,options)
        res.send(result)
      })

  return router;
};