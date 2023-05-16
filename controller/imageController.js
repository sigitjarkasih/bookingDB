const Item = require("../models/Item");
const Image = require("../models/Image");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  addImageItem: async (req, res) => {
    const { id } = req.params;
    try {
      if (req.file) {
        const item = await Item.findOne({ _id: id });

        const imageSave = await Image.create({
          imageUrl: `images/${req.file.filename}`,
        });

        item.image.push({
          _id: imageSave._id,
        });

        await item.save();
        res.status(201).json(imageSave);
      } else {
        res.status(400).json({ message: "Please Upload Image" });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  deleteImageItem: async (req, res) => {
    const { id, itemId } = req.params;
    try {
        const item = await Item.findOne({ _id: itemId });
        const image = await Image.findOne({ _id: id });

        if(!item) {
            res.status(404).json({ message: "Item Not Found "});
        }
        if(!item) {
            res.status(404).json({ message: "Image Not Found "});
        }

        async function deleteImageOnItem() {
            for (let i = 0; i < item.image.length; i++){
                if (item.image[i]._id.toString() === image._id.toString()) {
                    item.image.pull({ _id: image._id })
                    await item.save()
                }
            }
        }

        await image
        .remove()
        .then(()=> deleteImageOnItem())
        .then(()=> fs.unlink(path.join(`public/${image.imageUrl}`)));

        res.status(200).json({ message: "Image Deleted"})
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};
