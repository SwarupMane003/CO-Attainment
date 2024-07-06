const express = require("express");
const { handleGetPattern, handleGetAcadamicYear, handleGetDepartment, handleGetDivision, handleGetSubject, deletePatternAndYear, insertPattern, fetchPatternAndYear, fetchSubjects, deleteSubject, addSubject, handleCoPoAttainment, addDepartmentDivision, fetchDepartment, deleteDepartmentDivision } = require("../controllers/dropdownController");
const router = express.Router();

router.get("/pattern", handleGetPattern);
router.get("/pattrenname/:pattern", handleGetAcadamicYear);
router.get("/department", handleGetDepartment);
router.get("/division/:name", handleGetDivision);
router.get("/subject/:name", handleGetSubject);
router.get("/fetch_pattern_and_year", fetchPatternAndYear);
router.post("/delete_pattern_and_year/:PYear/:AYear", deletePatternAndYear);
router.post("/insert_pattern", insertPattern)
router.get("/fetch_subject/:tableName", fetchSubjects);
router.post("/delete_subject/:tableName/:code", deleteSubject)
router.post("/add_subject/:tableName/:inputCode/:inputCourseAb/:inputCourse", addSubject)
router.post("/add_department_division/:department/:degreeYear/:division/:divisionCode", addDepartmentDivision)
router.get('/fetch_department/:department', fetchDepartment);
router.post("/delete_department_division/:divisionCode", deleteDepartmentDivision);
router.post("/co_po/:tableName", handleCoPoAttainment);

module.exports = router;