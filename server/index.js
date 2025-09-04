//Load Packages
const express = require('express');
const mongoose = require('mongoose');
const cors=require('cors');

//Create Express App
const app = express();
app.use(express.json());
app.use(cors());

//Database Connect
mongoose.connect("mongodb://127.0.0.1:27017/bit")
.then(()=>console.log("BIT MongoDB Connected!"))
.catch(err=>console.log("Connection Error: ",err));

//Model + Schema
const Person = mongoose.model("Person", new mongoose.Schema({name: String,age:Number}), "students");

//Read Route
app.get("/", async(_req,res)=>{
    try{
        const people = await Person.find().sort({name:1});
        res.json(people);
    }catch{
        res.status(500).json({error:e.error});
    }
});

//Create Route
app.post("/",async(req,res)=>{
    try{
        const people = await Person.create({
            name:req.body.name,
            age:Number(req.body.age)
        });
        res.status(201).json(people);
    }catch{
        res.status(500).json({error:e.message});
    }
});

//Update Route
app.put("/:id",async(req,res)=>{
    try{
        const updated = await Person.findByIdAndUpdate(
            req.params.id,
            {
                name:req.body.name,
                age:Number(req.body.age)
            },
            {new: true} //It returns the new updated value
        );
        if (!updated)
            return res(400).json({error:"Not Found"}); 
        res.json(updated);
    } catch(e) {
        res.status(400).json({error:e.message});
    }});

    //Delete Crud
    app.delete("/:id",async(req,res)=>{
        try{
            const deleted = await Person.findByIdAndDelete(req.params.id);
            if (!deleted)return res.status(404).json({error:"Noot Found."});
            res.json({ok:true});
        }catch{
            res.status(400).json({error:e.message});
        }
    });

//Start Server
app.listen(4000,()=>console.log("Server is running in http://localhost:4000"));