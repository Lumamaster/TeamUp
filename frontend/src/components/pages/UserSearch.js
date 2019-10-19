import React from 'react';
import {Redirect, Link} from 'react-router-dom';
import '../../App.css';
import {PRODUCTION, production_url, local_url} from '../../env.json';

class UserSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users:[],
            searchText:''
        }
    }
    //TODO: dont know correct fetch argument
    render(){
        if(!window.localStorage.getItem('token')) {
            return <Redirect to="/login/"/>
        }
        return(
            <div className="container" style={{minHeight:400}}>
                <h2>Search Users</h2>
                <input style={{width:'100%'}} type="text" name="searchText" onChange={this.handleInputChange} value={this.state.searchText}/>
                {this.state.users.map(user => {
                    return <p key={user._id}><Link id={user.username || user.name || user.id} to={'/profile/' + user._id}>{user.username || user.name || user.id}</Link></p>
                })}
            </div>
        );
    }

    handleInputChange = async e => {
        const {name, value} = e.target;
        this.setState({
            [name]:value
        })

        if(name === 'searchText') {
            const url = (PRODUCTION ? production_url : local_url) + '/search/' + value
            const fetchParams = {
                method:'GET',
                headers: {
                    Authorization: 'Bearer ' + window.localStorage.getItem('token')
                }
            }
            const res = await fetch(url, fetchParams)
            if(res.status == 200) {
                const data = await res.json();
                this.setState({
                    users:data
                })
                //console.log(data)
            }
        }
    }
}

export default UserSearch;