const express = require("express");
const router = express.Router();
const questionController = require("../../controllers/employer/TechnicalQuestionController");

router.get("/", questionController.getQuestions);
router.get("/:id", questionController.getQuestionById);
router.post("/", questionController.createQuestion);
router.put("/:id", questionController.updateQuestion);
router.delete("/:id", questionController.deleteQuestion);

module.exports = router;
