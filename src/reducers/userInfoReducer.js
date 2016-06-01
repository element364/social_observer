import { actionTypes } from '../actions/actionTypes'; 

const initialUserInfoState = {
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
    },
    followed_by: [],
    follows: []
};

const userInfoReducer = (state = initialUserInfoState, action) => {
    switch (action.type) {
        case actionTypes.SET_USER_INFO:
            return {
                ...state,
                user_info: action.payload
            };
        case actionTypes.LOAD_FOLLOWED_BY:
            return {
                ...state,
                followed_by: [...state.followed_by, ...action.payload]
            }
        case actionTypes.LOAD_FOLLOWS:
            return {
                ...state,
                follows: [...state.follows, ...action.payload]
            };
    }
    
    return state;
};

export { userInfoReducer }