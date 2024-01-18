const mongoose = require("mongoose")


const TransactionSchema = new mongoose.Schema({
    user:{
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    balanceBefore:{
        type:Number,
        required:true
    },
    balanceAfter:{
        type:Number,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    transactionType:{
        type: String,
        enum: ["Credit", "Debit"],
        required: [true, "Transaction type not indicated"]
    },
    status:{
        type: String,
        enum: ["Pending", "Completed", "Failed"],
        default: "Pending",
        required: true
    },
    description:{
        type: String,
        required: [true, "Please indicate the description of this transaction"]
    },
    reference_number: {
        type: String,
        trim: true,
        required: [true, "Transaction not referenced"]
    },

},
{timestamps: true}
)

const Transaction = mongoose.model("transaction", TransactionSchema)

module.exports = Transaction;