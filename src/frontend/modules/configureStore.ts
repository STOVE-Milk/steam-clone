import { createStore, applyMiddleware, AnyAction, Store } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer, { IState, rootSaga } from '.';
import { Reducer } from 'typesafe-actions';
import { createWrapper } from 'next-redux-wrapper';

function configureStore() {
  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(
    rootReducer as Reducer<IState, AnyAction>,
    composeWithDevTools(applyMiddleware(sagaMiddleware)),
  );

  sagaMiddleware.run(rootSaga);

  return store;
}

//next에서 redux의 단일 스토어를 지키기 위해 wrapper로 스토어를 감싸줌
const wrapper = createWrapper<Store<IState>>(configureStore);

export default wrapper;
