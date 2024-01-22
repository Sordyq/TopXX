const { latestBets, trendingBets } = require('../Controller/LatestBet');
const User = require('../Model/User')
const Wallet = require('../Model/Wallet')

const userDashboard = async(req,res)=>{
    const user = req.user;
    const wallet = await Wallet.findOne({user});
    const latest = await latestBets.find()
    const trending = await trendingBets.find()

    const userData = {
        user,
        wallet,
        latest,
        trending
    }
    if(!user) throw new Error('User not found')
    return res.json({data: userData})
}

module.exports = {userDashboard}