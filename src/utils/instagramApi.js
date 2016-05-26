import $ from 'jquery';
import moment from 'moment';

class InstagramApi {
    constructor() {
        this.clientId = '56b5e75fc8124dfba12aa25af2faae18';
        this.clientSecret = 'e1c3bfd6dfb7422ba4d9532b6eca1339';
        
        this.token = '';
    }
    
    getUserInfo(user_id) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `https://api.instagram.com/v1/users/${user_id}/?access_token=${this.token}`,
                type: 'get',
                dataType: 'jsonp',
                success: r => {
                    console.log(r);
                    resolve(r.data);
                }
            });
        });
    }
    
    getUserFollowers(user_id) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `https://api.instagram.com/v1/users/${user_id}/followed-by?access_token=${this.token}`,
                type: 'get',
                dataType: 'jsonp',
                success: r => {
                    console.log(r);
                    resolve(r.data);
                }
            });
        });
    }
    
    findCheckins(options) {
        const { lat, lng, max_timestamp = null } = options;
        
        return new Promise((resolve, reject) => {
            $.ajax({
                url: 'https://api.instagram.com/v1/media/search',
                data: {
                    lat, lng,
                    max_timestamp,
                    distance: 800,
                    client_id: this.clientId
                },
                type: 'get',
                dataType: 'jsonp',
                success: r => {
                    console.log(r);
                    resolve(
                        r.data.map(item => ({
                            id: item.id,
                            lat: item.location.latitude,
                            lng: item.location.longitude,
                            created_time: item.created_time,
                            moment_created_time: moment(item.created_time, 'X'),
                            image_url: item.images.standard_resolution.url,
                            thumb_url: item.images.thumbnail.url,
                            text: (item.caption && item.caption.text) || '',
                            link: item.link,
                            user_id: item.user.id,
                            user_name: item.user.username,
                            user_image_url: item.user.profile_picture
                        }))
                    );
                }
            });
        });
    }
}

export default InstagramApi;