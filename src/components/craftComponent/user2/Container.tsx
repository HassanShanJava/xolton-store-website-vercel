import {
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from "@chakra-ui/react";
import { useNode } from "@craftjs/core";

import React from "react";

export const Container = ({
  background,
  padding,
  children,
  width,
  box,
  ...props
}: any) => {
  const {
    connectors: { connect, drag },
    selected,
    actions: { setProp },
  } = useNode((state) => ({
    selected: state.events.selected,
    dragged: state.events.dragged,
  }));
  return (
    <Flex
      {...props}
      // templateColumns={`repeat(${+box}, 1fr)`}
      ref={(ref: any) => connect(drag(ref))}
      border={"none !important"}
      style={{
        margin: "5px 0",
        background,
        padding: `${padding}px`,
        width: `${width}%`,
        display: `flex`,

        // flexDirection: `${box ? box : 'column'}`,
      }}
      className={` gap-2 xs:flex-col  sm:flex-col  md:${
        box ? box : "flex-col"
      }`}
    >
      {children}
    </Flex>
  );
};

export const ContainerSettings = () => {
  const {
    background,
    padding,
    width,
    box,
    actions: { setProp },
  } = useNode((node) => ({
    background: node.data.props.background,
    padding: node.data.props.padding,
    width: node.data.props.width,
    box: node.data.props.box,
  }));

  return (
    <div className="flex flex-col gap-2 space-y-2">
      <FormControl size="small">
        <FormLabel>Background</FormLabel>
        <Input
          type="color"
          defaultValue={background}
          onChange={(e: any) => {
            setProp((props) => (props.background = e.target.value), 1000);
          }}
        />
      </FormControl>
      <FormControl size="small">
        <FormLabel>padding</FormLabel>
        <Slider
          aria-label="slider-ex-1"
          value={padding || 2}
          step={1}
          min={1}
          max={50}
          defaultValue={padding}
          onChange={(val: any) => {
            setProp((props) => (props.padding = val), 1000);
          }}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </FormControl>
      <FormControl size="small">
        <FormLabel>Width</FormLabel>
        <Slider
          aria-label="slider-ex-1"
          value={width || 2}
          step={5}
          min={1}
          max={100}
          defaultValue={width}
          onChange={(val: any) => {
            setProp((props) => (props.width = val), 1000);
          }}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </FormControl>
      <FormControl size="small">
        <FormLabel>Direction</FormLabel>
        <Select
          placeholder="Select Direction"
          value={box}
          onChange={(e: any) => {
            setProp((props) => (props.box = e.target.value));
          }}
        >
          <option value="flex-row">Row</option>
          <option value="flex-col">Column</option>
        </Select>
      </FormControl>

      <FormControl size="small"></FormControl>
    </div>
  );
};

export const ContainerDefaultProps = {
  background: "#ffffff",
  padding: 3,
};

Container.craft = {
  props: ContainerDefaultProps,
  related: {
    settings: ContainerSettings,
  },
};
