import { createReducer } from 'typesafe-actions';

import { asyncState } from 'modules/utils/reducerUtils';
import { gameState } from './types';
import {
  GET_CATEGORIES,
  GET_CATEGORIES_SUCCESS,
  GET_CATEGORIES_FAIL,
  GET_GAME,
  GET_GAME_SUCCESS,
  GET_GAME_FAIL,
  GET_GAMESBYCATEGORY,
  GET_GAMESBYCATEGORY_SUCCESS,
  GET_GAMESBYCATEGORY_FAIL,
} from './actions';

const initialState: gameState = {
  categories: asyncState.initial([
    'Sandbox',
    'Real-time strategy (RTS)',
    'Shooters (FPS and TPS)',
    'Multiplayer online battle arena (MOBA)',
    'Role-playing (RPG, ARPG, and More)',
    'Simulation and sports.',
    'Puzzlers and party games.',
    'Action-adventure.',
  ]),
  gamesByCategory: asyncState.initial([
    {
      id: 6,
      name: 'Red Dead Redemption 2',
      description_snippet:
        '올해의 게임 175여 개를 수상하고 250개 이상의 완벽한 평가를 받은 Red Dead Redemption 2는 현대 시대가 시작될 무렵 무법자인 아서 모건과 악명 높은 반 더 린드 갱단이 미국 전역을 따라 도주하는 장대한 서사시입니다. 모두가 함께 즐길 수 있는 생생한 세계인 Red Dead 온라인 역시 포함됩니다.',
      price: 66000,
      sale: 50,
      image: {
        main: 'https://cdn.akamai.steamstatic.com/steam/apps/1446780/ss_f8249da14987e3c2d10fd4024736f28774c713da.600x338.jpg?t=1642121078',
        sub: [
          'https://cdn.akamai.steamstatic.com/steam/apps/1446780/ss_25686086b61ca88a859bc20d588682be92ab4d63.600x338.jpg?t=1642121078',
          'https://cdn.akamai.steamstatic.com/steam/apps/1446780/ss_d8d96313f1049c800d37a3fc521f06f926fca3ac.116x65.jpg?t=1642121078',
        ],
      },
      video: {
        main: 'https://cdn.akamai.steamstatic.com/steam/apps/256864285/movie480_vp9.webm?t=1640223329',
        sub: ['https://cdn.akamai.steamstatic.com/steam/apps/256864285/movie480_vp9.webm?t=1640223329'],
      },
      os_list: ['Window'],
      download_count: 52228,
      category_list: ['액션', '격투'],
    },
  ]),
  game: asyncState.initial({
    id: 1,
    name: 'MONSTER HUNTER RISE',
    description_snippet:
      '역동하는 사냥 본능! 사냥에 새로운 바람을 불러일으킬, 종횡무진으로 도약하는 액션. 마음 가는 대로 달릴 수 있는 필드. 미지의 흥분과 놀라움을 선사할 새로운 몬스터들. 이제껏 없었던 사냥 체험이 「MONSTER HUNTER RISE」에서 헌터들을 기다린다!',
    price: 66800,
    sale: 6,
    image: {
      main: 'https://cdn.akamai.steamstatic.com/steam/apps/1446780/ss_f8249da14987e3c2d10fd4024736f28774c713da.600x338.jpg?t=1642121078',
      sub: [
        'https://cdn.akamai.steamstatic.com/steam/apps/1446780/ss_25686086b61ca88a859bc20d588682be92ab4d63.600x338.jpg?t=1642121078',
        'https://cdn.akamai.steamstatic.com/steam/apps/1446780/ss_d8d96313f1049c800d37a3fc521f06f926fca3ac.116x65.jpg?t=1642121078',
      ],
    },
    video: {
      main: 'https://cdn.akamai.steamstatic.com/steam/apps/256864285/movie480_vp9.webm?t=1640223329',
      sub: ['https://cdn.akamai.steamstatic.com/steam/apps/256864285/movie480_vp9.webm?t=1640223329'],
    },
    category_list: ['액션', '3인칭', '롤플레잉'],
    os_list: ['Window', 'macOs'],
    description: '"네르기간테 너무 쎄다"',
    download_count: 52228,
    publisher: {
      id: 1,
      name: 'FOR',
    },
    review_count: 3,
    recommend_count: 3,
    language: ['한국어', '영어'],
  }),
};

const reducer = createReducer<gameState>(initialState, {
  [GET_CATEGORIES]: (state, action) => ({
    ...state,
    categories: asyncState.load(action.payload),
  }),
  [GET_CATEGORIES_SUCCESS]: (state, action) => ({
    ...state,
    categories: asyncState.success(action.payload),
  }),
  [GET_CATEGORIES_FAIL]: (state, action) => ({
    ...state,
    categories: asyncState.error(action.payload),
  }),
  [GET_GAME]: (state, action) => ({
    ...state,
    game: asyncState.load(action.payload),
  }),
  [GET_GAME_SUCCESS]: (state, action) => ({
    ...state,
    game: asyncState.success(action.payload),
  }),
  [GET_GAME_FAIL]: (state, action) => ({
    ...state,
    game: asyncState.error(action.payload),
  }),
  [GET_GAMESBYCATEGORY]: (state, action) => ({
    ...state,
    gamesByCategory: asyncState.load(action.payload),
  }),
  [GET_GAMESBYCATEGORY_SUCCESS]: (state, action) => ({
    ...state,
    gamesByCategory: asyncState.success(action.payload),
  }),
  [GET_GAMESBYCATEGORY_FAIL]: (state, action) => ({
    ...state,
    gamesByCategory: asyncState.error(action.payload),
  }),
});

export default reducer;
