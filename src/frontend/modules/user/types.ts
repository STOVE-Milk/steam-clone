import { ActionType } from 'typesafe-actions';

import { AsyncState } from 'modules/utils/reducerUtils';
import * as actions from './actions';

export interface IGiftcard {
  id: number; //TODO(양하): idx -> id
  name: string;
  price: number;
}
export interface IChargeInfo {
  tid: string;
  next_redirect_pc_url: string;
  created_at?: string;
}

export interface userState {
  giftCardList: AsyncState<IGiftcard[], Error>;
  charge: AsyncState<IChargeInfo, Error>;
  approvalCharge: AsyncState<null, Error>;
}

export type userAction = ActionType<typeof actions>;
