import React, { Component } from 'react';
import { Link } from 'react-router';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';

class HistoryObserver extends Component {
    render() {
        const position = [51.505, -0.09];
        
        return (
            <div className="container-fluid">
                <Link to="/realtime_observer">Realtime</Link>
                <div className="row">
                    HistoryObserver--
                    <Map center={position} zoom={13}>
                        <TileLayer
                            url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <Marker position={position}>
                            <Popup>
                                <span>A pretty CSS3 popup.<br/>Easily customizable.</span>
                            </Popup>
                        </Marker>
                    </Map>
                </div>
            </div>
        );
    }
}

export default HistoryObserver;