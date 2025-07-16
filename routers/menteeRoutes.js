const express = require("express");
const router = express.Router();
const menteesController = require("../controllers/menteeController");

router.post("/createMentee", menteesController.createMentee);
router.post("/loginMentee", menteesController.loginMentee);

router.get("/getAllMentees", menteesController.getAllMentees);
router.get("/getMenteeById/:id", menteesController.getMenteeById);
router.put("/updateMenteeById/:id", menteesController.updateMenteeById);
router.delete("/deleteMenteeById/:id", menteesController.deleteMenteeById);

module.exports = router;
