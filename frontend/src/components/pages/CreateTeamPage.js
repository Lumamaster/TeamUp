import React from 'react';
import '../../App.css';
import {Redirect} from 'react-router-dom';
import {PRODUCTION, production_url, local_url} from '../../env.json';


class CreateTeamPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            teamName: '',
            teamMembers: [],
            owner: '', 
            info: '', 
            requestedSkills: [], 
            numMembers: '', 
            open: false, 
            course: '', 
            maxMembers: 1,
            errors: []
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    };
    onChangeFunc = (event) => {
        this.setState({maxMembers: event.target.value});
    }
    /*TODO: need to get token and set logged in email to owner*/
    handleSubmit(event) {
        event.preventDefault();
    
        fetch((PRODUCTION ? production_url : local_url) + '/startteam', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + window.localStorage.getItem('token')
            },
            body: JSON.stringify({
                teamName: this.state.teamName,
                info: this.state.info, 
                requestedSkills: this.state.requestedSkills, 
                open: true, 
                course: this.state.course, 
                maxMembers: this.state.maxMembers,
                teamMembers: this.state.teamMembers
            })
          }).then(response => response.ok).then(success => (success ? alert("Team successfully created") : alert("Failed to create team")))
    }
    handleText = (e, stateKey, i) => {
        let arr = this.state[stateKey]
        console.log("Hello", i, e.target);
        arr[i] = e.target.value
        this.setState({
            [stateKey]: arr
        })
      }
    
      handleDelete = (e, stateKey, i) => {
        e.preventDefault()
        let arr = [
          ...this.state[stateKey].slice(0, i),
          ...this.state[stateKey].slice(i + 1)
        ]
        this.setState({
            [stateKey]: arr
        })
      }
    
      appendStateArray = (e, stateKey) => {
        e.preventDefault()
        //console.log(this.state.requestedSkills);
        let arr = this.state[stateKey].concat([''])
        this.setState({
            [stateKey]: arr
        })
      }

    render(){
        if(!window.localStorage.getItem('token')) {
            return <Redirect to="/login/"/>
        }
        return(
            <div>
                <div className="container">
                    <h1>Create New Team</h1>
                    <form onSubmit={this.handleSubmit}>
                    <div><label>
                        <input type="text" maxLength="70" placeholder="Team Name" className="textbox" onChange={this.handleChange} name="teamName" id="teamName" value={this.state.teamName} /> 
                    </label></div>
                    <div><label>
                        <input type="text" maxLength="70" placeholder="Course" className="textbox" onChange={this.handleChange} name="course" id="course" value={this.state.course} /> 
                    </label></div>
                    <div><label>
                        <input type="text" maxLength="200" placeholder="Project Overview" className="textboxbig" onChange={this.handleChange} name="info" id="info" value={this.state.info} /> 
                    </label></div>
                    <React.Fragment>
                        Requested Skills
                        {this.state.requestedSkills && this.state.requestedSkills.map((skill, index) => (
                        <span key={index}>
                        <input
                            type="text"
                            onChange={e => this.handleText(e, 'requestedSkills', index)}
                            value={skill}
                        />
                        <button onClick={e => this.handleDelete(e, 'requestedSkills', index)}>X</button>
                        </span>
                        ))}
                        <button onClick={e => this.appendStateArray(e, 'requestedSkills')}>Add New Skill</button>
                    </React.Fragment>
                    <br/>
                    <React.Fragment>
                        Automatically invite users
                        {this.state.teamMembers && this.state.teamMembers.map((user, index) => (
                        <span key={index}>
                        <input
                            type="text"
                            onChange={e => this.handleText(e, 'teamMembers', index)}
                            value={user}
                        />
                        <button onClick={e => this.handleDelete(e, 'teamMembers', index)}>X</button>
                        </span>
                        ))}
                        <button onClick={e => this.appendStateArray(e, 'teamMembers')}>Add New User</button>
                    </React.Fragment>
                    <div><label>
                        Max Number of Members
                        <select value={this.state.maxMembers} onChange={this.onChangeFunc}>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                        </select>
                    </label></div>
                    <input type="submit" value="Submit" />
                    </form>
                </div>
            </div>
        );
    }

}
export default CreateTeamPage;