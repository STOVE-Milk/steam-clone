import { ActionType } from 'typesafe-actions';

import { AsyncState } from 'modules/utils/reducerUtils';
import * as actions from './actions';

export interface IAuthState {
  signup: AsyncState<{}, Error>;
}

export type authAction = ActionType<typeof actions>;
