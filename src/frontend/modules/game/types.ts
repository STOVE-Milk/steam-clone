import { ActionType } from 'typesafe-actions';

import * as actions from './actions';

export type gameState = {
  categories: string[];
  categoryError: string;
};

export type gameAction = ActionType<typeof actions>;
