import { useForm } from "react-hook-form";
import {
  Input,
  InputGroup,
  Text,
  Button,
  FormLabel,
  Textarea,
  FormControl,
  InputLeftAddon,
} from "@chakra-ui/react";

import Image from "next/image";
import Character from "~/public/images/character.svg";
import { FileInput, FileInput2, SeoImage } from "./Input";
import { useEffect, useState } from "react";
import { CustomToast } from "../globalToast";
import { isValidImageType } from "~/utils/helper";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "~/store/store";
import { getS3ImageUrl } from "service/api/s3Url.service";
import { useMutation } from "@tanstack/react-query";
import { setUserProcess } from "~/store/slices/authSlice";
import { LoadingeModal } from "./LoadingModal";

export default function SettingsForm({}: any) {
  const { addToast } = CustomToast();
  const { register, reset, getValues, setValue, handleSubmit } = useForm<any>();
  const { user }: any = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const [imageName, setImageName] = useState<any>("");
  const [optimizeFile, setOptimizeFile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<any>(false);
  const [optimizeFile1, setOptimizeFile1] = useState<any>(null);

  const updateUser = useMutation({
    mutationFn: async (payload) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/store-customer/update`,
        {
          method: "PUT",
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      return result;
    },
  });
  useEffect(() => {
    if (user) {
      console.log({ user });
      setValue("full_name", user?.full_name);
      setValue("bio", user?.bio);
      user?.profile_pic && setValue("profile_pic", user?.profile_pic);
      user?.cover_pic && setValue("cover_pic", user?.cover_pic);
      setValue("facebook", user?.facebook);
      setValue("twitter", user?.twitter);
      setValue("instagram", user?.instagram);
      // setImageState(user?.profile_pic);
    }
  }, [user]);

  const onSubmit = async (values: any) => {
    try {
      setIsLoading(true);
      const actualData = { ...values };
      // console.log({ actualData });

      if (actualData?.profile_pic) delete actualData?.profile_pic;
      if (actualData?.cover_pic) delete actualData?.cover_pic;
      if (actualData?.type) delete actualData?.type;

      const imageData: any =
        typeof getValues("profile_pic") !== "object"
          ? { profile_pic: values?.profile_pic }
          : await uploadOnS3Handler(optimizeFile1, "profile_pic");
      const covrData: any =
        typeof getValues("cover_pic") !== "object"
          ? { cover_pic: values?.cover_pic }
          : await uploadOnS3Handler(optimizeFile1, "cover_pic");

      const payload = {
        store_id: process.env.NEXT_PUBLIC_STORE_ID,
        store_customer_id: user?.id,
        ...imageData,
        ...covrData,
        ...actualData,
      };
      console.log({ payload });
      const res = await updateUser.mutateAsync(payload);
      if (res.success) {
        addToast({
          id: "registered",
          type: "success",
          message: "Registered Successfully!",
        });

        console.log(res.data);
        localStorage.setItem("store_customer", JSON.stringify(res.data));
        dispatch(setUserProcess(res.data));
        setIsLoading(false);
      } else {
        throw new Error(res.message);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);

      addToast({
        id: "contract-toast",
        message: `Something Went Wrong!`,
        type: "error",
      });
    }
  };
  // UPLOAD ON S3 BUCKET
  async function uploadOnS3Handler(optimizeFile: any, type: string) {
    if (optimizeFile?.name) {
      const response = await getS3ImageUrl(optimizeFile);
      if (!response.success)
        return console.log("response.message", response.message);

      const isImage = isValidImageType(optimizeFile?.type);

      const nftSource = {
        [type]: "",
      };

      if (isImage) {
        nftSource[type] = response?.data;
      }

      return nftSource;
    } else {
      return console.log("Please Select Image");
    }
  }
  return (
    <>
      <div className="flex h-auto  justify-center bg-bg-1 py-10">
        <div className=" flex flex-col xss:px-6 sm:px-6  md:px-6  lg:w-1/2 lg:px-0 ">
          <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            <div className="w-full space-y-4">
              <Text className="text-4xl tracking-tight text-pm-10">
                Setting{" "}
              </Text>
              <Text className="mt-2 text-base text-pm-4">
                Lorem ipsum dolor sit amet consectetur. Lacus in quis ipsum
                aliquam eu amet duis. Id dignissim massa pellentesque aliquet mi
                placerat.
              </Text>
              {/* INPUTS */}
              {/* IMAGE UPLOAD  */}
              <InputGroup className="flex w-full items-center justify-between rounded-md !bg-white p-1 transition ease-in-out">
                {/* <FileInput2
                  register={register("thumb")}
                  reset={reset}
                  getValues={getValues}
                  setValue={setValue}
                  placeholder={"Upload Cover"}
                /> */}
                {user && (
                  <SeoImage
                    register={register(`cover_pic`)}
                    name={"cover_pic"}
                    reset={reset}
                    getValues={getValues}
                    setValue={setValue}
                    setOptimizeFile={setOptimizeFile1}
                    seoData={user}
                    setImageName={setImageName}
                    placeholder={`Upload Cover`}
                  />
                )}
              </InputGroup>
              <div className="z-50  w-full">
                <div
                  // columns={[1, 2, 2, 2, 2]}
                  // spacing={4}
                  className="grid w-full  items-center justify-between gap-3 rounded-md transition  ease-in-out xs:grid-cols-1 sm:grid-cols-1 md:grid-cols-5"
                >
                  <div className="col-span-3 gap-2 space-y-5">
                    <FormLabel className="text-sm text-black/70">
                      Full Name
                    </FormLabel>

                    <InputGroup className="flex w-full items-center justify-between rounded-md bg-white p-1 transition ease-in-out">
                      <Input
                        autoComplete="off"
                        placeholder=" Full Name"
                        size="md"
                        {...register("full_name")}
                        borderRadius={"none"}
                        maxLength={36}
                        className="flex-1 !border-none   focus:!ring-0"
                      />
                    </InputGroup>
                    <InputGroup className="col-span-3 w-full flex-1 items-center justify-between rounded-md bg-white p-1 transition ease-in-out">
                      <Textarea
                        placeholder="Description"
                        {...register("bio")}
                        maxLength={250}
                        className="!h-40 flex-1 !border-none  placeholder:text-gt-1 focus:!ring-0"
                      />{" "}
                    </InputGroup>

                    {/* CATEGORY */}
                  </div>
                  <div className="relative col-span-2 flex  w-full items-center justify-center gap-2  space-y-5 bg-white p-1  ">
                    {user && (
                      <SeoImage
                        register={register(`profile_pic`)}
                        name={"profile_pic"}
                        reset={reset}
                        getValues={getValues}
                        setValue={setValue}
                        setOptimizeFile={setOptimizeFile}
                        seoData={user}
                        setImageName={setImageName}
                        placeholder={`Upload Profile`}
                      />
                    )}
                  </div>
                </div>
              </div>
              <FormLabel className="text-sm text-black/70">Socials</FormLabel>
              <InputGroup
                size="sm"
                className="flex w-full items-center justify-between rounded-md bg-white p-1 transition ease-in-out"
              >
                <InputLeftAddon
                  children="https://facebook.com/"
                  className=" !w-1/4"
                />
                <Input
                  type="text"
                  placeholder="Facebook ID"
                  autoComplete="off"
                  {...register("facebook")}
                  maxLength={26}
                  borderRadius={"none"}
                  className="flex-1   focus:!ring-0"
                />
              </InputGroup>
              <InputGroup
                size="sm"
                className="flex w-full items-center justify-between rounded-md bg-white p-1 transition ease-in-out"
              >
                <InputLeftAddon
                  children="https://twitter.com/"
                  className=" !w-1/4"
                />
                <Input
                  type="text"
                  placeholder="Twitter ID"
                  autoComplete="off"
                  {...register("twitter")}
                  borderRadius={"none"}
                  maxLength={26}
                  className="flex-1   focus:!ring-0"
                />
              </InputGroup>
              <InputGroup
                size="sm"
                className="flex w-full items-center justify-between rounded-md bg-white p-1 transition ease-in-out"
              >
                <InputLeftAddon
                  children="https://instagram.com/"
                  className=" !w-1/4"
                />
                <Input
                  type="text"
                  placeholder="Instagram ID"
                  autoComplete="off"
                  borderRadius={"none"}
                  {...register("instagram")}
                  maxLength={26}
                  className="flex-1   focus:!ring-0"
                />
              </InputGroup>

              {/* TEXT AREA */}

              <div className="ml-auto mt-10 !flex gap-2">
                <Button
                  type="submit"
                  className="hover:!bg-gray ml-auto w-20 !bg-transparent text-black/70"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className=" w-20 !bg-ac-2 text-white hover:!bg-ac-2"
                >
                  Submit
                </Button>
              </div>
            </div>
          </form>
        </div>
        <LoadingeModal modalState={isLoading} />
      </div>
    </>
  );
}
