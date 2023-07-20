import React, { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Switch,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import Web3 from "web3";
import { useSelector } from "react-redux";
import { web3Init } from "~/store/slices/web3Slice";
import { RootState } from "~/store/store";
import { buyNFT } from "~/utils/web3/buyNFT";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/router";

import { checkTargetForNewValues } from "framer-motion";

import { UseQueryResult, useMutation, useQuery } from "@tanstack/react-query";
import { CustomToast } from "../globalToast";

import { customTruncateHandler, renderNFTImage } from "~/utils/helper";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { approveContract } from "~/utils/web3/approveContract";
import { signSignature } from "~/utils/web3/listNft";
import { LoadingeModal } from "../Ui/LoadingModal";

const ListingPopup = ({ ...payload }: any) => {
  console.log({ payload });
  // alert
  const { addToast } = CustomToast();
  // states
  const { account }: any = useSelector((state: RootState) => state.web3);
  const { web3 } = useSelector((state: any) => state.web3);

  const [testSellType, setTestSellType] = useState({
    fixed: true,
    offer: false,
    auction: false,
  });
  const [sellType, setSellType] = useState<any>("fixed");
  const [auctionDate, setAuctionDate] = useState<any>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isListed, setIsListed] = useState(false);

  const today = new Date();
  const tomorrow = new Date();
  const custom = new Date();
  custom.setDate(today.getDate() + 14);
  const [percentage, setPercentage] = useState<any>({
    min: 0,
    max: 999,
  });
  // useform
  const {
    handleSubmit,
    register,
    control,
    watch,
    formState: { errors },
  } = useForm<any>();

  const nftUpdate = useMutation({
    mutationFn: async (payload) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/list-nft`,
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      return result;
    },
  });
  const handleSellTypeToggle = (type: string, state: any) => {
    let updatedSellType: any = {};
    if (type === "offer") {
      updatedSellType = { ...testSellType, [type]: !state, auction: false };
    } else if (type === "auction") {
      updatedSellType = { ...testSellType, [type]: !state, offer: false };
    } else {
      updatedSellType = { ...testSellType, [type]: !state };
    }

    setTestSellType(updatedSellType);
    setSellType(
      updatedSellType.fixed && updatedSellType.offer
        ? "fixed-offer"
        : updatedSellType.fixed && updatedSellType.auction
        ? "fixed-auction"
        : updatedSellType.offer
        ? "offer"
        : updatedSellType.auction
        ? "auction"
        : "fixed"
    );
  };
  // use effects

  useEffect(() => {
    const subscription = watch("is_listed");
    setIsListed(subscription);
  }, [watch("is_listed")]);
  useEffect(() => {
    const subscription = watch("price");
    console.log("sellType", sellType);
    if (subscription && +subscription > 0) {
      setPercentage({
        min: +((10 / 100) * +subscription),
        max: +((80 / 100) * +subscription),
      });
    }
  }, [watch("price"), sellType]);
  const handleClose = () => {
    payload?.setOpenListing(false);
    payload?.refetch();
    setIsLoading(false);
    setSellType("fixed");
    setAuctionDate(null);
    setIsListed(false);
  };
  async function onSubmit(values: any) {
    try {
      console.log(values, "values?.end_date");
      console.log(values, "values?.end_date");
      // const payload = { ...values, id: index };
      if (testSellType?.fixed || testSellType?.offer || testSellType?.auction) {
        if (account !== "") {
          if (account === payload?.selectNftListing?.owner_id) {
            setIsLoading(true);

            const isApprove: any = await approveContract(
              web3,
              account,
              payload?.selectNftListing?.contract_address
            );
            console.log({ isApprove });

            if (isApprove?.success) {
              const testSellTypeData =
                testSellType.fixed && testSellType.offer
                  ? "fixed-offer"
                  : testSellType.fixed
                  ? "fixed"
                  : testSellType.offer
                  ? "offer"
                  : "fixed";
              // payload for data passing
              const NFTpayload: any = {
                isOrderAsk: true,
                signer: account,
                baseAccount: payload?.selectNftListing?.creator_id,
                nftContract: payload?.selectNftListing?.contract_address,
                price:
                  sellType === "offer" || sellType === "auction"
                    ? 0
                    : values?.price,
                min_price: values?.min_price ? values?.min_price : 0,
                tokenId: payload?.selectNftListing?.token_id,
                // tax: +((2 / 100) * +values?.price).toFixed(5),
                nonce: "",
                signed_v: "0",
                signed_r: "",
                signed_s: "",
                nft_id: "",
                store_id: "",
                is_listed: values?.is_listed,
                //  domain_name: webDetails?.domain_name,
                sell_type: sellType,
                sign_price:
                  sellType === "offer" || sellType === "auction"
                    ? values?.min_price
                    : values?.price,
                tax:
                  sellType === "offer" || sellType === "auction"
                    ? +((2 / 100) * +values?.min_price).toFixed(5)
                    : +((2 / 100) * +values?.price).toFixed(5),
                royalty: +(
                  (+payload?.selectNftListing?.royalties / 100) *
                  +values?.price
                ).toFixed(5),
                check:
                  sellType === "offer" || sellType === "auction" ? false : true,
              };

              try {
                // if only offer or auction is selected on sell type we are not taking signature from user
                if (NFTpayload?.check) {
                  const sign = await signSignature(NFTpayload, web3);
                  const signature = sign?.sign.substring(2);
                  NFTpayload.signed_r = "0x" + signature.substring(0, 64);
                  NFTpayload.signed_s = "0x" + signature.substring(64, 128);
                  NFTpayload.signed_v = parseInt(
                    signature.substring(128, 130),
                    16
                  ).toString();
                  NFTpayload.nonce = sign?.nonce?.toString() || "";
                }

                NFTpayload.nft_id = payload?.selectNftListing?._id?.$oid || "";
                NFTpayload.store_id =
                  payload?.selectNftListing?.store_id?.$oid || "";
                // (sellType === 'auction') && payload.end_date = new Date()
                console.log(NFTpayload, "payload?.selectNftListing");
                if (sellType.includes("auction"))
                  NFTpayload.end_date = new Date(
                    values?.end_date == "custom"
                      ? +auctionDate
                      : +values?.end_date
                  );

                const data = await nftUpdate.mutateAsync(NFTpayload);

                if (data) {
                  addToast({
                    id: "list-toast",
                    message: "Nft Listed Successfully!",
                    type: "success",
                  });
                  handleClose();
                  //  router.push("/store/nfts");
                } else {
                  throw new Error("Something Went Wrong");
                }
              } catch (error: any) {
                setIsLoading(false);
                return addToast({
                  id: "list-toast",
                  message: error?.message,
                  type: "error",
                });
              }
            } else {
              throw new Error("Approval Not Given");
            }
          } else {
            throw new Error(
              `Please Connect to the wallet from  which NFT is minted! \n ${payload?.selectNftListing?.owner_id}`
            );
          }
        } else {
          throw new Error("Connect wallet first to proceed further!");
        }
      } else {
        throw new Error("Please Select Selling Method First!");
      }
    } catch (error: any) {
      setIsLoading(false);
      addToast({
        id: "list-toast",
        message: error?.message,
        type: "error",
      });
      console.log({ error });
    }
  }

  return (
    <>
      <Modal
        isOpen={payload?.openListing}
        onClose={() => handleClose()}
        scrollBehavior={"inside"}
      >
        <ModalOverlay />
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <ModalContent>
            <ModalHeader>NFT Listing</ModalHeader>
            <ModalCloseButton />

            <ModalBody>
              <div className="mx-3 p-3">
                <div className="flex items-center justify-center gap-3 rounded-full border border-gray-700 p-4">
                  {/* eth logo */}
                  <div className="flex items-center rounded-full bg-gray-300">
                    <i className="fa-brands fa-ethereum h-8 w-8 py-1.5 text-center "></i>
                  </div>

                  {/* account */}
                  <p>{customTruncateHandler(account, 15)}</p>

                  {/* connected */}
                  <div className="rounded-3xl bg-green-200 p-0.5 text-center">
                    <p className="px-1 text-[10px] text-green-900">Connected</p>
                  </div>
                </div>
              </div>
              {/* nft detail */}
              <div className="mx-3 p-3">
                <div className="flex items-center justify-start gap-3 rounded-xl border border-gray-700 p-2">
                  <div className="relative h-20 w-20">
                    <Image
                      src={renderNFTImage(payload?.selectNftListing)}
                      alt="/"
                      fill
                      priority
                      quality={100}
                      className="mx-auto rounded-xl  object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-bold">NFT Info</p>
                    <p>{payload?.selectNftListing.name}</p>
                    <p className="text-xs">
                      {customTruncateHandler(
                        payload?.selectNftListing.creator_id,
                        20
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mx-3 p-3">
                <div className="flex  items-center justify-between">
                  <FormLabel className="text-sm text-black/70">
                    List NFT
                  </FormLabel>
                  <Switch
                    size="md"
                    className="z-1"
                    {...register("is_listed")}
                    required
                    sx={{
                      "span.chakra-switch__track:not([data-checked])": {
                        backgroundColor: "#CBD5E0",
                      },
                      "span.chakra-switch__track": {
                        backgroundColor: "#BF1065",
                      },
                    }}
                  />
                </div>
                {watch("is_listed") && (
                  <>
                    <div>
                      <div className="mt-4 grid grid-cols-3 gap-2 align-middle">
                        <div
                          // onClick={() =>
                          //   handleSellTypeToggle('fixed', testSellType.fixed)
                          // }
                          className={`text-1xl h-26 flex cursor-pointer flex-col  items-center justify-center gap-2 rounded-md border p-2 shadow-md ${
                            testSellType.fixed
                              ? "border-2 border-black bg-ac-1 text-white"
                              : "bg-white text-black/60"
                          }`}
                        >
                          <i className="fal fa-solid fa-dollar-sign text-3xl"></i>
                          <span>Fixed Price</span>
                        </div>
                        <div
                          onClick={() =>
                            handleSellTypeToggle("offer", testSellType.offer)
                          }
                          className={`text-1xl h-26 flex cursor-pointer flex-col  items-center justify-center gap-2 rounded-md border p-2 shadow-md ${
                            testSellType.offer
                              ? "border-2 border-black bg-ac-1 text-white"
                              : "bg-white text-black/60"
                          }`}
                        >
                          <i className="fa-solid fa-hand-holding-dollar text-3xl"></i>

                          <span>Offer Price</span>
                        </div>
                        <div
                          onClick={() =>
                            handleSellTypeToggle(
                              "auction",
                              testSellType.auction
                            )
                          }
                          className={`text-1xl h-26 flex cursor-pointer flex-col items-center  justify-center gap-2 rounded-md border p-2 text-center shadow-md ${
                            testSellType.auction
                              ? "border-2 border-black bg-ac-1 text-white"
                              : "bg-white text-black/60"
                          }`}
                        >
                          <i className="fa-solid fa-hand-holding-dollar text-3xl"></i>

                          <span>Timed Auction</span>
                        </div>
                      </div>
                      <div className="mt-4">
                        {watch("is_listed") && (
                          <div className=" space-y-4">
                            {(testSellType.fixed || testSellType.offer) && (
                              <FormLabel>
                                <div className="flex items-center justify-between">
                                  <span>Add NFT information</span>
                                  <span>
                                    <Tooltip label="Offer and Auction Price vary from 10% to 80% of Fixed Price">
                                      <i className="fas fa-circle-info cursor-pointer  text-base text-gray-500 hover:text-gray-950" />
                                    </Tooltip>
                                  </span>
                                </div>
                              </FormLabel>
                            )}

                            <div className="flex flex-col gap-3 ">
                              {testSellType.fixed && watch("is_listed") && (
                                <FormControl
                                  variant="floating"
                                  id="first-name"
                                  fontWeight={400}
                                  isInvalid={errors.price ? true : false}
                                >
                                  <div className="!flex w-full !items-center justify-between rounded-md border bg-white p-1 transition ease-in-out">
                                    <InputGroup className="flex w-full items-center justify-between rounded-md bg-white p-1 text-black transition ease-in-out">
                                      <Input
                                        autoComplete="off"
                                        placeholder=" "
                                        size="md"
                                        borderRadius={"none"}
                                        type="number"
                                        defaultValue={
                                          payload?.selectNftListing?.price
                                            ? +payload?.selectNftListing?.price
                                            : 2
                                        }
                                        {...register("price", {
                                          valueAsNumber: true,
                                          required:
                                            "Fixed price field is required",
                                          min: {
                                            value: 0.1,
                                            message:
                                              "Fixed Price Should be greater than or equal to 2", // JS only: <p>error message</p> TS only support string
                                          },
                                        })}
                                        step={0.1}
                                        className="flex-1 !border-none !text-black  focus:!ring-0"
                                        _focusVisible={{
                                          borderTop: "none",
                                          borderRight: "none",
                                          borderLeft: "none",
                                        }}
                                      />

                                      <FormLabel
                                        fontSize="md"
                                        fontWeight={400}
                                        color="#A0AEC0"
                                        _focusVisible={{
                                          bg: "greens",
                                        }}
                                      >
                                        Fixed Price
                                      </FormLabel>
                                    </InputGroup>
                                    <Text className="pr-1 text-sm font-normal text-black/90">
                                      matic
                                    </Text>
                                  </div>
                                  {errors?.price ? (
                                    <FormErrorMessage>
                                      {errors?.price?.message as string}
                                    </FormErrorMessage>
                                  ) : (
                                    ""
                                  )}
                                </FormControl>
                              )}
                              {(testSellType.offer || testSellType.auction) &&
                                watch("is_listed") && (
                                  <>
                                    <FormControl
                                      variant="floating"
                                      id="first-name"
                                      fontWeight={400}
                                      isInvalid={
                                        errors.min_price ? true : false
                                      }
                                    >
                                      <div className="!flex w-full !items-center justify-between rounded-md border bg-white p-1 transition ease-in-out">
                                        <InputGroup className="flex w-full items-center justify-between rounded-md bg-white p-1 transition ease-in-out">
                                          <Input
                                            autoComplete="off"
                                            placeholder=" "
                                            size="md"
                                            borderRadius={"none"}
                                            type="number"
                                            defaultValue={
                                              payload?.selectNftListing
                                                ?.min_price
                                                ? +payload?.selectNftListing
                                                    ?.min_price
                                                : 2
                                            }
                                            {...register("min_price", {
                                              valueAsNumber: true,
                                              required:
                                                "Min price field is required",

                                              min: {
                                                value:
                                                  sellType == "offer" ||
                                                  sellType == "auction"
                                                    ? 2
                                                    : percentage?.min,
                                                message:
                                                  sellType == "offer" ||
                                                  sellType == "auction"
                                                    ? "Min Price Should be greater than or equal to 2"
                                                    : "The Price should be between " +
                                                      percentage?.min +
                                                      " - " +
                                                      percentage?.max,
                                              },
                                              max: {
                                                value:
                                                  sellType == "offer" ||
                                                  sellType == "auction"
                                                    ? 9999
                                                    : percentage?.max,
                                                message:
                                                  sellType == "offer" ||
                                                  sellType == "auction"
                                                    ? "Min Price Should be greater than or equal to 2"
                                                    : "The Price should be between " +
                                                      percentage?.min +
                                                      " - " +
                                                      percentage?.max, // JS only: <p>error message</p> TS only support string
                                              },
                                            })}
                                            step={0.001}
                                            // required
                                            className="flex-1 !border-none !text-black focus:!ring-0"
                                            _focusVisible={{
                                              borderTop: "none",
                                              borderRight: "none",
                                              borderLeft: "none",
                                            }}
                                          />

                                          <FormLabel
                                            fontSize="md"
                                            fontWeight={400}
                                            color="#A0AEC0"
                                            _focusVisible={{
                                              bg: "greens",
                                            }}
                                          >
                                            Min Offer Price
                                          </FormLabel>
                                        </InputGroup>
                                        <Text className="pr-1 text-sm font-normal text-black/90">
                                          matic
                                        </Text>
                                      </div>
                                      {errors?.min_price ? (
                                        <FormErrorMessage>
                                          {errors?.min_price?.message as string}
                                        </FormErrorMessage>
                                      ) : (
                                        ""
                                      )}
                                    </FormControl>
                                  </>
                                )}
                              {testSellType.auction && watch("is_listed") && (
                                <>
                                  <FormControl
                                    variant="floating"
                                    id="first-name"
                                    fontWeight={400}
                                  >
                                    <div className="!flex w-full !items-center justify-between rounded-md border bg-white p-2  transition ease-in-out">
                                      <Select
                                        autoComplete="off"
                                        size="md"
                                        borderRadius={"none"}
                                        {...register("end_date")}
                                        className="flex-1 !border-none text-black/90 placeholder:text-gt-1 focus:!ring-0"
                                        _focusVisible={{
                                          borderTop: "none",
                                          borderRight: "none",
                                          borderLeft: "none",
                                          background: "temp-3",
                                          borderBottomColor: "green-75",
                                          borderBottomWidth: "sm",
                                        }}
                                      >
                                        <option
                                          selected
                                          value={tomorrow.setDate(
                                            today.getDate() + 1
                                          )}
                                        >
                                          1 Day
                                        </option>
                                        <option
                                          value={tomorrow.setDate(
                                            today.getDate() + 2
                                          )}
                                        >
                                          2 Day
                                        </option>
                                        <option
                                          value={tomorrow.setDate(
                                            today.getDate() + 3
                                          )}
                                        >
                                          3 Day
                                        </option>
                                        <option
                                          value={tomorrow.setDate(
                                            today.getDate() + 4
                                          )}
                                        >
                                          4 Day
                                        </option>
                                        <option
                                          value={tomorrow.setDate(
                                            today.getDate() + 5
                                          )}
                                        >
                                          5 Day
                                        </option>
                                        <option
                                          value={tomorrow.setDate(
                                            today.getDate() + 6
                                          )}
                                        >
                                          6 Day
                                        </option>
                                        <option
                                          value={tomorrow.setDate(
                                            today.getDate() + 7
                                          )}
                                        >
                                          7 Day
                                        </option>
                                        <option value="custom">
                                          Add a Custom Date
                                        </option>
                                      </Select>
                                      <FormLabel
                                        fontSize="md"
                                        fontWeight={400}
                                        color="#A0AEC0"
                                        _focusVisible={{
                                          bg: "greens",
                                        }}
                                      >
                                        Auction End Date
                                      </FormLabel>
                                    </div>
                                    {/* {errors?.min_price ? (
                                  <FormErrorMessage>
                                    {errors?.min_price?.message as string}
                                  </FormErrorMessage>
                                ) : (
                                  ''
                                )} */}
                                  </FormControl>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
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
                List NFT
              </button>
            </ModalFooter>
          </ModalContent>
        </form>
        <LoadingeModal modalState={isLoading} />
      </Modal>
    </>
  );
};

export default ListingPopup;
