const TicketsModal = require("../Modal/tickets");
const QueryModal = require("../Modal/ticketQuery");
exports.AddTickets = async (req, res) => {
  let { OrderId, ClientId, TickesStatus, comments } = req.body;

  try {
    const TicketsData = new TicketsModal({
      OrderId,
      ClientId,
      TickesStatus,
      comments,
    });

    const savedTickets = await TicketsData.save();

    if (savedTickets) {
      return res
        .status(200)
        .json({ message: "Tickets Added Successfully", savedTickets });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal error" });
  }
};
exports.update = async (req, res) => {
  let { OrderId, ClientId, TickesStatus, comments } = req.body;
  try {
    let idd = req.params.id;

    const findTickets = await TicketsModal.findOne({
      _id: idd,
    });
    if (!findTickets) {
      return res.json({ error: "No such record found" });
    }
    findTickets.TickesStatus = TickesStatus || findTickets.TickesStatus;
    findTickets.comments = comments || findTickets.comments;
    findTickets.OrderId = OrderId || findTickets.OrderId;
    const UpdateTickets = await TicketsModal.findOneAndUpdate(
      { _id: idd },
      findTickets,
      { new: true }
    );
    return res.status(200).json({
      message: "Updated successfully",
      date: UpdateTickets,
    });
  } catch (error) {
    return res.status(500).json({ error: "Unable to update the Tickets" });
  }
};
exports.getAllTickets = async (req, res) => {
  try {
    const TicketsData = await TicketsModal.aggregate([
      {
        $lookup: {
          from: "clients",
          localField: "ClientId",
          foreignField: "_id",
          as: "ClientData",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "OrderId",
          foreignField: "_id",
          as: "Productdata",
        },
      },
    ]);

    return res.status(200).json({ data: TicketsData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal error" });
  }
};

exports.getByid = async (req, res) => {
  let id = req.params.id;
  try {
    const TicketsData = await TicketsModal.findOne({ _id: id });

    if (TicketsData) {
      return res.status(200).json({ data: TicketsData });
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

    const TicketsData = await TicketsModal.find({ ClientId: id });

    if (TicketsData) {
      return res.status(200).json({ data: TicketsData });
    } else {
      return res
        .status(404)
        .json({ message: "No Ticketss found for the specified client ID" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal error" });
  }
};

exports.trash = async (req, res) => {
  let id = req.params.id;
  try {
    const TicketsData = await TicketsModal.findOneAndDelete({
      _id: id,
    });

    if (TicketsData) {
      return res.status(200).json({ data: TicketsData });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal error" });
  }
};

exports.GetDataWithClients = async (req, res) => {
  try {
    const { searchValue } = req.query;
    const query = searchValue
      ? { productname: { $regex: new RegExp(escapeRegex(searchValue), "i") } }
      : {};

    const data = await TicketsModal.aggregate([
      {
        $lookup: {
          from: "clients",
          localField: "ClientId",
          foreignField: "_id",
          as: "ClientData",
        },
      },
      {
        $lookup: {
          from: "orders",
          localField: "OrderId",
          foreignField: "_id",
          as: "OrderData",
        },
      },

      { $match: query },
    ]);

    if (data.length > 0) {
      res.status(200).json({ Ticketsdata: data });
    } else {
      res.status(404).json({ error: "No Data Found!" });
    }
  } catch (error) {
    console.log("Error fetching data with clients:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.AddTicketsQuery = async (req, res) => {
  let { ticketsQuery } = req.body;

  try {
    const QueryData = new QueryModal({
      ticketsQuery,
    });

    const savedQuery = await QueryData.save();

    if (savedQuery) {
      return res
        .status(200)
        .json({ message: "Query Added Successfully", savedQuery });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal error" });
  }
};
exports.getAllQuery = async (req, res) => {
  try {
    let querydata = await QueryModal.find();

    return res.status(200).json({ data: querydata });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal error" });
  }
};

exports.trashQuery = async (req, res) => {
  let id = req.params.id;
  try {
    const TicketsData = await QueryModal.findOneAndDelete({
      _id: id,
    });

    if (TicketsData) {
      return res.status(200).json({ data: TicketsData });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal error" });
  }
};
exports.updateQuery = async (req, res) => {
  let { ticketsQuery } = req.body;
  try {
    let idd = req.params.id;

    const findQuery = await QueryModal.findOne({
      _id: idd,
    });
    if (!findQuery) {
      return res.json({ error: "No such record found" });
    }
    findQuery.ticketsQuery = ticketsQuery || findQuery.ticketsQuery;

    const UpdateQuery = await QueryModal.findOneAndUpdate(
      { _id: idd },
      findQuery,
      { new: true }
    );
    return res.status(200).json({
      message: "Updated successfully",
      date: UpdateQuery,
    });
  } catch (error) {
    return res.status(500).json({ error: "Unable to update the Query" });
  }
};


exports.getQuerByid = async (req, res) => {
  let id = req.params.id;
  try {
    const QueryData = await QueryModal.findOne({ _id: id });

    if (QueryData) {
      return res.status(200).json({ data: QueryData });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal error" });
  }
};
