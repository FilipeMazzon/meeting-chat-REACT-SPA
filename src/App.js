import React, {Component} from 'react';
import {Router, navigate} from '@reach/router';
import firebase from './components/config/Firebase';

import 'bootstrap/dist/css/bootstrap.css';

import Home from './components/Home';
import Welcome from "./components/Welcome";
import NavBar from './components/NavBar';
import Register from './components/Register';
import Meeting from './components/Meeting';
import Login from "./components/Login";

class App extends Component {
    constructor() {
        super();
        this.state = {
            user: null,
            displayName: null,
            userId: null
        }
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged(FBUser => {
            if (FBUser) {
                this.setState({
                    user: FBUser,
                    displayName: FBUser.displayName,
                    userId: FBUser.uid
                })
            }
        })
    }

    registerUser = userName => {
        firebase.auth().onAuthStateChanged(FBUser => {
            FBUser.updateProfile({
                displayName: userName
            }).then(() => {
                this.setState({
                    user: FBUser,
                    displayName: FBUser.displayName,
                    userId: FBUser.uid
                });
                navigate('/meetings')
            });
        });
    };
    logoutUser = e => {
        e.preventDefault();
        this.setState({
            displayName: null,
            user: null,
            userId: null
        });
        firebase.auth().signOut().then(() => {
            navigate('/login');
        });
    };

    render() {
        return (
            <div>
                <NavBar user={this.state.user} logoutUser={this.logoutUser}/>
                {this.state.user &&
                <Welcome userName={this.state.displayName} logoutUser ={this.logoutUser}/>
                }
                <Router>
                    <Home path="/" user={this.state.user}/>
                    <Login path="/login"/>
                    <Meeting path="/meetings"/>
                    <Register path="/register" registerUser={this.registerUser}/>
                </Router>


            </div>
        );
    }
}

export default App;
