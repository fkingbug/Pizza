export const addPizzaTocart = (pizzaObj) => ({
  type: 'ADD_PIZZA_CART',
  payload: pizzaObj,
});

//Удаляем корзину поэтому не передаем параметры в payload
export const clearCart = () => ({
  type: 'CLEAR_CART',
});

//Удаление 1 вида пицц
export const removeCartitem = (id) => ({
  type: 'REMOVE_CART_ITEM',
  payload: id,
});

export const plusCartItem = (id) => ({
  type: 'PLUS_CART_ITEM',
  payload: id,
});
export const minusCartItem = (id) => ({
  type: 'MINUS_CART_ITEM',
  payload: id,
});
