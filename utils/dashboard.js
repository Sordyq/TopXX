const { latestBets, trendingBets } = require('../Controller/LatestBet');
const User = require('../Model/User')
const Wallet = require('../Model/Wallet');
const ChallengeModel = require('../Model/betChallenge');

const userDashboard = async(req,res)=>{
    const user = req.user;
    const wallet = await Wallet.findOne({user});
    const latestBet = await ChallengeModel.find({status: 'pending'});
    const trendingBet = await ChallengeModel.find({status: 'accepted'});

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

    const formatTrendingBet = (bet)=>{
        return{
            _id: bet._id,
            challenge_title: bet.challenge_title,
            amount_to_stake: bet.amount_to_stake,
            expected_challenge_time: bet.expected_challenge_time,
            livestream_link: bet.livestream_link,
            preferred_level: bet.preferred_level,
            description: bet.description,
            status: bet.status,
            challenger: bet.challenger,
            opponent: bet.opponent
        }
    }

    const userData = {
        user: formatUser(user),
        wallet: formatWallet(wallet),
        latestBet,
        trendingBet
    }
    if(!user) throw new Error('User not found')
    return res.json(userData)
}

module.exports = {userDashboard}