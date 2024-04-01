import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Form, Card } from "react-bootstrap";

import { customStyles } from "./data";
import Offcanvas from "react-bootstrap/Offcanvas";
import http from "../http.common.function";
import { ImageApiURL } from "../../src/path";

export default function Category() {
  const [showcategory, setshowcategory] = useState(false);
  const [CategoryData, setCategoryData] = useState();
  const [category, setCategory] = useState("");
  const [categoryImage, setCategoryImage] = useState("");
  const [editcategory, seteditcategory] = useState(false);
  const [EditData, setEditData] = useState();
  const [categoryID, setcategoryID] = useState();
  const [SearchValue, setSearchValue] = useState("");

  const columns = [
    {
      name: "Category Name",
      selector: (row) => row?.category,
    },
    {
      name: "Category Image",
      selector: (row) => (
        <>
          <img
            width={20}
            height={20}
            src={`${ImageApiURL}/Category/${row?.categoryImage}`}
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
              onClick={() => handleUpdatecategory(row._id)}
              class="fa-solid fa-pen"
              title="Edit"
              style={{ color: "#ffc107" }}
            ></i>{" "}
            |{" "}
          </span>

          <a
            onClick={() => deleteCategory(row._id)}
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
    getcategory();
  }, [SearchValue]);

  const AddCategory = async () => {
    if (!categoryImage || !category) {
      return alert("Please select Image");
    }
    try {
      const formdata = new FormData();
      formdata.append("categoryImage", categoryImage);
      formdata.append("category", category);
      let response = await http.post(`category/addcategory`, formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200) {
        alert("Category Added Succesfully");
        window.location.reload("");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getcategory = async () => {
    try {
      let category = await http.get(`/category/getcategory`, {
        params: { searchValue: SearchValue },
      });
      setCategoryData(category.data.data);
    } catch (error) {
      console.log("Error fetching category data", error);
    }
  };

  const deleteCategory = async (idd) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete this category?`
    );

    if (confirmed) {
      let data = await http.post(`/category/trash/${idd}`);
      if (data.status === 200) {
        alert("category deleted succesfully ");
        window.location.reload();
      }
    } else {
      console.log("category canceled the deletion.");
    }
  };

  const handleUpdatecategory = async (id) => {
    try {
      let category = await http.get(`/category/getbycategoryid/${id}`);
      setcategoryID(id);
      setEditData(category.data.data);
      setshowcategory(true);
      seteditcategory(true);
    } catch (error) {
      console.log("Error fetching category data:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      const formdata = new FormData();
      formdata.append("categoryImage", categoryImage);
      formdata.append("category", category);

      let response = await http.put(
        `category/editcategory/${categoryID}`,
        formdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        alert("Category updated successfully!");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };
  const handleAddNewCategory = () => {
    setCategory("");
    setCategoryImage(null);
    seteditcategory(false);
    setcategoryID(null);
    setEditData({});
    setshowcategory(true);
  };
  return (
    <>
      <Card className=" mt-4 p-3">
        <div className="row">
          <div className="col-md-10 m-auto"></div>

          <button
            onClick={handleAddNewCategory}
            className="col-md-2 btn_bg p-2 m-auto float-end"
          >
            <i className="pi pi-plus"></i> Add Category
          </button>
        </div>
      </Card>

      <div className="row mt-4">
        <div className="col-md-9"></div>
        <div className="col-md-3 m-auto float-end">
          <Form.Control
            className=""
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search Category..."
          />
        </div>
      </div>
      <DataTable
        className="mt-3"
        columns={columns}
        data={CategoryData}
        highlightOnHover
        pointerOnHover
        pagination
        selectableRows
        bordered
        customStyles={customStyles}
      />
      <Offcanvas
        show={showcategory}
        onHide={() => setshowcategory(false)}
        placement="end"
        className="offcan"
      >
        <Offcanvas.Header className="col-md-12 ofheader">
          <div className="title ">
            <div>
              <Offcanvas.Title className="">
                {editcategory && categoryID !== null
                  ? "Modify Category"
                  : "Add Category"}{" "}
              </Offcanvas.Title>
              <p>Embed Your Product Category and Crucial Details Instantly</p>
            </div>
            <button
              onClick={() => setshowcategory(false)}
              className="closebtn "
            >
              x
            </button>
          </div>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="row">
            <div className="col-md-4">
              <Form.Label>Category Name</Form.Label>
            </div>
            <div className="col-md-8">
              <Form.Control
                defaultValue={
                  editcategory && categoryID !== null ? EditData.category : ""
                }
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Category"
              />
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-md-4">
              <Form.Label>Category Image</Form.Label>
            </div>
            <div className="col-md-8 cateimg p-5">
              <Form.Label>
                {editcategory && categoryID !== null ? (
                  <img
                    width={40}
                    height={40}
                    src={`${ImageApiURL}/Category/${EditData.categoryImage}`}
                  />
                ) : (
                  <i className="pi pi-cloud-upload m-auto"></i>
                )}
                <Form.Control
                  onChange={(e) => setCategoryImage(e.target.files[0])}
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
              onClick={() => setshowcategory(false)}
            >
              Cancel
            </button>
            {editcategory && categoryID !== null ? (
              <button
                className="col-md-4 btn_bg save p-2 m-auto btncwhite"
                onClick={handleUpdate}
              >
                Save Changes
              </button>
            ) : (
              <button
                className="col-md-4 btn_bg save p-2 m-auto btncwhite"
                onClick={AddCategory}
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
