import { createSlice } from '@reduxjs/toolkit'
import firebase from '../firebase'

const initialState = {
    offers: [],
    offersLoading: false,
    
}

export const offersSlice = createSlice({
    name: 'offers',
    initialState,
    reducers: {
        loading: (state) => {
            state.offersLoading = true;
        },
        getOffers: (state, action) => {
            state.offers.push(action.payload)
            state.offersLoading = false;
        },
        failure: (state) => {
            state.offersLoading = false;
        },
        deleting:(state, action) => {
            let index = state.offers.findIndex(offer => offer.offerCode === action.payload);
            state.offers.splice(index, 1);
        },
        add: (state, action) => {
            state.offers.unshift(action.payload);
        },
        clear: (state) => {
            Object.assign(state, initialState);
        }
        
    }
})

export const offersSelector = (state) => state.offers;

export const {
    loading,
    getOffers,
    failure,
    deleting,
    add,
    clear
} = offersSlice.actions;

export default offersSlice.reducer;

export function fetchOffers() {
    return async (dispatch) => {
        dispatch(loading)
        
        const query = firebase.firestore().collection('offers').orderBy('modified', 'desc')

        const snapshot = await query.get();

        if(snapshot.empty){
            dispatch(failure())
        } else {
            snapshot.forEach(doc => {
                dispatch(getOffers(doc.data()));
            })
        }

    }
}

export function clearOffers () {
    return (dispatch) => {
        dispatch(clear());
    }
}

export function deleteOffers(name) {
    return (dispatch) => {
        dispatch(deleting(name))
    }
}

export function addOffers(name) {
    return (dispatch) => {
        const query = firebase
                        .firestore()
                        .collection('offers')
                        .where('offerCode','==',name);
        
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