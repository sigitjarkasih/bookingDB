const Item = require("../models/Item");
const Feature = require("../models/Feature");
const fs = require("fs-extra");
const path = require("path");
const { features } = require("process");

module.exports = {
  addFeature: async (req, res) => {
    // console.log(req.body);
    const { featureName, qty, item } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image Not Found" });
    }

    try {
      const feature = await Feature.create({
        featureName,
        qty,
        item,
        imageUrl: `images/${req.file.filename}`,
      });

      const itemDb = await Item.findOne({ _id: item });
      itemDb.feature.push({ _id: feature._id });
      await itemDb.save();

      res.status(201).json(feature);
    } catch (err) {
      await fs.unlink(path.join(`public/images/${req.file.filename}`));
      res.status(500).json({ message: err.message });
    }
  },

  viewFeature: async (req, res) => {
    try {
      const feature = await Feature.find().populate({
        path: "item",
        select: "id itemName",
      });

      feature.lenght === 0
        ? res.status(404).json({ message: "No Data Feature Found " })
        : res.status(200).json(feature);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  updateFeature: async (req, res) => {
    // console.log(req.body);
    const id = req.params.id;
    const updates = Object.keys(req.body);
    const allowedUpdates = ["featureName", "qty", "item"];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      return res.status(403).json({ message: "Invalid Key Parameter" });
    }

    try {
      const feature = await Feature.findById({_id : id});
      if (req.file == undefined) {
        updates.forEach((update) => {
          feature[update] = req.body[update];
        });
        await feature.save();
        res.status(200).json(feature);
      } else {
        await fs.unlink(path.join(`public/${feature.imageUrl}`));
        updates.forEach((update) => {
          Bank[update] = req.body[update];
        });
        feature.imageUrl = `images/${req.file.filename}`;
        await feature.save();
        res.status(200).json(feature);
      }
    } catch (err) {
      if (req.file) {
        await fs.unlink(path.join(`public/images/${req.file.filename}`));
      }
      res.status(500).json({ message: err.message });
    }
  },

  deleteFeature: async (req, res) => {
    try {
    const id  = req.params.id;
    const feature = await Feature.findOne({ _id: id });

      if (!feature) {
        return res.status(404).send({ message: "Feature Not Found" });

      }

      async function deleteItem(){
        const itemDb = await Item.findOne({ _id: feature.item });
        for (let i = 0; i < itemDb.feature.length; i++){
            if (itemDb.feature[i]._id.toString() === feature._id.toString()) {
                itemDb.feature.pull({ _id: feature._id })
                await itemDb.save()
            }
        }
      }

      async function deleteImage(){
        for (let i = 0; i < feature.image.length; i++){
          Image.findOne({ _id: feature.image[i]._id })
            .then((image) => {
              fs.unlink(path.join(`public/${image.imageUrl}`));
              image.remove();
            })
            .catch((error) => {
              res.status(500).json({ message: error.message });
            });
        }
      }

      await feature
      .remove()
      .then(() => deleteItem())
      .then(() => fs.unlink(path.join(`public/images/${req.file.filename}`)));

      
      res.status(200).json({ message: "Feature Deleted"})
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};
