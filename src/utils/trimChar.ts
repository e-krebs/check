export const trimChar = (string: string, char: '\'' = '\''): string => {
  // ^     beginning of the string
  // |     or
  // $     end of the string
  const regex = new RegExp(`^[${char}]+|[${char}]+$`, 'g');
  return string.replace(regex, '');
}
