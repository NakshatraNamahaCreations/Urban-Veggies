import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import { Form, Button } from "react-bootstrap";
import { customStyles } from "./data";

export default function Clients() {
  const invoiceContainerRef = useRef(null);
  const navigate = useNavigate();

  const handleDetails = () => {
    navigate("/ClientView");
  };
  const columns = [
    {
      name: "ID",
      selector: (row) => row["ID"],
    },

    {
      name: "JOINING DATE",
      selector: (row) => row["JOINING DATE"],
    },
    {
      name: "NAME",
      selector: (row) => row["NAME"],
    },

    {
      name: "EMAIL",
      selector: (row) => row["EMAIL"],
    },

    {
      name: "PHONE",
      selector: (row) => row["PHONE"],
    },

    {
      name: "ACTION",
      selector: (row) => (
        <div className="row">
          <a
            onClick={() => handleDetails(row._id)}
            className="hyperlink mx-1 col-md-3"
          >
            <i
              className="pi pi-eye"
              title="view"
              style={{ color: "#63bff5" }}
            ></i>
          </a>
        </div>
      ),
    },
  ];
  useEffect(() => {
    if (invoiceContainerRef.current) {
      const dataTableContainer =
        invoiceContainerRef.current.querySelector(".rdt_Table");
      if (dataTableContainer) {
        dataTableContainer.classList.add("printableDataTable");
      }
    }
  }, []);

  return (
    <div className="">
      <div className="row shadow-sm m-auto p-4 mt-5 bg-light rounded">
        <div className="col-md-5  m-auto">
          <Form.Control
            className="p-2"
            placeholder="Search by name/email/phone..."
          />
        </div>
        <Button className="col-md-2 p-2 m-auto filter">Filter</Button>
        <Button className="col-md-2 m-auto p-2 reset">Reset</Button>
        <div className="col-md-2"></div>
      </div>

      <DataTable
        className="mt-3"
        columns={columns}
        data={ClientsData}
        highlightOnHover
        pointerOnHover
        pagination
        selectableRows
        bordered
        customStyles={customStyles}
      />
    </div>
  );
}
