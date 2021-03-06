import { configureStore } from "@reduxjs/toolkit";
import userInfoSlice, { login } from "../redux/userSlice";
import { Provider } from "react-redux";
import axios from "axios";
import { useEffect } from "react";
import productSlice from "../redux/productSlice";
import cartSlice from "../redux/cartSlice";
import orderSlice from "../redux/orderSlice";
//Create Our Store
const store = configureStore({
  reducer: {
    user: userInfoSlice,
    product:productSlice,
    cart:cartSlice,
    order:orderSlice
  },
  devTools: process.env.NODE_ENV !== 'production',
});
//State Provider To Provide store state in our application
const StoreProvider = ({children}) => {
  //checking if user logged in or not
  useEffect(() => {
    const myFunc = () =>{
        const userData = localStorage.getItem("user");
      if (userData) store.dispatch(login(JSON.parse(userData)));
    }
    myFunc()

  }, []);
  //when any error coming with axios it's showing to console to fix bug
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    function (error) {
      const res = error.response;
      //Checking token is expire or not if token expire return automatic logout and return login page
      if (res?.data.message.includes("invalid token")) {
        return new Promise((response, reject) => {
          axios
            .get(`${process.env.REACT_APP_PROXY_URI}/logout`)
            .then(({ data }) => {
              store.dispatch(login(data));
              localStorage.clear();
              window.location.href = '/login'
            })
            .catch((err) => {
              console.log(err);
              reject(error);
            });
        });
      }
      return Promise.reject(error);
    }
  );

  return <Provider store={store}>{children}</Provider>;
};

export default StoreProvider;