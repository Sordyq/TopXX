const { default: axios } = require("axios");
const Transaction = require('../Model/Transaction') 
const Wallet = require("../Model/Wallet");

require("dotenv").config();

const fundWallet = async (req, res) => {
    const user = req.user;
    const { amount, reference } = req.body;
    if (!amount || !reference) {
        return res.json({ message: "reference or amount field is required", success: false })
    }
    let wallet = await Wallet.findOne({ user: user });
    if (!wallet) {
        wallet = new Wallet({
            user: user,
            current_balance: 0,
            previous_balance: 0,
        });
    }

    const userBalance = wallet.current_balance;

    //transaction area
    const transaction = new Transaction({
        user: req.user,
        balance_before: userBalance,
        balance_after: userBalance,
        amount: amount / 100,
        type: "credit",
        status: "pending",
        description: `Wallet funding with ${amount / 100}`,
        reference_number: reference,
    });

    let transaction_id = "";
    const url = "https://api.paystack.co/transaction/verify/{reference}"
    try {

        const payment = await axios.get(url, {
            headers: {
                authorization: `Bearer ${process.env.PAYSTACK_TOKEN}`
            }
        });
        const { data } = payment;
        if (data?.status === false) {
            transaction.status = "failed";
            transaction.description = "paystack payment verification failed";
            await transaction.save();
            return res.status(422).json({
                message: "Verification failed",
                success: false
            })
        }
        const payment_data = data.data;
        transaction_id = payment_data;
        transaction.external_id = transaction_id;
        if (payment_data.status != "success") {
            transaction.description = "paystack payment verification failed";
            await transaction.save();
            return res.status(422).json({
                message: "verification failed",
                success: false
            })
        }
    } catch (error) {
        const message = "paystack payment verification failed";
        transaction.external_id = transaction_id;
        transaction.status = "failed";
        transaction.description = "payment verification failed";
        await transaction.save();
        return res.status(422).json({
            message: message,
            success: false
        })
    }

    const formatTransaction = (transaction) => {
        return {
            id: transaction._id,
            description: transaction.description,
            balance_before: transaction.balance_before,
            balance_after: transaction.balance_after,
            amount: transaction.amount,
            status: transaction.status,
            // date: formatTransactionDate(transaction.createdAt),
        };
    };

    const amount_paid = Number(amount / 100);
    wallet.previous_balance = userBalance;
    wallet.current_balance = userBalance + amount_paid;
    transaction.status = "completed";
    transaction.balance_after = userBalance + amount_paid;
    await wallet.save();
    await transaction.save();
    res.status(200).json({
        message: "verification successful",
        status: "true",
        data: {
            balance: wallet.current_balance,
            transaction: formatTransaction(transaction)
        }
    })
}

module.exports = fundWallet;