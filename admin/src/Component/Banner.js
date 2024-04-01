import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Form, Card } from "react-bootstrap";
import { customStyles } from "./data";
import Offcanvas from "react-bootstrap/Offcanvas";
import Modal from "react-bootstrap/Modal";
import { ImageApiURL, ApiURL } from "../../src/path";

import {ServicePage} from "../ServicePage";
export default function Banners() {
  const [showBanners, setshowBanners] = useState(false);
  const [BannerData, setBannerData] = useState();
  const [editbaner, seteditbaner] = useState(false);
  const [bannerImag, setbannerImag] = useState("");
  const [EditbannerImag, setEditbannerImag] = useState("");
  const [BannerID, setBannerID] = useState();
  console.log(EditbannerImag, "EditbannerImag");
  const deleteuser = async (idd) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete this Banner?`
    );

    if (confirmed) {
      ServicePage.handleTrash(idd)
        .then((response) => {
          if (response.status === 200) {
            alert("Banner deleted succesfully ");
            window.location.reload();
          }
        })
        .catch((error) => console.error(error));
    } else {
      console.log("Banner canceled the deletion.");
    }
  };
  const [banner, setbanner] = useState();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = (data) => {
    console.log(data, "data");
    setbanner(data);
    setShow(true);
  };
  useEffect(() => {
    fetchdata();
  }, []);

  const handleSubmit = async () => {
    if (!bannerImag) {
      return alert("Please select Image");
    }
    const formdata = new FormData();
    formdata.append("BannerImage", bannerImag);
    try {
      ServicePage.AddBanner(formdata)
        .then((response) => {
          alert("Banner added Successful!");

          window.location.reload();
        })
        .catch((error) => {
          console.error("Error updating banner ", error);
        });
    } catch (error) {
      console.log(error);
    }
  };
  const handleUpdateBanner = async (id) => {
    try {
      let data = await ServicePage.getBannerById(id);
      console.log(data, "data");
      setEditbannerImag(data.BannerImage || null);
      setBannerID(id);
      setshowBanners(true);
      seteditbaner(true);
    } catch (error) {
      console.log("Error fetching banner data:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      const formdata = new FormData();
      formdata.append("BannerImage", bannerImag);
      ServicePage.UpdateBanner(formdata, BannerID)
        .then(() => {
          alert("Banner Updated Successful!");
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error updating banner ", error);
        });
    } catch (error) {
      console.log(error);
    }
  };
  const fetchdata = async () => {
    let Bnrdata = await ServicePage.getBanner();
    setBannerData(Bnrdata);
  };

  const columns = [
    {
      name: "Banners Image",
      selector: (row) => (
        <>
          <img
            onClick={() => handleShow(row.BannerImage)}
            width={20}
            height={20}
            src={`${ImageApiURL}/Banner/${row.BannerImage}`}
          />
        </>
      ),
    },

    {
      name: "ACTION",
      selector: (row) => (
        <div className="row">
          <span className="hyperlink col-md-3" style={{ cursor: "pointer" }}>
            <i
              onClick={() => handleUpdateBanner(row._id)}
              class="fa-solid fa-pen"
              title="Edit"
              style={{ color: "#ffc107" }}
            ></i>{" "}
            |{" "}
          </span>

          <a className="hyperlink mx-1 col-md-3">
            <i
              onClick={() => deleteuser(row._id)}
              class="fa fa-trash"
              title="Delete"
              style={{ color: "#dc3545" }}
            ></i>
          </a>
        </div>
      ),
    },
  ];

  return (
    <>
      <Card className=" mt-4 p-3">
        <div className="row">
          <div className="col-md-10 m-auto"></div>

          <button
            onClick={() => setshowBanners(true)}
            className="col-md-2 btn_bg p-2 m-auto float-end"
          >
            <i className="pi pi-plus"></i> Add Banners
          </button>
        </div>
      </Card>

      <DataTable
        className="mt-3"
        columns={columns}
        data={BannerData}
        highlightOnHover
        pointerOnHover
        pagination
        selectableRows
        bordered
        customStyles={customStyles}
      />

      <Modal
        show={show}
        onHide={handleClose}
        dialogClassName="fullscreen-modal"
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <img src={`${ImageApiURL}/Banner/${banner}`} alt="Banner" />
        <i className="pi pi-times-circle modelclo" onClick={handleClose}></i>
      </Modal>
      <Offcanvas
        show={showBanners}
        onHide={() => setshowBanners(false)}
        placement="end"
        className="offcan"
      >
        <Offcanvas.Header className="col-md-12 ofheader">
          <div className="title ">
            <div>
              <Offcanvas.Title className=""> Add Banners</Offcanvas.Title>
              <p>Embed Your Product Banners and Crucial Details Instantly</p>
            </div>
            <button onClick={() => setshowBanners(false)} className="closebtn ">
              x
            </button>
          </div>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="row mt-4">
            <div className="col-md-4">
              <Form.Label>Banners Image</Form.Label>
            </div>

            <div className="col-md-8 cateimg p-5">
              {editbaner && (
                <img
                  width={40}
                  height={40}
                  src={`${ImageApiURL}/Banner/${EditbannerImag}`}
                />
              )}
              <Form.Label>
                <i className="pi pi-cloud-upload m-auto"></i>
                <Form.Control
                  onChange={(e) => setbannerImag(e.target.files[0])}
                  className="inpfile"
                  type="file"
                />
                <p className="m-auto">Drag your image here</p>
              </Form.Label>
            </div>
          </div>
        </Offcanvas.Body>
        <div className="col-md-12  ofheader p-3">
          <div className="row">
            <button
              className="col-md-4 btn_bg p-2 m-auto"
              onClick={() => setshowBanners(false)}
            >
              Cancel
            </button>
            {editbaner ? (
              <button
                className="col-md-4 btn_bg save p-2 m-auto btncwhite"
                onClick={handleUpdate}
              >
                Update
              </button>
            ) : (
              <button
                className="col-md-4 btn_bg save p-2 m-auto btncwhite"
                onClick={handleSubmit}
              >
                Save
              </button>
            )}
          </div>
        </div>
      </Offcanvas>
    </>
  );
}
