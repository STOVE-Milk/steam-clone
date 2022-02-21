export const makeUniqueArr = (prev: any[], newThing: any) => {
  const dupArr = [...prev, newThing];
  const set = new Set(dupArr);
  const uniqueArr = [...set];

  return uniqueArr;
};
