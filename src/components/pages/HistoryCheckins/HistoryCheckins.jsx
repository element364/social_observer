import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router';
import { Map, Marker, Popup, TileLayer, Circle } from 'react-leaflet';
import FontAwesome from 'react-fontawesome';
import InstagramApi from '../../../utils/instagramApi';

require('./history-checkin.less');

class HistoryCheckins extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            currentPosition: [51.505, -0.09],
            selectedLocation: [51.505, -0.09],
            checkins: []
        };
        
        this.instagramApi = new InstagramApi();
    }
    
    searchInstagramCheckins = (lat, lng, max_timestamp) => {
        this.instagramApi.findCheckins({ lat, lng, max_timestamp })
            .then(checkins => this.setState({ checkins }));
    };
    
    loadMoreCheckins = () => {
        const minTimestamp = this.state.checkins.reduce((minTS, checkin) => {
            return Math.min(minTS, checkin.created_time)
        }, 9999999999);
        
        this.searchInstagramCheckins(
            this.state.selectedLocation[0], this.state.selectedLocation[1],
            minTimestamp
        );
    };
    
    componentDidMount() {
        navigator.geolocation.getCurrentPosition(p => {
            const position = [p.coords.latitude, p.coords.longitude];
            
            this.setState({
                currentPosition: position,
                selectedLocation: position
            });
            
            this.searchInstagramCheckins(p.coords.latitude, p.coords.longitude);
        });
    }
    
    mapClickHandler = e => {
        console.log('mapClickHandler');
        console.log(e);
        this.setState({
           selectedLocation: [e.latlng.lat, e.latlng.lng] 
        }, () => {
            this.searchInstagramCheckins(e.latlng.lat, e.latlng.lng);
        });
    }
    
    render() {
        const { currentPosition, selectedLocation, checkins } = this.state;
        
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
                            {checkins && checkins.map(checkin =>
                                <Marker position={[checkin.lat, checkin.lng]}>
                                    <Popup>
                                        <img width="100" height="100" src={checkin.image_url} />
                                    </Popup>
                                </Marker>)}
                        </Map>
                    </div>
                </div>
                <div className="row">
                    <Button onClick={this.loadMoreCheckins}>Еще</Button>
                    {checkins && checkins.map(checkin =>
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
                                            <FontAwesome
                                                className='super-crazy-colors'
                                                name='instagram'
                                                size='2x'
                                                spin
                                                style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }}
                                            />
                                        </div>
                                        <h4><Link to={`/user/${checkin.user_name}`}>{checkin.user_name}</Link></h4>
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