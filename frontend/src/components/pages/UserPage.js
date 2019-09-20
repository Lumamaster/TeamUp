import React from 'react';
import {Redirect} from 'react-router-dom';
import '../../App.css';

class UserPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            edit:false,
            email: '',
            name: '',
            skills: '',
            rating: '',
            prevTeams: [],
            curTeams: [],
            blocked: [],
            invites: [],
            errors: []
        }
    }
    //TODO: dont know correct fetch argument
    componentDidMount(){
        let uid = window.location.toString().substr(window.location.toString().indexOf('/profile') + 9)
        fetch('/profile/' + uid, {
            headers: {
                Authorization: 'Bearer ' + window.localStorage.getItem('token')
            }
        })
        .then(response => response.json())
        .then(data => {
            this.setState({
            email: data.email,
            name: data.name,
            skills: data.skills,
            rating: data.rating,
            prevTeams: data.prevTeams,
            curTeams: data.curTeams,
            blocked: data.blocked,
            invites: data.invites
            })
        })
    }
    showErrors = () => {
        return this.state.errors.map(err => <p className="color-error" key={err}>{err}</p>)
    }

    handleInputChange = e => {
        const {name, value} = e.target;
        this.setState({
            [name]:value
        });
    }
    
    edit = () => {
        this.setState({
            edit: !this.state.edit
        })
    }
    render(){
        if(!window.localStorage.getItem('token')) {
            return <Redirect to="/login/"/>
        }
        return(
            <div>
                <div className="container">
                    {!this.state.edit ? 
                        <React.Fragment>
                            <h1>{this.state.name}</h1>
                            <p>Email: {this.state.email}</p>
                            <p>Skills: {this.state.skills}</p>
                            <p>Rating: {this.state.rating}</p>
                        </React.Fragment>
                        : 
                        <form>
                            <input type="text" placeholder={this.state.name} name="name" id="edit-name" onChange={this.handleInputChange}/>
                            <p>Email: {this.state.email}</p>
                            <p>Skills: {this.state.skills}</p>
                            <p>Rating: {this.state.rating}</p>
                        </form>
                    }
                    <button onClick={this.edit}>{this.state.edit ? 'Save Changes' : 'Edit Profile'}</button>
                    {this.state.edit ? this.state.errors.map(err => <p className="color-error" key={err}>{err}</p>) : null}
                </div>
            </div>
        );
    }
}
export default UserPage;