import React, { useRef, useEffect, useState } from "react";

import Card from "react-bootstrap/Card";
import { useNavigate } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import InventoryIcon from "@mui/icons-material/Inventory";
import Groups2OutlinedIcon from "@mui/icons-material/Groups2Outlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import { Column } from "@ant-design/charts";
import DataTable from "react-data-table-component";
import Form from "react-bootstrap/Form";
import { useReactToPrint } from "react-to-print";
import { Chart } from "react-google-charts";
import { Tabldata, customStyles } from "./data";
import "./dash.css";
import http from "../http.common.function";
import { ImageApiURL } from "../../src/path";
import moment from "moment";
export default function Dashboard() {
  const [OrderData, setOrderData] = useState();
  const navigate = useNavigate();
  const invoiceContainerRef = useRef(null);
  const [Category, setCategory] = useState();
  const [Product, setProduct] = useState();
  const [Client, setClient] = useState();
  let initstatus = {
    delivered: 0,
    pending: 0,
    process: 0,
    cancel: 0,
  };
  const [status, setStatus] = useState(initstatus);
  useEffect(() => {
    let updatedStatus = { ...initstatus };
    OrderData?.forEach((ele) => {
      if (ele.orderStatus === "Delivered") {
        updatedStatus.delivered++;
      } else if (ele.orderStatus === "Pending") {
        updatedStatus.pending++;
      } else if (ele.orderStatus === "Processing") {
        updatedStatus.process++;
      } else if (ele.orderStatus === "Cancel") {
        updatedStatus.cancel++;
      }
    });

    setStatus(updatedStatus);
  }, [OrderData]);

  const data = [
    ["Order", "Per day"],
    ["delivered", status.delivered],
    ["pending", status.pending],
    ["process", status.process],
    ["cancel", status.cancel],
  ];

  const options = {
    title: "Order",
    is3D: true,
  };

  let cartdata = [
    {
      bgcolor: "#f39c12",
      category: "Orders",
      iconss: ShoppingCartIcon,
      TotalNumber: OrderData?.length,
    },
    {
      bgcolor: "#63bff5",
      category: "Product",
      iconss: InventoryIcon,
      TotalNumber: Product?.length,
    },
    {
      bgcolor: "#dd4b39",
      category: "Clients",
      iconss: Groups2OutlinedIcon,
      TotalNumber: Client?.length,
    },
    {
      bgcolor: "#00a65a",
      category: "Bill",
      iconss: TrendingUpOutlinedIcon,
      TotalNumber: status.delivered,
    },
  ];

  const [totalAmount, setTotalAmount] = useState({});
  useEffect(() => {
    const initTotalAmount = {};
    moment.months().forEach((month) => {
      initTotalAmount[month] = 0;
    });

    OrderData?.forEach((order) => {
      if (order.createdAt) {
        const monthName = moment(order.createdAt).format("MMMM");
        initTotalAmount[monthName] += parseFloat(
          order.BillingDetails["To Pay"]
        );
      }
    });

    setTotalAmount(initTotalAmount);
  }, [OrderData]);
  const chartData = Object.entries(totalAmount).map(([month, amount]) => ({
    month,
    amount,
  }));

  let config = {
    data: chartData,
    yField: "amount",
    xField: "month",
  };

  useEffect(() => {
    if (invoiceContainerRef.current) {
      const dataTableContainer =
        invoiceContainerRef.current.querySelector(".rdt_Table");
      if (dataTableContainer) {
        dataTableContainer.classList.add("printableDataTable");
      }
    }
    getOrderList();
    getAllCategory();
    getAllProduct();
    getAllClients();
  }, []);
  const getAllCategory = async () => {
    const resp = await http.get("/category/getallcategory");

    setCategory(resp.data.data);
  };
  const getAllProduct = async () => {
    const resp = await http.get("/product/getallProduct");

    setProduct(resp.data.data);
  };
  const getAllClients = async () => {
    const resp = await http.get("/client/getallClient");
    setClient(resp.data.data);
  };
  const handlePrint = useReactToPrint({
    content: () => invoiceContainerRef.current,
  });
  const columns = [
    {
      name: "SI NO",
      selector: (row, index) => index + 1,
    },

    {
      name: "ORDER TIME",
      selector: (row) =>
        row?.createdAt ? moment(row?.createdAt).format("DD MMMM YYYY") : "",
    },
    {
      name: "CLIENT NAME",
      selector: (row) => row?.ClientData?.[0]?.clientname,
    },

    {
      name: "STATUS",
      selector: (row) => row?.orderStatus,
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
  const handleInvoice = (id) => {
    navigate("/orderdetails", { state: id });
  };

  return (
    <div className="row ">
      <div className="row m-auto mt-3">
        {cartdata?.map((ele) => (
          <Card
            key={ele}
            text={ele.bgcolor.toLowerCase() === "light" ? "dark" : "white"}
            style={{
              width: "16rem",
              height: "120PX",
              backgroundColor: ele.bgcolor,
            }}
            className="m-auto mb-2 glassBox"
          >
            <Card.Body>
              <div className="row">
                <div className="col-md-6 ">
                  <Card.Title>{ele.TotalNumber}</Card.Title>
                  <Card.Text>{ele.category}</Card.Text>
                </div>
                <div className="col-md-6 glassBox__imgBox">
                  <ele.iconss className="icons" />
                </div>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>

      <p>Recent Order</p>

      <div className="row mt-5" ref={invoiceContainerRef}>
        <DataTable
          columns={columns}
          data={OrderData}
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
