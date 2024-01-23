const { latestBets, trendingBets } = require('../Controller/LatestBet');
const User = require('../Model/User')
const Wallet = require('../Model/Wallet');
const ChallengeModel = require('../Model/betChallenge');

const userDashboard = async(req,res)=>{
    const user = req.user;
    const wallet = await Wallet.findOne({user});
    const latestBet = await ChallengeModel.find({status: 'pending'});
    const claimedBet = await ChallengeModel.find({status: 'claimed'});
    const completedBet = await ChallengeModel.find({status: 'completed'});
    const trendingBet = await ChallengeModel.find({status: 'accepted'})

    const formatWallet = (wallet)=>{
        return {
            current_balance: wallet?.current_balance,
            previous_balance: wallet?.previous_balance
        }
    }

    const formatUser = (person)=>{
        return{
        username: person.username,
        email: person.email,
        isAdmin: person.isAdmin,
        isBlocked: person.isBlocked
        }
    }

    const userData = {
        user: formatUser(user),
        wallet: formatWallet(wallet),
        latestBet,
        trendingBet,
        claimedBet,
        completedBet
    }
    if(!user) throw new Error('User not found')
    return res.json(userData)
}

module.exports = {userDashboard}