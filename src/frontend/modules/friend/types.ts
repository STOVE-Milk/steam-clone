import { ActionType } from 'typesafe-actions';

import { AsyncState } from 'modules/utils/reducerUtils';
import * as actions from './actions';

interface IFriendInfo {
  id: number;
  nickname: string;
  profile: {
    image: string | JSX.Element;
    description: string;
  };
  is_friend?: number;
}

export interface IFriendState {
  friends: AsyncState<IFriendInfo[], Error>;
}

export type friendAction = ActionType<typeof actions>;
