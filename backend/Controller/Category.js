const categoryModal = require("../Modal/category/Category");

exports.AddCategory = async (req, res) => {
  let file = req.file.filename;
  let { category } = req.body;
  try {
    const categoryData = new categoryModal({ category, categoryImage: file });

    const savedcategory = await categoryData.save();

    if (savedcategory) {
      return res
        .status(200)
        .json({ message: "category Added Successfully", savedcategory });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal error" });
  }
};

exports.getAllcategory = async (req, res) => {
  try {
    const categoryData = await categoryModal.find({});

    return res.status(200).json({ data: categoryData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal error" });
  }
};
exports.getSearchedCategory = async (req, res) => {
  try {
    const { searchValue } = req.query;

    const query = searchValue
      ? { category: { $regex: new RegExp(escapeRegex(searchValue), "i") } }
      : {};

    const categoryData = await categoryModal.find(query);

    return res.status(200).json({ data: categoryData || [] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal error" });
  }
};

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

exports.getByid = async (req, res) => {
  let id = req.params.id;
  try {
    const categoryData = await categoryModal.findOne({ _id: id });

    if (categoryData) {
      return res.status(200).json({ data: categoryData });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal error" });
  }
};

exports.update = async (req, res) => {
  let { category } = req.body;
  try {
    let idd = req.params.id;
    const file = req.file?.filename;
    const findcategory = await categoryModal.findOne({
      _id: idd,
    });
    if (!findcategory) {
      return res.json({ error: "No such record found" });
    }
    findcategory.category = category || findcategory.category;
    if (file) {
      findcategory.categoryImage = file;
    }

    const updateCategory = await categoryModal.findOneAndUpdate(
      { _id: idd },
      findcategory,
      { new: true }
    );
    return res.status(200).json({
      message: "Updated successfully",
      date: updateCategory,
    });
  } catch (error) {
    return res.status(500).json({ error: "Unable to update the category" });
  }
};

exports.trash = async (req, res) => {
  let id = req.params.id;
  try {
    const categoryData = await categoryModal.findOneAndDelete({ _id: id });

    if (categoryData) {
      return res.status(200).json({ data: categoryData });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal error" });
  }
};
