const mentorsRepository = require("../repositories/mentorRepository");
const { validateMentorPayload } = require("../validators/mentorValidator");


const mentorsController = {
   loginMentor: async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      const mentor = await mentorsRepository.loginMentorByPhone(email);

      if (!mentor) {
        return res.status(404).json({ error: "Mentor not found" });
      }

      res.status(200).json({
        message: "Login successful",
        mentor,
      });
    } catch (error) {
      console.error("controller failed: loginMentor", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  createMentor: async (req, res) => {
  try {
    const validation = validateMentorPayload(req.body, false);
    if (!validation.valid) return res.status(400).json({ error: validation.error });

    const mentor = await mentorsRepository.createMentor(req.body);
    res.status(201).json(mentor);
  } catch (error) {
    console.error("controller failed: createMentor", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
},


  getAllMentors: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const offset = parseInt(req.query.offset) || 0;

      const mentors = await mentorsRepository.getAllMentors(limit, offset);
     res.status(200).json({
  mentors: mentors,
  total: mentors.length
});

    } catch (error) {
      console.error("controller failed: getAllMentors", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getMentorById: async (req, res) => {
    try {
      const mentor = await mentorsRepository.getMentorById(req.params.id);
      if (!mentor) return res.status(404).json({ error: "Mentor not found" });
      res.status(200).json(mentor);
    } catch (error) {
      console.error("controller failed: getMentorById", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  updateMentorById: async (req, res) => {
  try {
    const validation = validateMentorPayload(req.body, true);
    if (!validation.valid) return res.status(400).json({ error: validation.error });

    const updated = await mentorsRepository.updateMentorById(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: "Mentor not found" });

    res.status(200).json(updated);
  } catch (error) {
    console.error("controller failed: updateMentorById", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
},


  deleteMentorById: async (req, res) => {
    try {
      const deleted = await mentorsRepository.deleteMentorById(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Mentor not found" });
      res.status(200).json({ message: "Mentor deleted", deleted });
    } catch (error) {
      console.error("controller failed: deleteMentorById", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

module.exports = mentorsController;
