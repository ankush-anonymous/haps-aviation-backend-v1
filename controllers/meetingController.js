const meetingRepository = require("../repositories/meetingRepository");
const { validateMeetingPayload } = require("../validators/meetingValidator");

const meetingController = {
  createMeeting: async (req, res) => {
    try {
      const validation = validateMeetingPayload(req.body, false);
      if (!validation.valid) return res.status(400).json({ error: validation.error });

      const created = await meetingRepository.createMeeting(req.body);
      res.status(201).json(created);
    } catch (error) {
      console.error("controller failed: createMeeting", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getMeetings: async (req, res) => {
    try {
      const { mentorId, menteeId } = req.query;

      const meetings = await meetingRepository.findMeetings({ mentorId, menteeId });

      return res.status(200).json({ success: true, data: meetings });
    } catch (error) {
       console.error("controller failed: getMeeting", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getAllMeetings: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const offset = parseInt(req.query.offset) || 0;
      const meetings = await meetingRepository.getAllMeetings(limit, offset);
      res.status(200).json(meetings);
    } catch (error) {
      console.error("controller failed: getAllMeetings", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getMeetingById: async (req, res) => {
    try {
      const meeting = await meetingRepository.getMeetingById(req.params.id);
      if (!meeting) return res.status(404).json({ error: "Meeting not found" });
      res.status(200).json(meeting);
    } catch (error) {
      console.error("controller failed: getMeetingById", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  updateMeetingById: async (req, res) => {
    try {
      const validation = validateMeetingPayload(req.body, true);
      if (!validation.valid) return res.status(400).json({ error: validation.error });

      const updated = await meetingRepository.updateMeetingById(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: "Meeting not found" });
      res.status(200).json(updated);
    } catch (error) {
      console.error("controller failed: updateMeetingById", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  deleteMeetingById: async (req, res) => {
    try {
      const deleted = await meetingRepository.deleteMeetingById(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Meeting not found" });
      res.status(200).json({ message: "Meeting deleted", deleted });
    } catch (error) {
      console.error("controller failed: deleteMeetingById", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

module.exports = meetingController;
