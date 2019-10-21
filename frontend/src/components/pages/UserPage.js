import React from 'react';
import {Redirect} from 'react-router-dom';
import {Link} from 'react-router-dom';
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
            username: '',
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
            changedSchedule: false,
            teamSelect:""
        }
        this.acceptInvite = this.acceptInvite.bind(this);
        this.times = ['6:00','6:30','7:00','7:30','8:00','8:30','9:00','9:30','10:00','10:30','11:00','11:30','12:00','12:30','1:00','1:30','2:00','2:30','3:00','3:30','4:00','4:30','5:00','5:30','6:00','6:30','7:00','7:30','8:00','8:30','9:00','9:30','10:00','10:30','11:00','11:30','12:00','12:30',]
    }
    //TODO: dont know correct fetch argument
    componentDidMount(){
        let uid = window.location.toString().substr(window.location.toString().indexOf('/profile') + 9)
        let isMe = false;
        if(window.localStorage.getItem('token')) {
            const {id} = jwt.decode(window.localStorage.getItem('token')).data
            //console.log(uid);
            //console.log(id);
            this.setState({uid});
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
            let tempSchedule = [];
            for(let i = 0; i < 38; i++) {
                tempSchedule[i] = [false,false,false,false,false,false,false]
            }
            /*let tempRow = [];
            tempRow.fill(false, 0, 18);
            if(!data.schedule) {
                tempSchedule.fill(tempRow,0,6)
            }*/
            console.log(tempSchedule)
            this.setState({
            isMe: isMe,
            bio: data.bio,
            email: data.email,
            username: data.username,
            skills: data.skills,
            rating: data.rating,
            prevTeams: data.prevTeams,
            curTeams: data.curTeams,
            blocked: data.blockedUsers,
            invites: data.invites,
            prevName: data.name,
            prevBio: data.bio,
            schedule: data.schedule || tempSchedule,
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
            const username = this.state.name !== '' ? this.state.username : this.state.prevName;

            if(username === this.state.prevName && bio === this.state.prevBio && !this.state.changedSchedule) {
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
                body: JSON.stringify({username:username, bio:bio, schedule:this.state.schedule})
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
                prevName:username,
                username:username,
                bio:bio,
                changedSchedule:false
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
        const name = e.target.id;
        console.log(" = " + this.state.blocked);
        e.preventDefault();
        fetch((PRODUCTION ? production_url : local_url) + '/blk/unblock/' + e.target.id, {
            method: "GET",
            headers: {
                "content-type":"application/json; charset=UTF-8",
                Authorization: 'Bearer ' + window.localStorage.getItem('token')
                
            },
          }).then(response => response.ok).then(success => {
              if(success){
                alert("User successfully unblocked");
                const items = this.state.blocked;
                const filtereditems = items.filter((item) => item._id !== name)
                console.log(filtereditems);
                //item =>item._id !== e.target.id);
                this.setState({blocked: filtereditems})
                console.log(this.state.blocked);
              }else{
                  alert("Failed to unblock user");
              }
          })
    }
//need to get invite id from button
    acceptInvite = async e =>{
        e.preventDefault();
        console.log(e.target.id);
        fetch((PRODUCTION ? production_url : local_url) + '/invite/acceptinvite/' + e.target.id, {
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
        fetch((PRODUCTION ? production_url : local_url) + '/invite/declineinvite/' + e.target.id, {
            method:"GET",
            headers: {
                "content-type":"application/json; charset=UTF-8",
                Authorization: 'Bearer ' + window.localStorage.getItem('token')
                
            },
          }).then(response => response.ok).then(success => (success ? alert("Successfully Rejected invite") : alert("Failed to reject invite")))
    }

    drawSchedule = () => {
        return <table style={{width:'100%'}}>
            <tbody style={{width:'100%'}}>
                <tr style={{width:'100%'}}>
                    <th style={{margin:'0px'}}></th>
                    <th style={{margin:'0px auto'}}>Sun</th>
                    <th style={{margin:'0px auto'}}>Mon</th>
                    <th style={{margin:'0px auto'}}>Tues</th>
                    <th style={{margin:'0px auto'}}>Wed</th>
                    <th style={{margin:'0px auto'}}>Th</th>
                    <th style={{margin:'0px auto'}}>Fri</th>
                    <th style={{margin:'0px auto'}}>Sat</th>
                </tr>
                {this.state.schedule && this.state.schedule.map((time,i) => {
                    return <tr key={'scheduleline' + i}>
                        <td>{this.times[i]}</td>
                        {time.map((dayTime,j) => <td key={'schedule' + i + j} style={{backgroundColor:dayTime ? '#6d22d7' : '#ddd'}}>{dayTime}</td>)}
                    </tr>
                })}
            </tbody>
        </table>
    }

    drawScheduleEdit = () => {
        return <table style={{width:'100%'}}>
            <tbody style={{width:'100%'}}>
                <tr style={{width:'100%'}}>
                    <th style={{margin:'0px auto'}}></th>
                    <th style={{margin:'0px auto'}}>Sun</th>
                    <th style={{margin:'0px auto'}}>Mon</th>
                    <th style={{margin:'0px auto'}}>Tues</th>
                    <th style={{margin:'0px auto'}}>Wed</th>
                    <th style={{margin:'0px auto'}}>Th</th>
                    <th style={{margin:'0px auto'}}>Fri</th>
                    <th style={{margin:'0px auto'}}>Sat</th>
                </tr>
                {this.state.schedule && this.state.schedule.map((time,i) => {
                    //console.log(time)
                    return <tr key={'scheduleline'+i}>
                        <td>{this.times[i]}</td>
                        {time.map((dayTime,j) => <td key={'schedule' + i + j} style={{textAlign:'center'}}><input type="checkbox" checked={this.state.schedule[i][j]} onChange={e => this.updateSchedule(i,j,e)}/></td>)}
                    </tr>
                })}
            </tbody>
        </table>
    }

    updateSchedule = (time, day, e) => {
        let {schedule} = this.state;
        console.log(day, time)
        schedule[time][day] = e.target.checked;
        console.log(schedule[time][day])
        this.setState({schedule, changedSchedule:true});
    }

    invite = async e => {
        e.preventDefault();
        const teamId = this.state.teamSelect;
        const userId = this.state.uid;
        let teamname;
        JSON.parse(window.localStorage.getItem('teams')).forEach(team => {
            if(team.id === teamId) teamname = team.name;
        })
        const url = (PRODUCTION ? production_url : local_url) + `/inviteuser/${userId}/${teamId}/${teamname}`
        const otherParams = {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${window.localStorage.getItem('token')}`
            }
        }
        const res = await fetch(url,otherParams);
        if(res.ok) {
            alert("Successfully invited user")
        }
        else {
            alert("Failed to invite user")
            console.log(await res.text())
        }
    }

    render(){
        if(!window.localStorage.getItem('token')) {
            return <Redirect to="/login/"/>
        }
        //console.log("blocked =" +this.state.blocked);
        if(this.state.blocked === undefined){
            this.state.blocked = []
        }

        
        return(
            <div>
                <div className="container">
                    {!this.state.edit ? 
                        <React.Fragment>
                            <h1>{this.state.username}</h1>
                            <p>Email: {this.state.email}</p>
                            <p>Bio: {this.state.bio}</p>
                            <p>Skills: {this.state.skills ? this.state.skills.join(', ') : null}</p>
                            <p>Rating: {this.state.rating}</p>
                        </React.Fragment>
                        : 
                        <form>
                            <input type="text" maxLength="70" placeholder={this.state.prevName} value={this.state.username} name="username" id="edit-name" onChange={this.handleInputChange}/>
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
                    {!this.state.isMe && 
                        <React.Fragment>
                            <button disabled={!(window.localStorage.getItem('teams') && window.localStorage.getItem('teams') !== '[]') || !this.state.teamSelect || this.state.teamSelect === ''} style={{marginLeft:10}} id="invite" onClick={this.invite}>Invite to Team</button>
                            <select name="teamSelect" disabled={!(window.localStorage.getItem('teams') && window.localStorage.getItem('teams') !== '[]')} onChange={this.handleInputChange}>
                                <option disabled hidden selected>Choose a team</option>
                                {window.localStorage.getItem('teams') && window.localStorage.getItem('teams') !== '[]' && 
                                JSON.parse(window.localStorage.getItem('teams')).map(team => 
                                <option value={team.id}>{team.name}</option>)}
                            </select>
                        </React.Fragment>
                    }
                    {this.state.edit ? this.state.errors.map(err => <p className="color-error" key={err}>{err}</p>) : null}
                </div>
                <div className="container" id="schedule">
                <h3>Schedule{this.state.edit && " - Please select the times when you are free to work with your team"}</h3>
                    {this.state.edit ? this.drawScheduleEdit() : this.drawSchedule()}
                </div>
                <div className="container" id="curTeams">
                    <h3>Teams</h3>
                    {this.state.curTeams && this.state.curTeams.map(team => {
                        return <p key={'team'+team.id}><Link to={'/teams/' + team.id}>{team.name}</Link></p>
                    })}
                </div>
                <div className="container">
                        <h3>Invites</h3>
                        <React.Fragment>
                            {
                                this.state.invites.map((invite)=> 
                                <InviteButton key={invite.id} invite={invite} accept={this.acceptInvite} reject={this.rejectInvite}/>)
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
            <table key={'invite' + this.props.invite.id}>
                <tbody>
                    <tr>
                        <td><span>{this.props.invite.name}   </span></td>
                        <td><button id={this.props.invite.id} onClick={this.props.accept}>Accept</button></td>
                        <td><button id={this.props.invite.id} onClick={this.props.reject}>Reject</button></td>
                    </tr>
                </tbody>
            </table>
        )
    }
}
class BlockedUserButton extends React.Component {

    render(){
        return(
            <div>
                <span><Link target="_blank" key={this.props.user._id} to={`/profile/${this.props.user._id}`}>{this.props.user.username}</Link></span>
                <button id={this.props.user._id} onClick={this.props.unblock}>Unblock</button>
            </div>
        )
    }
}
export default UserPage;
