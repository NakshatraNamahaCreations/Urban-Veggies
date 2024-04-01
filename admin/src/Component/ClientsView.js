import React, { useState } from "react";
import { Tabldata, customStyles } from "./data";
import DataTable from "react-data-table-component";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import http from "../http.common.function";
import { ImageApiURL } from "../../src/path";

export default function ClientsView() {
  const location = useLocation();
  let userdata = location.state || null;

  const [ClientsData, setClientsData] = useState();
  const [viewdata, setViewData] = useState();
  const [ViewMode, setViewMode] = useState(false);
  const handleDetails = (data) => {
    setViewData(data);
    setViewMode(true);
  };
  const columns = [
    {
      name: "Category Name",
      selector: (row) => row.category || null,
    },

    {
      name: "Product Name",
      selector: (row) => row["productname"] || null,
    },
    {
      name: "ProductImage",
      selector: (row) => (
        <>
          {console.log(row?.productimage, "ImageApiURL")}
          <img
            width={50}
            height={50}
            src={`${ImageApiURL}/Product/${row?.productimage}`}
          />
        </>
      ),
    },

    {
      name: "Price",
      selector: (row) => row.price || null,
    },
    {
      name: "Sales Price",
      selector: (row) => row.offerprice || null,
    },
    {
      name: "Min Quantity",
      selector: (row) => row.minqty || null,
    },

    {
      name: "ACTION",
      selector: (row) => (
        <div className="row">
          <a
            onClick={() => handleDetails(row)}
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
  }, []);

  const getclient = async () => {
    try {
      let client = await http.get(`/product/getproductbyuser/${userdata.id}`);
      setClientsData(client.data.data);
    } catch (error) {
      console.log("Error fetching category data", error);
    }
  };
  console.log(viewdata, "viewdata");
  return (
    <div className="mt-3">
      {!ViewMode ? (
        <div className="row mt-5">
          <h4>Product Details for Client {userdata?.name}</h4>
          <DataTable
            columns={columns}
            data={ClientsData}
            highlightOnHover
            pointerOnHover
            pagination
            selectableRows
            customStyles={customStyles}
          />
        </div>
      ) : (
        <>
          <div className="row">
            <h2 className="m-auto mt-3"> Product Details</h2>
            <div key={viewdata?._id} className="row">
              <div className="col-md-6">
                <div className="row">
                  <div className="col-md-8">
                    <img
                      style={{ width: "100%", height: "400px" }}
                      src={`${ImageApiURL}/Product/${viewdata?.productimage}`}
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <p className="headeingName mb-3 m-auto">
                  Category : {viewdata?.category}
                </p>
                <p className="headeingName mb-3 m-auto">
                  Product Name : {viewdata?.productname}
                </p>
                <p className="headeingName mb-3 m-auto">
                  Minimu Quantity : {viewdata?.minqty}
                </p>
                <p className="headeingName mb-3 m-auto">
                  GST : {viewdata?.GST}%
                </p>
                <p className="headeingName mb-3 m-auto">
                  Unit : 1/{viewdata?.unit}
                </p>

                <p className="prices mb-3">
                  {" "}
                  <p className="headeingName m-auto">Price :</p>
                  <span className="Price m-auto">
                    {" "}
                    ₹ {viewdata?.price}
                  </span>{" "}
                  <p className="saleprice m-auto">₹ {viewdata?.offerprice} </p>
                </p>

                <p className="headeingName">
                  About this item : {viewdata?.description}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
