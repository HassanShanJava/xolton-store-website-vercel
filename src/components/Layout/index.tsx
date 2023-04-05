import React, { ReactNode, useEffect, useState } from "react";
import Navbar from "./Navbar";
import  Head  from "next/head";
import { store } from '~/store/store';
import { Provider } from 'react-redux';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
    <Provider store={store}>
      <Head>
        <title>Xoltan Marketplace Store</title>
      </Head>

      <div>
        <Navbar />
        <main>{children}</main>
      </div>
    </Provider>
    </>
  );
};

export default Layout;
