import { ActionType } from 'typesafe-actions';

import * as actions from './actions';

export type gameState = {
  // [index: string]: string | string[] | null;

  categories: string[];
  // categories: IGetCategoriesResType | null
  categoryError: string;
};

export type gameAction = ActionType<typeof actions>;
