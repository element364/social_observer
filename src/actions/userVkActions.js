import { actionTypes } from './actionTypes';

const addFriends = friends => ({
    type: actionTypes.LOAD_FRIENDS_VK,
    payload: friends
});

const loadUser = user => ({
    type: actionTypes.LOAD_USER_VK,
    payload: user
});

const loadUserLikedBy = likes => ({
    type: actionTypes.LOAD_USER_LIKED_BY,
    payload: likes
});

const loadFriends = friends => ({
    type: actionTypes.LOAD_FRIENDS,
    payload: friends
});

export { addFriends, loadUser, loadUserLikedBy, loadFriends }