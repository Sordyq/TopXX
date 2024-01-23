const mongoose = require('mongoose')
const {model, Schema} = mongoose

const challengeSchema = new Schema({
    challenge_title: {
        type: String,
        required: true
    },
    amount_to_stake:{
        type: Number,
        required: true
    },
    expected_challenge_time:{
        type:String,
    },
    livestream_link:{
        type:String
    },
    preferred_level:{
        type: String,
        required: true,
        enum:['intermediate','starter', 'expert']
    },
    description:{
        type:String
    },
    status:{
        type:String,
        required: true,
        enum:["pending", "accepted", "completed", "claimed"],
        default: "pending"
    },
    challenger:{
        type: String,
        ref:"User",
        required:true
    },
    opponent:{
        type: String,
        ref:"User"
    },
    proof:{
        type:String
    },
    winner:{
        type: String,
        ref:"User"
    }
}, {timestamps: true})


const ChallengeModel = model('Challenge', challengeSchema)

module.exports = ChallengeModel