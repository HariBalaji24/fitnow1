import express from "express"
import authcontroller from "../controller/authcontroller.js"
import workoutcontoller from "../controller/workoutcontoller.js"
import aicoachcontroller from "../controller/aicoachcontroller.js"
import progresscontroller from "../controller/progresscontroller.js"

const router = express.Router()

router.route("/allclients").get(authcontroller.getclients)
router.route("/google").post(authcontroller.googlelogin)
router.route("/getid").get(authcontroller.getid)

router.route("/signin").post(authcontroller.signin)
router.route("/login").post(authcontroller.login)
router.route("/adddetails").post(authcontroller.adddetails)
router.route("/updateuser/:user_id").put(authcontroller.updateuser)

router.route("/workout-plan/:user_id").post(workoutcontoller.workoutrecommend)
router.route("/userdetails/:user_id").get(workoutcontoller.userdetails)
router.route("/getworkouts/:user_id").get(workoutcontoller.getallworkouts)
router.route("/workoutdone/:user_id").post(workoutcontoller.workoutdone)
router.route("/getchangedworkout/:user_id").get(workoutcontoller.getchangedworkout)

router.route("/diet-plan/:user_id").post(workoutcontoller.dietrecommend)
router.route("/getdietplan/:user_id").get(workoutcontoller.getdiet)

router.route("/aicoach").post(aicoachcontroller.aicoach)
router.route("/getresponse/:user_id").get(aicoachcontroller.getresponse)

router.route("/workoutsdoneonday/:user_id").get(progresscontroller.workoutsdoneonday)

export default router