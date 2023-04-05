import Character from '~/public/images/character.svg';

export function generateOTP(otp_length = 0) {
  const digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < otp_length; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}

export function formatTrpcError(trpcError = 'Something went wrong!' as string) {
  if (trpcError?.includes('[\n  {\n  ')) {
    const formattedError = JSON.parse(trpcError);
    const msgError =
      formattedError?.length > 0
        ? formattedError[0].message
        : 'Internal server error';
    return msgError;
  } else {
    return trpcError;
  }
}

// CONCAT DATA
export function customTruncateHandler(str = '', n = 15) {
  return str?.length > n ? str?.slice(0, n) + '...' : str;
}
// VALIDATE IMAGE TYPE
export function isValidImageType(type: any) {
  const isImage = type?.includes('image/') && type !== 'image/gif';
  return isImage;
}
export function renderNFTImage(nft: any) {
  console.log('nft:::::', nft);
  return nft?.media_type === 'audio/mp3' || nft?.thumb === ''
    ? Character?.src
    : `${process.env.NEXT_PUBLIC_CLOUD_FRONT_BASE_URL}/${nft?.thumb}`;
}

export const displayDate = (payload: any) => {
  const date = new Date(payload);
  const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
  const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
  const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
  const formattedDate = `${da}-${mo}-${ye}`;
  return formattedDate;
};
