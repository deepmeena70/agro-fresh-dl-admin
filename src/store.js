import { configureStore } from '@reduxjs/toolkit'
import userReducer from './features/user'
import productsReducer from './features/products'

export const store = configureStore({
  reducer: {
      user: userReducer,
      products: productsReducer
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      thunk:{
        
      },
      serializableCheck: false,
    })
  
})