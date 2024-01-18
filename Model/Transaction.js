const mongoose = require("mongoose")


const TransactionSchema = new mongoose.Schema({
    user:{
        type: mongoose.Types.ObjectId,
        ref: "User",
        require: true
    },
    balanceBefore:{
        type:Number,
        require:true
    },
    balanceAfter:{
        type:Number,
        require:true
    },
    amount:{
        type:Number,
        require:true
    },
    transactionType:{
        type: String,
        enum: ["Credit", "Debit"],
        require: [true, "Transaction type not indicated"]
    },
    status:{
        type: String,
        enum: ["Pending", "Completed", "Failed"],
        default: "Pending",
        require: true
    },
    description:{
        type: String,
        require: [true, "Please indicate the description of this transaction"]
    },
    reference_number: {
        type: String,
        trim: true,
        require: [true, "Transaction not referenced"]
    },

},
{timestamps: true}
)

const Transaction = mongoose.model("transaction", TransactionSchema)

module.exports = Transaction;