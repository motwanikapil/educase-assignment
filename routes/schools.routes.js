const router = require("express").Router();
const schoolController = require("../controllers/users.controller");

router.get("/listSchools", schoolController.getAllSchools);
router.post("/addNewSchool", schoolController.addNewSchool);

module.exports = router;
