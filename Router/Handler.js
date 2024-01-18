const express = require("express")
const {signUp, forgetPassword, updatePassword, Logout, Login} = require("../Controller/Auth")
const fundWallet = require("../Controller/Transaction")
const {postChallenge,getSingleChallenge,getAllChallenge,updateChallenge,deleteChallenge, acceptChange, adminApproval, claimChallenge }= require("../Controller/betChallenge");
const Updateprofile = require("../Controller/UpdateProfile");
const { trendingBets, latestBets } = require("../Controller/LatestBet");
const { isLoggedin } = require("../Middleware/Auth");
const { userDashboard } = require("../utils/dashboard");
const router = express.Router()
const mongoose = require('mongoose');




router.route('/').post(postChallenge)
// router.route('/:id').get(getSingleChallenge)
router.route('/').get(getAllChallenge)
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
router.route("/claimed-challenge/:id").post(claimChallenge)
router.route('/trend').post(trendingBets)
router.route('/latest').post(latestBets)
router.route('/user-dashboard').get([isLoggedin], userDashboard)

module.exports = router