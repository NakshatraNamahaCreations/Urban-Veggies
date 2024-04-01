import React from "react";

import "primeicons/primeicons.css";

export default function Header() {
  return (
    <div className="row" style={{ backgroundColor: "#fbfbfb", padding: "15px" }}>
      <div className="m-auto text-end">
        <i
          className="pi pi-user-edit"
          style={{  fontSize: "25px" }}
        ></i>
      </div>
    </div>
  );
}
