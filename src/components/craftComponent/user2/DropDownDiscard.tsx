import { Element, useNode } from '@craftjs/core';
import React from 'react';

import { Button } from './Button';
import { Container } from './Container';
import { Text } from './Text';
import { DropDownItem } from './DropDownItem';
import {
  Accordion,
  FormControl,
  FormLabel,
  Input,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from '@chakra-ui/react';

export const CardTop = ({ children, ...props }: any) => {
  const {
    connectors: { connect },
  } = useNode();
  return (
    <div {...props} ref={connect} className=" w-full  space-y-2 gap-2">
      {children}
    </div>
  );
};

CardTop.craft = {
  rules: {
    canMoveIn: (incomingNodes) =>
      incomingNodes.every((incomingNode) => incomingNode.data.type === Text),
  },
};
export const CardBottom = ({ children, ...props }: any) => {
  const {
    connectors: { connect },
  } = useNode();
  return (
    <div {...props} style={{ padding: '10px 0' }} ref={connect}>
      {children}
    </div>
  );
};

CardBottom.craft = {
  rules: {
    canMoveIn: (incomingNodes) =>
      incomingNodes.every(
        (incomingNode) => incomingNode.data.type === DropDownItem,
      ),
  },
  selected: true,
};
export const DropDown = ({ background, padding, ...props }: any) => {
  return (
    <Container {...props} background={background} padding={padding}>
      <Element canvas id="text" is={CardTop} data-cy="card-top">
        <Text text="Only texts" fontSize={20} data-cy="card-top-text-1" />
        <Text
          text="are allowed up here"
          fontSize={15}
          data-cy="card-top-text-2"
        />
      </Element>
      {/* <Element canvas id="buttons" is={CardBottom} data-cy="card-bottom">
        <Button
          size="small"
          text="Only buttons down here"
          data-cy="card-bottom-button"
        />
      </Element> */}
    </Container>
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

      <FormControl size="small"></FormControl>
    </div>
  );
};
export const ContainerDefaultProps = {
  background: '#ffffff',
  padding: 20,
};
DropDown.craft = {
  props: ContainerDefaultProps,
  related: {
    settings: ContainerSettings,
  },
};
