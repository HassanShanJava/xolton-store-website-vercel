import React, { useEffect, useState } from "react";
import { useNode } from "@craftjs/core";
import PropTypes from "prop-types";

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
      <a
        ref={(ref: any) => connect(drag(ref))}
        href={href}
        className={`${selected && "border-2 border-black"}`}
      >
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
          selected && " border-2 border-black"
        }  object-center`}
      />
    );
  }
};

function ImageSettings() {
  const [optimizeFile, setOptimizeFile] = useState<any>(null);

  const {
    actions: { setProp },
    upload,
    src,
    alt,
    href,
    height,
    width,
    objectType,
  } = useNode((node) => ({
    upload: node.data.props.upload,
    src: node.data.props.src,
    alt: node.data.props.alt,
    href: node.data.props.href,
    height: node.data.props.height,
    width: node.data.props.width,
    objectType: node.data.props.objectType,
  }));

  return (
    <div className=" mb-2 gap-1 space-y-2">
      <FormControl>
        <FormLabel>Image Upload </FormLabel>

        <input
          className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-400"
          type="file"
        />

        {/* <Input
          value={src}
          onChange={(e) => {
            setProp((props) => (props.src = e.target.value));
          }}
        /> */}
      </FormControl>
      <FormControl>
        <FormLabel>Image Source</FormLabel>
        <Input
          value={src}
          onChange={(e) => {
            setProp((props) => (props.src = e.target.value));
          }}
        />
      </FormControl>

      <FormControl m="normal">
        <FormLabel>Image Alt tag</FormLabel>
        <Input
          value={alt}
          onChange={(e) => {
            setProp((props) => (props.alt = e.target.value));
          }}
        />
      </FormControl>

      <FormControl m="normal">
        <FormLabel>Image Link</FormLabel>
        <Input
          value={href}
          onChange={(e) => {
            setProp((props) => (props.href = e.target.value));
          }}
        />
      </FormControl>
      <div className="flex flex-row  items-center gap-2">
        <FormControl m="normal">
          <FormLabel>Width in %</FormLabel>
          <Input
            value={width}
            onChange={(e) => {
              setProp((props) => (props.width = e.target.value));
            }}
          />
        </FormControl>
        <FormControl m="normal">
          <FormLabel>Height in px</FormLabel>
          <Input
            value={height}
            onChange={(e) => {
              setProp((props) => (props.height = e.target.value));
            }}
          />
        </FormControl>
      </div>
      <FormControl size="small">
        <FormLabel>Image Resizing</FormLabel>
        <Select
          placeholder="Select Resize Option"
          value={objectType}
          onChange={(e: any) => {
            setProp((props) => (props.objectType = e.target.value));
          }}
        >
          <option value="cover">Cover</option>
          <option value="contain">Contain</option>
          <option value="fill">Fill</option>
          <option value="scale-down">Scale Down</option>
          <option value="none">None</option>
        </Select>
      </FormControl>

      <FormControl size="small"></FormControl>
    </div>
  );
}

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
  related: {
    settings: ImageSettings,
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
