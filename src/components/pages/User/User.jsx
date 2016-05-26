import React, { Component } from 'react';
import cookie from 'react-cookie';
import InstagramApi from '../../../utils/instagramApi';

class User extends Component {
    constructor(props) {
        super(props);
        
        this.instagramApi = new InstagramApi();
        this.instagramApi.token = cookie.load('instagramToken');
        
        this.state = {
            user_info: {
                id: '',
                bio: '',
                full_name: '',
                profile_picture: '',
                username: '',
                website: '',
                counts: {
                    followed_by: 0,
                    follows: 0
                }
            }
        };
    }
    
    componentDidMount() {
        const { user_id } = this.props.params;
            
        this.instagramApi.getUserInfo(user_id)
            .then(user_info => {
                console.log('Success');
                console.log(user_info);
                this.setState({ user_info });
            });
            
        this.instagramApi.getUserFollowers(user_id)
            .then(followers => {
                console.log(followers);
                console.log('followers');
            });
    }
        
    render() {
        let { user_id } = this.props.params,
            redirectUrl = encodeURIComponent('http://localhost:8000/#/instagram_auth');
        
        const instagramAuthUrl = `https://api.instagram.com/oauth/authorize/?client_id=${this.instagramApi.clientId}&amp;redirect_uri=${redirectUrl}&amp;response_type=token&scope=basic+likes+relationships+comments`;
        
        console.log('Rendering');
    
        return (
            <div className="container-fluid">
                <a href={instagramAuthUrl}>Login Instagram</a>
                
                <div className="row">
                    <h1>{this.state.user_info.full_name}</h1>
                    <div className="col-xs-5 col-sm-5 col-md-5">
                        <img className="img-rounded img-responsive" src={this.state.user_info.profile_picture} />
                    </div>
                    <div className="row">
                        <span>followed by: {this.state.user_info.counts.followed_by}</span>
                        <span>follows: {this.state.user_info.counts.follows}</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default User;