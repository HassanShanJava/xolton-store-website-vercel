import {
  FormControl,
  FormLabel,
  Select,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from "@chakra-ui/react";
import { useNode } from "@craftjs/core";
import React, { useState, useEffect } from "react";
import ContentEditable from "react-contenteditable";

export const Text = ({
  text,
  fontSize,
  fontStyle,
  fontWeight,
  fontAlign,
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

  const [editable, setEditable] = useState(false);

  useEffect(() => {
    if (selected) {
      return;
    }

    setEditable(false);
  }, [selected]);

  return (
    <div
      {...props}
      ref={(ref: any) => connect(drag(ref))}
      onClick={() => selected && setEditable(true)}
    >
      <ContentEditable
        html={text}
        disabled={!editable}
        onChange={(e) =>
          setProp((props: any) => (props.text = e.target.value), 500)
        }
        style={{
          fontSize: `${fontSize}px`,
          fontStyle: `${fontStyle}`,
          fontWeight: `${fontWeight}`,
          textAlign: `${fontAlign}`,
        }}
      />
    </div>
  );
};

const TextSettings = () => {
  const {
    actions: { setProp },
    fontSize,
    fontStyle,
    fontWeight,
    fontAlign,
  } = useNode((node) => ({
    text: node.data.props.text,
    fontSize: node.data.props.fontSize,
    fontStyle: node.data.props.fontStyle,
    fontAlign: node.data.props.fontAlign,
    fontWeight: node.data.props.fontWeight,
  }));

  return (
    <div className="flex flex-col gap-2 space-y-2">
      <FormControl size="small">
        <FormLabel>Font size</FormLabel>
        <Slider
          aria-label="slider-ex-1"
          value={fontSize || 7}
          step={5}
          min={1}
          max={55}
          onChange={(val: any) => {
            console.log(val, "number");
            setProp((props: any) => (props.fontSize = val), 1000);
          }}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </FormControl>
      <FormControl size="small">
        <FormLabel>Font Alignment</FormLabel>
        <Select
          placeholder="Select font alignment"
          value={fontAlign}
          onChange={(e: any) => {
            setProp((props: any) => (props.fontAlign = e.target.value));
          }}
        >
          <option value="center">Center</option>
          <option value="left">Left</option>
          <option value="right">Right</option>
        </Select>
      </FormControl>
      <FormControl size="small">
        <FormLabel>Font style</FormLabel>
        <Select
          placeholder="Select font style"
          value={fontStyle}
          onChange={(e: any) => {
            setProp((props: any) => (props.fontStyle = e.target.value));
          }}
        >
          <option value="normal">Normal</option>
          <option value="italic">Italic</option>
          <option value="oblique">Oblique</option>
        </Select>
      </FormControl>
      <FormControl size="small">
        <FormLabel>Font Weight</FormLabel>
        <Select
          placeholder="Select font weight"
          value={fontWeight}
          onChange={(e: any) => {
            setProp((props: any) => (props.fontWeight = e.target.value));
          }}
        >
          <option value="normal">Normal</option>
          <option value="bold">Bold</option>
        </Select>
      </FormControl>
      <FormControl size="small"></FormControl>
    </div>
  );
};

export const TextDefaultProps = {
  text: "Hi",
  fontSize: 20,
};

Text.craft = {
  props: TextDefaultProps,
  related: {
    settings: TextSettings,
  },
};
