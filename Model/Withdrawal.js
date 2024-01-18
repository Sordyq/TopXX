const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const WithdrawalSchema = new Schema({
    user : {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    amount : {
        type: Number,
        required: true
    },
    status : {
        type: String,
        enum: ["pending", "completed", "failed", "review"],
        default: "pending",
        required: true
    },
    recipient_code : {
        type: String,
    },
    transaction_id : {
        type: String
    },
},
    {timestamps: true}
)



const Withdrawal = model('Withdrawal', WithdrawalSchema);

module.exports = Withdrawal;