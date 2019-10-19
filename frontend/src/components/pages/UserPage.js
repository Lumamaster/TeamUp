import React from 'react';
import {Redirect} from 'react-router-dom';
import * as jwt from 'jsonwebtoken';
import '../../App.css';
import {PRODUCTION, production_url, local_url} from '../../env.json';

class UserPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isMe: false,
            edit:false,
            email: '',
            name: '',
            bio: '',
            skills: '',
            rating: '',
            prevTeams: [],
            curTeams: [],
            blocked: [],
            invites: [],
            errors: [],
            prevName: '',
            prevBio: '',
            uid: '',
        }
        this.acceptInvite = this.acceptInvite.bind(this);
    }
    //TODO: dont know correct fetch argument
    componentDidMount(){
        let uid = window.location.toString().substr(window.location.toString().indexOf('/profile') + 9)
        let isMe = false;
        if(window.localStorage.getItem('token')) {
            const {id} = jwt.decode(window.localStorage.getItem('token')).data
            console.log(uid);
            console.log(id);
            this.state.uid = uid;
            isMe = uid === id || uid === '';
        }
        fetch((PRODUCTION ? production_url : local_url) + '/profile/' + uid, {
            headers: {
                Authorization: 'Bearer ' + window.localStorage.getItem('token')
            }
        })
        .then(response => {
            if(response.status === 200) return response.json()
            if(response.status === 401) {
                this.props.history.push('/login')
                return Promise.reject('Unauthorized; redirecting to login page')
            }
            if(response.status > 500 && response.status < 600) {
                console.log(response)
                return Promise.reject('Server error')
            }
            console.log(response)
            return Promise.reject('Got an unexpected status code from the server')
        })
        .then(data => {
            this.setState({
            isMe: isMe,
            bio: data.bio,
            email: data.email,
            name: data.name,
            skills: data.skills,
            rating: data.rating,
            prevTeams: data.prevTeams,
            curTeams: data.curTeams,
            blocked: data.blocked,
            invites: data.invites,
            prevName: data.name,
            prevBio: data.bio
            })
        })
        .catch(err => {})
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

    removeSkill = async e => {
        //console.log('Remove Skill:', e.target.id)
        let newSkills = this.state.skills.filter(skill => skill !== e.target.id)
        //console.log(newSkills.join(', '))
        this.setState({
            skills:newSkills
        })

        const url = (PRODUCTION ? production_url : local_url) + '/user/profile/edit/removeskill'
        const fetchParams = {
            method:'POST',
            headers: {
                Authorization: 'Bearer ' + window.localStorage.getItem('token'),
                "content-type":"application/json; charset=UTF-8"
            },
            body: JSON.stringify({skill:e.target.id})
        }
        //console.log(fetchParams)
        const res = await fetch(url, fetchParams)
        if(res.status !== 200) {
            const text = await res.text();
            console.log('Error:', text)
            alert("Error; could not remove skill")
        }
    }

    addSkill = async e => {
        e.preventDefault();
        let newSkills = this.state.skills
        let skill = this.state.addSkillText;
        if(skill && skill !== '' && !this.state.skills.includes(skill)) {
            newSkills.push(skill);
        } else {
            return;
        }

        this.setState({
            skills:newSkills,
            addSkillText:''
        })

        const url = (PRODUCTION ? production_url : local_url) + '/user/profile/edit/addskill'
        const fetchParams = {
            method:'POST',
            headers: {
                Authorization: 'Bearer ' + window.localStorage.getItem('token'),
                "content-type":"application/json; charset=UTF-8"
            },
            body: JSON.stringify({skill:skill})
        }
        console.log(fetchParams)
        const res = await fetch(url, fetchParams)
        if(res.status !== 200) {
            const text = await res.text();
            console.log('Error:', text)
            alert("Error; could not add skill")
        }
    }
    
    edit = async () => {
        if(this.state.edit) {
            const bio = this.state.bio !== '' ? this.state.bio : this.state.prevBio;
            const name = this.state.name !== '' ? this.state.name : this.state.prevName;

            if(name === this.state.prevName && bio === this.state.prevBio) {
                this.setState({
                    edit: !this.state.edit
                })
                return;
            }

            const url = (PRODUCTION ? production_url : local_url) + '/user/profile/edit/update'
            const fetchParams = {
                method:'POST',
                headers: {
                    Authorization: 'Bearer ' + window.localStorage.getItem('token'),
                    "content-type":"application/json; charset=UTF-8"
                },
                body: JSON.stringify({name:name, bio:bio})
            }
            console.log(fetchParams)
            const res = await fetch(url, fetchParams)
            if(res.status !== 200) {
                const text = await res.text();
                console.log('Error:', text)
                alert("Error; could not edit profile")
            }
            this.setState({
                prevBio:bio,
                prevName:name,
                name:name,
                bio:bio,
            })
        }
        this.setState({
            edit: !this.state.edit
        })
    }
    //Need way to tell if profile is blocked or not
    block = async e => {
        e.preventDefault();
        fetch((PRODUCTION ? production_url : local_url) + '/blk/block/' + this.state.uid, {
            method: "GET",
            headers: {
                "content-type":"application/json; charset=UTF-8",
                Authorization: 'Bearer ' + window.localStorage.getItem('token')
            },
          }).then(response => response.ok).then(success => (success ? alert("User successfully blocked") : alert("Failed to block user")))
    }
    unblock = async e => {
        e.preventDefault();
        fetch((PRODUCTION ? production_url : local_url) + '/unblk/', {
            method: "GET",
            headers: {
                "content-type":"application/json; charset=UTF-8",
                Authorization: 'Bearer ' + window.localStorage.getItem('token')
                
            },
          }).then(response => response.ok).then(success => (success ? alert("User successfully unblocked") : alert("Failed to unblock user")))
    }
//need to get invite id from button
    acceptInvite = async e =>{
        e.preventDefault();
        console.log(e.target.id);
        fetch((PRODUCTION ? production_url : local_url) + '/invite/accept/' + e.target.id, {
            method: "GET",
            headers: {
                "content-type":"application/json; charset=UTF-8",
                Authorization: 'Bearer ' + window.localStorage.getItem('token')
                
            },
          }).then(response => response.ok).then(success => (success ? alert("Team successfully joined") : alert("Failed to join team")))
    }

    rejectInvite = async e => {
        e.preventDefault();
        console.log(e.target.id);
        fetch((PRODUCTION ? production_url : local_url) + '/invite/reject/' + e.target.id, {
            method: "GET",
            headers: {
                "content-type":"application/json; charset=UTF-8",
                Authorization: 'Bearer ' + window.localStorage.getItem('token')
                
            },
          }).then(response => response.ok).then(success => (success ? alert("Successfully Rejected invite") : alert("Failed to reject invite")))
    }




    render(){
        if(!window.localStorage.getItem('token')) {
            return <Redirect to="/login/"/>
        }
        
        if(this.state.blocked === undefined){
            this.state.blocked = []
        }

        console.log("blocked =" +this.state.blocked);
        return(
            <div>
                <div className="container">
                    {!this.state.edit ? 
                        <React.Fragment>
                            <h1>{this.state.name}</h1>
                            <p>Email: {this.state.email}</p>
                            <p>Bio: {this.state.bio}</p>
                            <p>Skills: {this.state.skills ? this.state.skills.join(', ') : null}</p>
                            <p>Rating: {this.state.rating}</p>
                        </React.Fragment>
                        : 
                        <form>
                            <input type="text" maxLength="70" placeholder={this.state.prevName} value={this.state.name} name="name" id="edit-name" onChange={this.handleInputChange}/>
                            <p>Email: {this.state.email}</p>
                            <p>Bio: </p>
                            <input type="textarea" placeholder={this.state.prevBio} value={this.state.bio} name="bio" id="edit-bio" onChange={this.handleInputChange}/>
                            <p>Skills: </p>
                                <React.Fragment>
                                    {this.state.skills.map(skill => <SkillButton key={skill} skill={skill} delete={this.removeSkill}/>)}
                                    <input type="text" value={this.state.addSkillText || ''} placeholder="Add a skill" name="addSkillText" id="add-skill-text" onChange={this.handleInputChange}/>
                                    <button onClick={this.addSkill} id="add-skill-button">Add Skill</button>
                                </React.Fragment>
                            <p>Rating: {this.state.rating}</p>
                        </form>
                    }
                    {this.state.isMe ? <button name="editbutton" onClick={this.edit}>{this.state.edit ? 'Save Changes' : 'Edit Profile'}</button> : null}
                    {this.state.isMe ?  null : <button name="blockbutton" onClick={this.block}>Block User</button>}
                    {this.state.edit ? this.state.errors.map(err => <p className="color-error" key={err}>{err}</p>) : null}
                </div>
                <div className="container">
                        <h3>Invites</h3>
                        <React.Fragment>
                            {
                                this.state.invites.map((invite)=> 
                                <InviteButton key={invite} invite={invite} accept={this.acceptInvite} reject={this.rejectInvite}/>)
                            }
                        </React.Fragment>
                </div>
                {this.state.isMe ? 
                <div className="container">
                    <h3>Blocked Users</h3>
                    <React.Fragment>
                        {
                            this.state.blocked.map((user)=>
                                <BlockedUserButton key={user} user={user} unblock = {this.unblock}/>)
                        }
                    </React.Fragment>
                </div> : null }
            </div>
        );
    }
}

class SkillButton extends React.Component {
    render() {
        return (
            <div>
                <span>{this.props.skill}    </span>
                <span id={this.props.skill} onClick={this.props.delete} style={{color:'red', fontWeight:'bold'}}>X</span>
            </div>
        )
    }
}
class InviteButton extends React.Component {
    render(){
        return(
            <div>
                <tr>
                <td><span>{this.props.invite}   </span></td>
                <td><button id={this.props.invite} onClick={this.props.accept}>Accept</button></td>
                <td><button id={this.props.invite} onClick={this.props.reject}>Reject</button></td>
                </tr>
            </div>
        )
    }
}
class BlockedUserButton extends React.Component {
    render(){
        return(
            <div>
                <span>{this.props.user}</span>
                <button id={this.props.user} onClick={this.props.unblock}>Unblock</button>
            </div>
        )
    }
}
export default UserPage;
