import Image from "next/image";
import Link from "next/link";
import React from "react";
import { renderNFTIcon } from "~/utils/helper";

const Footer = ({ webData }: any) => {
  return (
    <>
      <footer id="Contact" className={"w-full bg-bg-2"}>
        {/* <div className={styles.gradient_cover}></div> */}
        <div>
          <div className="relative  mx-auto pb-6 pt-8 md:px-14">
            <div className="flex flex-col justify-between text-left md:!flex-row ">
              <div className="gap-4 md:w-1/2">
                <h4
                  className={`fonat-semibold text-blueGray-700 flex  items-center gap-2 text-3xl md:text-4xl`}
                >
                  <Image
                    src={renderNFTIcon(webData)}
                    className="h-8 w-8"
                    alt={"company logo"}
                    width={16}
                    height={16}
                  />
                  Let's keep in touch!
                </h4>
                <h5 className="text-blueGray-600 mb-2 mt-0 text-lg">
                  Own a Piece of the Future with Us!
                </h5>
                <p className="text-blueGray-600 mb-2 mt-0 text-base">
                  Enter the Gateway to Exclusive Digital Masterpieces: Your
                  Ultimate NFT Marketplace
                </p>
                <div className="mb-6 mt-6 lg:mb-0">
                  <button
                    className="text-lightBlue-400 align-center mr-2 h-10 w-10 items-center justify-center rounded-full bg-white font-normal shadow-lg outline-none hover:bg-gray-300 focus:outline-none"
                    type="button"
                  >
                    <i className="fab fa-twitter text-xl text-black"></i>
                  </button>
                  <button
                    className="text-lightBlue-600 align-center mr-2 h-10 w-10 items-center justify-center rounded-full bg-white font-normal shadow-lg outline-none hover:bg-gray-300 focus:outline-none"
                    type="button"
                  >
                    <i className="fab fa-facebook-square text-xl text-black"></i>
                  </button>
                  <button
                    className="align-center mr-2 h-10 w-10 items-center justify-center rounded-full bg-white font-normal text-black shadow-lg outline-none hover:bg-gray-300 focus:outline-none"
                    type="button"
                  >
                    <i className="fab fa-dribbble text-xl"></i>
                  </button>
                  <button
                    className="text-blueGray-800 align-center mr-2  h-10 w-10 items-center justify-center rounded-full bg-white font-normal shadow-lg outline-none hover:bg-gray-300 focus:outline-none"
                    type="button"
                  >
                    <i className="fab fa-github text-xl text-black "></i>
                  </button>
                </div>
              </div>

              <div className="px-4  md:w-1/2">
                <div className="items-top mb-6 flex flex-wrap">
                  <div className="ml-auto w-full px-4 lg:w-4/12">
                    <span className="text-blueGray-500 mb-2 block text-sm font-semibold uppercase">
                      Useful Links
                    </span>
                    <ul className="list-unstyled">
                      <li>
                        <a
                          className="text-blueGray-600 block   pb-2 text-sm hover:underline"
                          href="/about-us"
                        >
                          About Us
                        </a>
                      </li>
                      <li>
                        <a
                          className="text-blueGray-600 block   pb-2 text-sm hover:underline"
                          href="/blogs"
                        >
                          Blogs
                        </a>
                      </li>
                    </ul>
                  </div>

                  {webData.socials && (
                    <div className="w-full px-4 lg:w-4/12">
                      <span className="text-blueGray-500 mb-2 block text-sm font-semibold uppercase">
                        Socials
                      </span>
                      <ul className="list-unstyled">
                        {webData.socials.map((item: any, i: any) => (
                          <ul key={i}>
                            <li className="hover:underline">
                              <a
                                className="text-blueGray-600 flex items-center gap-2  pb-2 text-sm capitalize "
                                href={item.url}
                              >
                                <span>
                                  <i className={`fa-brands fa-${item.social_type} w-4 h-4 text-center`}></i>
                                </span>
                                {item.social_type}
                              </a>
                            </li>
                          </ul>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
