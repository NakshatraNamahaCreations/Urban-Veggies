import React, { useRef, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Form, Card, Button } from "react-bootstrap";
import { Tabldata, customStyles } from "./data";
import { useReactToPrint } from "react-to-print";
import { Await, useLocation, useNavigate } from "react-router-dom";
import http from "../http.common.function";
import { ImageApiURL } from "../../src/path";
import moment from "moment";
export default function OrderDetails() {
  const invoiceContainerRef = useRef(null);
  const location = useLocation();
  let userdata = location.state || null;
  const [OrderData, setOrderData] = useState();

  const [ProductsDetails, setProductsDetails] = useState();
  const [Product, setProduct] = useState();
  const [Category, setCategory] = useState();

  useEffect(() => {
    if (invoiceContainerRef.current) {
      const dataTableContainer =
        invoiceContainerRef.current.querySelector(".rdt_Table");
      if (dataTableContainer) {
        dataTableContainer.classList.add("printableDataTable");
      }
    }
  }, []);

  const handlePrint = useReactToPrint({
    content: () => invoiceContainerRef.current,
  });

  useEffect(() => {
    getOrderList();
    getAllCategory();
  }, []);
  const getAllCategory = async () => {
    const resp = await http.get("/category/getallcategory");
    setCategory(resp.data.data);
  };

  const columns = [
    {
      name: "SI. NO.",
      selector: (row, index) => index + 1,
    },

    {
      name: "PRODUCT NAME",
      selector: (row) => row?.productname,
    },
    {
      name: "PRODUCT CATEGORY",
      selector: (row) => row?.productCategory,
    },
    {
      name: "PRODUCT IMAGE",

      selector: (row) => {
        let data = Product?.find((product) => product._id === row.ProductId);

        return (
          <img
            width={50}
            height={50}
            src={`${ImageApiURL}/Product/${data?.productimage}`}
          />
        );
      },
    },
    {
      name: "QUANTITY",
      selector: (row) => row?.qty,
    },
    {
      name: "ITEM PRICE",
      selector: (row) => row?.productPrice,
    },
    {
      name: "Unit",
      selector: (row) => row?.unit,
    },
  ];

  const getOrderList = async () => {
    try {
      let order = await http.get(`/order/getbyorderid/${userdata}`);
      let data = order.data.data;
      setOrderData(data);
      let productdata = await http.get(`/product/getallProduct`);
      setProduct(productdata.data.data);
      setProductsDetails(data.Products);
    } catch (error) {
      console.log("Error fetching category data", error);
    }
  };
  console.log(OrderData, "OrderData");
  return (
    <div className="row m-auto">
      <div className="row shadow-none p-3 mt-5 bg-light rounded  m-auto">
        <div className="row p-2">
          <div className="col-md-3 m-auto">Order ID</div>

          <div className="col-md-3 m-auto">Order Status</div>
          <div className="col-md-2 m-auto">Shipping Cost</div>
          <div className="col-md-2 m-auto">Total Amount</div>
        </div>
        <div className="row p-2">
          <div className="col-md-3 m-auto">{OrderData?.OrderID}</div>
          <div className="col-md-3 m-auto">{OrderData?.orderStatus}</div>
          <div className="col-md-2 m-auto">
            {OrderData?.BillingDetails?.handingFeeIncGST}
          </div>
          <div className="col-md-2 m-auto">
            {OrderData?.BillingDetails?.finalPrice}
          </div>
        </div>
      </div>
      <div className="row ">
        <p className="headeingName">Order</p>
      </div>

      <div className="row mt-5" ref={invoiceContainerRef}>
        <DataTable
          columns={columns}
          data={ProductsDetails}
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
