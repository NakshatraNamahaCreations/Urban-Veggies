import React from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import { Link, useNavigation } from "react-router-dom";
import { Button } from "react-bootstrap";
import { ServicePage } from "../ServicePage";

function Sidenav() {
  const Logout = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("userdata")).token;

      if (!token) {
        console.error("Token not found");
        return;
      }

      const response = await ServicePage.logout({ token });

      if (response.status === 200) {
        alert("Logout successful!");
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="row">
      <h5 className="mt-2 f-bold text-center">Urban Veggies </h5>
      <Sidebar className="sidenav">
        <Menu>
          <MenuItem
            component={<Link className="M-link" to="/home" />}
            icon={<i className="pi pi-th-large"></i>}
          >
            Dashboard
          </MenuItem>
          <MenuItem
            component={<Link className="M-link" to="/banners" />}
            icon={<i className="pi pi-image"></i>}
          >
            Spotlight Banners
          </MenuItem>

          <MenuItem
            icon={<i className="pi pi-slack"></i>}
            component={<Link className="M-link" to="/category" />}
          >
            Category
          </MenuItem>
          <MenuItem
            component={<Link className="M-link" to="/Product" />}
            icon={<i className="pi pi-inbox"></i>}
          >
            Product
          </MenuItem>

          <MenuItem
            icon={<GroupsOutlinedIcon />}
            component={<Link className="M-link" to="/Clients" />}
          >
            {" "}
            Clients
          </MenuItem>
          <MenuItem
            component={<Link className="M-link" to="/OrderList" />}
            icon={<i className="pi pi-cart-plus"></i>}
          >
            Order
          </MenuItem>
          <MenuItem
            component={<Link className="M-link" to="/DeliveryCharge" />}
            icon={<i className="pi pi-wallet"></i>}
          >
            Delivery Charge
          </MenuItem>
          <MenuItem
            component={<Link className="M-link" to="/DeliveryChallan" />}
            icon={<i className="pi pi-book"></i>}
          >
            Delivery Challan
          </MenuItem>

          <MenuItem
            component={<Link className="M-link" to="/Tickets" />}
            icon={<i className="pi pi-book"></i>}
          >
            Tickets Rising
          </MenuItem>

          <MenuItem>
            <Button onClick={Logout} className="row p-2 m-auto filter">
              <div className="row">
                <i className="pi pi-sign-out col-md-4 m-auto" />
                <span className="col-md-8 m-auto">Logout</span>
              </div>
            </Button>
          </MenuItem>
        </Menu>
      </Sidebar>
    </div>
  );
}

export default Sidenav;
