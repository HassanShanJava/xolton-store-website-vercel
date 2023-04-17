import { useNode } from "@craftjs/core";

import {
  Button as ChakraButton,
  FormControl,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Select,
  Stack,
} from "@chakra-ui/react";
import React from "react";
import { useRouter } from "next/router";

export const Button = ({ size, variant, color, text, src, ...props }: any) => {
  const router = useRouter();
  const {
    connectors: { connect, drag },
  } = useNode();
  const handleClick = (src: any) => {
    if (src) {
      // router.push(src);
      const newWindow = window.open(src, "_blank", "noopener,noreferrer");
      if (newWindow) newWindow.opener = null;
    }
  };
  return (
    <ChakraButton
      ref={(ref: any) => connect(drag(ref))}
      style={{ margin: "5px" }}
      size={size}
      variant={variant}
      colorScheme={color}
      onClick={() => handleClick(src)}
      {...props}
    >
      {text}
    </ChakraButton>
  );
};

export const ButtonSettings = () => {
  const {
    actions: { setProp },
    props,
  } = useNode((node) => ({
    props: node.data.props,
  }));

  return (
    <div className="mb-2 flex flex-col gap-2 space-y-2">
      <FormControl size="small">
        <FormLabel>Link</FormLabel>
        <Input
          value={props.src}
          placeholder="Enter Link"
          onChange={(e: any) => {
            setProp((props: any) => (props.src = e.target.value));
          }}
        />
      </FormControl>
      <FormControl size="small">
        <FormLabel>Text</FormLabel>
        <Input
          value={props.text}
          placeholder="Enter Text"
          onChange={(e: any) => {
            setProp((props: any) => (props.text = e.target.value));
          }}
        />
      </FormControl>
      <div className="grid grid-cols-2">
        <FormControl size="sm">
          <FormLabel>Size</FormLabel>
          <RadioGroup
            defaultValue={props.size}
            onChange={(value) => setProp((props: any) => (props.size = value))}
          >
            <Stack spacing={5} direction="column">
              <Radio colorScheme="red" value="sm">
                Small
              </Radio>
              <Radio colorScheme="green" value="md">
                Medium
              </Radio>
              <Radio colorScheme="green" value="lg">
                Large
              </Radio>
            </Stack>
            {/* <FormControlLabel
            label="Small"
            value="sm"
            control={<Radio size="small" color="primary" />}
          />
          <FormControlLabel
            label="Medium"
            value="md"
            control={<Radio size="small" color="primary" />}
          />
          <FormControlLabel
            label="Large"
            value="lg"
            control={<Radio size="small" color="primary" />}
          /> */}
          </RadioGroup>
        </FormControl>
        <FormControl>
          <FormLabel>Variant</FormLabel>
          <RadioGroup
            defaultValue={props.variant}
            onChange={(value) =>
              setProp((props: any) => (props.variant = value))
            }
          >
            <Stack spacing={5} direction="column">
              <Radio colorScheme="red" value="solid">
                solid
              </Radio>
              <Radio colorScheme="green" value="outline">
                outline
              </Radio>
              <Radio colorScheme="green" value="ghost">
                ghost
              </Radio>
              <Radio colorScheme="green" value="link">
                link
              </Radio>
            </Stack>
          </RadioGroup>
        </FormControl>
      </div>
      <FormControl size="small">
        <FormLabel>Font Weight</FormLabel>
        <Select
          placeholder="Select font weight"
          value={props.color}
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
    </div>
  );
};

export const ButtonDefaultProps = {
  size: "small",
  variant: "contained",
  color: "primary",
  text: "Click me",
};

Button.craft = {
  props: ButtonDefaultProps,
  related: {
    settings: ButtonSettings,
  },
};
