import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import { Form, Button, Card } from "react-bootstrap";
import { customStyles } from "./data";
import Offcanvas from "react-bootstrap/Offcanvas";

import http from "../http.common.function";

export default function Clients() {
  let InitialData = {
    ClientName: "",
    Addres: "",
    State: "",
    City: "",
    Contact: "",
    alernativeContact: "",
    Email: "",
    password: "",
  };
  const [showClient, setshowClient] = useState(false);
  const [ClientsData, setClientsData] = useState();
  const [ClientData, setClientData] = useState(InitialData);
  const [editClient, seteditClient] = useState(false);
  const [EditData, setEditData] = useState();
  const [ClientID, setClientID] = useState();
  const [SearchValue, setSearchValue] = useState("");
  const handleChange = (e) => {
    let { name, value } = e.target;
    setClientData((prev) => ({ ...prev, [name]: value }));
  };
  const invoiceContainerRef = useRef(null);
  const navigate = useNavigate();
  const handleDetails = (id, clientname) => {
    navigate("/ClientView", { state: { id: id, name: clientname } });
  };
  const columns = [
    {
      name: "NAME",
      selector: (row) => row?.clientname || null,
    },

    {
      name: "EMAIL",
      selector: (row) => row?.email,
    },

    {
      name: "PHONE",
      selector: (row) => row?.contact,
    },
    {
      name: "ACTION",
      selector: (row) => (
        <div className="row">
          <span className="hyperlink col-md-3" style={{ cursor: "pointer" }}>
            <i
              onClick={() => handleUpdatecategory(row._id)}
              class="fa-solid fa-pen"
              title="Edit"
              style={{ color: "#ffc107" }}
            ></i>{" "}
            |{" "}
          </span>

          <a
            onClick={() => deleteClients(row._id)}
            className="hyperlink mx-1 col-md-3"
          >
            <i
              class="fa fa-trash"
              title="Delete"
              style={{ color: "#dc3545" }}
            ></i>
          </a>
          <a
            onClick={() => handleDetails(row._id, row?.clientname)}
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
    getclient();
  }, [SearchValue]);

  useEffect(() => {
    if (invoiceContainerRef.current) {
      const dataTableContainer =
        invoiceContainerRef.current.querySelector(".rdt_Table");
      if (dataTableContainer) {
        dataTableContainer.classList.add("printableDataTable");
      }
    }
  }, []);
  const handleAddNewClient = () => {
    setClientData("");
    seteditClient(false);
    setClientID(null);
    setEditData({});
    setshowClient(true);
  };

  const handleUpdate = async () => {
    try {
      let response = await http.put(
        `client/editClient/${ClientID}`,
        {
          clientname: ClientData.ClientName,
          email: ClientData.Email,
          password: ClientData.password,
          contact: ClientData.Contact,
          altcontact: ClientData.alernativeContact,
          city: ClientData.City,
          state: ClientData.State,
          address: ClientData.Addres,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        alert("Client updated successfully!");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating Client:", error);
    }
  };
  const getclient = async () => {
    try {
      let client = await http.get(`/client/getClient`, {
        params: { searchValue: SearchValue },
      });

      setClientsData(client.data.data);
    } catch (error) {
      console.log("Error fetching category data", error);
    }
  };
  const deleteClients = async (idd) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete this clients?`
    );

    if (confirmed) {
      let data = await http.post(`/client/trash/${idd}`);
      if (data.status === 200) {
        alert("clients deleted succesfully ");
        window.location.reload();
      }
    } else {
      console.log("clients canceled the deletion.");
    }
  };
  const AddClient = async () => {
    try {
      let response = await http.post(
        `client/addClient`,
        {
          clientname: ClientData.ClientName,
          email: ClientData.Email,
          password: ClientData.password,
          contact: ClientData.Contact,
          altcontact: ClientData.alernativeContact,
          city: ClientData.City,
          state: ClientData.State,
          address: ClientData.Addres,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        alert("Client Added Succesfully");
        window.location.reload("");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleUpdatecategory = async (id) => {
    try {
      let client = await http.get(`/client/getbyClientid/${id}`);
      setClientID(id);
      setEditData(client.data.data);
      setshowClient(true);
      seteditClient(true);
    } catch (error) {
      console.log("Error fetching category data:", error);
    }
  };

  return (
    <div className="">
      <Card className=" mt-4 p-3">
        <div className="row">
          <div className="col-md-10 m-auto"></div>

          <button
            onClick={handleAddNewClient}
            className="col-md-2 btn_bg p-2 m-auto float-end"
          >
            <i className="pi pi-plus"></i> Add Client
          </button>
        </div>
      </Card>

      <div className="row shadow-sm m-auto p-4 mt-5 rounded">
        <div className="col-md-8"></div>
        <div className="col-md-4  m-auto">
          <Form.Control
            className="p-2"
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search by client..."
          />
        </div>
      </div>
      <Offcanvas
        show={showClient}
        onHide={() => setshowClient(false)}
        placement="end"
        className="offcan"
      >
        <Offcanvas.Header className="col-md-12 ofheader">
          <div className="title ">
            <div>
              <Offcanvas.Title className="">
                {editClient && ClientID !== null
                  ? "Modify Client"
                  : "Add Client"}{" "}
              </Offcanvas.Title>
              <p>Embed Your Product Client and Crucial Details Instantly</p>
            </div>
            <button onClick={() => setshowClient(false)} className="closebtn ">
              x
            </button>
          </div>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="row mb-3">
            <div className="col-md-4">
              <Form.Label>Name</Form.Label>
            </div>
            <div className="col-md-8">
              <Form.Control
                defaultValue={
                  editClient && ClientID !== null
                    ? EditData.clientname
                    : ClientData.ClientName
                }
                onChange={handleChange}
                name="ClientName"
                placeholder="Client name"
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-4">
              <Form.Label> Email</Form.Label>
            </div>
            <div className="col-md-8">
              <Form.Control
                defaultValue={
                  editClient && ClientID !== null
                    ? EditData.email
                    : ClientData.Email
                }
                onChange={handleChange}
                name="Email"
                placeholder="Email"
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-4">
              <Form.Label>Password</Form.Label>
            </div>
            <div className="col-md-8">
              <Form.Control
                defaultValue={
                  editClient && ClientID !== null
                    ? EditData.password
                    : ClientData.password
                }
                onChange={handleChange}
                name="password"
                placeholder="Password"
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-4">
              <Form.Label> Contact</Form.Label>
            </div>
            <div className="col-md-8">
              <Form.Control
                defaultValue={
                  editClient && ClientID !== null
                    ? EditData.contact
                    : ClientData.Contact
                }
                onChange={handleChange}
                name="Contact"
                placeholder="Contact"
              />
            </div>
          </div>{" "}
          <div className="row mb-3">
            <div className="col-md-4">
              <Form.Label>Alernative Contact</Form.Label>
            </div>
            <div className="col-md-8">
              <Form.Control
                defaultValue={
                  editClient && ClientID !== null
                    ? EditData.altcontact
                    : ClientData.alernativeContact
                }
                onChange={handleChange}
                name="alernativeContact"
                placeholder="Alernative Contact"
              />
            </div>
          </div>{" "}
          <div className="row mb-3">
            <div className="col-md-4">
              <Form.Label> State</Form.Label>
            </div>
            <div className="col-md-8">
              <Form.Control
                defaultValue={
                  editClient && ClientID !== null
                    ? EditData.state
                    : ClientData.State
                }
                onChange={handleChange}
                name="State"
                placeholder="State"
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-4">
              <Form.Label> City</Form.Label>
            </div>
            <div className="col-md-8">
              <Form.Control
                defaultValue={
                  editClient && ClientID !== null
                    ? EditData.city
                    : ClientData.City
                }
                onChange={handleChange}
                placeholder="City"
                name="City"
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-4">
              <Form.Label> Address</Form.Label>
            </div>
            <div className="col-md-8">
              <Form.Control
                as="textarea"
                defaultValue={
                  editClient && ClientID !== null
                    ? EditData.address
                    : ClientData.Addres
                }
                onChange={handleChange}
                placeholder="Address"
                name="Addres"
              />
            </div>
          </div>
        </Offcanvas.Body>
        <div className="col-md-12  ofheader p-3">
          <div className="row">
            <button
              className="col-md-4 btn_bg p-2 m-auto"
              onClick={() => setshowClient(false)}
            >
              Cancel
            </button>
            {editClient && ClientID !== null ? (
              <button
                className="col-md-4 btn_bg save p-2 m-auto btncwhite"
                onClick={handleUpdate}
              >
                Save Changes
              </button>
            ) : (
              <button
                className="col-md-4 btn_bg save p-2 m-auto btncwhite"
                onClick={AddClient}
              >
                Save
              </button>
            )}
          </div>
        </div>
      </Offcanvas>
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
