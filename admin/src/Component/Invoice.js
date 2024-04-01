import React, { useEffect, useRef, useState } from "react";
import DataTable from "react-data-table-component";
import { Button, Card } from "react-bootstrap";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import { useReactToPrint } from "react-to-print";
import { useLocation } from "react-router-dom";
import http from "../http.common.function";
import moment from "moment";
import { ImageApiURL } from "../../src/path";
export default function Invoice() {
  let location = useLocation();
  const [InvoiceDetails, setInvoiceDetails] = useState();
  const [ProductsDetails, setProductsDetails] = useState();
  const [Product, setProduct] = useState();
  let idd = location.state.orderid || null;
  const invoiceContainerRef = useRef(null);
  const columns = [
    {
      name: "SI. NO.",
      selector: (row, index) => index + 1,
    },

    {
      name: "PRODUCT NAME",
      selector: (row) => row?.productname,
    },
    // {
    //   name: "PRODUCT IMAGE",

    //   selector: (row) => {
    //     let data = Product?.find((product) => product._id === row.ProductId);
    //     return (
    //       <img
    //         width={50}
    //         height={50}
    //         src={`${ImageApiURL}/Product/${data?.productimage}`}
    //       />
    //     );
    //   },
    // },
    {
      name: "PRODUCT CATEGORY",
      selector: (row) => row?.productCategory,
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

  useEffect(() => {
    getInvoice();
  }, []);
  console.log(idd, "idd");
  const getInvoice = async () => {
    let data = await http.get(`/order/getbyuser`);
    let filteredData = data.data.OrderData.filter((Ele) => Ele._id === idd);
    setInvoiceDetails(filteredData);
    let pdata = filteredData.flatMap((ele) => ele.Products);
    setProductsDetails(pdata);
    let productdata = await http.get(`/product/getallProduct`);
    setProduct(productdata.data.data);
  };

  const handleDownload = () => {
    const invoiceContainer = invoiceContainerRef.current;

    html2canvas(invoiceContainer, { scale: 4 })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        pdf.addImage(
          imgData,
          "PNG",
          0,
          0,
          pdfWidth,
          pdfHeight,
          undefined,
          "FAST"
        );

        saveAs(pdf.output("blob"), "invoice.pdf");
      })
      .catch((error) => {
        console.error("Error generating PDF:", error);
      });
  };

  const handlePrint = useReactToPrint({
    content: () => invoiceContainerRef.current,
  });

  let GrandTotal = InvoiceDetails?.[0]?.BillingDetails;

  let clients = InvoiceDetails?.[0]?.ClientData?.[0];
  return (
    <div className="row">
      {" "}
      <p className="m-auto text-center">Invoice</p>
      <div
        className="col-md-10 p-2 m-auto invoice mt-5 "
        ref={invoiceContainerRef}
      >
        <div className="row p-2">
          <div className="col-md-4">
            <div className="row">
              <h3>INVOICE</h3>
              <p>{InvoiceDetails?.[0]?.orderStatus}</p>
            </div>
          </div>
          <div className="col-md-4"></div>
          <div className="col-md-4">
            <div className="row m-auto invoice-headi text-end ">
              <p className="m-0"> BILLED BY</p>
              <span>Urban Veggies</span>
            </div>
            <div className="row text-end">
              Urban Veggies #1/1, 2nd Floor, Shamraj building MN Krishnarao Road
              Mahadevapura Outer Ring Road, Banglore 560048 GSTN :
              29EIXPK0545M1ZE
            </div>
          </div>
        </div>
        <div className="row mt-3 p-2">
          <div className="row">
            <div className="col-md-4">
              <p className="invoice-headi">Date</p>
            </div>
            <div className="col-md-4">
              <p className="invoice-headi ">Invoice No</p>
            </div>
            <div className="col-md-4 text-end">
              <p className="row  invoice-headi float-end">Invoice To</p>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4">
              <p className="row m-auto">
                {InvoiceDetails?.[0]?.createdAt
                  ? moment(InvoiceDetails?.[0]?.createdAt).format(
                      "DD MMMM YYYY"
                    )
                  : ""}
              </p>
            </div>
            <div className="col-md-4">
              <p className="row m-auto">{InvoiceDetails?.[0]?.OrderID}</p>
            </div>
            <div className="col-md-4 text-end">
              <p className="row m-auto">
                {clients?.clientname} {clients?.email} {clients?.altcontact}{" "}
                {clients?.city} {clients?.state} {clients?.address}
              </p>
            </div>
          </div>
        </div>

        <div className="row p-2">
          <DataTable
            title="Order List"
            columns={columns}
            data={ProductsDetails}
            highlightOnHover
            pointerOnHover
          />
        </div>
        <div className="row shadow-none p-3 mt-5 bg-light rounded  m-auto">
          <div className="row p-2">
            <div className="col-md-3 m-auto">Payment Method</div>
            <div className="col-md-2 m-auto">Shipping Cost</div>
            <div className="col-md-2 m-auto">Total Amount</div>
          </div>
          <div className="row p-2">
            <div className="col-md-3 m-auto">Cash</div>
            <div className="col-md-2 m-auto">
              {GrandTotal?.handingFeeIncGST}
            </div>

            <div className="col-md-2 m-auto">{GrandTotal?.finalPrice}</div>
          </div>
        </div>
      </div>
      <div className="row m-auto mt-5 p-2">
        <Button
          className="col-md-3 m-auto"
          variant="success"
          onClick={handleDownload}
        >
          Download invoice <i className="pi pi-cloud-download m-auto"></i>
        </Button>

        <Button
          className="col-md-2 m-auto"
          variant="success"
          onClick={handlePrint}
        >
          Print invoice <i className="pi pi-print m-auto"></i>
        </Button>
      </div>
    </div>
  );
}
