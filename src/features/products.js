import { createSlice } from '@reduxjs/toolkit'
import firebase from '../firebase'

const initialState = {
    products: [],
    productsLoading: false,
    
}

export const productsSlice = createSlice({
    name: 'products',
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

export const productsSelector = (state) => state.products;

export const {
    productsIsLoading,
    getProducts,
    getProductsFailure,
    deleting,
    add,
    clear
} = productsSlice.actions;

export default productsSlice.reducer;

export function fetchProducts() {
    return async (dispatch) => {
        dispatch(productsIsLoading)
        
        const query = firebase.firestore().collection('products').orderBy('modified', 'desc')

        const snapshot = await query.get();

        if(snapshot.empty){
            dispatch(getProductsFailure())
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
                        .collection('products')
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