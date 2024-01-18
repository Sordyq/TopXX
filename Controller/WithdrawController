const { default: axios } = require("axios");

const verifyAccount = async (req, res)=>{
    const {accountNumber, accountName, bankcode} = req.body;
    const secret_key = process.env.secret_key;
    const url = `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&account_name=${accountName}&bank_code=${bankcode}`
    try {
        
        const response = await axios.get(url,
        {
            headers: {
                Authorization: `Bearer ${secret_key}`
            }
        }
        );

        const responseData = response.data

        if(responseData.status){
            const resolvedNumber = responseData.data.account_number
            const resolvedName = responseData.data.account_name
            const resolvedBankCode = responseData.data.bank_code

            if(resolvedName === accountName){
                res.status(200).json({
                    verified: true,
                    message: 'Account name matches',
                    accountNumber: resolvedNumber,
                    bankcode: resolvedBankCode
                });
            }else{{}
                res.status(400).json({error: 'Account name does not match'})
            }
        }else{
            res.status(404).json({error: 'Account not found'})
        }
    } catch (error) {
        console.error(error);

        if(error.response){
            res.status(error.response.status).json({ verified: false, message: 'Error verifying account'})
        }else{
            res.status(500).json({verified: false, message: 'Internal server error'})
        }
    }
    }




    const createRecipient = async(recipientDetails)=>{

    const paystackSecretKey = process.env.SECRET_KEY;


    try {
    const response = await axios.post(
        `https://api.paystack.co/transferrecipient`,
        recipientDetails,
        {
            headers: {
                Authorization: `Bearer ${paystackSecretKey}`,
            },
        },  
    );

    const responseData = response.data

        if(responseData.status){
            const recipientCode = responseData.data.recipient_code;
            return recipientCode
        }else{
            console.error('Failed to recipient:', responseData.message);
            return null
        }
    } catch (error) {
    console.error('Error creating recipient:', error);
    return null
    }
    };



    const WithdrawFunds = async (req, res)=>{
    const {amount, recipientCode} = req.body;
    const paystackSecretKey = process.env.SECRET_KEY;

    try {
        const response = await axios.post(
            `https://api.paystack.co/transfer`,
            {
                source : 'balance',
                amount: amount * 100,
                recipient: recipientCode
            },
            {
                headers: {
                    Authorization: `Bearer ${paystackSecretKey}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const responseData = response.data;
        res.json (responseData)
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Withdrawal failed"})
    }
    }



    module.exports = { verifyAccount, createRecipient, WithdrawFunds }
       