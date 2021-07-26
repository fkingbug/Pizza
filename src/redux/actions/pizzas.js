import axios from 'axios';

export const setLoaded = payload => ({
  type: 'SET_LOADED',
  payload,
});

export const fetchPizzas = (sortBy, category) => dispatch => {
  dispatch({
    type: 'SET_LOADED',
    payload: false,
  });
  axios
    .get(
      `/pizzas?${category !== null ? `category=${category}` : ''}&_sort=${sortBy.type}&_order=${
        sortBy.order
      }`,
    )
    .then(({ data }) => {
      dispatch(setPizzas(data));
    });
};
//
//actionCreater - с маленькой буквы ↓  , анонимная функция поулчает знаечение name и создает объект
export const setPizzas = items => ({
  type: 'SET_PIZZAS',
  payload: items,
});

//action отправляется в reducer
