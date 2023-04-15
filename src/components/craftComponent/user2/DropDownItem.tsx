import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Collapse,
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

export const DropDownItem = ({
  text,
  text2,
  fontSize,
  fontSize1,
  fontStyle,
  fontWeight,

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
      <Button onClick={() => setIsOpen(!isOpen)} className="w-full  " size="lg">
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
          }}
          className="flex flex-1 text-left"
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
          }}
          className="flex flex-1 p-4 text-left"
        />
      </Collapse>
    </div>
    // <div
    // {...props}
    // ref={(ref: any) => connect(drag(ref))}
    //   onClick={() => selected && setEditable(true)}
    //   className="w-full"
    // >
    //   <AccordionItem className="w-full">
    //     <AccordionButton>
    // <ContentEditable
    //   html={text}
    //   disabled={!editable}
    //   onChange={(e) =>
    //     setProp((props:any) => (props.text = e.target.value), 500)
    //   }
    //   style={{
    //     fontSize: `${fontSize}px`,
    //     fontStyle: `${fontStyle}`,
    //     fontWeight: `${fontWeight}`,
    //   }}
    //   className="flex flex-1 text-left"
    // />
    //       <AccordionIcon />
    //     </AccordionButton>

    //     <AccordionPanel pb={4}>
    //       <ContentEditable
    //         html={text2}
    //         disabled={!editable}
    //         onChange={(e) =>
    //           setProp((props:any) => (props.text2 = e.target.value), 500)
    //         }
    //         style={{
    //           fontSize: `${fontSize}px`,
    //           fontStyle: `${fontStyle}`,
    //           fontWeight: `${fontWeight}`,
    //         }}
    //       />
    //     </AccordionPanel>
    //   </AccordionItem>
    // </div>
  );
};

const TextSettings = () => {
  const {
    actions: { setProp },
    fontSize,
    fontSize1,
    fontStyle,
    fontWeight,
  } = useNode((node) => ({
    text: node.data.props.text,
    text2: node.data.props.text,
    fontSize: node.data.props.fontSize,
    fontSize1: node.data.props.fontSize1,
    fontStyle: node.data.props.fontStyle,
    fontWeight: node.data.props.fontWeight,
  }));

  return (
    <div className="flex flex-col gap-2 space-y-2">
      <FormControl size="small">
        <FormLabel>Title Font size</FormLabel>
        <Slider
          aria-label="slider-ex-1"
          value={fontSize || 7}
          step={7}
          min={1}
          max={50}
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
        <FormLabel>Content Font size</FormLabel>
        <Slider
          aria-label="slider-ex-1"
          value={fontSize1 || 7}
          step={7}
          min={1}
          max={50}
          onChange={(val: any) => {
            console.log(val, "number");
            setProp((props: any) => (props.fontSize1 = val), 1000);
          }}
        >
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
  text2: "Hi",
  fontSize: 20,
};

DropDownItem.craft = {
  props: TextDefaultProps,
  related: {
    settings: TextSettings,
  },
};
