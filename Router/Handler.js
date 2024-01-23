const express = require("express")
const {signUp, forgetPassword, updatePassword, Logout, Login} = require("../Controller/Auth")
const fundWallet = require("../Controller/Transaction")
const {postChallenge,getAllChallenge,updateChallenge,deleteChallenge, acceptChange, adminApproval, claimChallenge, oppoentClaimChallenge }= require("../Controller/betChallenge");
const Updateprofile = require("../Controller/UpdateProfile");
const { trendingBets, latestBets } = require("../Controller/LatestBet");
const { isLoggedin } = require("../Middleware/Auth");
const { userDashboard } = require("../utils/dashboard");
const router = express.Router()
const mongoose = require('mongoose');




router.route('/post-challenge').post(postChallenge)
// router.route('/:id').get(getSingleChallenge)
router.route('/get-all-challenge').get(getAllChallenge)
router.route('/:id').put(updateChallenge)
router.route('/:id').delete(deleteChallenge)
router.route("/signup").post(signUp)
router.route("/signin").post(Login)
router.route('/logout').get([isLoggedin], Logout)
router.route("/reset").post(forgetPassword)
router.route("/reset/:token").post(updatePassword)
router.route("/transaction").post(fundWallet)
router.route('user/:id').post(Updateprofile)
router.route("/accept-challenge/:id").post(acceptChange)
router.route("/admin-approval/:id").post(adminApproval)
router.route("/challenger-claim/:id").post(claimChallenge)
router.route("/opponent-claim/:id").post(oppoentClaimChallenge)
router.route('/trend').post(trendingBets)
router.route('/latest').post(latestBets)
router.route('/user-dashboard').get([isLoggedin], userDashboard)

module.exports = router