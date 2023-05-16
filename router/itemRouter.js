const express = require("express");
const imageController = require("../controller/imageController");
const itemController = require("../controller/itemController");
const { uploadMultiple, uploadSingle } = require("../middleware/multer");
const auth = require("../middleware/auth");
const checkRole = require("../middleware/checkRole");

const router = express.Router();

router.post(
  "/create",
  auth,
  checkRole("admin"),
  uploadMultiple,
  itemController.addItem
);
router.get("/read", itemController.viewItem);
router.patch(
  "/update/:id",
  auth,
  checkRole("admin"),
  itemController.updateItem
);
router.delete(
  "/delete/:id",
  auth,
  checkRole("admin"),
  itemController.deleteItem
);

// Tambah Image id=item._id
router.post(
  "/add-image/:id",
  auth,
  checkRole("admin"),
  uploadSingle,
  imageController.addImageItem
);
// Delete Image
router.delete(
  "/delete-image/:itemId/:id",
  auth,
  checkRole("admin"),
  imageController.deleteImageItem
);

module.exports = router;
