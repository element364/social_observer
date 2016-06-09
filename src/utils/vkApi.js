import $ from 'jquery';
import { first } from 'lodash';

class VkApi {
    constructor() {
        this.token = '';
    }
    
    getAuthUrl() {
        const url = `https://oauth.vk.com/authorize?client_id=4609506&display=page&redirect_uri=http://localhost:8000&response_type=token&v=5.52`;
        return url;        
    }
    
    getUserInfo(options) {
        const
            { user_id, fields = 'photo_50' } = options,
            url = `https://api.vk.com/method/users.get?user_ids=${user_id}&fields=${fields}`;
        
        return new Promise((resolve, reject) => {
            $.ajax({
                url,
                type: 'get',
                dataType: 'jsonp',
                success: r => {
                    resolve(first(r.response));
                }
            });
        });
    }
    
    getUserWall(options) {
        const
            { user_id } = options,
            url = `https://api.vk.com/method/wall.get?owner_id=${user_id}`;
            
        return new Promise((resolve, reject) => {
            $.ajax({
                url,
                type: 'get',
                dataType: 'jsonp',
                success: r => {
                    resolve( r.response.slice(1) );
                }
            });
        });
    }
    
    getUserFriendsAndWallPosts(ids) {
        const code = `
var ids = ${JSON.stringify(ids)}, result = [], i = 0;

while (i < ids.length) {
    result.push({
        uid: ids[i],
        info: API.users.get({ user_ids: ids[i], fields: "photo_50" })[0],
        friends: API.friends.get({ user_id: ids[i], fields: "photo_50" }),
        wall: API.wall.get({ owner_id: ids[i] })
    });
    i = i + 1;
}

return result;
`,
        url = `https://api.vk.com/method/execute?code=${encodeURIComponent(code)}&access_token=${this.token}`;
        
        return new Promise((resolve, reject) => {
            $.ajax({
                url,
                type: 'get',
                dataType: 'jsonp',
                success: r => {
                    resolve(r.response.reduce((h, user) => {
                        h[user.uid] = {
                            ...user,
                            wall: user.wall.slice(1)
                        };
                        return h;
                    }, {}));
                }
            });
        });
    }
    
    getLikes(optionsList) {
        const code = `
var items = ${JSON.stringify(optionsList)}, result = [];

var i = 0;
while (i < items.length) {
  var likes = API.likes.getList(items[i]);
  result.push(likes);
  i = i + 1;
}

return result;
`,
            url = `https://api.vk.com/method/execute?code=${encodeURIComponent(code)}&access_token=${this.token}`;

        return new Promise((resolve, reject) => {
            $.ajax({
                url,
                type: 'get',
                dataType: 'jsonp',
                success: r => {
                    resolve(r.response);
                }
            });
        });
    }
    
    getUserFriends(options) {
        const
            { user_id, fields = 'nickname,photo_50' } = options,
            url = `https://api.vk.com/method/friends.get?user_id=${user_id}&fields=${fields}`;
        
        return new Promise((resolve, reject) => {
            $.ajax({
                url,
                type: 'get',
                dataType: 'jsonp',
                success: r => {
                    resolve(r.response);
                }
            });
        });
    };
}

export default VkApi;