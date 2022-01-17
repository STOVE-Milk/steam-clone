import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { BrowserHistory } from 'history';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer, { rootSaga } from '.';

export default function configureStore(customHistory: BrowserHistory) {
  const sagaMiddleware = createSagaMiddleware({
    context: {
      history: customHistory,
    },
  });

  const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(sagaMiddleware)));

  sagaMiddleware.run(rootSaga);

  return store;
}
