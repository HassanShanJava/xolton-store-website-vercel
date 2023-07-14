import { forwardRef, useEffect } from "react";
import React, { useId, useState } from "react";
import UploadImage from "~/public/images/image.svg";

import Image from "next/image";
export const Input = forwardRef(function Input(props: any, ref) {
  return (
    <div className="flex w-full items-center justify-between rounded-md bg-white p-1 transition ease-in-out">
      <label htmlFor="email-address" className="sr-only">
        {props?.placeholder}
      </label>
      <input
        ref={ref && ref}
        id="email-address"
        name={props?.inputName}
        type={props?.type}
        placeholder={props?.placeholder}
        autoComplete="off"
        className="flex-1 border-none px-2 text-pm-10 outline-none placeholder:text-gt-1 focus:ring-0"
        required
        {...props?.register}
        {...props}
      />
      {props?.icon !== "" ? (
        <i
          onClick={() => props?.onIconClick && props?.onIconClick(props.value)}
          className={`text-admingray-300 px-2 text-lg ${props?.icon}`}
        />
      ) : (
        ""
      )}
    </div>
  );
});

export const SearchInput = forwardRef(function Input(props: any, ref) {
  return (
    <div className="flex w-full flex-wrap items-center justify-between rounded-md border bg-white p-1 transition ease-in-out">
      <label htmlFor="email-address" className="sr-only">
        {props?.placeholder}
      </label>
      <input
        ref={ref && ref}
        id="email-address"
        name={props?.inputName}
        type={props?.type}
        placeholder={props?.placeholder}
        autoComplete="off"
        className="flex-1 border-none px-2 text-pm-10 outline-none placeholder:text-gt-1 focus:ring-0"
        required
        {...props?.register}
        {...props}
      />
      {props?.icon !== "" ? (
        <i
          onClick={() => props?.onIconClick && props?.onIconClick(props.value)}
          className={`text-admingray-300 px-2 text-lg ${props?.icon}`}
        />
      ) : (
        ""
      )}
    </div>
  );
});

export function FileInput(props: any) {
  const [image, setImage] = useState<any>(null);
  const handleChange = (e: any) => {
    setImage(URL.createObjectURL(e.target.files[0]));
    props.imageCompressorHandler(e.target.files[0]);

    props.setValue(props?.register.name, e.target.files[0]);
  };
  const handleDelete = (InputName: string) => {
    setImage(null);
    props.setValue(InputName, null);
  };
  useEffect(() => {
    if (typeof props?.getValues("thumb") !== "object") {
      const linkData = `${
        process.env.NEXT_PUBLIC_CLOUD_FRONT_BASE_URL
      }/${props?.getValues("thumb")}`;

      setImage(linkData.includes("undefined") ? null : linkData);
    }
  }, [props?.getValues("thumb")]);
  return (
    <div className=" relative flex w-full items-center justify-center p-2  ">
      {image !== null ? (
        <>
          <div
            onClick={() => handleDelete(props?.register?.name)}
            className="duration absolute right-[-14px] top-[-16px] z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white text-center text-ac-2 hover:bg-ac-2 hover:text-white"
          >
            <i className={` fas fa-remove text-xl `}></i>
          </div>
          <Image
            width={5000}
            height={5000}
            src={image}
            alt="uploaded Image"
            className="mb-3 h-52 w-full object-cover text-gray-400"
          />
        </>
      ) : (
        <>
          <label
            htmlFor="dropzone-file"
            className="dark:hover:bg-bray-800 flex h-64 w-full cursor-pointer  flex-col items-center justify-center rounded-lg border-2 border-dashed    bg-white dark:border-gray-600  dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          >
            <div className="flex flex-col items-center justify-center pb-6 pt-5">
              <Image
                width={10}
                height={10}
                src={UploadImage.src}
                alt="upload Image"
                className="mb-3 h-10 w-10 text-gray-400"
              ></Image>

              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">
                  {props?.placeholder ? props?.placeholder : "Upload file "}
                </span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                File types supported: JPG, PNG, GIF, SVG, MP4, WEBM, MP3,WAV,
                OGG, GLB
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="sr-only"
              accept="image/*"
              required
              // {...props?.register}
              onChange={(e) => handleChange(e)}
            />
          </label>
        </>
      )}
    </div>
  );
}

export function FileInput2(props: any) {
  const [image, setImage] = useState<any>(null);
  const handleChange = (e: any) => {
    setImage(URL.createObjectURL(e.target.files[0]));
    props.imageCompressorHandler(e.target.files[0]);

    props.setValue(props?.register.name, e.target.files[0]);
  };
  const handleDelete = (InputName: string) => {
    setImage(null);
    props?.setImageState(null);
    props.setValue(InputName, null);
  };
  useEffect(() => {
    const linkData = `${process.env.NEXT_PUBLIC_CLOUD_FRONT_BASE_URL}/${props?.imageState}`;
    setImage(
      linkData.includes("undefined") || props?.imageState == ""
        ? null
        : linkData
    );
    props.setValue("thumb", props?.imageState);
  }, [props?.imageState]);

  return (
    <div className=" relative flex w-full items-center justify-center p-2  ">
      {image !== null ? (
        <>
          <div
            onClick={() => handleDelete(props?.register?.name)}
            className="duration absolute right-[-14px] top-[-16px] z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white text-center text-ac-2 hover:bg-ac-2 hover:text-white"
          >
            <i className={` fas fa-remove text-xl `}></i>
          </div>
          <Image
            width={5000}
            height={5000}
            src={image}
            alt="uploaded Image"
            quality={100}
            className="mb-3 h-52 w-full object-cover object-center text-gray-400"
          />
        </>
      ) : (
        <>
          <label
            htmlFor="dropzone-file"
            className="dark:hover:bg-bray-800 flex h-64 w-full cursor-pointer  flex-col items-center justify-center rounded-lg border-2 border-dashed    bg-white dark:border-gray-600  dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          >
            <div className="flex flex-col items-center justify-center pb-6 pt-5">
              <Image
                width={10}
                height={10}
                src={UploadImage.src}
                alt="upload Image"
                className="mb-3 h-10 w-10 text-gray-400"
              ></Image>

              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">
                  {props?.placeholder ? props?.placeholder : "Upload file "}
                </span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                File types supported: JPG, PNG
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="sr-only"
              accept="image/*"
              required
              // {...props?.register}
              onChange={(e) => handleChange(e)}
            />
          </label>
        </>
      )}
    </div>
  );
}

export function SeoImage(props: any) {
  const [image, setImage] = useState<any>(null);
  const handleChange = (e: any) => {
    console.log(e?.target?.values, "data image uploaded");
    setImage(URL.createObjectURL(e.target.files[0]));

    props.setValue(props?.register.name, e.target.files[0]);
    props?.setOptimizeFile(e.target.files[0]);
    props?.setImageName(props?.register.name);
  };
  const handleDelete = (InputName: string) => {
    setImage(null);
    props.setValue(InputName, null);
  };
  // useEffect(() => {
  //   console.log(props?.imageState, 'props?.imageState');
  //   const linkData = `${process.env.NEXT_PUBLIC_CLOUD_FRONT_BASE_URL}/${props?.imageState}`;
  //   setImage(
  //     linkData.includes('undefined') || props?.imageState == ''
  //       ? null
  //       : linkData,
  //   );
  //   props.setValue(props?.register.name, props?.imageState);
  // }, [props?.imageState]);
  useEffect(() => {
    console.log(
      props?.register?.name,
      props?.getValues(props?.register?.name),
      props?.seoData,
      "linkDatalinkData"
    );
    if (
      props?.seoData &&
      typeof props?.getValues(props?.register?.name) !== "object"
    ) {
      const linkData = `${
        process.env.NEXT_PUBLIC_CLOUD_FRONT_BASE_URL
      }/${props?.getValues(props?.register?.name)}`;

      setImage(linkData.includes("undefined") ? null : linkData);
    }
  }, [props?.getValues(props?.register?.name), props?.seoData]);
  return (
    <div
      id={props?.name}
      className=" relative flex w-full items-center justify-center p-2  "
    >
      {image !== null ? (
        <>
          <div
            onClick={() => handleDelete(props?.register?.name)}
            className="duration absolute right-[-14px] top-[-16px] z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white text-center text-ac-2 hover:bg-ac-2 hover:text-white"
          >
            <i className={` fas fa-remove text-xl `}></i>
          </div>
          <Image
            width={5000}
            height={5000}
            src={image}
            alt="uploaded Image"
            quality={100}
            className="mb-3 h-52 w-full object-cover object-center text-gray-400"
          />
        </>
      ) : (
        <>
          <label
            htmlFor={`dropzone-file-${props?.name}`}
            className="dark:hover:bg-bray-800 flex h-64 w-full cursor-pointer  flex-col items-center justify-center rounded-lg border-2 border-dashed    bg-white dark:border-gray-600  dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          >
            <div className="flex flex-col items-center justify-center pb-6 pt-5">
              <Image
                width={10}
                height={10}
                src={UploadImage.src}
                alt="upload Image"
                className="mb-3 h-10 w-10 text-gray-400"
              ></Image>

              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">
                  {props?.placeholder ? props?.placeholder : "Upload file "}
                </span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                File types supported: JPG, PNG
              </p>
            </div>
            <input
              id={`dropzone-file-${props?.name}`}
              type="file"
              className="sr-only"
              accept="image/*"
              required
              // {...props?.register}
              onChange={(e) => handleChange(e)}
            />
          </label>
        </>
      )}
    </div>
  );
}
