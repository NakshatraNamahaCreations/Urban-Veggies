import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ProductData } from "./data";
import { ImageApiURL } from "../../src/path";
import http from "../http.common.function";
import { customStyles } from "./data";
import DataTable from "react-data-table-component";
export default function PrductView() {
  const location = useLocation();
  let dataid = location?.state || null;
  console.log(dataid?.id, "dataid");
  const [ProductData, setProductData] = useState();
  const [userData, setuserData] = useState([]);
  useEffect(() => {
    getProducts();
  }, []);
  const getProducts = async () => {
    let Productdata = await http.get(`/product/getproductbyuser/${dataid?.id}`);
    console.log(Productdata.data.data, "ProductData");
    // setProductData(Productdata.data.data);
  };

  const columns = [
    {
      name: "Client Name",
      selector: (row) => {
        let data = row.clientId;
        let startIndex = data.indexOf('"clientname":"') + 14;
        let endIndex = data.indexOf('"', startIndex);
        let clientName = data.slice(startIndex, endIndex);
        return <span>{clientName}</span>;
      },
    },
    {
      name: "Category Name",
      selector: (row) => row.category,
    },

    {
      name: "Product Name",
      selector: (row) => row["productname"],
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
      selector: (row) => row.price,
    },
    {
      name: "Sales Price",
      selector: (row) => row.offerprice,
    },
    {
      name: "Min Quantity",
      selector: (row) => row.minqty,
    },

    {
      name: "ACTION",
      selector: (row) => (
        <div className="row">
          <span
            className="hyperlink col-md-3"
            // onClick={() => handleUpdateProduct(row._id)}
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
            // onClick={() => deleteProduct(row._id)}
            className="hyperlink mx-1 col-md-3"
          >
            <i
              class="fa fa-trash"
              title="Delete"
              style={{ color: "#dc3545" }}
            ></i>
          </a>{" "}
          |
          <a
            // onClick={() => handleDetails(row._id)}
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
  return (
    <>
      {/* <div className="row">
        <h2 className="m-auto mt-3"> Product Details</h2>
        <div key={ProductData?._id} className="row">
          <div className="col-md-6">
            <div className="row">
              <div className="col-md-8">
                <img
                  style={{ width: "100%", height: "400px" }}
                  src={`${ImageApiURL}/Product/${ProductData?.productimage}`}
                />
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <p className="headeingName mb-3 m-auto">
              Category : {ProductData?.category}
            </p>
            <p className="headeingName mb-3 m-auto">
              Product Name : {ProductData?.productname}
            </p>
            <p className="prices mb-3">
              {" "}
              <p className="headeingName m-auto">Price :</p>
              <span className="Price m-auto"> ₹ {ProductData?.price}</span>{" "}
              <p className="saleprice m-auto">₹ {ProductData?.offerprice} </p>
            </p>

            <p className="headeingName">
              About this item : {ProductData?.description}
            </p>
          </div>
        </div>
      </div>

      <DataTable
        className="mt-3"
        columns={columns}
        data={userData}
        highlightOnHover
        pointerOnHover
        pagination
        selectableRows
        bordered
        customStyles={customStyles}
      /> */}
    </>
  );
}
