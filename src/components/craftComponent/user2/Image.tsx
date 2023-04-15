import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNode } from "@craftjs/core";
import { FormControl, FormLabel, Input, Select } from "@chakra-ui/react";

import { isValidImageType } from "~/utils/helper";
import imageCompression from "browser-image-compression";
const Images = ({
  upload,
  src,

  alt,
  href,
  height,
  width,
  objectType = "cover",
}: any) => {
  const {
    connectors: { connect, drag },
    selected,
  } = useNode((state) => ({
    selected: state.events.selected,
    dragged: state.events.dragged,
  }));

  if (href) {
    return (
      <a ref={(ref: any) => connect(drag(ref))} href={href}>
        <img
          src={upload !== "" ? upload : src}
          alt={alt}
          style={{ width: `${width}%`, height: `${height}px ` }}
          className={`w-[${
            width ? width : "20"
          }%]  cursor-pointer object-${objectType}`}
        />
      </a>
    );
  } else {
    return (
      <img
        ref={(ref: any) => connect(drag(ref))}
        src={upload !== "" ? upload : src}
        alt={alt}
        style={{ width: `${width}%`, height: `${height}px ` }}
        className={`w-[${
          width ? width : "20"
        }%]  cursor-pointer object-${objectType} ${
          selected && " !border-none "
        }  object-center`}
      />
    );
  }
};

Images.craft = {
  props: {
    src: "",
    upload: "",
    alt: "image",
    href: "",
    objectType: "cover",
    width: "100",
    height: "245",
  },
};

Images.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  href: PropTypes.string,

  onClick: PropTypes.func,
  onFocus: PropTypes.func,
};
export default Images;
