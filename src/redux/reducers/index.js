import { combineReducers } from 'redux';

import filters from './filters';
import pizzas from './pizzas';
import cart from './cart';

//чтобы передать в стор несколько редьюсеров , в библиотеке redux есть combineReducers , которая объединяет все редьюсеры в  1 объект и передает в стор
const rootRecuder = combineReducers({
  filters,
  pizzas,
  cart,
});
//filter: filterReducer - меняем на звание на ftlter
export default rootRecuder;

//Длинная запись ↓
// import filterReducer from './filters';
// import pizzasReducer from './pizzas';
// import cartReducer from './cart';

// //чтобы передать в стор несколько редьюсеров , в библиотеке redux есть combineReducers , которая объединяет все редьюсеры в  1 объект и передает в стор
// const rootRecuder = combineReducers({
//   filters: filterReducer,
//   pizzas: pizzasReducer,
//   cart: cartReducer,
// });
