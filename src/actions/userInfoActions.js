import { actionTypes } from './actionTypes';

const setUserInfo = userInfo => ({
    type: actionTypes.SET_USER_INFO,
    payload: userInfo
});

const addFollowedBy = followers => ({
    type: actionTypes.LOAD_FOLLOWED_BY,
    payload: followers
});

const addFollows = follows => ({
    type: actionTypes.LOAD_FOLLOWS,
    payload: follows
});

export { setUserInfo, addFollowedBy, addFollows }