import { createReducer } from 'typesafe-actions';

import { gameAction, gameState } from './types';
import { GET_CATEGORIES_SUCCESS, GET_CATEGORIES_FAIL, GET_GAME_SUCCESS, GET_GAME_FAIL } from './actions';

const initialState: gameState = {
  categories: [
    'Sandbox',
    'Real-time strategy (RTS)',
    'Shooters (FPS and TPS)',
    'Multiplayer online battle arena (MOBA)',
    'Role-playing (RPG, ARPG, and More)',
    'Simulation and sports.',
    'Puzzlers and party games.',
    'Action-adventure.',
  ],
  categoryError: '',
  games: [
    {
      id: 1,
      name: 'Vampire Survivors',
      os: ['windows', 'apple'],
      description:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.za',
      price: {
        KR: 10000,
      },
      sale: 10,
      image: {
        main: 'www',
        sub: ['www1', 'www2'],
      },
      video: {
        main: 'www',
        sub: ['www1', 'www2'],
      },
      category_list: ['Sandbox', 'RTS', 'FPS', 'MOBA'],
    },
    {
      id: 2,
      name: 'Vampire Survivors2',
      os: ['windows'],
      description:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.za',
      price: {
        KR: 20000,
      },
      sale: 0,
      image: {
        main: 'www',
        sub: ['www1', 'www2'],
      },
      video: {
        main: 'www',
        sub: ['www1', 'www2'],
      },
      category_list: ['Sandbox', 'RTS', 'FPS'],
    },
  ],
  game: {
    id: 1,
    name: 'Vampire Survivors',
    os: ['windows', 'apple'],
    description:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.za',
    price: {
      KR: 10000,
    },
    sale: 10,
    image: {
      main: 'www',
      sub: ['www1', 'www2'],
    },
    video: {
      main: 'www',
      sub: ['www1', 'www2'],
    },
    category_list: ['Sandbox', 'RTS', 'FPS', 'MOBA'],
  },
};

const reducer = createReducer<gameState>(initialState, {
  [GET_CATEGORIES_SUCCESS]: (state, action) => ({
    ...state,
    categories: action.payload,
  }),
  [GET_CATEGORIES_FAIL]: (state, action) => ({
    ...state,
    categoryError: action.payload,
  }),

  [GET_GAME_SUCCESS]: (state, action) => ({
    ...state,
    game: action.payload,
  }),
  [GET_GAME_FAIL]: (state, action) => ({
    ...state,
    game: action.payload,
  }),
});

export default reducer;
