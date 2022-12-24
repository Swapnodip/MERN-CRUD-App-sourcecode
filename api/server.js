const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mailer = require("nodemailer");
const user = require("./models/user");
const dotenv = require("dotenv")
const path = require("path")

dotenv.config()
const PORT = process.env.PORT || 5000
const MONGO = process.env.MONGODB_URI || "mongodb+srv://admin:admin@cluster0.1lbvawd.mongodb.net/crud-db"

mongoose.connect(MONGO).then(()=>{
    const app = express();
    app.use(express.json())
    app.use(cors())

    // app.get("/",(req,res)=>{
    //     res.send("Hello world")
    // })

    //routes

    app.get("/user", async (req,res)=>{
        const list = await user.find();
        res.send(list);
    })

    app.post("/user", async (req,res)=>{
        try{
            const usr = new user(req.body);
            await usr.save()
            res.send(usr)
        }
        catch(error)
        {
            res.sendStatus(error)
        }
    })

    app.put("/user", async (req,res)=>{
        try
        {
            const usr = await user.findById(req.body.id)
            Object.assign(usr, req.body)
            usr.save()
            res.send(usr)
        }
        catch (error)
        {
            res.sendStatus(error)
        }
    })

    app.delete("/user/:id", async (req,res)=>{
        try
        {
            const usr = await user.findById(req.params.id)
            await usr.remove()
            res.send(true)
        }
        catch (error)
        {
            res.sendStatus(error)
        }
    })

    //email: test346785@gmail.com
    //password: njwckulnmdirabyw

    app.post("/mail", async (req,res)=>{
        try
        {
            const data = await user.find().where('_id').in(req.body.ids)
            const mail = {
                from: "test346785@gmail.com",
                to: req.body.mail,
                subject: "Selected user data",
                text: data.map(e=>(`name: ${e.name}, phone_number: ${e.ph_num}, email: ${e.email}, hobbies: ${e.hobbies}`)).join("\n")
            }
            mailer.createTransport({
                service: "gmail",
                auth:{
                    user: "test346785@gmail.com",
                    pass: "njwckulnmdirabyw"
                },
                port:456,
                host:"smtp.gmail.com",
                secure: true,
                tls : { rejectUnauthorized: false }
            })
            .sendMail(mail, (err)=>{
                if(err)
                {
                    return console.log(err)
                }
                else
                {
                    return
                }
            })
            res.send(true)
        }
        catch (error)
        {
            res.sendStatus(error).send(false)
        }
    })

    //listen

    app.use(express.static(path.join(__dirname,"./client")))

    app.get("*", ()=>{
        res.sendFile(path.join(__dirname, "./client/index.html"))
    })

    app.listen(PORT, ()=>{
        console.log("Listening on port "+PORT)
    })
}).catch(()=>{
    console.log("Connection failed")
})

