import React, { ReactNode, useEffect, useState } from "react";
import Navbar from "./Navbar";
import Head from "next/head";
import { store } from "~/store/store";
import { Provider } from "react-redux";

import { renderNFTIcon, websiteInfo } from "~/utils/helper";
import SeoHead from "./SeoHead";

const Layout = ({ children, ...props }: any) => {
  // use context

  return (
    <>
      <Provider store={store}>
        <div>
          <Navbar navData={props?.navData} webData={props?.webData} />

          <main>{children}</main>
        </div>
      </Provider>
    </>
  );
};

// This gets called on every request

export default Layout;
