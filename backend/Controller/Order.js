const OrderModal = require("../Modal/Order");

exports.AddOrder = async (req, res) => {
  let { Products, BillingDetails, ClientId, orderStatus } = req.body;

  try {
    const OrderID = generateRandomID();

    const OrderData = new OrderModal({
      Products,
      ClientId,
      BillingDetails,
      orderStatus: "Pending",
      OrderID,
    });

    const savedOrder = await OrderData.save();

    if (savedOrder) {
      return res
        .status(200)
        .json({ message: "Order Added Successfully", savedOrder });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal error" });
  }
};

function generateRandomID() {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const alphabetPart =
    alphabet[Math.floor(Math.random() * alphabet.length)] +
    alphabet[Math.floor(Math.random() * alphabet.length)];
  const numberPart = Math.floor(Math.random() * 1000000000000000)
    .toString()
    .padStart(15, "0");
  return alphabetPart + numberPart;
}

exports.update = async (req, res) => {
  let { orderStatus } = req.body;
  try {
    let idd = req.params.id;
    const findorder = await OrderModal.findOne({
      _id: idd,
    });
    if (!findorder) {
      return res.json({ error: "No such record found" });
    }
    findorder.orderStatus = orderStatus || findorder.orderStatus;
    const UpdateOrder = await OrderModal.findOneAndUpdate(
      { _id: idd },
      findorder,
      { new: true }
    );
    return res.status(200).json({
      message: "Updated successfully",
      date: UpdateOrder,
    });
  } catch (error) {
    return res.status(500).json({ error: "Unable to update the Product" });
  }
};
exports.getAllOrder = async (req, res) => {
  try {
    const OrderData = await OrderModal.find({});
    return res.status(200).json({ data: OrderData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal error" });
  }
};

exports.getByid = async (req, res) => {
  let id = req.params.id;
  try {
    const OrderData = await OrderModal.findOne({ _id: id });

    if (OrderData) {
      return res.status(200).json({ data: OrderData });
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

    const OrderData = await OrderModal.find({ ClientId: id });

    if (OrderData) {
      return res.status(200).json({ data: OrderData });
    } else {
      return res
        .status(404)
        .json({ message: "No Orders found for the specified client ID" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal error" });
  }
};

exports.trash = async (req, res) => {
  let id = req.params.id;
  try {
    const OrderData = await OrderModal.findOneAndDelete({
      _id: id,
    });

    if (OrderData) {
      return res.status(200).json({ data: OrderData });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal error" });
  }
};

exports.GetDataWithClients = async (req, res) => {
  try {
    const data = await OrderModal.aggregate([
      {
        $lookup: {
          from: "clients",
          localField: "ClientId",
          foreignField: "_id",
          as: "ClientData",
        },
      },
    ]);

    if (data.length > 0) {
      res.status(200).json({ OrderData: data });
    } else {
      res.status(404).json({ error: "No Data Found!" });
    }
  } catch (error) {
    console.log("Error fetching data with clients:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
