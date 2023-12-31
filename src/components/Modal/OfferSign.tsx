import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "~/store/store";
export const MintSteps = (props: any) => {
  const status =
    props.status === "complete"
      ? "data"
      : props.status === "loading"
      ? "loading"
      : "data";

  return (
    <div className="flex h-20 w-full items-center  justify-start gap-2 ">
      <div className={`flex  ${status}  rounded-full`}>
        {props.status === "complete" ? (
          <i className="fa-solid fa-check  text-2xl text-green-800"></i>
        ) : props.status === "loading" ? (
          <i className="fa-solid fa-spinner fa-spin text-2xl"></i>
        ) : (
          <i className="fa-solid fa-spinner text-2xl"></i>
        )}
      </div>
      <div className="flex flex-col text-black ">
        <div className="font-medium text-black">{props.heading}</div>
        <div className="text-sm text-black">{props.text}</div>
      </div>
    </div>
  );
};

export default function OfferSignModal(props: any) {
  const { onClose } = useDisclosure();
  const router = useRouter();
  const { nftStep } = useSelector((state: RootState) => state.nftOffer);

  const handleClose = () => {
    router.push("/");
    props?.setModalState(false);
  };
  return (
    <>
      <Modal isCentered isOpen={props?.modalState} onClose={onClose}>
        <ModalOverlay
          // bg="white"
          backdropFilter="blur(10px) hue-rotate(90deg)"
        />
        <ModalContent>
          <ModalHeader>{props?.title}</ModalHeader>
          {/* <ModalCloseButton /> */}
          <ModalBody className="bg-white">
            {nftStep == null
              ? props?.offerStepsData.map((item: any, index: number) => {
                  const status =
                    nftStep! > index + 1
                      ? "complete"
                      : nftStep === index + 1
                      ? "loading"
                      : "waiting";
                  return <MintSteps key={index} status={status} {...item} />;
                })
              : props?.offerStepsData.map((item: any, index: number) => {
                  const status =
                    nftStep! > index + 1
                      ? "complete"
                      : nftStep === index + 1
                      ? "loading"
                      : "waiting";
                  return <MintSteps key={index} status={status} {...item} />;
                })}
          </ModalBody>
          <ModalFooter>
            {(nftStep == null || nftStep == 4) && (
              <Button
                mr={3}
                onClick={() => handleClose()}
                className="!bg-ac-2 text-white hover:!bg-ac-2"
              >
                Close
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
