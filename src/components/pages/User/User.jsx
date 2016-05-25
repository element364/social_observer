import React, { Component } from 'react';
import cookie from 'react-cookie';
import InstagramApi from '../../../utils/instagramApi';
import 'whatwg-fetch';

class User extends Component {
    constructor(props) {
        super(props);
        
        this.instagramApi = new InstagramApi();
    }
    
    componentDidMount() {
        const { user_id } = this.props.params,
            token = cookie.load('instagramToken');
        
        fetch(`https://api.instagram.com/v1/users/${user_id}/?access_token=${token}`, { mode: 'no-cors' })
            .then(response => {
                console.log(response);
                console.log(response.json());
            })
            .then(r => {
                console.log(r)
            });
    }
        
    render() {
        let { user_id } = this.props.params,
            redirectUrl = encodeURIComponent('http://localhost:8000/#/instagram_auth');
        
        const instagramAuthUrl = `https://api.instagram.com/oauth/authorize/?client_id=${this.instagramApi.clientId}&amp;redirect_uri=${redirectUrl}&amp;response_type=token&scope=basic+likes+relationships+comments`;
    
        return (
            <div className="container-fluid">
                <a href={instagramAuthUrl}>Login Instagram</a>
                
                <div className="row">
                    <h1>User! {user_id}</h1>
                </div>
            </div>
        );
    }    
}

export default User;