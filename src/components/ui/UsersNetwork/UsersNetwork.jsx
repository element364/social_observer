import React, { Component, PropTypes as pt } from 'react';
import { map, each } from 'lodash';
import vis from 'vis';

import './users-network.less';

// my id 352665413
class UsersNetwork extends Component {
    constructor(props) {
        super(props);
        
        this.nodes = new vis.DataSet();
        this.edges = new vis.DataSet();
    }
    
    componentDidMount() {
        console.log('UsersNetwork componentDidMount');
        
        this.network = new vis.Network(
            document.getElementById(this.props.containerId),
            {
                nodes: this.nodes,
                edges: this.edges
            },
            this.props.options
        );
    }
    
    componentWillReceiveProps(newProps) {
        console.log('componentWillReceiveProps');
        console.log(newProps);
        
        this.network.setData({
            nodes: map(newProps.users, user => ({
                id: Number(user.id),
                label: user.username,
                shape: 'image',
                image: user.profile_picture
            })),
            edges: newProps.connections
        });
    }
    
    render() {
        return <div className='users-network' id={this.props.containerId}></div>; 
    }
}

UsersNetwork.propTypes = {
    containerId: pt.string,
    options: pt.object
};

UsersNetwork.defaultProps = {
    containerId: 'graph',
    options: {
        layout: {
            randomSeed: 26
        },
        physics: {
            forceAtlas2Based: {
                gravitationalConstant: -26,
                centralGravity: 0.005,
                springLength: 230,
                springConstant: 0.18
            },
            maxVelocity: 146,
            solver: 'forceAtlas2Based',
            timestep: 0.35,
            stabilization: {
                enabled:true,
                iterations:2000,
                updateInterval:25
            }
        },
        nodes: {
            borderWidth: 4,
            size: 30,
            color: {
                border: '#406897',
                background: '#6AAFFF'
            },
            font: {color :'#eeeeee'},
            shapeProperties: {
                useBorderWithImage:true
            }
        }
    }
};

export default UsersNetwork;