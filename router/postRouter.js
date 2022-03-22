const express = require("express");
const router = express.Router();
const postController = require("../controller/postController");

router.post("/post", postController.CreatePost);
router.get("/post", postController.GetPost);
router.get("/post/:id", postController.GetPostById);
router.put("/post/:id", postController.EditPost);
router.delete("/post/:id", postController.DeletePost);

module.exports = router;
