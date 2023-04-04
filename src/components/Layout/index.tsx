import React, { ReactNode, useEffect, useState } from "react";
import Navbar from "./Navbar";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <head>
        <title>Xoltan Marketplace Store</title>
      </head>

      <div>
        <Navbar />
        <main>{children}</main>
      </div>
    </>
  );
};

export default Layout;
