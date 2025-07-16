const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.post("/login", adminController.loginAdmin);

router.post("/createAdmin", adminController.createAdmin);
router.get("/getAllAdmins", adminController.getAllAdmins);
router.get("/getAdminById/:id", adminController.getAdminById);
router.put("/updateAdminById/:id", adminController.updateAdminById);
router.delete("/deleteAdminById/:id", adminController.deleteAdminById);

module.exports = router;
