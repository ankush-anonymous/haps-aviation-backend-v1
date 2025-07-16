const express = require("express");
const router = express.Router();
const mentorsController = require("../controllers/mentorController");

router.post("/loginMentor", mentorsController.loginMentor);

router.post("/createMentor", mentorsController.createMentor);
router.get("/getAllMentors", mentorsController.getAllMentors);
router.get("/getMentorById/:id", mentorsController.getMentorById);
router.put("/updateMentorById/:id", mentorsController.updateMentorById);
router.delete("/deleteMentorById/:id", mentorsController.deleteMentorById);

module.exports = router;
