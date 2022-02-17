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

export interface IFriendInfo {
  id: number;
  nickname: string;
  profile: {
    image: string | JSX.Element;
    description: string;
  };
  is_friend?: number;
}

export interface IUserState {
  userInfo: AsyncState<IUserInfo, Error>;
  friends: AsyncState<IFriendInfo[], Error>;
}

export type userAction = ActionType<typeof actions>;
