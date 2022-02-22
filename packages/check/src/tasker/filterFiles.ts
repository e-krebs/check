export const filterFiles = (input: string[], filter: string): string[] => {
  return input.filter(item => item.includes(filter));
};
