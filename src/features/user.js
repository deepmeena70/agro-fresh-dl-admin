import { createSlice } from '@reduxjs/toolkit'
import firebase from '../firebase'

const initialState = {
    user: null,
    signIn: false,
    userLoading: false,
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        userIsLoading: (state) => {
            state.userLoading = true;
        },
        getUser: (state, action) => {
            state.user = action.payload;
            state.signIn = true;
            state.userLoading = false;
        },
        getUserFailure: (state) => {
            state.userLoading = false;
        },
    }
})

export const userSelector = (state) => state.user;

export const {
    userIsLoading,
    getUser,
    getUserFailure
} = userSlice.actions;

export default userSlice.reducer;

export function fetchUser() {
    return async (dispatch) => {
        dispatch(userIsLoading)
        
        firebase
            .auth()
            .onAuthStateChanged(user => {
                (!user) ? dispatch(getUserFailure()) 
                    : dispatch(getUser(user.uid))
            })

    }
}