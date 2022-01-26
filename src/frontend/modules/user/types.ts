import { ActionType } from 'typesafe-actions';

import { AsyncState } from 'modules/utils/reducerUtils';
import * as actions from './actions';

export interface IGiftcard {
  idx: number; //TODO(양하): idx -> id
  name: string;
  price: number;
}

export interface userState {
  giftCardList: AsyncState<IGiftcard[], Error>;
}

export type userAction = ActionType<typeof actions>;
