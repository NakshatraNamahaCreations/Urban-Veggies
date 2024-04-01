import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Form, Card } from "react-bootstrap";
import { ServicePage } from "../ServicePage";
import { customStyles } from "./data";
import Offcanvas from "react-bootstrap/Offcanvas";
import http from "../http.common.function";
import { ImageApiURL } from "../../src/path";

export default function DeliveryCharge() {
  const [DeliveryChargeData, setDeliveryChargeData] = useState();
  const [DeliveryCharge, setDeliveryCharge] = useState("");
  const [clientid, setclientId] = useState();
  const [editDeliveryCharge, seteditDeliveryCharge] = useState(false);
  const [EditData, setEditData] = useState();
  const [DeliveryChargeID, setDeliveryChargeID] = useState();
  const [ClientsData, setClientsData] = useState();
  const columns = [
    {
      name: "Delivery Charge",
      selector: (row) => row?.dlcharge,
    },
    {
      name: "CLIENT NAME",
      selector: (row) => row.ClientData?.[0]?.clientname,
    },
    {
      name: "ACTION",
      selector: (row) => (
        <div className="row">
          <span className="hyperlink col-md-3" style={{ cursor: "pointer" }}>
            <i
              onClick={() => handleUpdateDeliveryCharge(row._id)}
              class="fa-solid fa-pen"
              title="Edit"
              style={{ color: "#ffc107" }}
            ></i>{" "}
            |{" "}
          </span>

          <a
            onClick={() => deleteDeliveryCharge(row._id)}
            className="hyperlink mx-1 col-md-3"
          >
            <i
              class="fa fa-trash"
              title="Delete"
              style={{ color: "#dc3545" }}
            ></i>
          </a>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getDeliveryCharge();
    getAllClient();
  }, [DeliveryChargeData]);
  const getAllClient = async () => {
    let client = await ServicePage.getAllClient();
    setClientsData(client);
  };
  const AddDeliveryCharge = async () => {
    try {
      let response = await http.post(
        `/adddlcharge`,
        { dlcharge: DeliveryCharge, ClientId: clientid },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        alert("Delivery Charge Added Succesfully");
        window.location.reload("");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getDeliveryCharge = async () => {
    try {
      let DeliveryCharge = await http.get(`/getbyuser`);

      setDeliveryChargeData(DeliveryCharge.data.data);
    } catch (error) {
      console.log("Error fetching DeliveryCharge data", error);
    }
  };

  const deleteDeliveryCharge = async (idd) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete this DeliveryCharge?`
    );

    try {
      if (confirmed) {
        let data = await http.post(`/trash/${idd}`);
        if (data.status === 200) {
          alert("DeliveryCharge deleted succesfully ");
          window.location.reload();
        }
      }
    } catch (error) {
      console.log("DeliveryCharge canceled the deletion.");
    }
  };

  const handleUpdateDeliveryCharge = async (id) => {
    try {
      let DeliveryCharge = await http.get(`/getbyiddlcharge/${id}`);
      setDeliveryChargeID(id);
      setEditData(DeliveryCharge.data.data);
      seteditDeliveryCharge(true);
    } catch (error) {
      console.log("Error fetching Delivery Charge data:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      setDeliveryCharge("");
      seteditDeliveryCharge(false);
      setDeliveryChargeID(null);
      setEditData({});

      let response = await http.put(
        `/editdlcharge/${DeliveryChargeID}`,
        { dlcharge: DeliveryCharge, ClientId: clientid },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        alert("Delivery Charge updated successfully!");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating Delivery Charge:", error);
    }
  };

  return (
    <>
      <Card className=" mt-4 p-3">
        <div className="row">
          <div className="col-md-4 m-auto">
            <Form.Control
              defaultValue={
                editDeliveryCharge && DeliveryChargeID !== null
                  ? EditData.dlcharge
                  : DeliveryCharge
              }
              onChange={(e) => setDeliveryCharge(e.target.value)}
              placeholder="Delivery Charge"
            />
          </div>
          <div className="col-md-4">
            <Form.Select
              defaultValue={
                editDeliveryCharge && DeliveryChargeID !== null
                  ? EditData.ClientId
                  : clientid
              }
              size="sm"
              onChange={(e) => setclientId(e.target.value)}
            >
              <option disabled>Choose Client</option>
              {ClientsData?.map((client) => (
                <option value={client._id}>{client.clientname}</option>
              ))}
            </Form.Select>
          </div>
          <div className="col-md-4">
            <div className="row">
              {editDeliveryCharge && DeliveryChargeID !== null ? (
                <button
                  className="col-md-4 btn_bg save p-2 m-auto btncwhite"
                  onClick={handleUpdate}
                >
                  Update
                </button>
              ) : (
                <button
                  className="col-md-4 btn_bg save p-2 m-auto btncwhite"
                  onClick={AddDeliveryCharge}
                >
                  Save
                </button>
              )}
            </div>
          </div>
        </div>
      </Card>

      <DataTable
        className="mt-3"
        columns={columns}
        data={DeliveryChargeData}
        highlightOnHover
        pointerOnHover
        pagination
        selectableRows
        bordered
        customStyles={customStyles}
      />
    </>
  );
}
