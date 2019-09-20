import React from 'react';
import '../../App.css';

class UserPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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
        fetch('/profile/' + uid)
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
    
    edit(){

    }
    render(){
        return(
            <div>
                <div className="container">
                    <h1>{this.state.name}</h1>
                    <h2>{this.state.email}</h2>
                    <h2>{this.state.skills}</h2>
                    <h2>{this.state.rating}</h2>
                    <button onClick={this.edit}>Edit Profile</button>
                </div>
            </div>
        );
    }
}
export default UserPage;