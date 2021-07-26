import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootRecuder from './reducers/';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
//Если нету расширения в хроме (reduxDevToold) - то юзай compose от redux
//передем редьюсер в стор↓
const store = createStore(rootRecuder, composeEnhancers(applyMiddleware(thunk)));
//applyMiddleware(thunk) - какое Middleware использовать ? =>  thunk , функции посредники использовать в каждом action
//redux теперь знает когда использовать асинхонные функции, а когда обычные(которые возврщают оъект)
window.store = store;

export default store;
