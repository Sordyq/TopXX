const ChallengeModel = require('../Model/betChallenge');
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
        challenger:user._id
    })

    return res.json({message: "Successfully posted new challenge", success:true})
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
    foundChallenge.opponent = user._id;
    foundChallenge.status = "accepted";
    await foundChallenge.save()
    return res.json({message: "Bet accepted successfully!", success: true})
}

// Claim Challenge features
const claimChallenge = async(req, res)=>{

    const user = req.user._id;
    const {id} = req.params;
    const availChallenge = await ChallengeModel.findById({_id:id});
    if(availChallenge.opponent != user || availChallenge.challenger != user) return res.json({info: "You are not allowed to accept a challenge you're not a participants!", success:false});
    const {proof} = req.body;
    availChallenge.proof = proof
    availChallenge.status = "Completed";
    availChallenge.winner = user
    await availChallenge.save()
    return res.json({message:"Bet claim has been submitted, you will get the total bet amount soon", success:true})
};

const adminApproval = async(req, res)=>{
    const {id} = req.params;

    const claimedBet = await ChallengeModel.findById({_id: id});
    if(claimedBet.status != "completed") return res.json({info : "You can't approve this challenge at the moment because it's not yet completed!"});
    const claimAmount = claimedBet.amount_to_stake * 2;
    const betWinner = claimedBet.winner;

    const winnerWallet = await Wallet.findOne({user:betWinner});
    if(winnerWallet){
        winnerWallet.currentBalance += claimAmount;
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
    getSingleChallenge,
    updateChallenge,
    deleteChallenge,
    claimChallenge,
    adminApproval,
    acceptChange
}