import React, { useRef, useEffect, useState } from "react";
import http from "../http.common.function";
import DataTable from "react-data-table-component";
import { Form, Card } from "react-bootstrap";
import { Offersdata, customStyles } from "./data";
import Offcanvas from "react-bootstrap/Offcanvas";
import {ServicePage} from "../ServicePage";

export default function Offers() {
  const [showOffers, setshowOffers] = useState(false);
  const [CategoryData, setCategoryData] = useState();
  const [SelectCategory, setSelectCategory] = useState("");
  const [SearchValue, setSearchValue] = useState("");

  const [OfferData, setOfferData] = useState();
  const [Offer, setOffer] = useState("");
  const deleteuser = () => {};
  const edit = () => {};
  useEffect(() => {
    fetchCategoryData();
  }, []);

  useEffect(() => {
    fetchCategoryData();
    getOffer();
  }, [SearchValue]);
  async function fetchCategoryData() {
    let data = await ServicePage.getcategory();
    setCategoryData(data);
  }
  const columns = [
    {
      name: "offer",
      selector: (row) => <span>{row.Offer}%</span>,
    },
    {
      name: "Category",
      selector: (row) => row.category,
    },

    {
      name: "ACTION",
      selector: (row) => (
        <div className="row">
          <span
            className="hyperlink col-md-3"
            onClick={() => edit(row)}
            style={{ cursor: "pointer" }}
          >
            <i
              class="fa-solid fa-pen"
              title="Edit"
              style={{ color: "#ffc107" }}
            ></i>{" "}
            |{" "}
          </span>

          <a
            onClick={() => deleteOffer(row._id)}
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

  const AddOFFer = async () => {
    if (!SelectCategory || !Offer) {
      return alert("Please select Image");
    }
    try {
      const formdata = new FormData();
      formdata.append("Offer", Offer);
      formdata.append("category", SelectCategory);

      let response = await http.post(`/addOffer`, formdata, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        alert("Offer Added Succesfully");
        window.location.reload("");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getOffer = async () => {
    try {
      let offers = await http.get(`/getOffer`, {
        params: { searchValue: SearchValue },
      });
      setOfferData(offers.data.data);
    } catch (error) {
      console.log("Error fetching category data", error);
    }
  };

  const deleteOffer = async (idd) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete this offer?`
    );

    if (confirmed) {
      let data = await http.post(`/trash/${idd}`);
      if (data.status === 200) {
        alert("offer deleted succesfully ");
        window.location.reload();
      }
    } else {
      console.log("offer canceled the deletion.");
    }
  };
  return (
    <>
      <Card className=" mt-4 p-3">
        <div className="row">
          <div className="col-md-10 m-auto"></div>

          <button
            onClick={() => setshowOffers(true)}
            className="col-md-2 btn_bg p-2 m-auto float-end"
          >
            <i className="pi pi-plus"></i> Add Offers
          </button>
        </div>
      </Card>

      <div className="row mt-4">
        <div className="col-md-9"></div>
        <div className="col-md-3 m-auto float-end">
          <Form.Control
            className=""
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search Offers..."
          />
        </div>
      </div>
      <DataTable
        className="mt-3"
        columns={columns}
        data={OfferData}
        highlightOnHover
        pointerOnHover
        pagination
        selectableRows
        bordered
        customStyles={customStyles}
      />
      <Offcanvas
        show={showOffers}
        onHide={() => setshowOffers(false)}
        placement="end"
        className="offcan"
      >
        <Offcanvas.Header className="col-md-12 ofheader">
          <div className="title ">
            <div>
              <Offcanvas.Title className=""> Add Offers</Offcanvas.Title>
              <p>Embed Your Product Offers and Crucial Details Instantly</p>
            </div>
            <button onClick={() => setshowOffers(false)} className="closebtn ">
              x
            </button>
          </div>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="row">
            <div className="col-md-4">
              <Form.Label>Offer</Form.Label>
            </div>
            <div className="col-md-8">
              <Form.Control
                onChange={(e) => setOffer(e.target.value)}
                placeholder="Enter Offers"
              />
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-md-4">
              <Form.Label>Select Category </Form.Label>
            </div>
            <div className="col-md-8">
              <Form.Select
                className="p-2"
                onChange={(e) => setSelectCategory(e.target.value)}
              >
                {CategoryData?.map((ele) => (
                  <option>{ele?.category}</option>
                ))}
              </Form.Select>
            </div>
          </div>
        </Offcanvas.Body>
        <div className="col-md-12  ofheader p-3">
          <div className="row">
            <button
              className="col-md-4 btn_bg p-2 m-auto"
              onClick={() => setshowOffers(false)}
            >
              Cancel
            </button>
            <button
              className="col-md-4 btn_bg save p-2 m-auto btncwhite"
              onClick={AddOFFer}
            >
              Save
            </button>
          </div>
        </div>
      </Offcanvas>
    </>
  );
}
