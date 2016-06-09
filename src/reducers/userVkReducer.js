import { actionTypes } from '../actions/actionTypes';

const initialUserVkState = {
    user_id: 0,
    users: {},
    friends: [],
    user_liked_by: {},
    connections: {}
};

const userVkReducer = (state = initialUserVkState, action) => {
    switch (action.type) {
        case actionTypes.LOAD_FRIENDS_VK:
            return {
                ...state,
                users: {
                    ...state.users,
                    ...action.payload.reduce((h, u) => {h[u.uid] = u; return h}, {})
                },
                friends: [...state.friends, ...action.payload.map(u => u.uid)]
            };
        case actionTypes.LOAD_USER_VK:
            return {
                ...state,
                user_id: action.payload.uid,
                users: {
                    ...state.users,
                    ...{ [action.payload.uid]: action.payload }
                }
            };
        case actionTypes.LOAD_USER_LIKED_BY:
            return {
                ...state,
                user_liked_by: {
                    ...state.user_liked_by,
                    ...action.payload.reduce((h, item) => {
                        item.users.forEach(u => {
                            h[u] = h[u] || 0;
                            h[u]++;
                        })
                        return h;
                    }, state.user_liked_by)
                }
            };
        case actionTypes.LOAD_FRIENDS:
            return {
                ...state,
                connections: {
                    ...state.connections,
                    ...action.payload
                }
            }
    }
    
    return state;
};

export { userVkReducer }