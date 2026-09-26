import postService from "../services/postServices.js";
import userRepository from "../repositories/userRepository.js";

class PostController {
    async showCreateForm(req, res) {
        const users = await userRepository.findAll();
        res.render("postForm", {
            post: {},
            users,
            selectedUserId: "",
            formAction: "/posts",
            formTitle: "Nuevo post"
        });
    }

    async create(req, res) {
        try {
            const { hashtags, ...postData } = req.body;
            const userId = req.body.userId || req.params.userId;
            delete postData.userId;
            const post = await postService.createPost(userId, {
                ...postData,
                hashtags: parseHashtags(hashtags)
            });
            res.redirect("/posts");
        } catch (error) {
            res.status(400).render("postForm", {
                post: req.body,
                users: await userRepository.findAll(),
                selectedUserId: req.body.userId,
                formAction: "/posts",
                formTitle: "Nuevo post",
                error: error.message
            });
        }
    }

    async getAll(req, res) {
        try {
            const posts = await postService.getPosts();
            res.render("posts", { posts });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async showEditForm(req, res) {
        try {
            const posts = await postService.getPosts();
            const post = posts.find((item) => item._id.toString() === req.params.id);
            if (!post) return res.status(404).send("Post no encontrado");
            const users = await userRepository.findAll();

            res.render("postForm", {
                post,
                users,
                selectedUserId: post.user?._id || post.user,
                formAction: `/posts/${post._id}`,
                formTitle: "Editar post"
            });
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    async update(req, res) {
        try {
            const { hashtags, userId, ...postData } = req.body;
            const post = await postService.updatePost(req.params.id, userId, {
                ...postData,
                hashtags: parseHashtags(hashtags)
            });
            if (!post) return res.status(404).send("Post no encontrado");
            res.redirect("/posts");
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    async delete(req, res) {
        try {
            const post = await postService.deletePost(req.params.id);
            if (!post) return res.status(404).send("Post no encontrado");
            res.redirect("/posts");
        } catch (error) {
            res.status(400).send(error.message);
        }
    }
}

function parseHashtags(value) {
    if (Array.isArray(value)) return value.filter(Boolean);
    return value ? value.split(",").map((tag) => tag.trim()).filter(Boolean) : [];
}

export default new PostController();
