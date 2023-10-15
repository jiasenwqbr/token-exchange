import { createStore, applyMiddleware, compose } from "redux";
import { createLogger } from "redux-logger";
import rootReducer from "./reducers";

// import { createSerialize } from "redux-devtools-serialize";
// import { composeWithDevTools } from "redux-devtools-extension";

const loggerMiddleware = createLogger();
const middleware = [];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// const customSerialize = createSerialize({
//   replacer: (key, value) => {
//     if (typeof value === "bigint") {
//       return value.toString();
//     }
//     return value;
//   },
//   reviver: (key, value) => {
//     if (typeof value === "string" && /^\d+n$/.test(value)) {
//       return value.slice(0, -1);
//     }
//     return value;
//   },
// });

export default function configureStore(preloadedState) {
  // BigInt.prototype.toJSON = function () {
  //   return this.toString();
  // };
  // , {
  //   serialize,
  //   deserialize,
  // }
  //定义自定义序列化和反序列化逻辑
  const serialize = (key, value) => {
    if (typeof value === "bigint") {
      return value.toString(); // 将 BigInt 转换为字符串
    }
    return value;
  };

  // const deserialize = (key, value) => {
  //   if (typeof value === "string") {
  //     if (/^\d+$/.test(value)) {
  //       return BigInt(value); // 将字符串转换回 BigInt
  //     }
  //   }
  //   return value;
  // };

  BigInt.prototype.toJSON = function () {
    return this.toString();
  };

  return createStore(
    rootReducer,
    preloadedState,
    // composeEnhancers({ serialize }),
    composeEnhancers(applyMiddleware(...middleware, loggerMiddleware))
  );
}
