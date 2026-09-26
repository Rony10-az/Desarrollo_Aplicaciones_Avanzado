import express from "express";
import postController from "../controllers/postController.js";

const router = express.Router();

router.get("/", postController.getAll);
router.get("/new", postController.showCreateForm);
router.post("/create/:userId", postController.create);
router.post("/create", postController.create);
router.post("/", postController.create);
router.get("/:id/edit", postController.showEditForm);
router.post("/:id", postController.update);
router.post("/:id/delete", postController.delete);
router.put("/:id", postController.update);
router.delete("/:id", postController.delete);

export default router;
