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
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";

export default function UpdateModal(props: any) {
  // TOAST
  const toast = useToast();
  // upload NFT API
  const nftUpdate = useMutation({
    mutationFn: async (payload: any) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/offer-nft?${new URLSearchParams(
          payload
        ).toString()}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();
      return result;
    },
  });
  const { onClose } = useDisclosure();
  const router = useRouter();
  const handleClose = () => {
    // router.push("/store/nfts");
    props?.setIsModal(false);
  };
  const handleSubmit = async () => {
    try {
      const nftData = props?.selectNft;

      const payload: any = {};
      if (props?.title?.includes("Offer")) {
        payload.offer_id = props?.selectedOffer?.id;
        const data = await nftUpdate.mutateAsync({ ...payload });
        if (data) {
          toast({
            title: "Your offer  cancelled successfully!",
            status: "success",
            isClosable: true,
            position: "top-right",
          });
          props.refetch();
          props?.setIsModal(false);
        } else {
          throw new Error("This is a generic error."); // Example of throwing a generic error
        }
      }
    } catch (e) {
      console.log(e);

      toast({
        title: "something Went Wrong!",
        status: "error",
        isClosable: true,
        position: "top-right",
      });
    }
  };
  return (
    <>
      <Modal isCentered isOpen={props?.isModal} onClose={onClose}>
        <ModalOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(10px) hue-rotate(90deg)"
        />
        <ModalContent>
          <ModalHeader className="text-center">
            Are you sure you want to cancel
            <span className="text-ac-2"> {props?.title}</span>?
          </ModalHeader>
          {/* <ModalCloseButton /> */}
          {/* <ModalBody pb={6}>Do you Really want to Unlist item?</ModalBody> */}
          <ModalFooter className=" items-center justify-center">
            <Button
              mr={3}
              isDisabled={nftUpdate.isLoading}
              onClick={() => handleClose()}
              className="!bg-gray-400 text-white hover:!bg-gray-500"
            >
              Close
            </Button>
            <Button
              mr={3}
              isLoading={nftUpdate.isLoading}
              loadingText="Save"
              isDisabled={nftUpdate.isLoading}
              onClick={() => handleSubmit()}
              className="!bg-ac-2 text-white hover:!bg-ac-2"
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
