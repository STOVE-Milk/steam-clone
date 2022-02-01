import { ActionType } from 'typesafe-actions';

import { AsyncState } from 'modules/utils/reducerUtils';
import * as actions from './actions';

export interface IUserState {
  signup: AsyncState<{}, Error>;
}

export type userAction = ActionType<typeof actions>;
