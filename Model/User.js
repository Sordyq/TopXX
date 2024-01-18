const mongoose = require("mongoose")
const passport = require("passport")
const passportLocalMongoose = require("passport-local-mongoose")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    fullName:{
        type:String
    },
    gender:{
        type:String,
        enum:['Male','Female']
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isBlocked:{
        type: Boolean,
        default: false
    },
    resetToken: String,
    resetExpires: Date
})

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy())

// SERIALIZE user
passport.serializeUser(User.serializeUser())

// DESERIALIZE USER

passport.deserializeUser(User.deserializeUser())

module.exports = User;