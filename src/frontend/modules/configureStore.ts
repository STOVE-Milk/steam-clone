import { createStore } from 'redux';
import rootReducer from '.';

export default function configureStore() {
  const store = createStore(rootReducer);

  return store;
}
