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

interface IUserInfo {
  country: string;
  exp: number;
  iat: number;
  idx: number;
  nickname: string;
  role: number;
}
export interface IUserState {
  giftCardList: AsyncState<IGiftcard[], Error>;
  charge: AsyncState<IChargeInfo, Error>;
  approvalCharge: AsyncState<{}, Error>;
  signup: AsyncState<{}, Error>;
  userInfo: AsyncState<IUserInfo, Error>;
}

export type userAction = ActionType<typeof actions>;
