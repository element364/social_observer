import React, { Component } from 'react';
import cookie from 'react-cookie';

class InstagramAccessToken extends Component {    
    render() {
        const { token } = this.props.params;
        cookie.save('instagramToken', token, { path: '/' });
        
        return <span>Token - {token}</span>;
    }
}

export default InstagramAccessToken;