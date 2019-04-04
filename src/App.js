import React, {Component} from 'react';
import {Router} from '@reach/router';
//import firebase from './components/config/Firebase';

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
            user: null
        }
    }
/*    componentDidMount() {
        const ref = firebase.database().ref('user');
        ref.on('value',snapshot=>{
            let FBUser = snapshot.val();
            this.setState({user:FBUser});
        })
    }*/

    render() {
        return (
            <div>
                <NavBar user={this.state.user}/>
                {this.state.user &&
                <Welcome user={this.state.user}/>
                }
                <Router>
                    <Home path="/" user={this.state.user}/>
                    <Login path="/login"/>
                    <Meeting path="/meetings"/>
                    <Register path="/register"/>
                </Router>


            </div>
        );
    }
}

export default App;
