const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");

app.use(express.urlencoded());
const port = 27017;

//EXPRESS
app.use("/static", express.static("static"));
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));


//Mongoose:
main().catch(err => console.log(err));
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/varun");
    console.log("connected :)");
}
const formSchema = new mongoose.Schema(
    {
        Name: {
            type: String,
            required: [true, "The entry must have a name"]
        },
        Class: {
            type: String,
            required: [true, "The entry must have class"]
        },
        MobileNumber: {
            type: String,
            required: [true, "The entry must have mobile number"]
        },
        Email: {
            type: String,
            required: [true, "The entry must have email-id"]
        }
    }
);

const Forms = mongoose.model("forms", formSchema);

app.get("/", (req, res) => {
    res.status(200).render("home", { title: "Varun Music Academy" });
});


app.get("/contact", (req, res) => {
    console.log(req.url);
    res.status(200).render("contact", { title: "Varun Music Academy"});
});


//To save in our files:

// app.post("/contact", (req,res) =>
// {
//     const body = req.body;
//     console.log(req.body);
//     let content = `Name: ${body.Name}\nClass: ${body.Class}\nMobile no.: ${body.phone}\nEmail-Id: ${body.email}\n`;
//     fs.appendFileSync("./forms_details.txt", content);
//     res.status(200).render("contact", {title: "Varun Music Academy"});
// });


function message(err) {
    if (err.Name) {
        return err.Name;
    }
    else if (err.Class) {
        return err.Class;
    }
    else if (err.MobileNumber) {
        return err.MobileNumber;
    }
    else if (err.Email) {
        return err.Email;
    }
}



//To save by mongodb:
app.post("/contact", (req, res) => {
    // const details = req.body;
    // const name = details.Name;
    // const Class= details.Class;
    // const mobile = details.phone;
    // const email = details.email;
    // let obj = new Forms({Name: name, Class: Class, MobileNumber: mobile, Email: email});
    // obj.save();
    // console.log(details);
    // res.status(200).render("contact",{title: "Varun Music Academy"});
    //OR

    const body = req.body;
    const doc = new Forms(req.body);
    doc.save()
        .then(() => {
            res.status(200).render("contact", {content: "Your form has been submitted successfully :)",alertcss : "display: grid; font-size: 1.5rem; grid-template-columns: 14fr 1fr;z-index: -1;", boxcss: "text-align: center;background-color: #43bc43;display: inline-block;", btncss: "height: 28px; width: 27px; position: relative; left: 24px; font-size: 1.2rem; border: none; cursor: pointer;background-color: #43bc43;display: inline-block; text-align: center;"});
        })
        .catch((err) => {
            console.log(err);
            res.status(200).render("contact", {alertcss : "display: grid; font-size: 1.5rem; grid-template-columns: 14fr 1fr;z-index: -1;", content: message(err.errors), boxcss: "text-align: center;background-color: #e66c6c;display: inline-block;", btncss: "height: 28px; width: 27px; position: relative; left: 24px; font-size: 1.2rem; border: none; cursor: pointer;background-color: #e66c6c;display: inline-block; text-align: center; "});
        });
});

app.listen(port, () => {
    console.log(`Running at http://localhost:${port}`);
});