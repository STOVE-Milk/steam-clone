import { createStore, applyMiddleware, AnyAction, Store } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer, { IState, rootSaga } from '.';
import { Reducer } from 'typesafe-actions';
import { MakeStore, createWrapper, Context } from 'next-redux-wrapper';

function configureStore() {
  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(
    rootReducer as Reducer<IState, AnyAction>,
    composeWithDevTools(applyMiddleware(sagaMiddleware)),
  );

  sagaMiddleware.run(rootSaga);

  return store;
}

const wrapper = createWrapper<Store<IState>>(configureStore);

export default wrapper;
