import { ActionType } from 'typesafe-actions';

import { AsyncState } from 'modules/utils/reducerUtils';
import * as actions from './actions';

interface IUserInfo {
  country: string;
  exp: number;
  iat: number;
  idx: number;
  nickname: string;
}
export interface IUserState {
  userInfo: AsyncState<IUserInfo, Error>;
}

export type userAction = ActionType<typeof actions>;
