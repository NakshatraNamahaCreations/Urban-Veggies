const ProductModal = require("../Modal/product/Product");

exports.GetDataWithClients = async (req, res) => {
  try {
    const { searchValue } = req.query;
    const query = searchValue
      ? { productname: { $regex: new RegExp(escapeRegex(searchValue), "i") } }
      : {};

    const data = await ProductModal.aggregate([
      {
        $lookup: {
          from: "clients",
          localField: "clientId",
          foreignField: "_id",
          as: "ClientData",
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "CategoryId",
          foreignField: "_id",
          as: "CategoryData",
        },
      },
      { $match: query },
    ]);

    if (data.length > 0) {
      res.status(200).json({ productData: data });
    } else {
      res.status(404).json({ error: "No Data Found!" });
    }
  } catch (error) {
    console.log("Error fetching data with clients:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

exports.AddProduct = async (req, res) => {
  let {
    CategoryId,
    productname,
    hsncode,
    offerprice,
    price,
    description,
    GST,
    clientId,
    minqty,
    clientName,
    unit,maxqty
  } = req.body;
  let file = req.file?.filename;
  try {
    const ProductData = new ProductModal({
      CategoryId,
      productname,
      hsncode,
      offerprice,
      price,
      description,
      productimage: file,
      GST,
      clientId,
      minqty,
      clientName,
      unit,maxqty
    });

    const savedProduct = await ProductData.save();

    if (savedProduct) {
      return res
        .status(200)
        .json({ message: "Product Added Successfully", savedProduct });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal error" });
  }
};

exports.getAllProduct = async (req, res) => {
  try {
    const ProductData = await ProductModal.find({});
    return res.status(200).json({ data: ProductData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal error" });
  }
};

exports.getSearchedProduct = async (req, res) => {
  try {
    const { searchValue } = req.query;

    const query = searchValue
      ? { productname: { $regex: new RegExp(escapeRegex(searchValue), "i") } }
      : {};

    const CategoryIdData = await ProductModal.find(query);

    return res.status(200).json({ data: CategoryIdData || [] });
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
    const ProductData = await ProductModal.findOne({ _id: id });

    if (ProductData) {
      return res.status(200).json({ data: ProductData });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal error" });
  }
};

exports.getByUserid = async (req, res) => {
  try {
    const clientId = req.params.id;
    const products = await ProductModal.find({ clientId });
    const categoryIds = products.map((product) => product.CategoryId);

    const aggregatedData = await ProductModal.aggregate([
      { $match: { CategoryId: { $in: categoryIds } } },
      {
        $lookup: {
          from: "categories",
          localField: "CategoryId",
          foreignField: "_id",
          as: "CategoryData",
        },
      },
    ]);

    if (aggregatedData && aggregatedData.length > 0) {
      return res.status(200).json({ data: aggregatedData });
    } else {
      return res
        .status(404)
        .json({ message: "No products found for the specified client ID" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal error" });
  }
};

exports.update = async (req, res) => {
  let {
    CategoryId,
    productname,
    hsncode,
    offerprice,
    price,
    description,
    GST,
    minqty,
    unit,maxqty
  } = req.body;
  try {
    let idd = req.params.id;
    const file = req.file?.filename;
    const findProduct = await ProductModal.findOne({
      _id: idd,
    });
    if (!findProduct) {
      return res.json({ error: "No such record found" });
    }
    findProduct.productname = productname || findProduct.productname;
    findProduct.CategoryId = CategoryId || findProduct.CategoryId;
    findProduct.hsncode = hsncode || findProduct.hsncode;
    findProduct.offerprice = offerprice || findProduct.offerprice;
    findProduct.price = price || findProduct.price;
    findProduct.description = description || findProduct.description;
    findProduct.GST = GST || findProduct.GST;
    findProduct.minqty = minqty || findProduct.minqty;
    findProduct.unit = unit || findProduct.unit;
    findProduct.maxqty = maxqty || findProduct.maxqty;
    if (file) {
      findProduct.productimage = file;
    }

    const updateProduct = await ProductModal.findOneAndUpdate(
      { _id: idd },
      findProduct,
      { new: true }
    );
    return res.status(200).json({
      message: "Updated successfully",
      date: updateProduct,
    });
  } catch (error) {
    return res.status(500).json({ error: "Unable to update the Product" });
  }
};

exports.trash = async (req, res) => {
  let id = req.params.id;
  try {
    const ProductData = await ProductModal.findOneAndDelete({
      _id: id,
    });

    if (ProductData) {
      return res.status(200).json({ data: ProductData });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal error" });
  }
};
