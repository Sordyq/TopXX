const passport = require("passport");
const User = require("../Model/User");
const crypto = require("crypto")
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')
const Wallet = require('../Model/Wallet')
const mongoose = require('mongoose');

const generateRandom = () => {
    return Math.random().toString() + "hgjk";
}
const signUp = async (req,res)=>{
    const {username, email, password, confirmPassword} = req.body;
  
  
    if(!username){
      return res.json({error: "username is required"})
    }
    if(!email){
      return res.json({error:"email is required"})
    }
    if(!password){
      return res.json({error:"password is required"})
    }

    if(password !== confirmPassword) return res.json({error: "Password and confirm password doesn't match!"})
    const existingUser = await User.findOne({email})
    if(existingUser){
      return res.json({error:"user already exist"})
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password,salt);
    const newUser = new User({
      email,
      username,
      password:hashedPassword
    })
    User.register(newUser, password, function(err){
      if(err){
        console.log(err);
      }
      passport.authenticate("local")(req,res, function(err){
        const userWallet = new Wallet({
          user: newUser._id,
        });
        userWallet
        .save()
        .then()
        .catch((error)=>{
          next(error);
        });
        res.json({msg:"Sign Up Successfully"})
      })
  
      
    });
} 

const Login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.json({ error: "Username and password are required" });
        }

        const existingUser = await User.findOne({ username });

        if (!existingUser) {
            return res.json({ error: "User not found. Please sign up to continue" });
        }

        const passwordMatch = await bcrypt.compare(password, existingUser.password);

        if (!passwordMatch) {
            return res.json({ error: "Incorrect password" });
        }

        req.login(existingUser, function (err) {
            if (err) {
                return res.json({ error: "Login error"});
            }

            res.json({msg: "Logged in successfully"});
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const Logout = async(req, res)=>{
    req.logout(function(err){
        if(err){
            return res.json(err)
        }
        res.json({message: "Logout successful"})
    })
}


//forget Password here
const forgetPassword = async (req, res) => {
    const { email } = req.body
    const id = req.params.id
    console.log(id)
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        //reset token here
        // const token = crypto.randomBytes(20).toString("hex");
        const token = generateRandom();
        user.resetToken = token
        //set the time for the token to expire
        user.resetExpires = Date.now() + 3600000

        await user.save()

        //function to send the reset link via email 
        const resetLink = `${process.env.LOCALHOST_URL}/reset/${token}`
        console.log("reset link", resetLink)

        //nodemailer function here
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL, // Correct the variable name here
                pass: process.env.PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: user.email,
            subject: 'Forget password Link ',
            text: `Dear ${user?.username}, this link is to be followed to reset your password ${resetLink}`, // Change the email content as needed
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.error(error);
                res.status(500).send('Failed to send email');
            } else {
                console.log('Email sent: ' + info.response);
                // res.status(200).send('Email sent successfully');
                res.status(200).json({ message: "Reset link sent successfully" })
            }
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "server Error" })
    }

}

const updatePassword = async (req, res) => {

    try {
        const { password, confirm } = req.body;

        if (password !== confirm) {
            return res.status(400).json({ message: "Passwords do not match" });
        }
        const user = await User.findOne({
            resetToken: req.params.token,
            resetExpires: { $gte: Date.now() }
        });

        if (!user) {
            return res.json({ message: "Password reset token invalid or has expired" });
        }

        const newPassword = req.body.password;
        const confirmPassword = req.body.confirm;

        if (newPassword !== confirmPassword) {
            return res.json({ message: "Passwords do not match" });
        }

        // Set the new password and reset token
        await user.setPassword(password);
        user.resetToken = undefined;
        user.resetExpires = undefined;
        await user.save();

        return res.json({ message: "Password successfully reset" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};



  

module.exports = { signUp, Login, forgetPassword, updatePassword, Logout }