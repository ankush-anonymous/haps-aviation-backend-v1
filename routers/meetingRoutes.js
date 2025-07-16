const express = require("express");
const router = express.Router();
const meetingController = require("../controllers/meetingController");

router.post("/createMeeting", meetingController.createMeeting);
router.get("/getAllMeetings", meetingController.getAllMeetings);
router.get("/getMeetingById/:id", meetingController.getMeetingById);
router.put("/updateMeetingById/:id", meetingController.updateMeetingById);
router.delete("/deleteMeetingById/:id", meetingController.deleteMeetingById);

module.exports = router;

