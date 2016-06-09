import React, { Component } from 'react';
import cookie from 'react-cookie';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import InstagramApi from '../../../utils/instagramApi';
import * as userInfoActions from '../../../actions/userInfoActions';
import UsersNetwork from '../../ui/UsersNetwork/UsersNetwork.jsx';

class User extends Component {
    constructor(props) {
        super(props);
        
        this.instagramApi = new InstagramApi();
        this.instagramApi.token = cookie.load('instagramToken');
    }
    
    componentDidMount() {
        const { user_id } = this.props.params;
            
        this.instagramApi.getUserInfo({user_id})
            .then(user_info => {
                this.props.userInfoActions.setUserInfo(user_info)
            });
            
        this.loadFollowers({ user_id });
        
        this.loadFollows({ user_id });
    }
    
    loadFollowers = params => {
        this.instagramApi.getUserFollowers(params)
            .then(r => {
                this.props.userInfoActions.addFollowedBy(r.data);

                if (r.pagination.next_url) {
                    this.loadFollowers({ next_url: r.pagination.next_url });
                }
            });
    };
    
    loadFollows = params => {
        this.instagramApi.getUserFollows(params)
            .then(r => {
                this.props.userInfoActions.addFollows(r.data);
                
                if (r.pagination.next_url) {
                    this.loadFollows({ next_url: r.pagination.next_url });
                }
            });
    };
        
    render() {
        let { user_id } = this.props.params,
            instagramAuthUrl = this.instagramApi.getAuthUrl();
        
        
        
        const followsHash = this.props.follows.reduce((hash, follow) => {
            hash[follow.id] = follow;
            return hash;
        }, {});
        
        const followedByHash = this.props.followed_by.reduce((hash, follower) => {
            hash[follower.id] = follower;
            return hasn;
        }, {});
        
        console.log('followsHash');
        console.log(followsHash);
        
        console.log('followedByHash');
        console.log(followedByHash);
        
        var users = [{
            id: Number(this.props.user.id),
            username: this.props.user.username,
            profile_picture: this.props.user.profile_picture
        }].concat(this.props.follows.map(follow =>({
            id: Number(follow.id),
            username: follow.username,
            profile_picture: follow.profile_picture
        }))),
        connections = this.props.follows.map(follow => ({
            from: Number(this.props.user.id),
            to: Number(follow.id),
            arrows: 'to'
        }));
        
        /*
        .concat(this.props.followed_by.map(follower => ({
            id: Number(follower.id),
            username: follower.username,
            profile_picture: follower.profile_picture
        })))
        */
        /*
        this.props.followed_by.map(follower => ({
            from: Number(follower.id),
            to: Number(this.props.user.id),
            arrows: 'to'
        }))
        */
    
        return (
            <div className="container-fluid">
                <a href={instagramAuthUrl}>Login Instagram</a>
                
                <div className="row">
                    <h1>{this.props.user.full_name}</h1>
                    <div className="col-xs-5 col-sm-5 col-md-5">
                        {false && <img className="img-rounded img-responsive" src={this.props.user_info.profile_picture} />}
                    </div>
                </div>
                <div className="row">
                    <span>followed by: {this.props.user.counts.followed_by}</span>
                    <span>follows: {this.props.user.counts.follows}</span>
                </div>
                <div className='row'>
                    <UsersNetwork users={users} connections={connections} />
                </div>
                <div className='row'>
                    <div className="col-sm-6 col-md-6">
                        <table className='table'>
                            {this.props.followed_by.map((follower, idx) =>
                                <tr>
                                    <td>{idx}</td>
                                    <td>{follower.full_name}</td>
                                </tr>
                            )}
                        </table>
                    </div>
                    <div className="col-sm-6 col-md-6">
                        <table className='table'>
                            {this.props.follows.map((follow, idx) =>
                                <tr>
                                    <td>{idx}</td>
                                    <td>{follow.full_name}</td>
                                </tr>
                            )}
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    user: state.user_info.user_info,
    followed_by: state.user_info.followed_by,
    follows: state.user_info.follows
});

const mapDispatchToProps = dispatch => ({
    userInfoActions: bindActionCreators(userInfoActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(User);