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
  } from '@chakra-ui/react';
  import { useRouter } from 'next/router';
  import { useSelector } from 'react-redux';
  import { RootState } from '~/store/store';
  export const MintSteps = (props: any) => {
    const status =
      props.status === 'complete'
        ? 'data'
        : props.status === 'loading'
        ? 'loading'
        : 'data';
  
    return (
      <div className="flex justify-start gap-2 items-center  w-full h-20 ">
        <div className={`flex  ${status}  rounded-full`}>
          {props.status === 'complete' ? (
            <i className="fa-solid fa-check  text-2xl text-green-800"></i>
          ) : props.status === 'loading' ? (
            <i className="fa-solid fa-spinner fa-spin text-2xl"></i>
          ) : (
            <i className="fa-solid fa-spinner text-2xl"></i>
          )}
        </div>
        <div className="text-black flex flex-col ">
          <div className="text-black font-medium">{props.heading}</div>
          <div className="text-black text-sm">{props.text}</div>
        </div>
      </div>
    );
  };
  
  export default function OfferSignModal(props: any) {
    const { onClose } = useDisclosure();
    const router = useRouter();
    const { nftStep } = useSelector((state: RootState) => state.nftOffer);

    const handleClose = () => {
      router.push('/');
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
              {nftStep == null ? (
                <Text></Text>
              ) : (
                props?.offerStepsData.map((item: any, index: number) => {
                  const status =
                    nftStep! > index + 1
                      ? 'complete'
                      : nftStep === index + 1
                      ? 'loading'
                      : 'waiting';
                  return <MintSteps key={index} status={status} {...item} />;
                })
              )}
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
  