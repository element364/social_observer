import React, { Component } from 'react';
import { Link } from 'react-router';

class RealtimeObserver extends Component {
    render() {
        return (
            <div className="container-fluid">
                <Link to="/">History</Link>
                <div className="row">
                    RealtimeObserver
                </div>
            </div>
        );
    }
}

export default RealtimeObserver;