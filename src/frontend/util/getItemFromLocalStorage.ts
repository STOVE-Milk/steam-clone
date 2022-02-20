export const getItemFromLocalStorage = (key: string) => {
  const data = typeof window !== 'undefined' && localStorage.getItem(key) != null ? localStorage.getItem(key) : '';

  return data;
};
