import {
  Button,
  Collapse,
  FormControl,
  FormLabel,
  Select,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
} from "@chakra-ui/react";
import { useNode } from "@craftjs/core";
import React, { useState, useEffect } from "react";
import ContentEditable from "react-contenteditable";

export const DropDownItem = ({
  text,
  text2,
  fontSize,
  fontSize1,
  fontStyle,
  fontWeight,
  fontAlign,
  color,

  ...props
}: any) => {
  const [isOpen, setIsOpen] = useState(false);

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
      className="w-full"
      onClick={() => selected && setEditable(true)}
    >
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full  "
        colorScheme={color}
        size="lg"
      >
        {" "}
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
            padding: "2px",
          }}
          className="flex-1 "
        />
        {isOpen ? (
          <i className="fa-solid fa-angle-up"></i>
        ) : (
          <i className="fa-solid fa-angle-down"></i>
        )}
      </Button>
      <Collapse in={isOpen}>
        <ContentEditable
          html={text2}
          disabled={!editable}
          onChange={(e) =>
            setProp((props: any) => (props.text2 = e.target.value), 500)
          }
          style={{
            fontSize: `${fontSize1}px`,
            fontStyle: `${fontStyle}`,
            fontWeight: `${fontWeight}`,
            textAlign: `${fontAlign}`,
          }}
          className="flex flex-1 p-4 text-left"
        />
      </Collapse>
    </div>
  );
};

const TextSettings = () => {
  const {
    actions: { setProp },
    fontSize,
    fontSize1,
    fontStyle,
    fontWeight,
    fontAlign,
    color,
  } = useNode((node) => ({
    text: node.data.props.text,
    text2: node.data.props.text,
    fontSize: node.data.props.fontSize,
    fontSize1: node.data.props.fontSize1,
    fontStyle: node.data.props.fontStyle,
    fontWeight: node.data.props.fontWeight,
    fontAlign: node.data.props.fontAlign,
    color: node.data.props.color,
  }));

  return (
    <div className="flex flex-col gap-2 space-y-2">
      <FormControl size="small">
        <FormLabel>Title Font size</FormLabel>
        <Slider
          aria-label="slider-ex-1"
          value={fontSize || 7}
          step={2}
          min={1}
          max={55}
          onChange={(val: any) => {
            setProp((props: any) => (props.fontSize = val), 1000);
          }}
        >
          <SliderMark
            value={fontSize}
            textAlign="center"
            bg="blue.500"
            color="white"
            mt="2"
            ml="-5"
            w="12"
          >
            {fontSize}px
          </SliderMark>
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </FormControl>
      <FormControl size="small">
        <FormLabel>Content Font size</FormLabel>
        <Slider
          aria-label="slider-ex-1"
          value={fontSize1 || 7}
          step={2}
          min={1}
          max={55}
          onChange={(val: any) => {
            setProp((props: any) => (props.fontSize1 = val), 1000);
          }}
        >
          <SliderMark
            value={fontSize1}
            textAlign="center"
            bg="blue.500"
            color="white"
            mt="2"
            ml="-5"
            w="12"
          >
            {fontSize1}px
          </SliderMark>
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
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
      <FormControl size="small">
        <FormLabel>Button Color Scheme</FormLabel>
        <Select
          placeholder="Button Color Scheme"
          value={color}
          onChange={(e: any) => {
            setProp((props: any) => (props.color = e.target.value));
          }}
        >
          <option value="teal">Teal</option>
          <option value="gray">gray</option>
          <option value="red">red</option>
          <option value="orange">orange</option>
          <option value="yellow">yellow</option>
          <option value="green">green</option>
          <option value="blue">blue</option>
        </Select>
      </FormControl>
      <FormControl size="small"></FormControl>
    </div>
  );
};

export const TextDefaultProps = {
  text: "Title Text",
  text2: "Content Text",
  fontSize: 20,
  fontAlign: "left",
};

DropDownItem.craft = {
  props: TextDefaultProps,
  related: {
    settings: TextSettings,
  },
};
