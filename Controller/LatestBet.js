const ChallengeModel = require('../Model/betChallenge')
const User = require("../Model/User");

const trendingBets = async(req,res) =>{
    try{
        const trendingBet = await ChallengeModel.find({status: 'accepted'});
        res.json(trendingBet)
    } catch (error){
        res.status(500).json({error: 'Server Error'})
    }
}

const latestBets = async(req,res) =>{
    try{
        const latestBet = await ChallengeModel.find({status: 'pending'}). sort({_id:-1}).limit(1)

        if(latestBet){
            res.json(latestBet)
        } else{
            res.status(404).json({error: 'No accepted bets found'})
        }
    } catch (error){
        res.status(500).json({error: 'Server Error'})
    }
}

module.exports = {trendingBets, latestBets}