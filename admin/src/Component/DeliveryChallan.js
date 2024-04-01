import React, { useRef, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Form, Card, Button } from "react-bootstrap";
import { Tabldata, customStyles } from "./data";
import { useReactToPrint } from "react-to-print";
import { useNavigate } from "react-router-dom";
import http from "../http.common.function";
import { ImageApiURL } from "../../src/path";
import moment from "moment";
export default function DeliveryChallan() {
  const invoiceContainerRef = useRef(null);

  const [OrderData, setOrderData] = useState();
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

  // Filter ing the data based on search value and date range
  const handleDateChange = (e) => {
    let { name, value } = e.target;
    setSearchDateWise((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleFilter = () => {
    const { start, end } = SearchDateWise;
    const filtered = OrderData.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return (
        (!start || orderDate >= new Date(start)) &&
        (!end || orderDate <= new Date(end))
      );
    });
    setFilteredData(filtered);
  };

  const handleReset = () => {
    console.log(initialdate, "initialdate");
    setSearchDateWise(initialdate);
    setFilteredData(OrderData);
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    setSearchValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const data = OrderData?.filter(
      (ele) =>
        ele.ClientData?.[0]?.clientname?.includes(SearchValue.clientname) &&
        ele.orderStatus?.includes(SearchValue.status)
    );
    setFilteredData(data);
  }, [OrderData, SearchValue]);

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
    navigate("/DeliverChallanFormat", { state: { orderid: id } });
  };
  useEffect(() => {
    getOrderList();
    getAllCategory();
  }, []);
  const getAllCategory = async () => {
    const resp = await http.get("/category/getallcategory");

    setCategory(resp.data.data);
  };
  const handelSelect = (e, id) => {
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
      name: "Order ID",
      selector: (row, index) => row.OrderID,
    },

    // {
    //   name: "CATEGORY",
    //   selector: (row) => {
    //     const categoryObj = Category?.find(
    //       (ele) => ele._id === row?.ProductData?.[0]?.CategoryId
    //     );
    //     return categoryObj ? categoryObj.category : "";
    //   },
    // },

    // {
    //   name: "PRODUCT NAME",
    //   selector: (row) => row.ProductData?.[0].productname,
    // },
    // {
    //   name: "PRODUCT IMAGE",

    //   selector: (row) => (
    //     <>
    //       <img
    //         width={50}
    //         height={50}
    //         src={`${ImageApiURL}/Product/${row?.Products?.[0].productimage}`}
    //       />
    //     </>
    //   ),
    // },
    {
      name: "ORDER TIME",
      selector: (row) =>
        row?.createdAt ? moment(row?.createdAt).format("DD MMMM YYYY") : "",
    },
    {
      name: "CLIENT NAME",
      selector: (row) => row.ClientData?.[0]?.clientname,
    },
    // {
    //   name: "Delivery Charge(Incld GSt)",
    //   selector: (row) => row.BillingDetails?.handingFeeIncGST,
    // },
    // {
    //   name: "AMOUNT",
    //   selector: (row) => row.BillingDetails.finalPrice,
    // },
    {
      name: "STATUS",
      selector: (row) => row.orderStatus,
    },
    {
      name: "ACTION",
      selector: (row) => (
        <>
          <Form.Select size="sm" onChange={(e) => handelSelect(e, row._id)}>
            <option value={"Processing"}>Processing</option>
            <option value={"Delivered"}>Delivered</option>
            <option value={"Canceled"}>Canceled</option>
          </Form.Select>
        </>
      ),
    },

    {
      name: "INVOICE",
      selector: (row) => (
        <div className="row">
          <i
            onClick={handlePrint}
            className="pi pi-print prints col-md-2 m-auto"
          ></i>
          <span
            className="view m-auto col-md-6"
            onClick={() => handleInvoice(row._id)}
          >
            <a className="hyperlink mx-1 col-md-3">
              <i
                className="pi pi-eye"
                title="view"
                style={{ color: "#63bff5" }}
              ></i>
            </a>
          </span>
        </div>
      ),
    },
  ];

  const getOrderList = async () => {
    try {
      let order = await http.get(`/order/getbyuser`);
      setOrderData(order.data.OrderData);
    } catch (error) {
      console.log("Error fetching category data", error);
    }
  };

  const updateStatus = async () => {
    try {
      let response = await http.put(
        `/order/editorder/${Editid}`,
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
  return (
    <div className="row m-auto">
      <div className="row ">
        <p className="headeingName">Delivery Challan</p>
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
                <option className="Delivered">Delivered</option>
                <option className="Pending">Pending</option>
                <option className="Processing">Processing</option>
                <option className="Canceled">Canceled</option>
              </Form.Select>
            </div>

            <div className="col-md-3">
              <button className="p-2 m-auto btn_bg">Download All orders</button>
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
