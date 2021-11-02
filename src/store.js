import { configureStore } from '@reduxjs/toolkit'
import userReducer from './features/user'
import productsReducer from './features/products'
import offersReducer from './features/offers'
import freshbasketReducer from './features/freshBasket'

export const store = configureStore({
  reducer: {
      user: userReducer,
      products: productsReducer,
      offers: offersReducer,
      freshBasket: freshbasketReducer
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      thunk:{
        
      },
      serializableCheck: false,
    })
  
})