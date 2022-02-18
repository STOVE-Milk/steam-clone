import { createAsyncAction } from 'typesafe-actions';
import { AxiosError } from 'axios';

import { createRequestActionTypes } from 'modules/utils/actionUtils';
import { IResStoreType, ISaveUserInfoReqtype } from 'api/user/type';
import { IReqType } from 'api/type';
import { IResType } from 'api/friend/type';

export const [SAVE_USERINFO, SAVE_USERINFO_SUCCESS, SAVE_USERINFO_FAIL] = createRequestActionTypes('SAVE_USERINFO');

export const saveUserInfo = createAsyncAction(SAVE_USERINFO, SAVE_USERINFO_SUCCESS, SAVE_USERINFO_FAIL)<
  ISaveUserInfoReqtype,
  IResStoreType,
  AxiosError
>();

export const [GET_FRIEND, GET_FRIEND_SUCCESS, GET_FRIEND_FAIL] = createRequestActionTypes('GET_FRIEND');

export const getFriend = createAsyncAction(GET_FRIEND, GET_FRIEND_SUCCESS, GET_FRIEND_FAIL)<
  IReqType,
  IResType,
  AxiosError
>();

export const SET_ONLINE = 'SET_ONLINE'; // 온라인 상태인 친구를 목록에 추가
export const SET_OFFLINE = 'SET_OFFLINE'; // 오프라인 상태인 친구를 목록에 제거

export const SET_WEBSOCKET = 'SET_WEBSOCKET'; // 웹 소켓 설정
