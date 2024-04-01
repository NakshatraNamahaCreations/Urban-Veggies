const categoryController = require("../Controller/Category");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "Public/Category");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post(
  "/addcategory",
  upload.single("categoryImage"),
  categoryController.AddCategory
);
router.get("/getallcategory", categoryController.getAllcategory);
router.get("/getcategory", categoryController.getSearchedCategory);
router.get("/getbycategoryid/:id", categoryController.getByid);
router.put(
  "/editcategory/:id",
  upload.single("categoryImage"),
  categoryController.update
);
router.post("/trash/:id", categoryController.trash);

module.exports = router;
