const router = require("express").Router();
const schoolController = require("../controllers/schools.controller");

router.get("/listSchools", schoolController.getAllSchools);
router.post("/addNewSchool", schoolController.addNewSchool);

module.exports = router;
