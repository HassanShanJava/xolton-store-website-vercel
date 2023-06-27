import { useEditor, Element } from "@craftjs/core";
import React, { useState } from "react";

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button as ChakraButton,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import {
  CardElement,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import { customTruncateHandler } from "~/utils/helper";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "~/store/store";
import { CustomToast } from "../globalToast";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      display: "flex !important",
      flexDirect: "column !important",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};
export const StripeModal = (props: any) => {
  const { user } = useSelector((state: any) => state.user);
  const { maticToUsd }: any = useSelector((state: RootState) => state.matic);

  // STRIPE
  const stripe = useStripe();
  const elements = useElements();
  const { addToast } = CustomToast();

  // states
  const [inputOffer, setInputOffer] = useState("5");
  const [stripeModalState, setStripeModalState] = useState(false);
  // queries for api
  const stripeConnect = useMutation({
    mutationFn: async (payload) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/token/checkout`,
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      return result;
    },
  });

  const handleModal = () => {
    //   props?.setBuy(false);
    setStripeModalState(true);
  };
  const handleSubmit = async (event: any) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();
    try {
      if (!stripe || !elements) {
        // Stripe.js hasn't yet loaded.
        throw new Error("Stripe.js hasn't yet loaded");
      }

      // const card: any = elements.getElement(CardNumberElement);
      const cardNumberElement: any = elements.getElement(CardNumberElement);
      const cardExpiryElement: any = elements.getElement(CardExpiryElement);
      const cardCvcElement: any = elements.getElement(CardCvcElement);
      // console.log(card);
      const result: any = await stripe.createToken(cardNumberElement);

      if (result.error) {
        // Show error to your customer.
        throw new Error(result.error.message);
      } else {
        if (+inputOffer * +maticToUsd >= 5) {
          const payload: any = {
            store_id: process.env.NEXT_PUBLIC_STORE_ID,
            token: result?.token?.id,
            store_customer_id: user?.id,
            wallet_address: props?.account,
            amount: +inputOffer * +maticToUsd * 100,
            //   amount: +inputOffer * 100,
          };
          const res = await stripeConnect.mutateAsync(payload);
          if (res) {
            props?.refetch();
            addToast({
              id: "transaction-id",
              message: "Your Transaction Completed Successfully",
              type: "success",
            });
          } else {
            throw new Error("Something Went Wrong!");
          }
        } else {
          throw new Error("The Amount should be greater than or equal to 5");
        }

        // Send the token to your server.
        // This function does not exist yet; we will define it in the next step.
        //    stripeTokenHandler(result.token);
      }
    } catch (e: any) {
      addToast({
        id: "transaction-id",
        message: e?.message,
        type: "error",
      });
    }
  };

  return (
    <>
      <>
        <button
          className="mb-1 mr-1 w-full rounded bg-bg-3 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-emerald-600"
          onClick={() => handleModal()}
        >
          Buy Matic
          {/* {props?.modalState ? "Close" : "Open"}  */}
        </button>
      </>
      <Modal
        isOpen={stripeModalState}
        onClose={() => setStripeModalState(false)}
        scrollBehavior={"inside"}
      >
        <ModalOverlay />
        <form
          onSubmit={(e: any) => {
            handleSubmit(e);
          }}
        >
          <ModalContent>
            <ModalHeader>Stripe Information</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {/* <Lorem count={2} /> */}
              <div className="mx-3 p-3">
                <div className="flex items-center justify-center gap-3 rounded-full border border-gray-700 p-4">
                  {/* eth logo */}
                  <div className="flex items-center rounded-full bg-gray-300">
                    <i className="fa-brands fa-ethereum h-8 w-8 py-1.5 text-center "></i>
                  </div>

                  {/* account */}
                  <p>{customTruncateHandler(props?.account, 15)}</p>

                  {/* connected */}
                  <div className="rounded-3xl bg-green-200 p-0.5 text-center">
                    <p className="px-1 text-[10px] text-green-900">Connected</p>
                  </div>
                </div>
              </div>
              <div className="m-4">
                <FormLabel>Matic </FormLabel>
                <InputGroup size="md">
                  {/* <InputLeftAddon children="https://" /> */}
                  <Input
                    placeholder="Offer Price"
                    defaultValue={5}
                    min={5}
                    type="number"
                    step={"any"}
                    required
                    maxLength={2}
                    onChange={(e) => setInputOffer(e.target.value)}
                  />
                  <InputRightAddon
                    children={`$  ${(
                      +inputOffer * (+maticToUsd as number)
                    ).toFixed(2)}`}
                  />
                </InputGroup>
              </div>
              <div className="ml-4 mr-4">
                {/* <label className=" !flex !flex-col">
                    Card details
                    <CardElement
                      className="flex h-10 flex-col rounded border border-gray-300 px-4 py-2 text-base"
                      options={CARD_ELEMENT_OPTIONS}
                    />
                  </label> */}
                <CardSection />
              </div>
              <div className="flex  w-full  flex-col items-stretch justify-center space-y-4 md:flex-row md:space-x-6 md:space-y-0 xl:space-x-8">
                <div className="flex w-full flex-col space-y-6 bg-gray-50 px-4 py-6 dark:bg-gray-800 md:p-6 xl:p-8">
                  <h3 className="text-xl font-semibold leading-5 text-gray-800 dark:text-white">
                    Summary
                  </h3>
                  <div className="flex w-full flex-col items-center justify-center space-y-4 border-b border-gray-200 pb-4">
                    <div className="flex w-full justify-between">
                      <p className="text-base leading-4 text-gray-800 dark:text-white">
                        Subtotal
                      </p>
                      <p className="text-base leading-4 text-gray-600 dark:text-gray-300">
                        ${(+inputOffer * (+maticToUsd as number)).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex w-full items-center justify-between">
                      <p className="text-base leading-4 text-gray-800 dark:text-white">
                        Stripe Tax{" "}
                      </p>
                      <p className="text-base leading-4 text-gray-600 dark:text-gray-300">
                        (2.9% + 0.30 cent) - $
                        {
                          +(
                            (2.9 / 100) *
                              (+inputOffer * (+maticToUsd as number)) +
                            0.3
                          ).toFixed(2)
                        }{" "}
                      </p>
                    </div>
                    <div className="flex w-full items-center justify-between">
                      <p className="text-base leading-4 text-gray-800 dark:text-white">
                        Total Price
                      </p>
                      <p className="text-base leading-4 text-gray-600 dark:text-gray-300">
                        $
                        {(
                          +inputOffer * (+maticToUsd as number) -
                          +((2.9 / 100) * +inputOffer + 0.3)
                        ).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="flex w-full items-center justify-between">
                    <p className="text-base font-semibold leading-4 text-gray-800 dark:text-white">
                      Total Matic Recieve
                    </p>
                    <p className="text-base font-semibold leading-4 text-gray-600 dark:text-gray-300">
                      {/* $ */}
                      {(
                        (+inputOffer * (+maticToUsd as number) -
                          +((2.9 / 100) * +inputOffer + 0.3)) /
                        +maticToUsd
                      ).toFixed(2)}{" "}
                      - matic
                    </p>
                  </div>
                </div>
              </div>
            </ModalBody>

            <ModalFooter>
              {/* <ChakraButton
                colorScheme="blue"
                mr={3}
                onClick={() => setStripeModalState(!stripeModalState)}
              >
                Close
              </ChakraButton> */}
              <button className="ml-4 mr-4 w-full rounded bg-bg-3 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-emerald-600">
                Pay Amount
              </button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
};
const CardSection = ({}: any) => {
  return (
    <div>
      <CardInput
        label="Card Number"
        element={
          <CardNumberElement
            options={
              {
                /* additional options */
              }
            }
          />
        }
      />
      <CardInput
        label="Expiration Date"
        element={
          <CardExpiryElement
            options={
              {
                /* additional options */
              }
            }
          />
        }
      />
      <CardInput
        label="CVC"
        element={
          <CardCvcElement
            options={
              {
                /* additional options */
              }
            }
          />
        }
      />
    </div>
  );
};

const CardInput = ({ label, element }: any) => {
  return (
    <div className="mb-4">
      <FormLabel>{label}</FormLabel>

      {/* <label className="block text-sm font-medium text-gray-700"></label> */}
      <div className="inline-block h-full w-full items-center justify-center rounded border border-gray-300 px-4 py-2 text-base">
        {element}
      </div>
    </div>
  );
};
