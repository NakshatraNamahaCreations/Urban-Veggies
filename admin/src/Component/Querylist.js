import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Form, Card } from "react-bootstrap";
import { ServicePage } from "../ServicePage";

import Offcanvas from "react-bootstrap/Offcanvas";
import http from "../http.common.function";
import { ImageApiURL } from "../../src/path";
import { useNavigate } from "react-router-dom";

export default function Querylist() {
  let navigate = useNavigate();
  const [QueryData, setQueryData] = useState();
  const [Query, setQuery] = useState("");
  const [clientid, setclientId] = useState();
  const [editQuery, seteditQuery] = useState(false);
  const [EditData, setEditData] = useState();
  const [QueryID, setQueryID] = useState();
  const [ClientsData, setClientsData] = useState();

  const columns = [
    {
      name: "SI. No",
      selector: (row, index) => index + 1,
    },
    {
      name: "Query",
      selector: (row) => row?.ticketsQuery,
    },
    {
      name: "ACTION",
      selector: (row) => (
        <div className="row">
          <span className="hyperlink col-md-3" style={{ cursor: "pointer" }}>
            <i
              onClick={() => handleUpdateQuery(row._id)}
              class="fa-solid fa-pen"
              title="Edit"
              style={{ color: "#ffc107" }}
            ></i>{" "}
            |{" "}
          </span>

          <a
            onClick={() => deleteQuery(row._id)}
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
    getQuery();
  }, []);

  const getQuery = async () => {
    try {
      let Query = await http.get(`/tickets/getallquery`);
      setQueryData(Query.data.data);
    } catch (error) {
      console.log("Error fetching Query data", error);
    }
  };

  const deleteQuery = async (idd) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete this Query?`
    );

    try {
      if (confirmed) {
        let data = await http.post(`/tickets/trashquery/${idd}`);
        if (data.status === 200) {
          alert("Query deleted succesfully ");
          window.location.reload();
        }
      }
    } catch (error) {
      console.log("Query canceled the deletion.");
    }
  };

  const handleUpdateQuery = (id) => {
    navigate("/Tickets", { state: { queryid: id } });
  };

  return (
    <div className="row m-auto">
      <table>
        <thead className="text-center">
          <th className="p-2">SI.No</th>
          <th className="p-2">Query</th>
          <th className="p-2">Action</th>
        </thead>
        <tbody>
          {QueryData?.map((ele, index) => (
            <tr className="text-center">
              <td className="p-2">{index + 1}</td>
              <td className="p-2">{ele.ticketsQuery}</td>
              <td className="p-2 text-center">
                {" "}
                <div className="row m-auto ">
                  <span
                    className="hyperlink col-md-1 "
                    style={{ cursor: "pointer" }}
                  >
                    <i
                      onClick={() => handleUpdateQuery(ele._id)}
                      className="fa-solid fa-pen  "
                      style={{ color: "#ffc107" }}
                    ></i>{" "}
                  </span>
                  <span className="col-md-1 ">|</span>
                  <a
                    onClick={() => deleteQuery(ele._id)}
                    className="hyperlink mx-1 col-md-1  "
                  >
                    <i class="fa fa-trash" style={{ color: "#dc3545" }}></i>
                  </a>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
