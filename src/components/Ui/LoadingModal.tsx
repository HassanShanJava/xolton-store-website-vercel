import {
  Button,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
  useDisclosure,
  Spinner,
  ModalBody,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

export function LoadingeModal(props: any) {
  // upload NFT API

  const { onClose } = useDisclosure();

  return (
    <>
      <Modal isCentered isOpen={props?.modalState} onClose={onClose}>
        <ModalOverlay
          bg="blackAlpha.300 !important"
          zIndex={"10"}
          backdropFilter="blur(1px) grayscale(1)"
        />
        <ModalContent
          className=" !bg-transparent"
          bg={"transaprent"}
          shadow={"none"}
        >
          <ModalHeader className="!bg-transparent text-center">
            <Spinner size="xl" className=" text-bg-3" thickness={"4px"} />
          </ModalHeader>
          {/* <ModalCloseButton /> */}
          {/* <ModalBody pb={6}>Do you Really want to Unlist item?</ModalBody> */}
        </ModalContent>
      </Modal>
    </>
  );
}
