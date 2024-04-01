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

export default function DeliverChallanFormat() {
  let location = useLocation();
  const [DeliveryChallanDetails, setDeliveryChallanDetails] = useState();
  const [ProductsDetails, setProductsDetails] = useState();
  let idd = location.state.orderid || null;
  const DeliveryChallanContainerRef = useRef(null);
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
      name: "QUANTITY",
      selector: (row) => row?.qty,
    },
    // {
    //   name: "ITEM PRICE",
    //   selector: (row) => row?.productPrice,
    // },
    {
      name: "Unit",
      selector: (row) => row?.unit,
    },
  ];
  useEffect(() => {
    getDeliveryChallan();
  }, []);
  console.log(idd, "idd");
  const getDeliveryChallan = async () => {
    let data = await http.get(`/order/getbyuser`);
    let filteredData = data.data.OrderData.filter((Ele) => Ele._id === idd);
    setDeliveryChallanDetails(filteredData);
    let pdata = filteredData.flatMap((ele) => ele.Products);
    setProductsDetails(pdata);
  };

  const handleDownload = () => {
    const DeliveryChallanContainer = DeliveryChallanContainerRef.current;

    html2canvas(DeliveryChallanContainer, { scale: 4 })
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

        saveAs(pdf.output("blob"), "DeliveryChallan.pdf");
      })
      .catch((error) => {
        console.error("Error generating PDF:", error);
      });
  };

  const handlePrint = useReactToPrint({
    content: () => DeliveryChallanContainerRef.current,
  });

  let clients = DeliveryChallanDetails?.[0]?.ClientData?.[0];
  return (
    <div className="row">
      {" "}
      <p className="m-auto text-center">Delivery Challan</p>
      <div
        className="col-md-10 p-2 m-auto DeliveryChallan mt-5 "
        ref={DeliveryChallanContainerRef}
      >
        <div className="row p-2">
          <div className="col-md-4">
            <div className="row">
              <h3>Delivery Challan</h3>
              <p>{DeliveryChallanDetails?.[0]?.orderStatus}</p>
            </div>
          </div>
          <div className="col-md-4"></div>
          <div className="col-md-4">
            <div className="row m-auto DeliveryChallan-headi text-end ">
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
              <p className="DeliveryChallan-headi">Date</p>
            </div>
            <div className="col-md-4">
              <p className="DeliveryChallan-headi ">Delivery Challan No</p>
            </div>
            <div className="col-md-4 text-end">
              <p className="row  DeliveryChallan-headi float-end">
                Delivery Challan To
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4">
              <p className="row m-auto">
                {DeliveryChallanDetails?.[0]?.createdAt
                  ? moment(DeliveryChallanDetails?.[0]?.createdAt).format(
                      "DD MMMM YYYY"
                    )
                  : ""}
              </p>
            </div>
            <div className="col-md-4">
              <p className="row m-auto">
                {DeliveryChallanDetails?.[0]?.OrderID}
              </p>
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
        {/* <div className="row shadow-none p-3 mt-5 bg-light rounded  m-auto">
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
        </div> */}
      </div>
      <div className="row m-auto mt-5 p-2">
        <Button
          className="col-md-3 m-auto"
          variant="success"
          onClick={handleDownload}
        >
          Download Delivery Challan{" "}
          <i className="pi pi-cloud-download m-auto"></i>
        </Button>

        <Button
          className="col-md-3 m-auto"
          variant="success"
          onClick={handlePrint}
        >
          Print Delivery Challan <i className="pi pi-print m-auto"></i>
        </Button>
      </div>
    </div>
  );
}
