import React, { useState } from "react";
import Header from "./Header";
import Sidenav from "./Sidenav";

export default function Layout({ children }) {
  return (
    <div className="row me-0">
      <div className="col-md-2">
        <Sidenav />
      </div>
      <div className="col-md-10">{children}</div>
    </div>
  );
}
