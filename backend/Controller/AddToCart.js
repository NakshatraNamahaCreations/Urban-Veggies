const CartModal = require("../Modal/AddtoCart");

exports.AddCart = async (req, res) => {
  let { ProductId, Quantity, Amount, ClientId } = req.body;

  try {
    const CartData = new CartModal({
      ProductId,
      Quantity,
      Amount,
      ClientId,
    });

    const savedCart = await CartData.save();

    if (savedCart) {
      return res
        .status(200)
        .json({ message: "Cart Added Successfully", savedCart });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal error" });
  }
};

exports.getAllCart = async (req, res) => {
  try {
    const CartData = await CartModal.find({});
    return res.status(200).json({ data: CartData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal error" });
  }
};

exports.getByid = async (req, res) => {
  let id = req.params.id;
  try {
    const CartData = await CartModal.findOne({ _id: id });

    if (CartData) {
      return res.status(200).json({ data: CartData });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal error" });
  }
};

exports.getByUserid = async (req, res) => {
  let { ClientId } = req.body;
  try {
    const id = req.params.id;

    const CartData = await CartModal.find({ ClientId: id });

    if (CartData) {
      return res.status(200).json({ data: CartData });
    } else {
      return res
        .status(404)
        .json({ message: "No Carts found for the specified client ID" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal error" });
  }
};

exports.update = async (req, res) => {
  let { ProductId, Quantity, Amount } = req.body;
  try {
    let idd = req.params.id;

    const findCart = await CartModal.findOne({
      _id: idd,
    });
    if (!findCart) {
      return res.json({ error: "No such record found" });
    }
    findCart.ProductId = ProductId || findCart.ProductId;
    findCart.Quantity = Quantity || findCart.Quantity;
    findCart.Amount = Amount || findCart.Amount;

    if (file) {
      findCart.Cartimage = file;
    }

    const updateCart = await CartModal.findOneAndUpdate(
      { _id: idd },
      findCart,
      { new: true }
    );
    return res.status(200).json({
      message: "Updated successfully",
      date: updateCart,
    });
  } catch (error) {
    return res.status(500).json({ error: "Unable to update the Cart" });
  }
};

exports.trash = async (req, res) => {
  let id = req.params.id;
  try {
    const CartData = await CartModal.findOneAndDelete({
      _id: id,
    });

    if (CartData) {
      return res.status(200).json({ data: CartData });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal error" });
  }
};
