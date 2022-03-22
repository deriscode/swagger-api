const { User, Post, sequelize } = require("../models");

const CreatePost = async (req, res) => {
	const transaction = await sequelize.transaction();
	const { user_uuid, title, content } = req.body;

	try {
		const user = await User.findOne({ where: { uuid: user_uuid } });

		const post = await Post.create(
			{
				title,
				content,
				user_uuid: user.uuid,
			},
			transaction
		);

		await transaction.commit();

		return res.status(201).json({
			message: "Post Successfully Created",
			data: post,
		});
	} catch (error) {
		await transaction.rollback();
		console.log(error);
		return res.status(500).json({
			message: error.message,
		});
	}
};

const GetPost = async (req, res) => {
	try {
		const page = Number(req.query.page) || 1;
		const itemPerPage = 6;

		const posts = await Post.findAndCountAll({
			limit: itemPerPage,
			offset: (page - 1) * itemPerPage,
		});

		const totalPage = Math.ceil(posts.count / itemPerPage);

		if (page > totalPage) {
			return res.status(404).json({
				message: "Posts Not Found",
				data: [],
			});
		} else {
			return res.status(200).json({
				message: "Posts Successfully Found",
				data: posts.rows,
				currentPage: page,
				totalPage,
				nextPage: page + 1,
				prevPage: page - 1 === 0 ? 1 : page - 1,
			});
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: error.message,
		});
	}
};

const GetPostById = async (req, res) => {
	try {
		const postSelected = await Post.findOne({
			where: {
				uuid: req.params.id,
			},
		});

		if (postSelected) {
			return res.status(200).json({
				message: "Successfully Get Post",
				data: postSelected,
			});
		} else {
			return res.status(404).json({
				message: "Post Not Found",
			});
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: error.message,
		});
	}
};

const EditPost = async (req, res) => {
	const transaction = await sequelize.transaction();
	const { title, content } = req.body;

	try {
		const postToUpdate = await Post.findByPk(req.params.id);

		if (postToUpdate) {
			const updated = await postToUpdate.update(
				{
					title: title === "" ? postToUpdate.title : title,
					content: content === "" ? postToUpdate.content : content,
				},
				transaction
			);

			await transaction.commit();

			return res.status(200).json({
				message: "Post Successfully Updated",
				data: updated,
			});
		} else {
			return res.status(404).json({
				message: "Post Not Found",
			});
		}
	} catch (error) {
		await transaction.rollback();
		console.log(error);
		return res.status(500).json({
			message: error.message,
		});
	}
};

const DeletePost = async (req, res) => {
	const transaction = await sequelize.transaction();

	try {
		const postToDelete = await Post.findByPk(req.params.id);

		if (postToDelete) {
			await Post.destroy(
				{
					where: {
						uuid: postToDelete.uuid,
					},
				},
				transaction
			);

			await transaction.commit();

			return res.status(200).json({
				message: "Post Successfully Deleted",
			});
		} else {
			return res.status(404).json({
				message: "Post Not Found",
			});
		}
	} catch (error) {
		await transaction.rollback();
		console.log(error);
		return res.status(500).json({
			message: error.message,
		});
	}
};

module.exports = {
	CreatePost,
	GetPost,
	GetPostById,
	EditPost,
	DeletePost,
};
