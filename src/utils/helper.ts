import Banner from "~/public/images/banner.png";

export function generateOTP(otp_length = 0) {
  const digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < otp_length; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}

export function formatTrpcError(trpcError = "Something went wrong!" as string) {
  if (trpcError?.includes("[\n  {\n  ")) {
    const formattedError = JSON.parse(trpcError);
    const msgError =
      formattedError?.length > 0
        ? formattedError[0].message
        : "Internal server error";
    return msgError;
  } else {
    return trpcError;
  }
}

// CONCAT DATA
export function customTruncateHandler(str = "", n = 10) {
  return str?.length > n ? str?.slice(0, n) + "..." : str;
}
// VALIDATE IMAGE TYPE
export function isValidImageType(type: any) {
  const isImage = type?.includes("image/") && type !== "image/gif";
  return isImage;
}
export function renderNFTImage(nft: any) {
  return nft?.media_type === "audio/mp3" || nft?.thumb === ""
    ? ""
    : `${process.env.NEXT_PUBLIC_CLOUD_FRONT_BASE_URL}/${nft?.thumb}`;
}
export function renderImage(nft: any) {
  return !nft && nft === ""
    ? ""
    : `${process.env.NEXT_PUBLIC_CLOUD_FRONT_BASE_URL}/${nft}`;
}
export function renderNFTIcon(nft: any) {
  return `${process.env.NEXT_PUBLIC_CLOUD_FRONT_BASE_URL}/${nft?.logo_image}`;
}
export function renderBanner(nft: any) {
  return `${process.env.NEXT_PUBLIC_CLOUD_FRONT_BASE_URL}/${nft?.banner_image}`;
}

export const displayDate = (payload: any) => {
  const date = new Date(payload);
  const ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(date);
  const mo = new Intl.DateTimeFormat("en", { month: "short" }).format(date);
  const da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(date);
  const formattedDate = `${da}-${mo}-${ye}`;
  return formattedDate;
};

export async function maticToUSD(price = 0 as number) {
  try {
    const data = await fetch(
      "https://min-api.cryptocompare.com/data/histoday?fsym=MATIC&tsym=USD&limit=1&aggregate=1&e=Cexio", {
      cache: "force-cache",
    }
    );

    const response = await data.json();

    const maticPrice = +response.Data[1].open * Number(price);

    return `${maticPrice.toFixed(3)}`;
  } catch (error: any) {
    console.log(error, "convertor matic to usd error");
  }
}


export async function websiteInfo() {
  try {

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/web?&store_id=${process.env.NEXT_PUBLIC_STORE_ID}`,
      {
        headers: {
          "Content-Type": "application/json",
          referer: "xoltanmarketplace.com",
        },
        cache: "force-cache",
      }
    );

    return response;
  } catch (e) {
    console.log(e)
  }
}


export async function loginConnectInfo(payload: any) {
  try {


    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/store-customer/login`,
      {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "force-cache",
        body: JSON.stringify(payload)
      }
    ).then(res => res.json());

    return response;

  } catch (e) {
    console.log(e)
  }

}


export async function registerConnectInfo(payload: any) {
  const newpayload = JSON.stringify(payload)
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/store-customer/register`,
    {
      headers: {
        "Content-Type": "application/json",
        // referer: "xoltanmarketplace.com",
      },
      mode: "no-cors",
      method: "POST",
      cache: "force-cache",
      body: newpayload
    }
  );

  return response;
}



export async function getCustomerConnectInfo() {
  // const newpayload = JSON.stringify(payload)
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/store-customer/`,
    {
      headers: {
        "Content-Type": "application/json",
        // referer: "xoltanmarketplace.com",
      },
      mode: "no-cors",
      cache: "force-cache",
      method: "GET",
    }
  ).then(res => res.json());

  return response;
}

export function customEmailTruncateHandler(str = "", n = 15) {
  const myArray: any = str.split("@");
  return myArray[0]?.length > n
    ? myArray[0]?.slice(0, n) + "***@" + myArray[1]
    : str;
}