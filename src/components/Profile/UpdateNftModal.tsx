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

export default function UpdateNftModal(props: any) {
  // TOAST
  const toast = useToast();
  // upload NFT API

  const nftUpdate = useMutation({
    mutationFn: async (payload: any) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/list-nft`,
        {
          method: "PUT",
          body: JSON.stringify(payload),
          cache:"force-cache",
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
      const nftData = props?.selectNftListing;

      if (props?.title?.includes("Unlist")) {
        const payload: any = {
          nft_id: nftData?._id.$oid,
        };
        if (props?.title?.includes("Unlist")) payload.is_listed = false;
        if (props?.title?.includes("Unlist")) payload.price = 0;
        if (props?.title?.includes("Unlist")) payload.min_price = 0;
        if (props?.title?.includes("Unlist")) payload.sell_type = "";
        if (props?.title?.includes("Unlist")) payload.tax = 0;
        if (
          props?.selectNft?.sell_type?.includes("offer") ||
          props?.selectNft?.sell_type?.includes("auction")
        )
          payload.cancel = true;

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
            Are you sure you want to
            <span className="text-ac-2"> {props?.title}</span> this NFT?
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
