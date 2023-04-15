import Image from "next/image";
import Link from "next/link";
import React from "react";
import { customTruncateHandler } from "~/store/helper";
import { api } from "~/utils/api";
import { displayDate, renderNFTImage } from "~/utils/helper";

const BlogsListing = () => {
  const { data: storeBlogsData, isFetched } =
    api.storeBlogs.getStoreBlogs.useQuery(
      {},
      {
        refetchOnWindowFocus: false,
      }
    );
  return (
    <>
      <div className="max-h-full min-h-screen w-full  bg-bg-1 px-8">
        <section className="pb-10 pt-20 lg:pb-20 lg:pt-[120px]">
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
            <div className="-mx-4 grid justify-items-center gap-4  md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {isFetched &&
                storeBlogsData?.map((store, i) => (
                  <Link
                    href={`/blogs/${store?.id}`}
                    key={i}
                    className="group w-full max-w-lg px-4"
                  >
                    <div className="mx-auto mb-10 max-w-[370px] rounded-md bg-white p-2 group-hover:bg-pm-11">
                      <div className="mb-8 h-[240px] w-full overflow-hidden rounded">
                        <Image
                          src={renderNFTImage(store)}
                          alt="image"
                          width={500}
                          height={500}
                          quality={100}
                          className="w-full object-contain object-bottom"
                        />
                      </div>
                      <div>
                        <span className="bg-primary mb-5 inline-block rounded px-4 py-1 text-center text-xs font-semibold leading-loose text-gray-600">
                          {displayDate(store?.created_at)}
                        </span>
                        <h3>
                          <a
                            href="javascript:void(0)"
                            className="text-dark hover:text-primary mb-4 inline-block text-xl font-semibold sm:text-2xl lg:text-xl xl:text-2xl"
                          >
                            {customTruncateHandler(store?.title, 20)}
                          </a>
                        </h3>
                        <p className="text-body-color text-base">
                          {store?.title}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default BlogsListing;
