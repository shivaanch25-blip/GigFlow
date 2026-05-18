import { Router } from "express";
import { auth } from "../middlewares/auth.Middleware";
import { allowRoles } from "../middlewares/roleMiddleware";
import {
  createLead,
  getAllLeads,
  getLeadById,
  updateLead,
  deleteLead,
  exportLeads,
  getLeadSummary,
} from "../controllers/lead.controller";

const router = Router();

router.use(auth, allowRoles("admin", "sales"));

router.get("/summary", getLeadSummary);
router.get("/export", exportLeads);
router.post("/", createLead);
router.get("/", getAllLeads);
router.get("/:id", getLeadById);
router.put("/:id", updateLead);
router.delete("/:id", deleteLead);

export default router;