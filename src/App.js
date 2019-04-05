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
import CheckIn from "./components/CheckIn";
import Attendees from "./components/Attendees/Index";

class App extends Component {
    constructor() {
        super();
        this.state = {
            user: null,
            displayName: null,
            userID: null,
            meetings: []
        }
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged(FBUser => {
            if (FBUser) {
                this.setState({
                    user: FBUser,
                    displayName: FBUser.displayName,
                    userID: FBUser.uid
                });
                const meetingRef = firebase.database().ref(`meeting/${FBUser.uid}`);
                meetingRef.on('value', snapshot => {
                    let meetings = snapshot.val();
                    const meetingsList = [];
                    for (const item in meetings) {
                        meetingsList.push({
                            meetingID: item,
                            meetingName: meetings[item].meetingName
                        });
                    }
                    this.setState({
                        meetings: meetingsList
                    })
                });
            } else {
                this.setState({user: null})
            }
        })
    }

    registerUser = userName => {
        firebase
            .auth()
            .onAuthStateChanged(FBUser => {
                FBUser.updateProfile({
                    displayName: userName
                }).then(() => {
                    this.setState({
                        user: FBUser,
                        displayName: FBUser.displayName,
                        userID: FBUser.uid
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
            userID: null
        });
        firebase.auth().signOut().then(() => {
            navigate('/login');
        });
    };
    addMeeting = meetingName => {
        const ref = firebase
            .database()
            .ref(`meeting/${this.state.user.uid}`);
        ref.push({meetingName})
    };

    render() {
        return (
            <div>
                <NavBar user={this.state.user} logoutUser={this.logoutUser}/>
                {this.state.user &&
                <Welcome userName={this.state.displayName} logoutUser={this.logoutUser}/>
                }
                <Router>
                    <Home path="/" user={this.state.user}/>
                    <Login path="/login"/>
                    <Attendees
                        path="/attendees/:userID/:meetingID"
                        adminUser={this.state.userID}
                    />
                    <Meeting path="/meetings"
                             addMeeting={this.addMeeting}
                             meetings={this.state.meetings}
                             userID={this.state.userID}/>
                    <Register path="/register" registerUser={this.registerUser}/>
                    <CheckIn path="/checkin/:userID/:meetingID"/>
                </Router>
            </div>
        );
    }
}

export default App;
