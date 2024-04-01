import React, { useRef, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Form, Card, Button } from "react-bootstrap";
import { Tabldata, customStyles } from "./data";
import { useReactToPrint } from "react-to-print";
import { Await, Link, useLocation, useNavigate } from "react-router-dom";
import http from "../http.common.function";
import { ImageApiURL } from "../../src/path";
import moment from "moment";
export default function TicketsRise() {
  const invoiceContainerRef = useRef(null);
  const location = useLocation();
  let queryidd = location.state?.queryid || null;
  const [Ticketsdata, setTicketsdata] = useState();
  const [FilteredData, setFilteredData] = useState();
  const [Category, setCategory] = useState();

  let initialData = {
    clientname: "",
    status: "",
  };
  let initialdate = {
    start: "",
    end: "",
  };
  const [SearchDateWise, setSearchDateWise] = useState(initialdate);
  const [SearchValue, setSearchValue] = useState(initialData);

  const handleDateChange = (e) => {
    let { name, value } = e.target;
    setSearchDateWise((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleFilter = () => {
    const { start, end } = SearchDateWise;
    const filtered = Ticketsdata.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return (
        (!start || orderDate >= new Date(start)) &&
        (!end || orderDate <= new Date(end))
      );
    });
    setFilteredData(filtered);
  };

  const handleReset = () => {
    setSearchDateWise(initialdate);
    setFilteredData(Ticketsdata);
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    setSearchValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const data = Ticketsdata?.filter(
      (ele) =>
        ele.ClientData?.[0]?.clientname?.includes(SearchValue.clientname) &&
        ele.orderStatus?.includes(SearchValue.status)
    );
    setFilteredData(data);
  }, [Ticketsdata, SearchValue]);

  useEffect(() => {
    if (invoiceContainerRef.current) {
      const dataTableContainer =
        invoiceContainerRef.current.querySelector(".rdt_Table");
      if (dataTableContainer) {
        dataTableContainer.classList.add("printableDataTable");
      }
    }
  }, []);
  const navigate = useNavigate();

  const [SelectedStatus, setSelectedStatus] = useState("");
  const [Editid, setEditid] = useState();

  const handlePrint = useReactToPrint({
    content: () => invoiceContainerRef.current,
  });
  const handleInvoice = (id) => {
    navigate("/Invoice", { state: { orderid: id } });
  };
  useEffect(() => {
    getOrderList();
    getAllCategory();
    getdata();
  }, []);
  const getAllCategory = async () => {
    const resp = await http.get("/category/getallcategory");

    setCategory(resp.data.data);
  };
  const handelSelect = async (e, id) => {
    setEditid(id);
    setSelectedStatus(e.target.value);
    if (SelectedStatus && Editid) {
      updateStatus();
    }
  };

  const columns = [
    {
      name: "SI NO",
      selector: (row, index) => index + 1,
    },
    {
      name: "CLIENT NAME",
      selector: (row) => row.ClientData?.[0]?.clientname,
    },
    {
      name: "Comment",
      selector: (row) => row.comments,
    },
    {
      name: "CATEGORY",
      selector: (row) => {
        const categoryObj = Category?.find(
          (ele) => ele._id === row?.Productdata?.[0]?.CategoryId
        );
        return categoryObj ? categoryObj.category : "";
      },
    },
    {
      name: "PRODUCT NAME",
      selector: (row) => row.Productdata?.[0]?.productname,
    },
    {
      name: "Tickets Rised Date",
      selector: (row) =>
        row?.createdAt ? moment(row?.createdAt).format("DD MMMM YYYY") : "",
    },
    {
      name: "STATUS",
      selector: (row) => row.TickesStatus,
    },
    {
      name: "ACTION",
      selector: (row) => (
        <>
          <Form.Select size="sm" onChange={(e) => handelSelect(e, row._id)}>
            <option value="" disabled>
              Choose
            </option>
            <option value={"Solved"}>Solved</option>
            <option value={"Pending"}>Pending</option>
          </Form.Select>
        </>
      ),
    },
  ];

  const getOrderList = async () => {
    try {
      let tickets = await http.get(`/tickets/getbyuser`);

      setTicketsdata(tickets.data.Ticketsdata);
    } catch (error) {
      console.log("Error fetching category data", error);
    }
  };

  const updateStatus = async () => {
    try {
      let response = await http.put(
        `/tickets/edittickets/${Editid}`,
        { orderStatus: SelectedStatus },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        alert("Status Updated Successfully");
        window.location.reload();
      }
    } catch (error) {
      console.log("Error fetching category data", error);
    }
  };
  const [TicketsQueryData, setTicketsQueryData] = useState();
  const [TicketsQuery, setTicketsQuery] = useState("");
  const [clientid, setclientId] = useState();
  const [editTicketsQuery, seteditTicketsQuery] = useState(false);
  const [EditData, setEditData] = useState();
  const [TicketsQueryID, setTicketsQueryID] = useState();
  const [ClientsData, setClientsData] = useState();
  const AddTicketsQuery = async () => {
    try {
      let response = await http.post(
        `/tickets/addquery`,
        { ticketsQuery: TicketsQuery },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        alert("tickets Query  Added Succesfully");
        window.location.reload("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async () => {
    try {
      setTicketsQuery("");
      seteditTicketsQuery(false);
      setTicketsQueryID(null);
      setEditData({});

      let response = await http.put(
        `/tickets/editquery/${TicketsQueryID}`,
        { ticketsQuery: TicketsQuery },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        alert("query Charge updated successfully!");
        window.location.assign("/Querylist");
      }
    } catch (error) {
      console.error("Error updating query Charge:", error);
    }
  };

  const getdata = async () => {
    try {
      let querydata = await http.get(`/tickets/getbyid/${queryidd}`);

      setTicketsQueryID(queryidd);
      setEditData(querydata.data.data);
      seteditTicketsQuery(true);
    } catch (error) {
      console.log("Error fetching Delivery Charge data:", error);
    }
  };
  return (
    <div className="row m-auto">
      <div className="row ">
        <p className="headeingName">Tickets</p>
        <Card className="mb-3 mt-4 p-3">
          <div className="row">
            <div className="col-md-6 m-auto">
              <Form.Control
                defaultValue={
                  editTicketsQuery && TicketsQueryID !== null
                    ? EditData.ticketsQuery
                    : TicketsQuery
                }
                onChange={(e) => setTicketsQuery(e.target.value)}
                placeholder="Tickets Query "
              />
            </div>

            <div className="col-md-4">
              <div className="row">
                {editTicketsQuery && TicketsQueryID !== null ? (
                  <button
                    className="col-md-4 btn_bg save p-2 m-auto btncwhite"
                    onClick={handleUpdate}
                  >
                    Update
                  </button>
                ) : (
                  <button
                    className="col-md-4 btn_bg save p-2 m-auto btncwhite"
                    onClick={AddTicketsQuery}
                  >
                    Save
                  </button>
                )}
                <div className="col-md-4 m-auto">
                  <Link to="/Querylist" className="row M-link">
                    <button className=" btn_bg save p-2 m-auto btncwhite">
                      View Query
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Card>
        <Card className=" shadow-sm p-5  m-auto  bg-white rounded m-auto">
          <div className="row">
            <div className="col-md-3">
              <Form.Control
                onChange={handleChange}
                className="p-2"
                name="clientname"
                placeholder="Seach by client"
              />
            </div>
            <div className="col-md-3">
              <Form.Select
                size="sm"
                className="p-2"
                onChange={handleChange}
                name="status"
              >
                <option value="" disabled></option>
                <option value={"Solved"}>Solved</option>
                <option value={"Pending"}>Pending</option>
              </Form.Select>
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-md-4">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                value={SearchDateWise.start || ""}
                onChange={handleDateChange}
                name="start"
                type="date"
              />
            </div>
            <div className="col-md-8">
              {" "}
              <div className="row">
                <Form.Label>End Date</Form.Label>
                <div className="col-md-6">
                  <Form.Control
                    value={SearchDateWise.end || ""}
                    name="end"
                    onChange={handleDateChange}
                    type="date"
                  />
                </div>

                <Button
                  onClick={handleFilter}
                  className="col-md-2 p-2 m-auto filter"
                >
                  Filter
                </Button>
                <Button
                  onClick={handleReset}
                  className="col-md-2 m-auto p-2 reset"
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="row mt-5" ref={invoiceContainerRef}>
        <DataTable
          columns={columns}
          data={FilteredData}
          highlightOnHover
          pointerOnHover
          pagination
          selectableRows
          customStyles={customStyles}
        />
      </div>
    </div>
  );
}
