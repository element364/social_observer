import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import ReactBootstrapToggle from 'react-bootstrap-toggle';
import { Link } from 'react-router';
import { Map, Marker, Popup, TileLayer, Circle } from 'react-leaflet';
import FontAwesome from 'react-fontawesome';
import InstagramApi from '../../../utils/instagramApi';
import moment from 'moment';
import  Notify from 'notifyjs';

require('react-bootstrap-toggle/lib/bootstrap2-toggle.css');

class RealtimeCheckins extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            currentPosition: [51.505, -0.09],
            selectedLocation: [51.505, -0.09],
            checkins: [],
            
            notifications: false
        };
        
        this.checkinsHash = {};
        
        this.instagramApi = new InstagramApi();
    }
    
    componentDidMount() {
        navigator.geolocation.getCurrentPosition(p => {
            const position = [p.coords.latitude, p.coords.longitude];
            
            this.setState({
                currentPosition: position,
                selectedLocation: position
            });
            
            this.searchInstagramCheckins();
        });
    }
    
    searchInstagramCheckins() {
        const
            lat = this.state.selectedLocation[0],
            lng = this.state.selectedLocation[1];
            
        this.instagramApi.findCheckins({ lat, lng }).then(checkins => {
            this.instagramSearchTimeout = setTimeout(() => {
                this.searchInstagramCheckins();
            }, 30 * 1000);
                        
            const
                currentMoment = moment(),
                newCheckins = checkins.filter(checkin => {
                    const delta = currentMoment.diff(checkin.moment_created_time, 'minutes');
                    console.log(`delta - ${delta}`);
                    return delta <= 1 && typeof this.checkinsHash[checkin.id] === 'undefined';
                });
            
            newCheckins.forEach(checkin => {
                this.checkinsHash[checkin.id] = 1;
                
                if (this.state.notifications) {
                    const checkinNotification = new Notify(`${checkin.user_name}`, {
                        body: checkin.text,
                        icon: checkin.thumb_url
                    });
                    
                    checkinNotification.show();
                }
            });
            
            this.setState({ checkins: this.state.checkins.concat(newCheckins) })
        })
    }
    
    handleNotificationsChange = notifications => {
        if (notifications) {
                Notify.requestPermission(() => {
                    this.setState({ notifications: true });
                    // Granted
                }, () => {
                    this.setState({ notifications: false });
                    // Denied
                });
                return;
        }
        
        this.setState({ notifications: false });
    };
    
    clearCheckins = () => {
        this.setState({ checkins: [] });
    };
    
    mapClickHandler = e => {
        clearTimeout(this.instagramSearchTimeout);
        
        this.checkinsHash = {};
        
        this.setState({
            checkins: [],
            selectedLocation: [e.latlng.lat, e.latlng.lng] 
        }, () => {
            this.searchInstagramCheckins();
        });
    }
    
    render() {
        const { currentPosition, selectedLocation, checkins } = this.state;
        
        return (
            <div className="container-fluid">
                <Link to="/">Realtime History</Link>
                <div className="row">
                    <div className="leaflet-container">
                        Realtime Checkins
                        
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
                    <div className="checkbox">
                        <label>
                            Notifications
                            <ReactBootstrapToggle active={this.state.notifications} onChange={this.handleNotificationsChange} />
                        </label>
                    </div>
                    
                </div>
                    {checkins && <div className="row">
                        <Button onClick={this.clearCheckins}>Очистить</Button>
                            {checkins.map(checkin =>
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
                                                <h4><Link to={`/user/${checkin.user_id}`}>{checkin.user_name}</Link></h4>
                                            </div>
                                            <div className="row" style={{ textAlign: 'center' }}>
                                                <img className="img-circle" style={{ maxWidth: '80%' }} src={checkin.user_image_url} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        )}
                    <Button onClick={this.clearCheckins}>Очистить</Button>
                </div>
                }
            </div>
        );
    }
}

export default RealtimeCheckins;