const dlchargeModal = require("../Modal/DeliveryCharge");

exports.Adddlcharge = async (req, res) => {
  let { dlcharge, ClientId } = req.body;
  try {
    const dlchargeData = new dlchargeModal({
      dlcharge,
      ClientId,
    });

    const saveddlcharge = await dlchargeData.save();

    if (saveddlcharge) {
      return res.status(200).json({ data: saveddlcharge });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal error" });
  }
};

exports.getAlldlcharge = async (req, res) => {
  try {
    const dlchargeData = await dlchargeModal.find({});
    return res.status(200).json({ data: dlchargeData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal error" });
  }
};

exports.update = async (req, res) => {
  let { dlcharge, ClientId } = req.body;
  try {
    let idd = req.params.id;

    const finddlcharge = await dlchargeModal.findOne({
      _id: idd,
    });
    if (!finddlcharge) {
      return res.json({ error: "No such record found" });
    }
    finddlcharge.dlcharge = dlcharge || finddlcharge.dlcharge;

    finddlcharge.ClientId = ClientId || finddlcharge.ClientId;
    const updatedlcharge = await dlchargeModal.findOneAndUpdate(
      { _id: idd },
      finddlcharge,
      { new: true }
    );
    return res.status(200).json({
      message: "Updated successfully",
      date: updatedlcharge,
    });
  } catch (error) {
    return res.status(500).json({ error: "Unable to update the dlcharge" });
  }
};

exports.trash = async (req, res) => {
  let id = req.params.id;
  try {
    const dlchargeData = await dlchargeModal.findOneAndDelete({
      _id: id,
    });

    if (dlchargeData) {
      return res.status(200).json({ data: dlchargeData });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal error" });
  }
};

exports.getByid = async (req, res) => {
  let id = req.params.id;
  try {
    const DeliveryChargeData = await dlchargeModal.findOne({ _id: id });

    if (DeliveryChargeData) {
      return res.status(200).json({ data: DeliveryChargeData });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal error" });
  }
};

exports.GetDataWithClients = async (req, res) => {
  try {
    const data = await dlchargeModal.aggregate([
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
      res.status(200).json({ data: data });
    } else {
      res.status(404).json({ error: "No Data Found!" });
    }
  } catch (error) {
    console.log("Error fetching data with clients:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
