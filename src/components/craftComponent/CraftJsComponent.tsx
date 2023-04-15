import React, { useState } from "react";
import { Editor, Frame, Element } from "@craftjs/core";
import { Button } from "~/components/craftComponent/user2/Button";
import {
  Card,
  CardBottom,
  CardTop,
} from "~/components/craftComponent/user2/Card";
import { Container } from "~/components/craftComponent/user2/Container";
import Images from "~/components/craftComponent/user2/Image";
import { Text } from "~/components/craftComponent/user2/Text";
import { DropDownItem } from "~/components/craftComponent/user2/DropDownItem";
import lz from "lzutf8";

export default function CraftJsComponent(props: any) {
  const blogData: any = lz.decompress(
    lz.decodeBase64(props.storeBlogsData?.data)
  );
  //  actions.deserialize(json);
  return (
    <div
      className={`   w-full
         bg-white`}
    >
      {blogData && (
        <Editor
          resolver={{
            Card,
            Button,
            Text,
            Container,
            CardTop,
            CardBottom,
            Images,
            DropDownItem,
          }}
          enabled={false}
        >
          <Frame data={blogData}>
            <Element canvas is={Container} data-cy="root-container"></Element>
          </Frame>
        </Editor>
      )}
    </div>
  );
}
