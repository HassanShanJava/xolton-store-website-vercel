import { useToast } from "@chakra-ui/react";
import React from "react";
import { useForm } from "react-hook-form";
import { api } from "~/utils/api";
import { trpc } from "~/utils/trpc";

const ContactUs = () => {
  const { handleSubmit, register } = useForm<any>();

  const emailSend = trpc.clientEmail.sendEmail.useMutation({
    onSuccess: () => {
      console.log("success");
    },
    onError(error: any) {
      console.log({ error });
    },
  });
  const toast = useToast();

  const onSubmit = async (values: any) => {
    try {
      console.log(values, "values::");
      const payload={
        ...values,
        store_id:process.env.NEXT_PUBLIC_STORE_ID,
      }
      const response: any = await emailSend.mutateAsync(payload);

      toast({
        title: "Your message delivered to concern.",
        status: "success",
        isClosable: true,
        position: "top-left",
      });
    } catch (e) {
      console.log(e);
      toast({
        title: "Something went wrong!",
        status: "error",
        isClosable: true,
        position: "top-left",
      });
    }
  };
  return (
    <>
      <div className="max-h-full min-h-screen w-full  bg-bg-1 px-8 py-4">
        <div className="mx-auto mt-4 grid max-w-screen-xl grid-cols-1 gap-8 rounded-lg  px-8 py-16 text-gray-900 shadow-md md:grid-cols-2 md:px-12 lg:px-16 xl:px-32">
          <div className="flex flex-col justify-between">
            <div>
              <h2 className="bg-accentLinear-1 bg-clip-text text-4xl font-bold leading-tight text-transparent lg:text-5xl">
                Lets talk about everything!
              </h2>
              <div className="mt-6 text-gray-700">
                Hate forms? Send us an{" "}
                <span className="cursor-pointer underline">email</span> instead.
              </div>
            </div>
            <div className="mt-6 text-center"></div>
          </div>
          <form className="" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <span className="text-sm font-bold uppercase text-gray-600">
                Full Name
              </span>
              <input
                className="focus:shadow-outline mt-2 w-full rounded-lg bg-gray-300 p-3 text-gray-900 focus:outline-none"
                type="text"
                {...register("name")}
                placeholder=""
              />
            </div>
            <div className="mt-6">
              <span className="text-sm font-bold uppercase text-gray-600">
                Email
              </span>
              <input
                className="focus:shadow-outline mt-2 w-full rounded-lg bg-gray-300 p-3 text-gray-900 focus:outline-none"
                type="email"
                {...register("email")}
                required
              />
            </div>
            <div className="mt-6">
              <span className="text-sm font-bold uppercase text-gray-600">
                Message
              </span>
              <textarea
                required
                {...register("message")}
                className="focus:shadow-outline mt-2 h-32 w-full rounded-lg bg-gray-300 p-3 text-gray-900 focus:outline-none"
              ></textarea>
            </div>
            <div className="mt-6">
              <button
                type="submit"
                className="focus:shadow-outline w-full rounded-lg bg-black p-3 text-sm font-bold uppercase tracking-wide text-gray-100 focus:outline-none"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ContactUs;
