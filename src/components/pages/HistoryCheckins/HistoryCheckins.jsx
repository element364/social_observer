import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router';
import { Map, Marker, Popup, TileLayer, Circle } from 'react-leaflet';
import moment from 'moment';
import $ from 'jquery';

require('./history-checkin.less');

const instagram_client_id = '56b5e75fc8124dfba12aa25af2faae18';
const instagram_client_secret = 'e1c3bfd6dfb7422ba4d9532b6eca1339';

class HistoryCheckins extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            currentPosition: [51.505, -0.09],
            selectedLocation: [51.505, -0.09],
            checkins: []  
        };
        
        this.searchInstagramCheckins = this.searchInstagramCheckins.bind(this);
        this.loadMoreCheckins = this.loadMoreCheckins.bind(this);
        this.mapClickHandler = this.mapClickHandler.bind(this);
    }
    
    searchInstagramCheckins(lat, lng, max_timestamp = null) {
        $.ajax({
            url: 'https://api.instagram.com/v1/media/search',
            data: {
                lat, lng,
                max_timestamp,
                distance: 800,
                client_id: instagram_client_id
            },
            type: 'get',
            dataType: 'jsonp',
            success: r => {
                console.log(r);
                this.setState({
                    checkins: r.data.map(item => ({
                        lat: item.location.latitude,
                        lng: item.location.longitude,
                        created_time: item.created_time,
                        moment_created_time: moment(item.created_time, 'X'),
                        image_url: item.images.standard_resolution.url,
                        text: (item.caption && item.caption.text) || '',
                        link: item.link,
                        user_name: item.user.username,
                        user_image_url: item.user.profile_picture
                    }))
                }, () => { debugger; });
            } 
        });
    }
    
    loadMoreCheckins() {
        const minTimestamp = this.state.checkins.reduce((minTS, checkin) => {
            return Math.min(minTS, checkin.created_time)
        }, 9999999999);
        
        this.searchInstagramCheckins(
            this.state.selectedLocation[0], this.state.selectedLocation[1],
            minTimestamp
        );
    }
    
    componentDidMount() {
        navigator.geolocation.getCurrentPosition(p => {
            this.setState({
                currentPosition: [p.coords.latitude, p.coords.longitude],
                selectedLocation: [p.coords.latitude, p.coords.longitude]
            });
            
            this.searchInstagramCheckins(p.coords.latitude, p.coords.longitude);
        });
    }
    
    mapClickHandler(e) {
        console.log('mapClickHandler');
        console.log(e);
        this.setState({
           selectedLocation: [e.latlng.lat, e.latlng.lng] 
        }, () => {
            this.searchInstagramCheckins(e.latlng.lat, e.latlng.lng);
        });
    }
    
    render() {
        const { currentPosition, selectedLocation } = this.state;
        
        return (
            <div className="container-fluid">
                <Link to="/realtime_checkins">Realtime checkins</Link>
                <div className="row">
                    <div className="leaflet-container">
                    History checkins
                    <Map center={currentPosition} zoom={13} onClick={this.mapClickHandler}>
                        <TileLayer
                            url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <Circle center={selectedLocation} radius={800}>
                        </Circle>
                        {this.state.checkins.map(checkin =>
                            <Marker position={[checkin.lat, checkin.lng]}>
                                <Popup>
                                    <img width="100" height="100" src={checkin.image_url} />
                                </Popup>
                            </Marker>)}
                    </Map>
                    </div>
                </div>
                <div className="row">
                    {this.state.checkins.map(checkin =>
                        <div className="well well-sm">
                            <div className="row">
                                <div className="col-xs-5 col-sm-5 col-md-5">
                                    <img className="img-rounded img-responsive" src={checkin.image_url} />
                                </div>
                                <div className="col-xs-4 col-sm-4 col-md-4">
                                    <blockquote className="'blockquote-reverse'">
                                        <p>{checkin.text}</p>
                                        <footer>
                                            <cite>
                                                <div>{checkin.moment_created_time.format('DD-MM-YYYY HH::mm:ss')}</div>
                                                <div>{checkin.moment_created_time.locale('ru').fromNow()}</div>
                                                <a target="_blank" href={checkin.link}>Go</a>
                                            </cite>
                                        </footer>
                                    </blockquote>
                                </div>
                                <div className="col-xs-3 col-sm-3 col-md-3">
                                    <div className="row">
                                        <div style={{ float: 'left' }}>
                                            <img height="25" src="http://static.parastorage.com/media/75a799_583bef29630244abb896648f080b2f4d.png" />
                                        </div>
                                        <h4>{checkin.user_name}</h4>
                                    </div>
                                    <div className="row" style={{ textAlign: 'center' }}>
                                        <img className="img-circle" style={{ maxWidth: '80%' }} src={checkin.user_image_url} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <Button onClick={this.loadMoreCheckins}>Еще</Button>
                </div>
            </div>
        );
    }
}

export default HistoryCheckins;