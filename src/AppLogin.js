import React from 'react';
import { Switch, BrowserRouter, Router, Route } from 'react-router-dom';

// import { alertActions } from '../_actions';
// import { PrivateRoute } from './_components';
import App from './App';
import User from './User';


class AppLogin extends React.Component {

    
    render() {
        return (
                    <BrowserRouter> 
                        <Switch>
                            <Route path="/chessviewer/:userid/:event" component={App} />
                            <Route path="/user" component={User} />
                            
                        </Switch>
                    </BrowserRouter>
        );
    }
}

export default AppLogin;