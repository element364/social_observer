import $ from 'jquery';
import moment from 'moment';

class InstagramApi {
    constructor() {
        this.clientId = 'e1c0c5ca4781431897c70a47b79a8c4e';
        this.clientSecret = '4e3075da7678499eb4a802b31251ef87';
        
        this.token = '';
    }
    
    getAuthUrl() {
        const
            redirectUrl = encodeURIComponent('http://localhost:8000/#/instagram_auth'),
            instagramAuthUrl = `https://api.instagram.com/oauth/authorize/?client_id=${this.clientId}&amp;redirect_uri=${redirectUrl}&amp;response_type=token&scope=basic+public_content+follower_list+comments+relationships+likes`;
            
        return instagramAuthUrl;
    }
    
    getUserInfo(options) {
        const
            { user_id } = options;
            
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
    
    getUserFollowers(options) {
        const
            { user_id } = options,
            url = options.next_url ? options.next_url : `https://api.instagram.com/v1/users/${user_id}/followed-by?access_token=${this.token}`;
                
        return new Promise((resolve, reject) => {
            $.ajax({
                url,
                type: 'get',
                dataType: 'jsonp',
                success: r => {
                    console.log(r);
                    resolve({
                        data: r.data,
                        pagination: r.pagination
                    });
                }
            });
        });
    }
    
    getUserFollows(options) {
        const
            { user_id } = options,
            url = options.next_url ? options.next_url : `https://api.instagram.com/v1/users/${user_id}/follows?access_token=${this.token}`;;
        
        return new Promise((resolve, reject) => {
            $.ajax({
                url,
                type: 'get',
                dataType: 'jsonp',
                success: r => {
                    resolve({
                        data: r.data,
                        pagination: r.pagination
                    });
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
                    client_id: this.clientId,
                    access_token: this.token
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