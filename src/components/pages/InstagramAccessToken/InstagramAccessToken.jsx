import React, { Component } from 'react';
import cookie from 'react-cookie';

const VK_IDENT = '&expires_in=';

class InstagramAccessToken extends Component {    
    render() {
        const { token } = this.props.params;
        if (token.indexOf(VK_IDENT) >= 0) {
            cookie.save('vkToken', token.substring(0, token.indexOf(VK_IDENT)), { path: '/' });
        } else {
            cookie.save('instagramToken', token, { path: '/' });    
        }
        
        return <span>Token - {token}</span>;
    }
}

export default InstagramAccessToken;