import { ActionType } from 'typesafe-actions';

import { AsyncState } from 'modules/utils/reducerUtils';
import * as actions from './actions';

export interface IUserInfo {
  country: string;
  exp: number;
  iat: number;
  idx: number;
  nickname: string;
  profileImg: string;
}

export interface IFriendInfo {
  id: number;
  nickname: string;
  profile: {
    image: string;
    description: string;
  };
  is_friend?: number;
  was_requested?: number;
  status?: boolean;
}

export interface IUserState {
  userInfo: AsyncState<IUserInfo, Error>;
  friends: AsyncState<IFriendInfo[], Error>;
  socket: AsyncState<WebSocket | undefined, Error>;
  onlines: AsyncState<number[], Error>;
}

export type userAction = ActionType<typeof actions>;
