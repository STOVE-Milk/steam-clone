import { ActionType } from 'typesafe-actions';

import { AsyncState } from 'modules/utils/reducerUtils';
import * as actions from './actions';

export interface gameInfo {
  category_list: string[];
  description_snippet: string;
  download_count: number;
  id: number;
  image?: {
    main: string;
    sub: string[];
  };
  name: string;
  os_list: string[];
  price: number;
  sale: number;
  video?: {
    main: string;
    sub: string[];
  };
}
interface gameDetail extends gameInfo {
  description: string;
  publisher: {
    id: number;
    name: string;
  };
  review_count: number;
  recommend_count: number;
}

export interface gameState {
  categories: AsyncState<string[], Error>;
  gamesByCategory: AsyncState<gameInfo[], Error>;
  game: AsyncState<gameDetail, Error>; // 상세 페이지에서 쓰일 1개 게임에 대한 정보
  cartInfo: AsyncState<number[], Error>;
  gamesByIdList: AsyncState<gameInfo[], Error>;
}

export type gameAction = ActionType<typeof actions>;
