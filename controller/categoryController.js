const Category = require("../models/Category");

module.exports = {
  addCategory: async (req, res) => {
    // console.log(req.body);

    const category = new Category({
      ...req.body,
    });

    try {
      await category.save();
      res.status(201).json(category);
    } catch (err) {
      res.status(400).send({message: err.message});
    }
  },

  viewCategory: async (req, res) => {
    try {
      const category = await Category.find();

      category.length === 0
        ? res.status(404).send({ message: "Tidak Ada Kategori" })
        : res.status(200).json(category);
    } catch (err) {
      res.status(500).send({message: err.message});
    }
  },

  updateCategory: async (req, res) => {
    // console.log(req.body);
    const updates = Object.keys(req.body);
    const allowedUpdates = ["categoryName"];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      return res.status(403).json({ message: "Invalid Key Parameter" });
    }

    try {
      const category = await Category.findById(req.params.id);
      updates.forEach((update) => {
        category[update] = req.body[update];
      });
      await category.save();
      res.status(200).json(category);
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const category = await Category.findByIdAndDelete(req.params.id);
      category
      ? res.status(200).json({ message: "Category Deleted" })
      : res.status(404).send({ message: "Category Not Found" });
    } catch (err) {
      res.status(500).send({message: err.message});
    }
  },
};
