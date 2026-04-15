import { Router } from "express";
import { groupController } from "../controllers/group.controller";

const router = Router();

router.get("/", groupController.list);
router.post("/", groupController.create);
router.get("/:id", groupController.getById);
router.put("/:id", groupController.update);
router.delete("/:id", groupController.delete);

router.post("/:id/members", groupController.addMember);
router.delete("/:id/members/:uid", groupController.removeMember);

router.get("/:id/events", groupController.listEvents);
router.post("/:id/events", groupController.createEvent);
router.put("/:id/events/:eid", groupController.updateEvent);
router.delete("/:id/events/:eid", groupController.deleteEvent);
router.post("/:id/events/:eid/join", groupController.joinEvent);

export default router;
