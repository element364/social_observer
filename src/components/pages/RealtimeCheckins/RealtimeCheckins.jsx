import React, { Component } from 'react';
import { Link } from 'react-router';

class RealtimeCheckins extends Component {
    render() {
        return (
            <div className="container-fluid">
                <Link to="/">Realtime History</Link>
                <div className="row">
                    Realtime Checkins
                </div>
            </div>
        );
    }
}

export default RealtimeCheckins;