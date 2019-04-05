import React, {Component} from 'react'
import firebase from '../config/Firebase';
import AttendeesList from "./List";
import {FaRandom, FaUndo} from "react-icons/fa";

class Attendees extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchQuery: '',
            displayAttendees: [],
            allAttendees:[]
        };
        this.handleChange = this.handleChange.bind(this);
        this.resetQuery = this.resetQuery.bind(this);
        this.chooseRandomAttendee = this.chooseRandomAttendee.bind(this);
    }

    handleChange(e) {
        const itemName = e.target.name;
        const itemValue = e.target.value;
        this.setState({[itemName]: itemValue})
    }
    chooseRandomAttendee(){
        const randomAttendee = Math.floor(Math.random()* this.state.allAttendees.length);
        this.resetQuery();
        this.setState({
            displayAttendees: [this.state.allAttendees[randomAttendee]]
        })
    }
    resetQuery() {
        this.setState({
            displayAttendees:this.state.allAttendees,
            searchQuery: ''
        })
    }

    componentDidMount() {
        const ref = firebase
            .database()
            .ref(`meeting/${this.props.userID}/${this.props.meetingID}/attendees`);
        ref.on('value', snapshot => {
            const attendees = snapshot.val();
            const attendeesList = [];
            for (const item in attendees) {
                attendeesList.push({
                    attendeeID: item,
                    attendeeName: attendees[item].attendeeName,
                    attendeeEmail: attendees[item].attendeeEmail,
                    star: attendees[item].star
                })
            }
            this.setState({
                displayAttendees: attendeesList,
                allAttendees:attendeesList
            })
        });

    }

    render() {
        const dataFilter = item => item.attendeeName.toLowerCase().match(this.state.searchQuery.toLowerCase()) && true;
        const filteredAttendees = this.state.displayAttendees.filter(
            dataFilter
        );
        return (
            <div className="container mt-4">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <h1 className="font-weight-light text-center">
                            Attendees
                        </h1>
                    </div>
                </div>
                <div className="card bg-light mb-4">
                    <div className="card-body text-center">
                        <div className="input-group input-group-lg">
                            <input type="text" name="searchQuery" value={this.state.searchQuery}
                                   placeholder="Search Attendees"
                                   className="form-control" onChange={this.handleChange}/>
                            <div className="input-group-append">
                                <button className="btn btn-sm btn-outline-info"
                                        title="Reset Search"
                                        onClick={() => {
                                            this.resetQuery()
                                        }}>
                                    <FaUndo/>
                                </button>
                                <button className="btn btn-sm btn-outline-info"
                                        title="Pick a Random attendee"
                                        onClick={() => {
                                            this.chooseRandomAttendee()
                                        }}>
                                    <FaRandom/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <AttendeesList
                    userID={this.props.userID}
                    attendees={filteredAttendees}
                    adminUser={this.props.adminUser}
                    meetingID={this.props.meetingID}
                />
            </div>
        )
    }
}

export default Attendees;