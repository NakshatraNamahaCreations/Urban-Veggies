const BannerModal = require("../Modal/banner/Banner");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/Banner");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });
const express = require("express");
const router = express.Router();

router.post("/addbanner", upload.single("BannerImage"), async (req, res) => {
  let file = req.file.filename;

  try {
    const BannerData = new BannerModal({
      BannerImage: file,
    });

    const savedBanner = await BannerData.save();

    if (savedBanner) {
      return res
        .status(200)
        .json({ message: "Banner Added Successfully", savedBanner });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal error" });
  }
});
router.get("/getbanner", async (req, res) => {
  try {
    const BannerData = await BannerModal.find({});

    if (BannerData) {
      return res.status(200).json({ data: BannerData });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal error" });
  }
});

router.get("/getbybannerid/:id", async (req, res) => {
  let id = req.params.id;
  try {
    const BannerData = await BannerModal.findOne({ _id: id });

    if (BannerData) {
      return res.status(200).json({ data: BannerData });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal error" });
  }
});

router.put(
  "/editbanner/:id",
  upload.single("BannerImage"),
  async (req, res) => {
    try {
      let idd = req.params.id;
      const file = req.file?.filename;
      const findBanner = await BannerModal.findOne({
        _id: idd,
      });
      if (!findBanner) {
        return res.json({ error: "No such record found" });
      }

      if (file) {
        findBanner.BannerImage = file;
      }

      const updateCategory = await BannerModal.findOneAndUpdate(
        { _id: idd },
        findBanner,
        { new: true }
      );
      return res.status(200).json({
        message: "Updated successfully",
        date: updateCategory,
      });
    } catch (error) {
      return res.status(500).json({ error: "Unable to update the banner" });
    }
  }
);

router.post("/trashbaner/:id", async (req, res) => {
  let id = req.params.id;
  try {
    const BannerData = await BannerModal.findOneAndDelete({ _id: id });

    if (BannerData) {
      return res.status(200).json({ data: BannerData });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal error" });
  }
});
module.exports = router;
