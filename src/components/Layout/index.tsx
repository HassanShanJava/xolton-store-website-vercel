import React, { ReactNode, useEffect, useState } from "react";
import Navbar from "./Navbar";
import  Head  from "next/head";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Head>
        <title>Xoltan Marketplace Store</title>
      </Head>

      <div>
        <Navbar />
        <main>{children}</main>
      </div>
    </>
  );
};

export default Layout;
