import { ActionType } from 'typesafe-actions';

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
  image?: {};
  video?: {};
  sale: number;
};

export type gameState = {
  categories: string[];
  categoryError: string;

  games: gameInfo[];
};

export type gameAction = ActionType<typeof actions>;
