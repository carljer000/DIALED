import { Router } from "express";
import { deleteCheckin, getCheckinByDate, listCheckins, upsertCheckin } from "../controllers/checkins.controller.js";

const router = Router();
router.get("/", listCheckins);
router.get("/:date", getCheckinByDate);
router.post("/", upsertCheckin);
router.delete("/:id", deleteCheckin);
export default router;
