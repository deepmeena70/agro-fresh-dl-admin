import { createSlice } from '@reduxjs/toolkit'
import firebase from '../firebase'

const initialState = {
    products: [],
    productsLoading: false,
}

export const freshBasketSlice = createSlice({
    name: 'freshBasket',
    initialState,
    reducers: {
        productsIsLoading: (state) => {
            state.productsLoading = true;
        },
        getProducts: (state, action) => {
            state.products.push(action.payload)
            state.productsLoading = false;
        },
        getProductsFailure: (state) => {
            state.productsLoading = false;
        },
        deleting:(state, action) => {
            let index = state.products.findIndex(product => product.productName === action.payload);
            state.products.splice(index, 1);
        },
        add: (state, action) => {
            state.products.unshift(action.payload);
        },
        clear: (state) => {
            Object.assign(state, initialState);
        }
        
    }
})

export const freshBasketSelector = (state) => state.freshBasket;

export const {
    productsIsLoading,
    getProducts,
    getProductsFailure,
    deleting,
    add,
    clear
} = freshBasketSlice.actions;

export default freshBasketSlice.reducer;

export function fetchProducts() {
    return async (dispatch) => {
        dispatch(productsIsLoading)
        
        const query = firebase.firestore().collection('freshBasket').orderBy('modified', 'desc')

        const snapshot = await query.get();

        if(snapshot.empty){
            dispatch(getProductsFailure())
            console.log("empty bucket")
        } else {
            snapshot.forEach(doc => {
                dispatch(getProducts(doc.data()));
            })
        }

    }
}

export function clearProducts () {
    return (dispatch) => {
        dispatch(clear());
    }
}

export function deleteProducts(name) {
    return (dispatch) => {
        dispatch(deleting(name))
    }
}

export function addProducts(name) {
    return (dispatch) => {
        const query = firebase
                        .firestore()
                        .collection('freshBasket')
                        .where('productName','==',name);
        
        query.onSnapshot(querySnapshot => {
            querySnapshot.docChanges().forEach(change => {
                if(change.type === 'added') {
                    console.log(change.doc.data());
                    dispatch(add(change.doc.data()));
                }
            })
        })
    }
}