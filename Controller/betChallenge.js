const ChallengeModel = require('../Model/betChallenge');
const User = require('../Model/User');
const Wallet = require("../Model/Wallet");



const postChallenge= async(req,res)=>{
    const user = req.user;
    const {
        challenge_title,
        amount_to_stake,
        expected_challenge_time,
        preferred_level,
        livestream_link,
        description
    } = req.body

    try {
        if(!challenge_title || !amount_to_stake || !expected_challenge_time || !preferred_level || !livestream_link || !description) return res.satus(403).json("all fields are required") 
      
    const newChallenge  = new ChallengeModel({
        challenge_title,
        amount_to_stake,
        expected_challenge_time,
        preferred_level,
        livestream_link,
        description,
        challenger:user.username
    })

    let userWallet = await Wallet.findOne({user:user._id});
    let userPrevBal = userWallet.previous_balance;
    let userCurrentBal = userWallet.current_balance;

    if(userCurrentBal < Number(amount_to_stake)) return res.json({error:"Insufficient funds, pls fund your wallet to continue"})

    userPrevBal = userCurrentBal;
    userWallet.previous_balance = userWallet.current_balance;
    userWallet.current_balance -= Number(amount_to_stake)
    
    
    await userWallet.save()

    await newChallenge.save()

    return res.json({message: "Successfully posted new challenge", userWallet})
    } catch (error) {
        console.log(error.message)
    }
};

const getAllChallenge = async(req, res)=>{
    const allChallenge = await ChallengeModel.find();
    if(!allChallenge) return res.status(404).json({error: "No Challenge yet, come back later!"});

    return res.json({allChallenge})
}

const getSingleChallenge = async(req,res)=>{
    try {
        const {id} = req.params;
        const singleChallenge = await ChallengeModel.findById({_id:id})

        if(!singleChallenge){
            return res.status(404).json({error:"Challenge not found"})
        }
        res.json({singleChallenge})
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Server error'})
    }
}

// Accept Challenge

const acceptChange = async(req, res)=>{
    const user = req.user;
    const {id} = req.params;

    const foundChallenge = await ChallengeModel.findById({_id:id});
    if(foundChallenge.status != "pending") return res.json({error: "You can't accept this challenge as it is already accepted by someome!", success:false})
    if(user.username === foundChallenge.challenger) return res.json({error: "You can't accept a challenge you created!", success:false})

    const userWallet = await Wallet.findOne({user:user._id});
    let userCurrentBal = Number(userWallet.current_balance);

    if(userCurrentBal < Number(foundChallenge.amount_to_stake)) return res.json({error:"Insufficient funds, pls fund your wallet to continue"})

    userWallet.previous_balance = userCurrentBal;
    userWallet.current_balance -= Number(foundChallenge.amount_to_stake);
    
    foundChallenge.opponent = user.username;
    foundChallenge.status = "accepted";

    await userWallet.save()
    await foundChallenge.save()
    return res.json({message: "Bet accepted successfully!", success: true})
}

// Claim Challenge features
const claimChallenge = async(req, res)=>{

    const user = req.user.username;
    const {proof} = req.body;
    const {id} = req.params;
    const availChallenge = await ChallengeModel.findById({_id:id});
    if(availChallenge.status !== "accepted") return res.json({error: "You can't claim this challenge yet, pls contact admin", success:false});
    if(availChallenge.challenger !== user) return res.json({error:"You are not allowed to claim a challenge you're not the challenger!", success:false, user})
    availChallenge.proof = proof
    availChallenge.status = "completed";
    availChallenge.winner = user
    await availChallenge.save()
    return res.json({message:"Bet claim has been submitted, you will get the total bet amount soon", success:true})
};

const opponentClaimChallenge = async(req, res)=>{

    const user = req.user.username;
    const {proof} = req.body;
    const {id} = req.params;
    const availChallenge = await ChallengeModel.findById({_id:id});
    if(availChallenge.status !== "accepted") return res.json({error: "You can't claim this challenge yet", success:false});
    if(availChallenge.opponent !== user) return res.json({error:"You are not allowed to claim a challenge you're not an opponent!", success:false, user})
    availChallenge.proof = proof
    availChallenge.status = "completed";
    availChallenge.winner = user
    await availChallenge.save()
    return res.json({message:"Bet claim has been submitted, you will get the total bet amount soon", success:true})
};

const adminApproval = async(req, res)=>{
    const {id} = req.params;
    const user =req.user

    // Find the bet challenge
    const claimedBet = await ChallengeModel.findById({_id: id});
    if(claimedBet.status != "completed") return res.json({info : "You can't approve this challenge at the moment because it's not yet completed!"});
    if(!user.isAdmin) return res.json({error: "Unauthorized features as you are not admin"})
    const claimAmount = parseInt(claimedBet.amount_to_stake * 2);
    // Make claimer the winner
    const betWinner = claimedBet.winner;

    // Find winner of the bet
    const winn = await User.findOne({username: betWinner});
    if(!winn) return res.json({error: "Could not find winner"})

    const winnerWallet = await Wallet.findOne({user:winn._id});
    if(winnerWallet){
        winnerWallet.previous_balance = winnerWallet.current_balance;
        winnerWallet.current_balance += claimAmount;
        claimedBet.status = "claimed";
        await claimedBet.save()
        await winnerWallet.save()

        return res.json({info: "Bet has been approved and the winner will get the total amount in their wallet!"})
    }

}

const updateChallenge = async(req,res)=>{
    try {
        const _id = req.params.id
        // const {challenge_title, amount_to_stake, expected_challenge_time, preferred_level, livestream_link, description} = req.body
        const updatedChallenge = await ChallengeModel.findByIdAndUpdate(_id, req.body, 
            {new: true, runValidators:true})
    if(!updatedChallenge) {
        return res.status(404).json({error:"Challenge not found"})
    }
    res.json({info: "Changed updated successfully!", updatedChallenge})
    } catch (error) {
        console.error(error)
        return res.status(500).json({error: 'Server error'});
    }
}


const deleteChallenge = async(req,res)=>{
    try {
        const {id} = req.params;
        const deletedChallenge = await ChallengeModel.findByIdAndDelete({_id: id})
    if(!deletedChallenge) {
        return res.satus(404).json({error:"Challenge not found, or has been deleted!"})
    }
    res.json({msg: "Challenge deleted successfully!"})
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Server error'})
    }
}

module.exports = {
    postChallenge,
    getAllChallenge,
    // getSingleChallenge,
    updateChallenge,
    deleteChallenge,
    claimChallenge,
    adminApproval,
    acceptChange,
    opponentClaimChallenge,
}