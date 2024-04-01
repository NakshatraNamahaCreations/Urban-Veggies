const ClientModal = require("../Modal/Client");

exports.AddClients = async (req, res) => {
  let {
    clientname,
    email,
    contact,
    altcontact,
    city,
    state,
    address,
    password,
  } = req.body;
  try {
    const AddData = new ClientModal({
      clientname,
      email,
      contact,
      altcontact,
      city,
      state,
      address,
      password,
    });
    let SaveData = await AddData.save();
    if (SaveData) {
      return res
        .status(200)
        .json({ message: "Succesfully Client Added", data: SaveData });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Error" });
  }
};
exports.getAllClient = async (req, res) => {
  try {
    const clientData = await ClientModal.find({});
    return res.status(200).json({ data: clientData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal error" });
  }
};
exports.LoginClient = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await ClientModal.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid Email or Password!" });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid Email or Password!" });
    }

    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal error" });
  }
};
exports.getSearchedClient = async (req, res) => {
  try {
    const { searchValue } = req.query;
    const categoryData = await ClientModal.find({
      clientname: { $regex: new RegExp(escapeRegex(searchValue), "i") },
    });
    let Ddata = await ClientModal.find({});

    return res.status(200).json({ data: searchValue ? categoryData : Ddata });
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
    const clientData = await ClientModal.findOne({ _id: id });

    if (clientData) {
      return res.status(200).json({ data: clientData });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal error" });
  }
};

exports.update = async (req, res) => {
  let { clientname, email, contact, altcontact, city, state, address } =
    req.body;
  try {
    let idd = req.params.id;

    const findData = await ClientModal.findOne({
      _id: idd,
    });
    if (!findData) {
      return res.json({ error: "No such record found" });
    }
    findData.clientname = clientname || findData.clientname;

    findData.email = email || findData.email;

    findData.contact = contact || findData.contact;
    findData.altcontact = altcontact || findData.altcontact;
    findData.city = city || findData.city;
    findData.state = state || findData.state;
    findData.address = address || findData.address;
    const updateclient = await ClientModal.findOneAndUpdate(
      { _id: idd },
      findData,
      { new: true }
    );
    return res.status(200).json({
      message: "Updated successfully",
      date: updateclient,
    });
  } catch (error) {
    return res.status(500).json({ error: "Unable to update the client" });
  }
};

exports.trash = async (req, res) => {
  let id = req.params.id;
  try {
    const clientData = await ClientModal.findOneAndDelete({
      _id: id,
    });

    if (clientData) {
      return res.status(200).json({ data: clientData });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal error" });
  }
};
