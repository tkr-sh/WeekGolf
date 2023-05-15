export const isAlpha = (str: string): boolean => {
  return /^[a-zA-Z]+$/.test(str);
}

export const isNumeric = (str: string): boolean => {
  return /^\d+$/.test(str);
}

export const isAlnum = (str: string): boolean => {
  return /^[a-zA-Z0-9]+$/.test(str);
}


