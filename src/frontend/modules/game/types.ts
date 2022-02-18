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
interface IGameOffset {
  [idx: number]: {
    name: string;
    x: number;
    y: number;
  };
}

export interface gameState {
  userData: AsyncState<IUserData, Error>;
  gameOffsetData: AsyncState<IGameOffset, Error>;
  gameInfoByUser: AsyncState<gameInfo[], Error>;
}

export type gameAction = ActionType<typeof actions>;
