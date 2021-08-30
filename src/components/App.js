import React, {useEffect} from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

import {useDispatch, useSelector} from 'react-redux';
import {fetchUser, userSelector} from '../features/user'

import SignIn from './auth/SignIn'
import Dashboard from './dashboard/Dashboard'

export default function App () {

    const dispatch = useDispatch();

    const {user, signIn, userLoading } = useSelector(userSelector);

    console.log(user, signIn, userLoading)

    useEffect(() => {
        dispatch(fetchUser())
    }, [dispatch])

    return (
        <Router>
            <Switch>
                <Route path="/signin" >
                    <SignIn />
                </Route>
                <Route path="/offers">
                    <Dashboard content="offers"/>
                </Route>
                <Route path="/products" >
                    <Dashboard content="products"/>
                </Route>
                <Route path="/">
                    <Dashboard content = "main"/>
                </Route>
            </Switch>
        </Router>
    )
}

