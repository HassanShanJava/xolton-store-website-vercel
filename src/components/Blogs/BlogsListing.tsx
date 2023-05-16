import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useSelector } from "react-redux";
import { customTruncateHandler } from "~/store/helper";
import { RootState } from "~/store/store";

import { displayDate, renderNFTImage } from "~/utils/helper";

const BlogsListing = ({ storeBlogsData }: any) => {
  return (
    <>
      <div className="max-h-full min-h-screen w-full  bg-bg-1 px-8">
        <section className="pb-6 pt-6 lg:pb-6 ">
          <div className="container mx-auto">
            <div className="-mx-4 flex flex-wrap justify-center">
              <div className="w-full px-4">
                <div className="mx-auto mb-[60px] max-w-[510px] text-center lg:mb-20">
                  <span className="text-primary mb-2 block text-lg font-semibold">
                    Our Blogs
                  </span>
                  <h2 className="text-dark mb-4 text-3xl font-bold sm:text-4xl md:text-[40px]">
                    Our Recent News
                  </h2>
                  <p className="text-body-color text-base">
                    There are many variations of passages of Lorem Ipsum
                    available but the majority have suffered alteration in some
                    form.
                  </p>
                </div>
              </div>
            </div>
            <div className="-mx-4 grid justify-items-center gap-4   md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {storeBlogsData.length > 0 ? (
                storeBlogsData?.map((store: any, i: number) => {
                  let date: any = new Date(store?.created_at);

                  return (
                    <div key={i} className="group w-full max-w-lg px-4">
                      <div className="mx-auto mb-10 max-w-[370px] rounded-md bg-white p-2 group-hover:bg-pm-11">
                        <div className="mb-2 h-[240px] w-full overflow-hidden rounded">
                          <a href={`/blogs/${store?.meta}.html`}>
                            <Image
                              src={renderNFTImage(store)}
                              alt="image"
                              width={5000}
                              height={5000}
                              quality={100}
                              className="h-[240px] w-full object-cover"
                              priority
                            />
                          </a>
                        </div>
                        <div>
                          <h3>
                            <a
                              href="javascript:void(0)"
                              className="text-dark hover:text-primary mb-1 inline-block text-xl font-semibold capitalize sm:text-2xl lg:text-xl xl:text-2xl"
                            >
                              {customTruncateHandler(store?.title, 20)}
                            </a>
                          </h3>
                          <p className="text-body-color text-base">
                            {customTruncateHandler(store?.description, 20)}
                          </p>
                          <span className="bg-primary mt-5 inline-block rounded  py-1 text-center text-xs font-semibold leading-loose text-gray-600">
                            {date.toDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="my-auto w-full text-center text-xl">
                  No Records Found
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default BlogsListing;
