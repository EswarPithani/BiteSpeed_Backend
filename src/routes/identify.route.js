import express from "express";
import identifyController from "../controllers/identify.controller.js";

const router = express.Router();

router.post("/", identifyController.identify);

export default router;