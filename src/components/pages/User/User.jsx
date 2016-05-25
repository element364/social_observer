import React, { Component } from 'react';

class User extends Component {    
    render() {
        let { user_name } = this.props.params;
        alert(user_name);
    
        return <h1>User! {user_name}</h1>;
    }    
};

export default User;