const ProductController = require("../Controller/Product");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "Public/Product");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post(
  "/addProduct",
  upload.single("productimage"),
  ProductController.AddProduct
);
router.get("/getallProduct", ProductController.getAllProduct);
router.get("/getProduct", ProductController.getSearchedProduct);
router.get("/getbyProductid/:id", ProductController.getByid);
router.get("/getproductbyuser/:id", ProductController.getByUserid);
router.put(
  "/editProduct/:id",
  upload.single("productimage"),
  ProductController.update
);
router.post("/trash/:id", ProductController.trash);
router.get("/getbyuser", ProductController.GetDataWithClients);
module.exports = router;
