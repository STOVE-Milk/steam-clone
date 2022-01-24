export interface IGetCategoriesReqType {}

export interface IGetCategoriesResType {
  code: number;
  message: string;
  payload: any;
}

export interface IGetGamesByCategoryReqType {
  category: string;
}
export type GameMedia = {
  main: string;
  sub: Array<string>;
};
export interface IGetGamesByCategoryResType {
  id: number;
  name: string;
  description_snippet: string;
  price: number;
  sale: number;
  image: GameMedia;
  video: GameMedia;
  category_list: Array<string>;
  os_list: Array<string>;
  download_count?: number;
}
