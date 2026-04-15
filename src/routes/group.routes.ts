import { Router } from "express";
import { groupController } from "../controllers/group.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
	addGroupMemberSchema,
	createGroupEventSchema,
	createGroupSchema,
	groupEventParamSchema,
	groupIdParamSchema,
	groupMemberParamSchema,
	updateGroupEventSchema,
	updateGroupSchema,
} from "../schemas/group.schema";

const router = Router();

router.use(authenticate);

router.get("/", groupController.list);
router.post("/", validate({ body: createGroupSchema }), groupController.create);
router.get("/:id", validate({ params: groupIdParamSchema }), groupController.getById);
router.put(
	"/:id",
	validate({ params: groupIdParamSchema, body: updateGroupSchema }),
	groupController.update
);
router.delete("/:id", validate({ params: groupIdParamSchema }), groupController.delete);

router.post(
	"/:id/members",
	validate({ params: groupIdParamSchema, body: addGroupMemberSchema }),
	groupController.addMember
);
router.delete(
	"/:id/members/:uid",
	validate({ params: groupMemberParamSchema }),
	groupController.removeMember
);

router.get("/:id/events", validate({ params: groupIdParamSchema }), groupController.listEvents);
router.post(
	"/:id/events",
	validate({ params: groupIdParamSchema, body: createGroupEventSchema }),
	groupController.createEvent
);
router.put(
	"/:id/events/:eid",
	validate({ params: groupEventParamSchema, body: updateGroupEventSchema }),
	groupController.updateEvent
);
router.delete(
	"/:id/events/:eid",
	validate({ params: groupEventParamSchema }),
	groupController.deleteEvent
);
router.post(
	"/:id/events/:eid/join",
	validate({ params: groupEventParamSchema }),
	groupController.joinEvent
);

export default router;
