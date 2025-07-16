const adminRepository = require("../repositories/adminRepository");
const { validateAdminPayload } = require("../validators/adminValidators");

const adminController = {
   loginAdmin: async (req, res) => {
    try {
      const { phone_number } = req.body;

      if (!phone_number || typeof phone_number !== "string") {
        return res.status(400).json({ error: "Phone number is required and must be a string" });
      }

      const admin = await adminRepository.loginByPhoneNumber(phone_number);

      if (!admin) {
        return res.status(404).json({ error: "Admin not found" });
      }

      res.status(200).json({ message: "Login successful", admin });
    } catch (error) {
      console.error("controller failed: loginAdmin", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  
  createAdmin: async (req, res) => {
    try {
      const validation = validateAdminPayload(req.body, false);
      if (!validation.valid) return res.status(400).json({ error: validation.error });

      const admin = await adminRepository.createAdmin(req.body);
      res.status(201).json(admin);
    } catch (error) {
      console.error("controller failed: createAdmin", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getAllAdmins: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const offset = parseInt(req.query.offset) || 0;

      const admins = await adminRepository.getAllAdmins(limit, offset);
      res.status(200).json(admins);
    } catch (error) {
      console.error("controller failed: getAllAdmins", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getAdminById: async (req, res) => {
    try {
      const admin = await adminRepository.getAdminById(req.params.id);
      if (!admin) return res.status(404).json({ error: "Admin not found" });
      res.status(200).json(admin);
    } catch (error) {
      console.error("controller failed: getAdminById", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  updateAdminById: async (req, res) => {
    try {
      const validation = validateAdminPayload(req.body, true);
      if (!validation.valid) return res.status(400).json({ error: validation.error });

      const updated = await adminRepository.updateAdminById(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: "Admin not found" });

      res.status(200).json(updated);
    } catch (error) {
      console.error("controller failed: updateAdminById", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  deleteAdminById: async (req, res) => {
    try {
      const deleted = await adminRepository.deleteAdminById(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Admin not found" });
      res.status(200).json({ message: "Admin deleted", deleted });
    } catch (error) {
      console.error("controller failed: deleteAdminById", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

module.exports = adminController;
