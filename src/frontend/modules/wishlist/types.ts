import { ActionType } from 'typesafe-actions';

import { AsyncState } from 'modules/utils/reducerUtils';
import * as actions from './actions';

interface IWish {
  success: Boolean;
}

export interface IWishState {
  wish: AsyncState<IWish, Error>;
  unWish: AsyncState<IWish, Error>;
}

export type wishAction = ActionType<typeof actions>;
