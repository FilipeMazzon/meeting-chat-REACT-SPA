import React, {Component} from 'react';
import firebase from './config/Firebase';
import {GoListUnordered, GoTrashcan} from 'react-icons/go';
import FormError from './FormError'
import {navigate} from "@reach/router";
import {FaLink} from "react-icons/fa";

class MeetingsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errorMessage: null
        };
        this.deleteMeeting = this.deleteMeeting.bind(this);
    }

    deleteMeeting = (e, whichMeeting) => {
        e.preventDefault();
        const ref = firebase
            .database()
            .ref(`meeting/${this.props.userID}/${whichMeeting}`);
        ref.remove().catch(error => {
            if (error.message !== null) {
                this.setState({errorMessage: error.message});
            } else {
                this.setState({errorMessage: null});
            }
        });
    };

    render() {
        const {meetings} = this.props;
        const myMeetings = meetings.map(item => {
            return (
                <div className="list-group-item d-flex" key={item.meetingID}>
                    <section
                        className="btn-group align-self-lg-end"
                        role="group"
                        aria-label="Meeting Options"
                    >
                        <button
                            className="btn btn-sm btn-outline-secondary"
                            title="Check In"
                            onClick={() => navigate(`/checkin/${this.props.userID}/${item.meetingID}`)}
                        >
                            <FaLink/>
                        </button>
                        <button
                            className="btn btn-sm btn-outline-secondary"
                            title="Attendees List"
                            onClick={() => navigate(`/attendees/${this.props.userID}/${item.meetingID}`)}
                        >
                            <GoListUnordered/>
                        </button>
                        <button
                            className="btn btn-sm btn-outline-secondary"
                            title="Delete Meeting"
                            onClick={e => this.deleteMeeting(e, item.meetingID)}
                        >
                            <GoTrashcan/>
                        </button>
                    </section>
                    <section className="pl-3 text-left align-self-center">
                        {item.meetingName}
                    </section>
                </div>
            );
        });

        return (
            <div>
                {this.state.errorMessage !== null ? (
                    <FormError theMessage={this.state.errorMessage}/>
                ) : null}
                {myMeetings}
            </div>
        );
    }
}

export default MeetingsList;