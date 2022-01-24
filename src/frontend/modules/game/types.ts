import { ActionType } from 'typesafe-actions';

import * as actions from './actions';
import { IGetGamesByCategoryResType } from 'pages/api/game/type';

export type gameState = {
  // [index: string]: string | string[] | null;

  categories: string[];
  // categories: IGetCategoriesResType | null
  categoryError: string;
  gameSimpleList: Array<IGetGamesByCategoryResType>; // response 이름에 맞춤
  gameSimpleListError: string;
};

export type gameAction = ActionType<typeof actions>;
