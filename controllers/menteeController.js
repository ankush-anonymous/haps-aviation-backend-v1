const menteesRepository = require("../repositories/menteeRepository");
const { validateMenteePayload } = require("../validators/menteeValidator");

const menteesController = {
   loginMentee: async (req, res) => {
    try {
      const { phone_number } = req.body;

      if (!phone_number || typeof phone_number !== "string") {
        return res.status(400).json({ error: "Invalid or missing phone_number" });
      }

      const mentee = await menteesRepository.loginByPhoneNumber(phone_number);

      if (!mentee) {
        return res.status(404).json({ error: "Mentee not found" });
      }

      res.status(200).json({ message: "Login successful", mentee });
    } catch (error) {
      console.error("controller failed: loginMentee", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  createMentee: async (req, res) => {
    try {
      const validation = validateMenteePayload(req.body, false);
      if (!validation.valid) return res.status(400).json({ error: validation.error });

      const mentee = await menteesRepository.createMentee(req.body);
      res.status(201).json(mentee);
    } catch (error) {
      console.error("controller failed: createMentee", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getAllMentees: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const offset = parseInt(req.query.offset) || 0;

      const mentees = await menteesRepository.getAllMentees(limit, offset);
res.status(200).json({ mentees, total: mentees.length });
    } catch (error) {
      console.error("controller failed: getAllMentees", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getMenteeById: async (req, res) => {
    try {
      const mentee = await menteesRepository.getMenteeById(req.params.id);
      if (!mentee) return res.status(404).json({ error: "Mentee not found" });
      res.status(200).json(mentee);
    } catch (error) {
      console.error("controller failed: getMenteeById", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  updateMenteeById: async (req, res) => {
    try {
      const validation = validateMenteePayload(req.body, true);
      if (!validation.valid) return res.status(400).json({ error: validation.error });

      const updated = await menteesRepository.updateMenteeById(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: "Mentee not found" });

      res.status(200).json(updated);
    } catch (error) {
      console.error("controller failed: updateMenteeById", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  deleteMenteeById: async (req, res) => {
    try {
      const deleted = await menteesRepository.deleteMenteeById(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Mentee not found" });
      res.status(200).json({ message: "Mentee deleted", deleted });
    } catch (error) {
      console.error("controller failed: deleteMenteeById", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

module.exports = menteesController;
