import React, { useRef, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Form, Card } from "react-bootstrap";
import { Tabldata, customStyles } from "./data";
import { useReactToPrint } from "react-to-print";
import { useNavigate } from "react-router-dom";

export default function Reports() {
  const navigate = useNavigate();
  const invoiceContainerRef = useRef(null);
  const columns = [
    {
      name: "INVOICE NO",
      selector: (row) => row["INVOICE NO"],
    },
    {
      name: "ORDER TIME",
      selector: (row) => row["ORDER TIME"],
    },
    {
      name: "CUSTOMER NAME",
      selector: (row) => row["CUSTOMER NAME"],
    },
    {
      name: "METHOD",
      selector: (row) => row["METHOD"],
    },
    {
      name: "AMOUNT",
      selector: (row) => row["AMOUNT"],
    },
    {
      name: "STATUS",
      selector: (row) => row["STATUS"],
    },
    {
      name: "ACTION",
      selector: (row) => (
        <Form.Select size="sm">
          <option>Delivered</option>
          <option>Pending</option>
          <option>Processing</option>
          <option>Cancel</option>
        </Form.Select>
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
            onClick={() => handleInvoice(row.id)}
          >
            View
          </span>
        </div>
      ),
    },
  ];

  const handlePrint = useReactToPrint({
    content: () => invoiceContainerRef.current,
  });
  const handleInvoice = (id) => {
    navigate("/Invoice", { state: id });
  };
  return (
    <div className="row mt-2 m-auto">
      <h3>Product Sales Reports</h3>
      <Card className=" shadow-sm p-5  m-auto  bg-white rounded m-auto">
        <div className="row mt-3">
          <div className="col-md-2">
            <Form.Label>Category</Form.Label>
            <Form.Select size="sm" className="p-2">
              <option>Electronics</option>
              <option>TVs & Appliances</option>
            </Form.Select>
          </div>
          <div className="col-md-3">
            <Form.Label>Start Date</Form.Label>
            <Form.Control type="date" />
          </div>
          <div className="col-md-7">
            {" "}
            <div className="row">
              <Form.Label>End Date</Form.Label>
              <div className="col-md-5">
                <Form.Control type="date" />
              </div>
              <button className="col-md-3  p-1 m-auto btn_bg">Filter</button>
              <button className="col-md-3  p-1 m-auto btn_bg">Reset</button>
            </div>
          </div>{" "}
        </div>
      </Card>
      <div className="row mt-5 mb-2">
        <div className="col-md-8"></div>
        <div className="col-md-4 m-auto">
          <Form.Control placeholder="Seach here..." />
        </div>
      </div>

      <DataTable
        ref={invoiceContainerRef}
        columns={columns}
        data={Tabldata}
        highlightOnHover
        pointerOnHover
        pagination
        selectableRows
        customStyles={customStyles}
      />
    </div>
  );
}
