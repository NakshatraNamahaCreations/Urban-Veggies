import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import { Form, Button, Card } from "react-bootstrap";
import { useReactToPrint } from "react-to-print";
import { customStyles } from "./data";
import Offcanvas from "react-bootstrap/Offcanvas";
import http from "../http.common.function";
import { ServicePage } from "../ServicePage";
import { ImageApiURL } from "../../src/path";
export default function Product() {
  const [Pimage, setPimage] = useState("");
  const [ProductData, setProductData] = useState();
  const [editProduct, seteditProduct] = useState(false);
  const [EditData, setEditData] = useState();
  const [ProductID, setProductID] = useState();
  const [SearchValue, setSearchValue] = useState("");
  const [showProduct, setshowProduct] = useState(false);
  const [ClientsData, setClientsData] = useState();

  const [Category, setCategory] = useState();
  let InitialData = {
    Category: "",
    Productname: "",
    Offerprice: "",
    Price: "",
    Description: "",
    GST: "",
    Minqty: "",
    Maxqty: "",
    ClientId: "",
  };

  const invoiceContainerRef = useRef(null);
  const navigate = useNavigate();

  const handleDetails = (id) => {
    navigate("/PrductView", { state: { id: id } });
  };

  const [FormProductData, setFormProductData] = useState(InitialData);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const columns = [
    {
      name: "Client Name",
      selector: (row) => row.ClientData[0]?.clientname || null,
    },
    {
      name: "Category Name",
      selector: (row) => row.CategoryData[0]?.category || null,
    },

    {
      name: "Product Name",
      selector: (row) => row["productname"] || null,
    },
    {
      name: "ProductImage",
      selector: (row) => (
        <>
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
      selector: (row) => {
        return (
          <div className="row">
            <span
              className="hyperlink col-md-3"
              onClick={() => handleUpdateProduct(row._id)}
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
              onClick={() => deleteProduct(row._id)}
              className="hyperlink mx-1 col-md-3"
            >
              <i
                class="fa fa-trash"
                title="Delete"
                style={{ color: "#dc3545" }}
              ></i>
            </a>{" "}
          </div>
        );
      },
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

  const handlePrint = useReactToPrint({
    content: () => invoiceContainerRef.current,
  });
  const handleInvoice = (id) => {
    navigate("/Invoice", { state: id });
  };
  const handleSubmit = () => {};

  useEffect(() => {
    fetchGetData();
  }, []);
  useEffect(() => {
    getProduct();
  }, [SearchValue]);
  let fetchGetData = async () => {
    let data = await ServicePage.getcategory();
    let client = await ServicePage.getAllClient();

    setCategory(data);
    setClientsData(client);
  };
  console.log(FormProductData, "FormProductData");

  const AddProduct = async () => {
    try {
      const formdata = new FormData();
      formdata.append("clientId", FormProductData.ClientId);
      formdata.append("productimage", Pimage);
      formdata.append("CategoryId", FormProductData.Category);
      formdata.append("productname", FormProductData.Productname);
      formdata.append("offerprice", FormProductData.Offerprice);
      formdata.append("price", FormProductData.Price);
      formdata.append("description", FormProductData.Description);
      formdata.append("GST", FormProductData.GST);
      formdata.append("minqty", FormProductData.Minqty);
      formdata.append("maxqty", FormProductData.Maxqty);
      formdata.append("unit", FormProductData.Unit);

      let response = await http.post(`/product/addProduct`, formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200) {
        alert("Product Added Successfully");
        window.location.reload("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async () => {
    try {
      const formdata = new FormData();
      formdata.append("productimage", Pimage);
      formdata.append("CategoryId", FormProductData.Category);
      formdata.append("productname", FormProductData.Productname);
      formdata.append("offerprice", FormProductData.Offerprice);
      formdata.append("price", FormProductData.Price);
      formdata.append("description", FormProductData.Description);
      formdata.append("GST", FormProductData.GST);
      formdata.append("clientId", FormProductData.ClientId);
      formdata.append("minqty", FormProductData.Minqty);
      formdata.append("unit", FormProductData.Unit);
      let response = await http.put(
        `/product/editProduct/${ProductID}`,
        formdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        alert("Product updated successfully!");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating Product:", error);
    }
  };
  const handleUpdateProduct = async (id) => {
    try {
      let category = await http.get(`/product/getbyProductid/${id}`);
      setProductID(id);
      setEditData(category.data.data);
      setshowProduct(true);
      seteditProduct(true);
    } catch (error) {
      console.log("Error fetching category data:", error);
    }
  };

  const handleAddNewProduct = () => {
    setFormProductData("");
    setPimage(null);
    seteditProduct(false);
    setProductID(null);
    setEditData({});
    setshowProduct(true);
  };

  const getProduct = async () => {
    try {
      let product = await http.get(`/product/getbyuser`, {
        params: { searchValue: SearchValue },
      });
      setProductData(product.data.productData);
    } catch (error) {
      console.log("Error fetching category data", error);
    }
  };

  const deleteProduct = async (idd) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete this product?`
    );

    if (confirmed) {
      let data = await http.post(`/product/trash/${idd}`);
      if (data.status === 200) {
        alert("product deleted succesfully ");
        window.location.reload();
      }
    } else {
      console.log("product canceled the deletion.");
    }
  };

  return (
    <>
      <Card className=" mt-4 p-3">
        <div className="row">
          <div className="col-md-10 m-auto"></div>

          <button
            onClick={handleAddNewProduct}
            className="col-md-2 btn_bg p-2 m-auto float-end"
          >
            <i className="pi pi-plus"></i> Add Product
          </button>
        </div>
      </Card>

      <div className="row mt-4">
        <div className="col-md-9"></div>
        <div className="col-md-3 m-auto float-end">
          <Form.Control
            className=""
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search Product..."
          />
        </div>
      </div>
      <DataTable
        className="mt-3"
        columns={columns}
        data={ProductData}
        highlightOnHover
        pointerOnHover
        pagination
        selectableRows
        bordered
        customStyles={customStyles}
      />

      <Offcanvas
        show={showProduct}
        onHide={() => setshowProduct(false)}
        placement="end"
        className="offcan"
      >
        <Offcanvas.Header className="col-md-12 ofheader">
          <div className="title ">
            <div>
              <Offcanvas.Title className="">
                {editProduct && ProductID !== null
                  ? "Modify Product"
                  : "Add Product"}{" "}
              </Offcanvas.Title>
              <p>Embed Your Product Product and Crucial Details Instantly</p>
            </div>
            <button onClick={() => setshowProduct(false)} className="closebtn ">
              x
            </button>
          </div>
        </Offcanvas.Header>

        <Offcanvas.Body>
          <div className="row mb-3">
            <div className="col-md-4 ">
              <Form.Label> Select Client</Form.Label>
            </div>
            <div className="col-md-8">
              <Form.Select size="sm" onChange={handleChange} name="ClientId">
                {ClientsData?.map((client) => (
                  <option value={client._id}>{client.clientname}</option>
                ))}
              </Form.Select>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-4">
              <Form.Label>Select Category</Form.Label>
            </div>
            <div className="col-md-8">
              <Form.Select size="sm" onChange={handleChange} name="Category">
                <option disabled>Choose...</option>

                {Category?.map((cate) => (
                  <option value={cate._id}>{cate.category}</option>
                ))}
              </Form.Select>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-4">
              <Form.Label>Product Name</Form.Label>
            </div>
            <div className="col-md-8">
              <Form.Control
                defaultValue={
                  editProduct && ProductID !== null
                    ? EditData.productname
                    : FormProductData.Productname
                }
                onChange={handleChange}
                name="Productname"
                placeholder="Product Name"
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-4">
              <Form.Label>Product Price</Form.Label>
            </div>
            <div className="col-md-8">
              <Form.Control
                defaultValue={
                  editProduct && ProductID !== null
                    ? EditData.price
                    : FormProductData.Price
                }
                onChange={handleChange}
                name="Price"
                placeholder="Product Price"
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-4">
              <Form.Label>Sales Price </Form.Label>
            </div>
            <div className="col-md-8">
              <Form.Control
                defaultValue={
                  editProduct && ProductID !== null
                    ? EditData.offerprice
                    : FormProductData.Offerprice
                }
                onChange={handleChange}
                name="Offerprice"
                placeholder="Offer Price"
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-4">
              <Form.Label>GST</Form.Label>
            </div>
            <div className="col-md-8">
              <Form.Select
                onChange={handleChange}
                name="GST"
                defaultValue={
                  editProduct && ProductID !== null
                    ? EditData.GST
                    : FormProductData.GST
                }
              >
                {" "}
                <option disabled>Choose...</option>
                <option value={"0"}>0%</option>
                <option value={"5"}>5%</option>
                <option value={"12"}>12%</option>
                <option value={"18"}>18%</option>
                <option value={"28"}>28%</option>
              </Form.Select>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-4">
              <Form.Label>Add Min Qty</Form.Label>
            </div>
            <div className="col-md-8">
              <Form.Control
                onChange={handleChange}
                name="Minqty"
                placeholder="Min Quantity"
                defaultValue={
                  editProduct && ProductID !== null
                    ? EditData.minqty
                    : FormProductData.Minqty
                }
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-4">
              <Form.Label>Add Max Qty</Form.Label>
            </div>
            <div className="col-md-8">
              <Form.Control
                onChange={handleChange}
                name="Maxqty"
                placeholder="Max Quantity"
                defaultValue={
                  editProduct && ProductID !== null
                    ? EditData.maxqty
                    : FormProductData.Maxqty
                }
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-4">
              <Form.Label>Select unit</Form.Label>
            </div>
            <div className="col-md-8">
              <Form.Select
                onChange={handleChange}
                name="Unit"
                value={
                  editProduct && ProductID !== null
                    ? EditData.unit
                    : FormProductData.Unit
                }
              >
                <option disabled>Choose...</option>
                <option value={"Kg"}>Kg</option>
                <option value={"Bunch"}>Bunch</option>
              </Form.Select>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-4">
              <Form.Label>Description </Form.Label>
            </div>
            <div className="col-md-8">
              <Form.Control
                as="textarea"
                defaultValue={
                  editProduct && ProductID !== null
                    ? EditData.description
                    : FormProductData.Description
                }
                onChange={handleChange}
                name="Description"
                placeholder="Description"
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-4">
              <Form.Label>Product Image</Form.Label>
            </div>

            <div className="col-md-8 cateimg p-5">
              <Form.Label>
                {editProduct && ProductID !== null ? (
                  <img
                    width={40}
                    height={40}
                    src={`${ImageApiURL}/Product/${EditData.productimage}`}
                  />
                ) : (
                  <>
                    {" "}
                    {Pimage ? (
                      <img
                        src={URL.createObjectURL(Pimage)}
                        width={100}
                        height={100}
                      />
                    ) : (
                      <i className="pi pi-cloud-upload m-auto"></i>
                    )}
                  </>
                )}
                <Form.Control
                  onChange={(e) => setPimage(e.target.files[0])}
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
              onClick={() => setshowProduct(false)}
            >
              Cancel
            </button>
            {editProduct && ProductID !== null ? (
              <button
                className="col-md-4 btn_bg save p-2 m-auto btncwhite"
                onClick={handleUpdate}
              >
                Save Changes
              </button>
            ) : (
              <button
                className="col-md-4 btn_bg save p-2 m-auto btncwhite"
                onClick={AddProduct}
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
