import Image from "next/image";
import React, { useState } from "react";

import Logo from "../../public/images/logo.png";
import MenuIcon from "../../public/icons/hamburger.svg";
import Link from "next/link";
const Navbar = () => {
  const [nav, setNav] = useState(false);
  const handleNav = () => setNav(!nav);

  return (
    <>
      <div className="sticky top-0 z-10 flex w-full items-center justify-between bg-white p-4">
        {/* for mobile menu state */}
        <div className=" sm:hidden" onClick={handleNav}>
          {nav ? (
            ""
          ) : (
            <div className="relative ml-4 flex h-10 w-10">
              <Image src={MenuIcon} alt="/logo" fill />
            </div>
          )}
        </div>

        <div
          className={
            nav
              ? "fixed left-0 top-0 z-10 h-screen w-[300px] bg-white duration-300"
              : "fixed left-[-100%] top-0 z-10 h-screen w-[300px] bg-white duration-300"
          }
        >
          <div
            className="absolute right-4 top-4 cursor-pointer text-xl"
            onClick={handleNav}
          >
            X
          </div>

          <nav className="mt-6">
            <ul className="flex flex-col p-4 text-gray-800 ">
              <Link href="/">
                <li className="flex items-center py-4 text-xl">Home</li>
              </Link>
              <Link href="/">
                <li className="flex items-center py-4 text-xl">Blog</li>
              </Link>
              <Link href="/about-us">
                <li className="flex items-center py-4 text-xl">About Us</li>
              </Link>
              <Link href="/">
                <li className="flex items-center py-4 text-xl">FAQ</li>
              </Link>
            </ul>
          </nav>
        </div>

        <div className="relative ml-4 hidden h-10 w-10 sm:flex">
          <Image src={Logo} alt="/logo" fill />
        </div>

        <ul className="hidden items-center justify-between sm:flex ">
          <Link href="/">
            <li className="mx-4">Home</li>
          </Link>
          <Link href="/">
            <li className="mx-4">Blog</li>
          </Link>
          <Link href="/about-us">
            <li className="mx-4">About Us</li>
          </Link>
          <Link href="/">
            <li className="mx-4">FAQ</li>
          </Link>
        </ul>

        <div className="mr-4">
          <button
            type="button"
            className=" rounded-3xl bg-accentLinear-1 p-3 text-white hover:bg-ac-2"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
