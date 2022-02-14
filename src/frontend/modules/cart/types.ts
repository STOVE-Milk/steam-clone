import { ActionType } from 'typesafe-actions';

import { AsyncState } from 'modules/utils/reducerUtils';
import * as actions from './actions';

export interface ICartState {
  cartInfo: AsyncState<number[], Error>;
}

export type cartAction = ActionType<typeof actions>;
