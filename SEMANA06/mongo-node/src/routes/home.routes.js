import express from "express";
import postService from "../services/postServices.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const posts = await postService.getPosts();
        res.render("home", { posts: posts.slice(0, 3) });
    } catch (error) {
        res.status(500).render("home", { posts: [], error: error.message });
    }
});

export default router;
