**redux**
**index.js**
Провайдер говорит что компоненты внутри него могут брать данные из store

```JavaScript
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';

import App from './App';

import './css/app.css';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root'),
);

```

создаем папку redux в ней reducer и action папки

в Папке reducer создаем фаил filter.js

```JavaScript
const initialState = {
  sortBy: 'popular',
  category: 0,
};

//редьюсер
const filters = (state = initialState, action) => {
// в state записываем initialState
  if (action.type == 'SET_SORT_BY') {
    return {
      ...state, //берет все старые даннеы полученного state и меняет на ↓
      sortBy: action.payload,
    };
  }
  //Если не пришла команда SET_SORT_BY и не нужно запускать редьюсер то верни старые данные
  return state;
};
```

---

В папкук actions хранятся функции которые влияют на редюсер :
filter.js в папке action:

```JavaScript
//actionCreater - с маленькой буквы ↓  , анонимная функция поулчает знаечение name и создает объект
const setSortBy = name => ({
  type: 'SET_SORT_BY',
  payload: name,
});

const setCategory = catIndex => ({
  type: 'SET_CATEGORY',
  payload: catIndex,
});

```

_В папках редьюсер и экшен есть файлы фильтер , в эитх файлах хранирся только логика делающая филтрацию и только ее(логика в том , чтобы файил редьюсера имел 1 имя с файлом экшена)_

---

создаем в папке reducers - index.js для импортов всех редьюсеров

```JavaScript
import { createStore, combineReducers } from 'redux';

import filterReducer from './filters';
import pizzasReducer from './pizzas';

//чтобы передать в стор несколько редьюсеров , в библиотеке redux есть combineReducers , которая объединяет все редьюсеры в  1 объект и передает в стор
const rootRecuder = combineReducers({
  filters: filterReducer,
  pizzas: pizzasReducer,
});
//filter: filterReducer - меняем на звание на ftlter
export default rootRecuder;

```

и подключаем в store

```JavaScript
import { createStore } from 'redux';

import rootRecuder from './reducers/';

//передем редьюсер в стор↓
const store = createStore(rootRecuder);

export default store;
```

---

**reduxDevTools**
в стор добавим window... и установим reduxDevTools , в этом расширении мы можем смотреть экшены и редьюсеры и diff - история изменений , для этого в консоле пишем :

```JavaScript
store.dispatch({
    type: 'SET_SORT_BY',
    payload : 'price'
})
```

store.js↓

```JavaScript
import { createStore } from 'redux';

import rootRecuder from './reducers/';

//передем редьюсер в стор↓
const store = createStore(
  rootRecuder,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);

window.store = store;

export default store;
```

Home.js отправлял в SortPopUp.js 3 стрики (популярность , цена , алфавит) , теперь он принимает object

Home.js ↓

```JavaScript
        <SortPopUp
          items={[
            { name: 'популярности', type: 'popular' },
            { name: 'цене', type: 'price' },
            { name: 'алфавиту', type: 'alphabet'}]}
        />
```

SortPopUp.js ↓

```JavaScript
//раньше переменная получала items[activeItem] , теперь получает поле name
const activeLabel = items[activeItem].name;

//При создании 3 фильтров , li получает obj и выводит obj.name
<ul>
    {items &&
        items.map((obj, index) => (
            <li
                onClick={() => onSelectItem(index)}
                className={activeItem === index ? 'active' : ''}
                key={`${obj.type}_${index}`}>
                {obj.name}
            </li>
     ))}
</ul>

```

---

**Хранение списка пицц в редаксе , а не парсинг и хранение в стейте в app.js**

App.js до↓

```JavaScript
function App() {
  const [pizzas, setPizzas] = React.useState([]);

  React.useEffect(() => {
    axios.get('http://localhost:3000/db.json').then(({ data }) => setPizzas(data.pizzas));
  }, []);

  return (
    <div className="wrapper">
      <Header />
      <div className="content">
        <Route path="/" render={() => <Home items={pizzas} />} exact />
        <Route path="/cart" component={Cart} exact />
      </div>
    </div>
  );
}
```

---

app.js на классах ↓

```JavaScript
import React from 'react';
import axios from 'axios';
import { Route } from 'react-router-dom';
import store from './redux/store';

import { Header } from './components';
import { Home, Cart } from './pages';
import { setPizzas } from './redux/actions/pizzas';

class App extends React.Component {
  componentDidMount() {
    axios.get('http://localhost:3000/db.json').then(({ data }) => {
      store.dispatch(setPizzas(data.pizzas));
    });
  }
  render() {
    return (
      <div className="wrapper">
        <Header />
        <div className="content">
          <Route path="/" render={() => <Home items={[]} />} exact />
          <Route path="/cart" component={Cart} exact />
        </div>
      </div>
    );
  }
}
export default App;

```

---

Классы часть 2

```JavaScript
import React from 'react';
import axios from 'axios';

import { connect } from 'react-redux';

import { Header } from './components';
import { Home, Cart } from './pages';
import { Route } from 'react-router-dom';
import { setPizzas as setPizzasAction } from './redux/actions/pizzas';

class App extends React.Component {
  componentDidMount() {
    axios.get('http://localhost:3000/db.json').then(({ data }) => {
      //С помощью диспатча поменяли значение поля payload в pizzas (довв в него массив пицц)
      this.props.sohraniPizzas(data.pizzas);
    });
  }
  render() {
    return (
      <div className="wrapper">
        <Header />
        <div className="content">
          <Route path="/" render={() => <Home items={this.props.items} />} exact />
          <Route path="/cart" component={Cart} exact />
        </div>
      </div>
    );
  }
}

//Следит за изменением в items
const mapStateToProps = state => {
  return {
    items: state.pizzas.items,
  };
};

//Чтобы изменения самы вызывали диспатч и не писать this.props.dispatch(setPizzasAction(data.pizzas));
const mapDispatchToProps = dispatch => {
  return {
    sohraniPizzas: items => dispatch(setPizzasAction(items)),
    dispatch,
  };
};
//Для диспатча используется имя поля в этом ретурне
//this.props.sohraniPizzas(data.pizzas);

//connect  - если измененние есть то делай ререндер (добавили или убрали массив)
export default connect(mapStateToProps, mapDispatchToProps)(App);

```

Классы часть 3 ( упрощаем запись если полученный action назвать также в mapDispatchToProps )

```JavaScript
import React from 'react';
import axios from 'axios';

import { connect } from 'react-redux';

import { Header } from './components';
import { Home, Cart } from './pages';
import { Route } from 'react-router-dom';
import { setPizzas } from './redux/actions/pizzas';

class App extends React.Component {
  componentDidMount() {
    axios.get('http://localhost:3000/db.json').then(({ data }) => {
      this.props.setPizzas(data.pizzas);
    });
  }
  render() {
    return (
      <div className="wrapper">
        <Header />
        <div className="content">
          <Route path="/" render={() => <Home items={this.props.items} />} exact />
          <Route path="/cart" component={Cart} exact />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    items: state.pizzas.items,
  };
};
const mapDispatchToProps = {
  setPizzas,
};
export default connect(mapStateToProps, mapDispatchToProps)(App);
```

redux hoooks ↓

```javascript
import React from 'react';
import axios from 'axios';

import { useDispatch } from 'react-redux';

import { Header } from './components';
import { Home, Cart } from './pages';
import { Route } from 'react-router-dom';
import { setPizzas } from './redux/actions/pizzas';

function App() {
  const dispatch = useDispatch();

  React.useEffect(() => {
    axios.get('http://localhost:3000/db.json').then(({ data }) => {
      dispatch(setPizzas(data.pizzas));
      //сделай запрос и сохрани данные в редаксе (почему в app не в home ? чтобы запрос делался 1 раз)
    });
  }, []);

  return (
    <div className="wrapper">
      <Header />
      <div className="content">
        <Route path="/" component={Home} exact />
        <Route path="/cart" component={Cart} exact />
      </div>
    </div>
  );
}

export default App;
```

---

**json serever**
*https://www.npmjs.com/package/json-server*

**Подключение**
npm i json-server - устуновка
json-server --watch db.json -наблюдай за файлом db ( в нашем случае public/db.json)
чтобы постоянно не писать ↑ , заходим в package.json , объект скрипт и делаем свой
_"server" : "npx json-server --watch public/db.json --port=3001"_ (поменяли порт приложение с сервером конмфликтуют)
в консоле - yarn server

```javascript
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "server" : "npx json-server --watch public/db.json --port=3001"
  }
```

---

В App.js меняем запрос с :

```javascript
React.useEffect(() => {
  axios.get('http://localhost:3000/db.json').then(({ data }) => {
    dispatch(setPizzas(data.pizzas));
    //сделай запрос и сохрани данные в редаксе (почему в app не в home ? чтобы запрос делался 1 раз)
  });
}, []);
```

на :
**Мы поменяли порт , так как объект подкключается к ключу pizzas в ссылке , мы убираем pizzas из dispatch(setPizzas(data));**

```javascript
React.useEffect(() => {
  axios.get('http://localhost:3001/pizzas').then(({ data }) => {
    dispatch(setPizzas(data));
    //сделай запрос и сохрани данные в редаксе (почему в app не в home ? чтобы запрос делался 1 раз)
  });
}, []);
```

---

**Перенос запроса на сервер в redux**
в actione - в файли puzzas.js добавляем новый экшени подключаем axiox (Мы не можем юзать диспач в action , диспач юзается только в компоненте), так как fetchPizzas не возвращает объект для этого нам поможет (yarn add redux-thunk)

```javascript
import axios from 'axios';

//Возвращает анонимную функцию , redux-thunk проверяте и видит что асинъронная функция(которая возвращет функцию и приводит ее к action )
export const fetchPizzas = () => (dispatch) => {
  axios.get('http://localhost:3001/pizzas').then(({ data }) => {
    dispatch(setPizzas(data));
  });
};
//Возвращает объект
export const setPizzas = (items) => ({
  type: 'SET_PIZZAS',
  payload: items,
});
```

В store.js подключаем - import thunk from 'redux-thunk';

thunk и reduxDevTools - это middleware они должны работать вместе но как ? :

```javascript
import { createStore } from 'redux';
import thunk from 'redux-thunk';
import rootRecuder from './reducers/';

//передем редьюсер в стор↓
const store = createStore(
  rootRecuder,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);

window.store = store;

export default store;
```

store.js ↓

```javascript
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
```

---

категории до redux

```javascript
import React from 'react';

const Categories = React.memo(function Categories({ items, onClickItem }) {
  const [activeItem, setactiveItem] = React.useState(null);

  const onSelectItem = (index) => {
    setactiveItem(index);
    onClickItem(index);
  };

  return (
    <div>
      <div className="categories">
        <ul>
          <li className={activeItem === null ? 'active' : ''} onClick={() => onSelectItem(null)}>
            Все
          </li>
          {items &&
            items.map((name, index) => (
              <li
                className={activeItem === index ? 'active' : ''}
                onClick={() => onSelectItem(index)}
                key={`${name}_${index}`}>
                {name}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
});

export default Categories;

// обернули функцию в const Categories = React.memo(function Categories({ items, onClickItem }) {
// В случае  изменения стейта , этот компонент не будет ререндерится
```

---

Изибавились от стейта и принимаем значение из redux и отправляем функцию из Home onClickCategory (а не онКлик) и передаем activeCategory и передаем ей значение из category

```javascript
<Categories activeCategory={category} onClickCategory={onSelectCategory} items={categoryName} />
```

после

```javascript
import React from 'react';
import PropTypes from 'prop-types';

const Categories = React.memo(function Categories({ activeCategory, items, onClickCategory }) {
  return (
    <div>
      <div className="categories">
        <ul>
          <li
            className={activeCategory === null ? 'active' : ''}
            onClick={() => onClickCategory(null)}>
            Все
          </li>
          {items &&
            items.map((name, index) => (
              <li
                className={activeCategory === index ? 'active' : ''}
                onClick={() => onClickCategory(index)}
                key={`${name}_${index}`}>
                {name}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
});

Categories.propTypes = {
  activeCategory: PropTypes.number.isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClickCategory: PropTypes.func,
};

Categories.defaultProps = {
  activeCategory: null,
  items: [],
};
export default Categories;

// обернули функцию в const Categories = React.memo(function Categories({ items, onClickItem }) {
// В случае  изменения стейта , этот компонент не будет ререндерится
```

---

---

SortBy до redux ↓

```javascript
import React from 'react';

const SortPopUp = React.memo(function SortPopUp({ items }) {
  const [visiblePopup, setVsiblePopup] = React.useState(false);
  const [activeItem, setActiveItem] = React.useState(0);
  const sortRef = React.useRef();
  const activeLabel = items[activeItem].name;

  const toggleVisiblePopup = () => {
    setVsiblePopup(!visiblePopup);
  };

  const onSelectItem = (index) => {
    setActiveItem(index);
    setVsiblePopup(false);
  };

  const handloutSideClick = (e) => {
    if (!e.path.includes(sortRef.current)) {
      setVsiblePopup(false);
    }
  };

  React.useEffect(() => {
    document.body.addEventListener('click', handloutSideClick);
  }, []);

  return (
    <div ref={sortRef} className="sort">
      <div className="sort__label">
        <svg
          className={visiblePopup ? 'rotated' : ''}
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M10 5C10 5.16927 9.93815 5.31576 9.81445 5.43945C9.69075 5.56315 9.54427 5.625 9.375 5.625H0.625C0.455729 5.625 0.309245 5.56315 0.185547 5.43945C0.061849 5.31576 0 5.16927 0 5C0 4.83073 0.061849 4.68424 0.185547 4.56055L4.56055 0.185547C4.68424 0.061849 4.83073 0 5 0C5.16927 0 5.31576 0.061849 5.43945 0.185547L9.81445 4.56055C9.93815 4.68424 10 4.83073 10 5Z"
            fill="#2C2C2C"
          />
        </svg>
        <b>Сортировка по:</b>
        <span onClick={toggleVisiblePopup}>{activeLabel}</span>
      </div>
      {visiblePopup && (
        <div className="sort__popup">
          <ul>
            {items &&
              items.map((obj, index) => (
                <li
                  onClick={() => onSelectItem(index)}
                  className={activeItem === index ? 'active' : ''}
                  key={`${obj.type}_${index}`}>
                  {obj.name}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
});

export default SortPopUp;
```

После
избавились от сейта активнымАйтемом и берем его из вне и ищем через find нужный type

```javascript
import React from 'react';
import PropTypes from 'prop-types';

const SortPopup = React.memo(function SortPopup({ items, activeSortType, onClickSortType }) {
  const [visiblePopup, setVisiblePopup] = React.useState(false);
  const sortRef = React.useRef();
  const activeLabel = items.find((obj) => obj.type === activeSortType).name;

  const toggleVisiblePopup = () => {
    setVisiblePopup(!visiblePopup);
  };

  const handleOutsideClick = (event) => {
    const path = event.path || (event.composedPath && event.composedPath());
    if (!path.includes(sortRef.current)) {
      setVisiblePopup(false);
    }
  };

  const onSelectItem = (index) => {
    console.log(index);
    if (onClickSortType) {
      onClickSortType(index);
    }
    setVisiblePopup(false);
  };

  React.useEffect(() => {
    document.body.addEventListener('click', handleOutsideClick);
  }, []);

  return (
    <div ref={sortRef} className="sort">
      <div className="sort__label">
        <svg
          className={visiblePopup ? 'rotated' : ''}
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M10 5C10 5.16927 9.93815 5.31576 9.81445 5.43945C9.69075 5.56315 9.54427 5.625 9.375 5.625H0.625C0.455729 5.625 0.309245 5.56315 0.185547 5.43945C0.061849 5.31576 0 5.16927 0 5C0 4.83073 0.061849 4.68424 0.185547 4.56055L4.56055 0.185547C4.68424 0.061849 4.83073 0 5 0C5.16927 0 5.31576 0.061849 5.43945 0.185547L9.81445 4.56055C9.93815 4.68424 10 4.83073 10 5Z"
            fill="#2C2C2C"
          />
        </svg>
        <b>Сортировка по:</b>
        <span onClick={toggleVisiblePopup}>{activeLabel}</span>
      </div>
      {visiblePopup && (
        <div className="sort__popup">
          <ul>
            {items &&
              items.map((obj, index) => (
                <li
                  onClick={() => onSelectItem(obj.type)}
                  className={activeSortType === obj.type ? 'active' : ''}
                  key={`${obj.type}_${index}`}>
                  {obj.name}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
});
SortPopup.propTypes = {
  activeSortType: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClickSortType: PropTypes.func.isRequired,
};

SortPopup.defaultProps = {
  items: [],
};
export default SortPopup;
```

Home После изменений

```javascript
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Categories, SortPopUp, PizzaBlock, PizzaLoadingBlock } from '../components';

import { setCategory, setSortBy } from '../redux/actions/filters';
import { fetchPizzas } from '../redux/actions/pizzas';

const categoryName = ['Мясные', 'Вегетарианская', 'Гриль', 'Острые', 'Закрытые'];
const sortItems = [
  { name: 'популярности', type: 'popular' },
  { name: 'цене', type: 'price' },
  { name: 'алфавиту', type: 'alphabet' },
];
function Home() {
  const dispatch = useDispatch();
  const items = useSelector(({ pizzas }) => pizzas.items);
  const isLoaded = useSelector(({ pizzas }) => pizzas.isLoaded);
  const { category, sortBy } = useSelector(({ filters }) => filters);

  React.useEffect(() => {
    dispatch(fetchPizzas());
  }, [category, sortBy]);

  //Из за рпередачи этой функции в категории , она вызывается и меняет ссылку на массив, useCallBack делает функцию и не меняет ее ссылку
  const onSelectCategory = React.useCallback((index) => {
    dispatch(setCategory(index));
  }, []);
  const onSelectSortType = React.useCallback((type) => {
    console.log(MimeType);
    dispatch(setSortBy(type));
  }, []);

  return (
    <div className="container">
      <div className="content__top">
        <Categories
          activeCategory={category}
          onClickCategory={onSelectCategory}
          items={categoryName}
        />
        <SortPopUp activeSortType={sortBy} items={sortItems} onClickSortType={onSelectSortType} />
      </div>

      <h2 className="content__title">Все пиццы</h2>
      <div className="content__items">
        {isLoaded
          ? items.map((obj) => <PizzaBlock key={obj.id} isLoading={true} {...obj} />)
          : Array(10)
              .fill(0)
              .map((_, index) => <PizzaLoadingBlock key={index} />)}
      </div>
    </div>
  );
}

export default Home;
```

### Сортировка

action/pizzas до↓

```javascript
import axios from 'axios';

export const fetchPizzas = () => (dispatch) => {
  axios.get('http://localhost:3001/pizzas').then(({ data }) => {
    dispatch(setPizzas(data));
  });
};

//actionCreater - с маленькой буквы ↓  , анонимная функция поулчает знаечение name и создает объект
export const setPizzas = (items) => ({
  type: 'SET_PIZZAS',
  payload: items,
});

//action отправляется в reducer
```

**ДОПИСАТЬ ↑**

---

## Корзина

Создаем reducer cart ↓

```javascript
const initialState = {
  items: {},
  totalPrice: 0,
  totalCount: 0,
};

const cart = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_PIZZA_CART':
      return {
        ...state, // Возьми старое состояние и замени все ниже
        items: {
          [action.payload.id]: [...state.items[action.payload.id], action.payload],
        },
      };
    default:
      return state;
  }
};

export default cart;
```

**Подключаем зависимости для импорта**

```javascript
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
```

**Изменения в кнопке корзины в header(чтобы она получала точные значения колличества пицц и цены**

```javascript
const { totalPrice, totalCount } = useSelector(({ cart }) => ({
  totalPrice: cart.totalPrice,
  totalCount: cart.totalCount,
}));
```

useSelector - дай из redax recuder cart и вытащи из него totalPrice и totalCount , useSelector верни все в виде объекта и делаем диструктуризацию из полученного объекта

Только из за изменений totalPrice и totalCount будет проводится ререндр header (так как мы указали их в объекте )

**Более короткая запись ↓**

```javascript
const { totalPrice, totalCount } = useSelector(({ cart }) => cart);
```

---

## Создание action cart ↓

---

---

---

---

Из pizzablock при клике по баттону выводится на экран id name и тд данной пиццы

```javascript
//вызываем фунцию из родительского компонента и передаем в нее объект index.js(PizzaBlock)
 <Button onClick={() => onClickAddPizza({ id, name, imageUrl, price })} / >

 //Родительский компонент home.js
 <PizzaBlock onClickAddPizza={obj => console.log(obj)} / >
```

Не делаем анонимных функций когда когда функция ничего не вовзращает и не записывает

```javascript
//Данные уже хранятся в каждом pizzaBlock
const onAddPizza = () => onClickAddPizza({ id, name, imageUrl, price });

//li перезаписывает state (Каждая анонимная фунция - ререндер)
<li
  key={type}
  onClick={() => onSelectItem(index)}
  className={classNames({
    active: activeType === index,
    disabled: !types.includes(index),
  })}>
  {type}
</li>;
```

**Редьюсер добавялющий в cart каждую пиццу**

```javascript
const initialState = {
  items: {},
  totalPrice: 0,
  totalCount: 0,
};

const cart = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_PIZZA_CART':
      return {
        ...state, // Возьми старое состояние и замени все ниже
        items: {
          ...state.items,
          [action.payload.id]: !state.items[action.payload.id] //если ключа нету то создай его (а то андефаинд а мы итерируемся по нему)
            ? [action.payload]
            : [...state.items[action.payload.id], action.payload],
        },
      };
    default:
      return state;
  }
};

export default cart;
```

---

так как у объета нету метода length мы ретурн оборачиваем в скоуп (делаем как бы функцию)

```javascript
return {
  ...state, // Возьми старое состояние и замени все ниже
  items: {
    ...state.items,
    [action.payload.id]: !state.items[action.payload.id] //если ключа нету то создай его (а то андефаинд а мы итерируемся по нему)
      ? [action.payload]
      : [...state.items[action.payload.id], action.payload],
  },
};
```

---

_Так можно все ключи занести в массив и узнать его длину_

```javascript
Object.keys(state.items).length,
```

---

reducer cart обновленный ↓

_newItems хранит в себе актуальное значение объекта при вызове action , и это значение мы передеаем в items и в totalCount передаем длину _
храним переменную и к ней обращаемся + мы не делаем action для totalCount

```javascript
const initialState = {
  items: {},
  totalPrice: 0,
  totalCount: 0,
};

const cart = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_PIZZA_CART': {
      //новый объект , из этого объекта берутся из актульного объекта (бех него redax путается)
      const newItems = {
        ...state.items,
        [action.payload.id]: !state.items[action.payload.id] //если ключа нету то создай его (а то андефаинд а мы итерируемся по нему)
          ? [action.payload]
          : [...state.items[action.payload.id], action.payload],
      };
      return {
        ...state, // Возьми старое состояние и замени все ниже
        items: newItems,
        totalCount: Object.keys(newItems).length,
      };
    }
    default:
      return state;
  }
};
export default cart;
```

как из объекта в котором объекты пиц узнать колличество пицц ?

```javascript
    items: {
      '3': [
        {
          id: 3,
          name: 'Кисло-сладкий цыпленок',
          imageUrl: 'https://dodopizza.azureedge.net/static/Img/Products/Pizza/ru-RU/af553bf5-3887-4501-b88e-8f0f55229429.jpg',
          price: 275,
          size: 26,
          type: 'традиционное'
        }
      ],
      '4': [
        {
          id: 4,
          name: 'Чизбургер-пицца',
          imageUrl: 'https://dodopizza.azureedge.net/static/Img/Products/Pizza/ru-RU/b750f576-4a83-48e6-a283-5a8efb68c35d.jpg',
          price: 415,
          size: 40,
          type: 'тонкое'
        }
      ],
      '5': [
        {
          id: 5,
          name: 'Крэйзи пепперони',
          imageUrl: 'https://dodopizza.azureedge.net/static/Img/Products/Pizza/ru-RU/1e1a6e80-b3ba-4a44-b6b9-beae5b1fbf27.jpg',
          price: 580,
          size: 40,
          type: 'тонкое'
        },
        {
          id: 5,
          name: 'Крэйзи пепперони',
          imageUrl: 'https://dodopizza.azureedge.net/static/Img/Products/Pizza/ru-RU/1e1a6e80-b3ba-4a44-b6b9-beae5b1fbf27.jpg',
          price: 580,
          size: 40,
          type: 'тонкое'
        }
      ]
    },
```

Рещение

```javascript
const totalobj = Object.values(items);
```

**totalobj ↓**

хранит в себе 3 массива (3 пиццы было выбрано) , в каждом массиве объекты (пиццы данного типа)

```javascript
0: [{…}]
1: [{…}]
2: (2) [{…}, {…}]
```

**но как узнать колличество всех пицц ?!**
(создался 1 массив с всеми объектами вместе)

```javascript
[].concat.apply([], Object.values(items));
//ну или так [].concat.applay([], totalobj)

//прайс итоговый
[].concat.apply([], Object.values(newItems)).reduce((sum, obj) => obj.price + sum, 0);
```

---

```javascript
const initialState = {
  items: {},
  totalPrice: 0,
  totalCount: 0,
};

const cart = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_PIZZA_CART': {
      //новый объект , из этого объекта берутся из актульного объекта (бех него redax путается)
      const newItems = {
        ...state.items,
        [action.payload.id]: !state.items[action.payload.id] //если ключа нету то создай его (а то андефаинд а мы итерируемся по нему)
          ? [action.payload]
          : [...state.items[action.payload.id], action.payload],
      };

      const allPizzas = [].concat.apply([], Object.values(newItems));
      const totalPrice = allPizzas.reduce((sum, obj) => obj.price + sum, 0);

      return {
        ...state, // Возьми старое состояние и замени все ниже
        items: newItems,
        totalCount: allPizzas.length,
        totalPrice,
      };
    }
    default:
      return state;
  }
};

export default cart;
```

---

Редирект ? Приложение работает на 3000 порте , а jSon сервер на 3001 , чтобы при заливе сайта на сервер не поднимались лишние порты

заходим в package.json и добавляем :

```javascript
"proxy": "http://localhost:3001",
```

Заходим в action pizzas и меняем ссылку дял запроса ! и теперь запрос будет приходиь на 3000 порт

```javascript
axios.get(
  `/pizzas?${category !== null ? `category=${category}` : ''}&_sort=${sortBy.type}&_order=${
    sortBy.order
  }`,
);
```

---

Оптимизация кода получения цены и количества пицц ↓

До :

```javascript
const items = Object.values(newItems).map((obj) => obj.items);
const allPizzas = [].concat.apply([], items);
const totalPrice = getTotalPrice(allPizzas);
```

После :

```javascript
const totalCount = Object.keys(newItems).reduce((sum, key) => newItems[key].items.length + sum, 0);

const totalPrice = Object.keys(newItems).reduce((sum, key) => newItems[key].totalPrice + sum, 0);
      return {
        ...state, /
        items: newItems,
        totalCount,
        totalPrice,
      };
```

ОПТИМИЗАЦИЯ (ПОЧЕМУ БЕЗ LOADDESH) :c ↓:

```javascript
const _get = (obj, path) => {
  const [firstKey, ...keys] = path.split('.');
  return keys.reduce((val, key) => {
    return val[key];
  }, obj[firstKey]);
};
const getTotalSum = (obj, path) => {
  return Object.values(obj).reduce((sum, obj) => {
    const value = _get(obj, path);
    return sum + value;
  }, 0);
};
const totalCount = getTotalSum(newItems, 'items.length');
const totalPrice = getTotalSum(newItems, 'totalPrice');
```
