import { ActionType } from 'typesafe-actions';

import { AsyncState } from 'modules/utils/reducerUtils';
import * as actions from './actions';

export type gameInfo = {
  id: number;
  name: string;
  price: {
    [index: string]: number;
  };
  description: string;
  os: string[];
  category_list: string[];
  image?: {
    main: string;
    sub: string[];
  };
  video?: {};
  sale: number;
  country: string;
};

export interface gameState {
  categories: AsyncState<string[], Error>;
  games: AsyncState<gameInfo[], Error>; // 메인 페이지, 카테고리 페이지 등에서 쓰일 게임 리스트
  game: AsyncState<gameInfo, Error>; // 상세 페이지에서 쓰일 1개 게임에 대한 정보
}

export type gameAction = ActionType<typeof actions>;