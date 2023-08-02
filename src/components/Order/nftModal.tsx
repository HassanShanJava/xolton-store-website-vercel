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
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "~/store/store";
import { offerAccept } from "~/utils/web3/offerAccept";
import { LoadingeModal } from "../Ui/LoadingModal";
// import { trpc } from '~/utils/trpc';

export default function UpdateModal(props: any) {
  const { user }: any = useSelector((state: RootState) => state.user);

  const { web3, account } = useSelector((state: RootState) => state.web3);
  const [isLoading, setIsLoading] = useState(false);
  // TOAST
  const toast = useToast();
  const router = useRouter();
  // upload NFT API

  const offerReject = useMutation({
    mutationFn: async (payload: any) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/offer-nft/reject`,
        {
          method: "PUT",
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      return result;
    },
  });
  const offerAcceptApi = useMutation({
    mutationFn: async (payload: any) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/offer-nft/accept`,
        {
          method: "PUT",
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      return result;
    },
  });

  // const { onClose } = useDisclosure();
  // const handleClose = () => {
  //   // router.push('/store/nfts');
  //   props?.setIsModal(false);
  // };
  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      const offerData: any = props?.selectNft;

      const payload: any = {};
      if (props?.title?.includes("Reject")) payload.offer_id = offerData?.id;
      if (props?.title?.includes("Reject")) {
        const data = await offerReject.mutateAsync({ ...payload });

        if (data.success) {
          toast({
            title: "Offer cancelled successfully!",
            status: "success",
            isClosable: true,
            position: "top-right",
          });
          props.refetch();
          props?.setIsModal(false);
        } else {
          throw new Error(data?.message); // Example of throwing a generic error
        }
      } else if (props?.title?.includes("Accept")) {
        setIsLoading(true);
        const data: any = offerData?.StoreMakerOffer[0];
        const payload: any = {
          isOrderAsk: data?.is_order_ask,
          baseAccount: data?.base_account,
          nftContract: data?.nft_contract,
          royalty: Number(
            +(
              (+offerData?.store_nfts?.royalties / 100) *
              offerData?.offer_amount
            ).toFixed(5)
          ),

          ...data,
        };
        const Acceptdata: any = await offerAccept(
          web3,
          account as string,
          payload
        );
        const dataPayload: any = {
          offer_id: offerData?.id,
          nft_id: offerData?.store_nfts?.id,
          store_id: user?.id,
          nft_name: offerData?.store_nfts?.name,
          total_royalty: (+offerData?.store_nfts.royalties / 100) * data?.price,
          amount: +(data?.price - data?.tax).toFixed(4),

          total_amount: data?.price, // 2.04
          net_amount: +(data?.price - 2 * +data?.tax).toFixed(4), // 1.96
          total_tax: 2 * +data?.tax,
          previous_owner_email: user?.email,
          owner_email: offerData?.store_customers?.email,
          store_customer_id: offerData?.store_customers?.id,
          ...Acceptdata,
          sell_type: offerData?.store_nfts.sell_type.includes("offer")
            ? "offer"
            : "auction",
        };
        if (!Acceptdata?.success) {
          throw new Error(Acceptdata?.message);
        }
        if (dataPayload?.success) delete dataPayload?.success;
        const response = await offerAcceptApi.mutateAsync({ ...dataPayload });

        if (response.success) {
          toast({
            title: "The Offer has been Accepted successfully!",
            status: "success",
            isClosable: true,
            position: "top-right",
          });
          props.refetch();
          setIsLoading(false);
          props?.setIsModal(false);
        } else {
          throw new Error("This is a generic error."); // Example of throwing a generic error
        }

      }
    } catch (e) {
      console.log(e);
      setIsLoading(false);

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
      <Modal
        isCentered
        isOpen={props?.isModal}
        onClose={() => props?.setIsModal(false)}
      >
        <ModalOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(10px) hue-rotate(90deg)"
        />
        <ModalContent>
          <ModalHeader className="text-center">
            Are you sure you want to{" "}
            <span className="text-ac-2">{props?.title}</span> this{" "}
            {props?.sell_type ? "Offer" : "Bid"}?
          </ModalHeader>
          {/* <ModalCloseButton /> */}
          {/* <ModalBody pb={6}>Do you Really want to Unlist item?</ModalBody> */}
          <ModalFooter className=" items-center justify-center">
            <Button
              mr={3}
              // isDisabled={offerReject.isLoading}
              onClick={() => props?.setIsModal(false)}
              className="!bg-gray-400 text-white hover:!bg-gray-500"
            >
              Close
            </Button>
            <Button
              mr={3}
              // isLoading={offerReject.isLoading || isLoading}
              // loadingText={props?.title}
              // isDisabled={offerReject.isLoading || isLoading}
              onClick={() => handleSubmit()}
              className="!bg-ac-2 text-white hover:!bg-ac-2"
            >
              {props?.title}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <LoadingeModal modalState={isLoading} />
    </>
  );
}
