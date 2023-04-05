// CONCAT DATA
export function customTruncateHandler(str = '', n = 15) {
    return str?.length > n ? str?.slice(0, n) + '...' : str;
  }