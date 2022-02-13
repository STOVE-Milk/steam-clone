import { ActionType } from 'typesafe-actions';

import { AsyncState } from 'modules/utils/reducerUtils';
import * as actions from './actions';

export interface gameInfo {
  category_list: string[];
  description_snippet: string;
  recommend_count?: number;
  download_count: number;
  review_count?: number;
  id: number;
  image: {
    main: string;
    sub: string[];
  };
  name: string;
  os_list: string[];
  price: number;
  sale: number;
  video: {
    main: string;
    sub: string[];
  };
  description?: string;
}

interface IWish {
  success: Boolean;
}
interface IUserData {
  wish_list: number[];
  purchase_list: number[];
}

export interface gameState {
  categories: AsyncState<string[], Error>;
  gamesByCategory: AsyncState<gameInfo[], Error>;
  cartInfo: AsyncState<number[], Error>;
  gamesByIdList: AsyncState<gameInfo[], Error>;
  wish: AsyncState<IWish, Error>;
  unWish: AsyncState<IWish, Error>;
  userData: AsyncState<IUserData, Error>;
  wishList: AsyncState<gameInfo[], Error>;
}

export type gameAction = ActionType<typeof actions>;
