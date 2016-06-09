import React, { Component } from 'react';
import cookie from 'react-cookie';
import { chunk, compact, forEach, orderBy, mapValues, min, max } from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import VkApi from '../../../utils/vkApi';
import * as userVkActions from '../../../actions/userVkActions';
import UsersNetwork from '../../ui/UsersNetwork/UsersNetwork.jsx';

class UserVk extends Component {
    constructor(props) {
        super(props);
        
        this.vkApi = new VkApi();
        this.vkApi.token = cookie.load('vkToken');
    }
    
    getUserWallLikes = wallChunks => {
        var wallPosts = wallChunks.shift(),
            reqPosts = compact(
                wallPosts.map(post => (post.likes.count > 0 && {
                    type: "post",
                    item_id: post.id,
                    owner_id: post.to_id,
                    skip_own: 1
                }))
            );

        this.vkApi.getLikes(reqPosts)
            .then(r => {
                console.log('getUserWallLikes');
                console.log(r);
                this.props.userVkActions.loadUserLikedBy(r);
                if (wallChunks.length) {
                    this.getUserWallLikes(wallChunks);
                } else {
                    // Load missing users
                    // console.log(this.props.users)
                    //debugger;
                }
            });
    };
    
    getUserFriendsInfo = friendChunks => {
        var friendIds = friendChunks.shift().map(friend => friend.uid);
        console.log(friendChunks);
        
        this.vkApi.getUserFriendsAndWallPosts(friendIds)
            .then(r => {
                this.props.userVkActions.loadFriends(mapValues(r, v => v.friends.map(friend => friend.uid)));
                
                if (friendChunks.length) {
                    this.getUserFriendsInfo(friendChunks);
                }
            });
    };
    
    componentDidMount() {
        // const { user_id } = { user_id: 279987856 };
        const { user_id } = { user_id: 9412816 };
        
        this.vkApi.getUserFriendsAndWallPosts([ user_id ])
            .then(r => {
                const user = r[user_id];

                this.props.userVkActions.loadUser(user.info);
                
                var splittedWallPosts = chunk(user.wall, 25);
                this.getUserWallLikes(splittedWallPosts);
                
                this.props.userVkActions.addFriends(user.friends);
                var splittedFriends = chunk(user.friends, 8);
                this.getUserFriendsInfo(splittedFriends);
            });
        /*
        this.vkApi.getUserWall({ user_id })
            .then(r => {
                console.log('getUserWall');
                console.log(r)
                
                var splittedWallPosts = chunk(r, 25);
                this.getUserWallLikes(splittedWallPosts);
            });

        this.vkApi.getUserInfo({ user_id })
            .then(r => {
                this.props.userVkActions.loadUser(r);
            });

        this.vkApi.getUserFriends({user_id})
            .then(r => {
                this.props.userVkActions.addFriends(r);
                var splittedFriends = chunk(r, 25);
                this.getUserFriendInfo(splittedFriends);
            });
        */
    }
    
    getUserProps = user_id => this.props.users[user_id] || { uid: '', first_name: '', last_name: '', photo_50: '' };
    
    render() {
        const
            vkAuthUrl = this.vkApi.getAuthUrl(),
            { user_id } = { user_id: 279987856 }, //this.props.params;
            user = this.getUserProps(user_id),
            { user_liked_by } = this.props,
            users = [{
                id: user_id,
                username: `${user.first_name} ${user.last_name}`,
                profile_picture: user.photo_50
            }]
                .concat(this.props.friends.map(f => {
                    let friend = this.getUserProps(f);
                    
                    return {
                        id: friend.uid,
                        username: `${friend.first_name} ${friend.last_name}`,
                        profile_picture: friend.photo_50
                    }
                }));
        let connectionsHash = this.props.friends.reduce((h, f) => {
            const s = `${min([user_id, f])}-${max([user_id, f])}`;
            h[s] = true;
            return h;
        }, {}),
            connections = this.props.friends.map(f => ({
            from: user_id,
            to: f
        }));
        Object.keys(this.props.connections).forEach(friend_id => {
            this.props.connections[friend_id]
                .filter(fr_id => this.props.friends.indexOf(fr_id) >= 0)
                .forEach(friend_friend => {
                    const s = `${min([friend_id, friend_friend])}-${max([friend_id, friend_friend])}`;
                    if (!connectionsHash[s]) {
                        connectionsHash[s] = true;
                        
                        connections = connections.concat({
                            from: friend_id,
                            to: friend_friend
                        });
                    }
                });
        });

        let topLikers = [];
        forEach(user_liked_by, (v, k) => {
            topLikers.push({
                uid: k,
                count: v
            });
        });
        topLikers = orderBy(topLikers, i => -i.count);
        
        console.log('props');
        console.log(this.props);

        return (
            <div className="container-fluid">
                <a href={vkAuthUrl}>Login Vk</a>
                
                <div className="row">
                    <h1>{user.first_name}</h1>
                </div>
                <div className='row'>
                    <UsersNetwork users={users} connections={connections} />
                </div>
                <div className="row">
                    <h3>Top likers</h3>
                    <table className='table'>
                        <thead>
                            <th>#</th>
                            <th>id</th>
                            <th>count</th>
                        </thead>
                        <tbody>
                        {topLikers.map((liker, idx) => {
                            const likerRec = this.getUserProps(liker.uid);
                            
                            return <tr>
                                <td>
                                    {idx + 1}
                                </td>
                                <td>
                                    <a href={`http://vk.com/id${liker.uid}`} target="_blank">
                                        {likerRec.uid ? `${likerRec.first_name} ${likerRec.last_name}` : liker.uid}
                                    </a>
                                </td>
                                <td>
                                    {liker.count}
                                </td>
                                <td>
                                    {likerRec && <img src={likerRec.photo_50} height="50" width="50" />}
                                </td>
                            </tr>
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    user_id: state.user_vk.user_id,
    users: state.user_vk.users,
    user_liked_by: state.user_vk.user_liked_by,
    friends: state.user_vk.friends,
    connections: state.user_vk.connections
});

const mapDispatchToProps = dispatch => ({
    userVkActions: bindActionCreators(userVkActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(UserVk);