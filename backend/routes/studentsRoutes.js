// routes/studentsRoutes.js
const express = require("express");
const router = express.Router();
const {
  createTableStudents,
  uploadExcelStudents,
  updateDatabaseStudents,
  countsOfPresentStudent,
  countsOfAbsentStudent,
  countsOfPresentStudentPercentage,
  countsOflevel1,
  countsOflevel2,
  countsOflevel3,
  getMaxMarks,
  updateMaxMarks,
  saveTarget_averageData,
  average_attainment_pastYears,
  fetchAverageOfLevelFromYearwiseAttainment,
  postTargetInYearwiseAttainment,
  postUpdatedAchivedAttainment,
  handleCoPoAttainment,
} = require("../controllers/studentController");

router.get("/createTable/:tableName/:degree_year/:department/:division", createTableStudents);
router.get("/insertCountsOfPresentStudent/:tableName", countsOfPresentStudent);
router.get("/insertCountsOfAbsentStudent/:tableName", countsOfAbsentStudent);
router.get("/insertCountsOfPresentStudentPercentage/:tableName", countsOfPresentStudentPercentage);
router.get("/insertCountsOflevel1/:tableName", countsOflevel1);
router.get("/insertCountsOflevel2/:tableName", countsOflevel2);
router.get("/insertCountsOflevel3/:tableName", countsOflevel3);
router.post("/upload/:tableName", uploadExcelStudents);
router.post("/updateDatabase/:tableName", updateDatabaseStudents);
router.post("/update_marks/:tableName", updateMaxMarks);
router.get("/max_marks_for_each_co/:tableName", getMaxMarks);
router.post("/saveAverageTarget/:tableName",saveTarget_averageData);
router.get("/average_attainment_pastYears/:tableName/:startingYear", average_attainment_pastYears);
router.get("/fetchAverageOfLevelFromYearwiseAttainment/:tableName/:year",fetchAverageOfLevelFromYearwiseAttainment);
router.post("/postTargetInYearwiseAttainment/:tableName/:year",postTargetInYearwiseAttainment);
router.post("/postUpdatedAchivedAttainment/:tableName/:year",postUpdatedAchivedAttainment);
router.post("/handleCoPoAttainment/:tableName/:year",handleCoPoAttainment);
module.exports = router;
