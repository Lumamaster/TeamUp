import React from 'react';
import '../../App.css';
import {Link} from 'react-router-dom';
import {PRODUCTION, production_url, local_url} from '../../env.json';
import io from 'socket.io-client';
import * as jwt from 'jsonwebtoken';

class TeamDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            team: null,
            chatmsg:'',
            notetext:'',
            errors: [], 
            disableChat: true,
            isOwner: false,
            edit: false,
            editForm: {
                teamName:"",
                info:"",
                course:"",
                maxMembers: 0,
                open:false,
                requestedSkills: []
            }
        }
        const roomId = window.location.href.substr(window.location.href.indexOf('/teams/') + 7)
        this.myId = null;
        this.socket = io.connect((PRODUCTION ? production_url : local_url), {
            query: {
                room: roomId,
                token: window.localStorage.getItem('token')
            }
        })
        this.socket.on('message', msg => this.showMessage(msg));
        this.socket.on('ready', data => this.prepareChat(data));

        this.fileRef = React.createRef();
        this.isOwner = null;
    }
    toggleEdit = async () => {
        const wasEditing = this.state.edit;
        this.setState({edit: !this.state.edit});

        if(!wasEditing) return;

        const teamId = window.location.href.substr(window.location.href.indexOf('/teams/') + 7)
        const url = (PRODUCTION ? production_url : local_url) + '/teams/edit/' + teamId;
        const otherParams = {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + window.localStorage.getItem('token'),
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(this.state.editForm)
        }
        console.log(this.state.editForm);
        this.setState({
            team: {
                ...this.state.team,
                ...this.state.editForm
            }
        })
        const res = await fetch(url, otherParams);
        if(!res.ok) {
            alert("Failed to update team");
            console.log(res)
        }
    }

    showMessage = msg => {
        console.log("Got a message", msg);
        let {messages} = this.state;
        messages.push(msg);
        this.setState({messages})
    }

    prepareChat = data => {
        this.myId = data.myId;
        this.setState({
            messages: data.messages,
            disableChat: false,
        })
    }
    async componentDidMount() {
        if(!window.localStorage.getItem('token')) {
            this.props.history.push('/login');
            return;
        }
        const id = window.location.href.substr(window.location.href.indexOf('/teams/') + 7)
        let url = (PRODUCTION ? production_url : local_url) + '/teams/' + id
        const otherParams = {
            method:'GET',
            headers:{
                Authorization: 'Bearer ' + window.localStorage.getItem('token')
            }
        }
        const res = await fetch(url, otherParams);
        if(res.status !== 200) {
            try {
                const json = await res.json();
                let {errors} = this.state;
                errors.push(json.err || 'Server Error');
                this.setState({
                    errors:errors
                })
            } catch(err) {
                console.log(err)
                let {errors} = this.state;
                errors.push('Server Error');
                this.setState({
                    errors:errors
                })
            }
            return;
        }
        const team = await res.json();
        this.setState({
            team:team,
            editForm:{
                teamName:team.teamName,
                info:team.info,
                course:team.course,
                maxMembers:team.maxMembers,
                open:team.open,
                requestedSkills:team.requestedSkills || []
            },
            isOwner:team.owner.id === jwt.decode(window.localStorage.getItem('token')).data.id
        })
    }
    handleFormChange = e => {
        let {editForm} = this.state;
        editForm[e.target.name] = e.target.value;
        this.setState({editForm})
    }
    handleInputChange = e => {
        this.setState({
            [e.target.name]:e.target.value
        })
    }
    sendChatMsg = () => {
        //console.log("Send chat message:",this.state.chatmsg);
        if(!this.state.chatmsg || this.state.chatmsg.length === 0 || this.state.chatmsg.length > 560) {
            alert("Please enter a chat message between 1 and 560 characters long")
            return;
        }
        this.socket.emit('message', this.state.chatmsg)
        this.setState({
            chatmsg:''
        })
    }
    showErrors = () => {
        return this.state.errors.map(err => <p className="color-error" key={err}>{err}</p>)
    }
    upload = async e => {
        e.preventDefault();
        const data = new FormData(e.target)
        const filename = this.fileRef.current.value.substr(this.fileRef.current.value.lastIndexOf('\\') + 1)
        data.set('name', filename)
        const fetchParams = {
            method:'POST',
            headers: {
                Authorization: `Bearer ${window.localStorage.getItem('token')}`
            },
            body:data
        }
        const url = (PRODUCTION ? production_url : local_url) + '/documents/' + this.state.team._id
        //console.log("Fetch", url, "with parameters:", fetchParams)
        const res = await fetch(url, fetchParams);
        console.log(res.status)
    }
    addSkill = e => {
        e.preventDefault();
        let {requestedSkills} = this.state.editForm;
        requestedSkills.push(this.state.newSkill);
        this.setState({
            editForm:{
                ...this.state.editForm,
                requestedSkills:requestedSkills
            },
            newSkill:''
        })
    }
    removeSkill = i => {
        this.setState({
            editForm:{
                ...this.state.editForm,
                requestedSkills:this.state.editForm.requestedSkills.filter((val,index) => index !== i)
            }
        })
    }
    render() {
        return (
            <div className="container" style={{display:'flex', flexDirection:'row', flexWrap:'wrap'}}>
                <div id="left" style={{minWidth:200, flexGrow:1}}>
                    {this.state.edit ? <React.Fragment><input type="text" placeholder="Team Name" name="teamName" value={this.state.editForm.teamName} onChange={this.handleFormChange}/><br/></React.Fragment> : this.state.team ? <h1>{this.state.team.teamName}</h1> : null}
                    {this.state.edit ? <input type="text" name="course" placeholder="Course" value={this.state.editForm.course} onChange={this.handleFormChange}/> : this.state.team ? <h4>{this.state.team.course}</h4> : null}
                    {this.state.edit ? <textarea name="info" style={{width:'100%'}} placeholder="Team Info" value={this.state.editForm.info} onChange={this.handleFormChange}/> : this.state.team ? <p>{this.state.team.info}</p> : null}
                    {this.state.edit ? <React.Fragment><p>Max Members:</p><input type="number" name="maxMembers" min={this.state.team.numMembers} step={1} value={this.state.editForm.maxMembers} onChange={this.handleFormChange} /></React.Fragment> : null}
                    {this.state.edit ? <React.Fragment><p>Open:</p><input type="checkbox" name="open" checked={this.state.editForm.open} onChange={e => {
                            e.target = {name:'open',value:e.target.checked}
                            this.handleFormChange(e);
                        }} /></React.Fragment> : null}
                    {this.state.edit && <React.Fragment><h3>Requested Skills:</h3>{this.state.editForm.requestedSkills && this.state.editForm.requestedSkills.map((skill,i) => {
                        return <React.Fragment><p key={skill + i}>{skill} <span onClick={() => this.removeSkill(i)} style={{color:'red', cursor:'pointer', fontWeight:'bold'}}>X</span></p></React.Fragment>
                    })}
                    <input type="text" name="newSkill" onChange={this.handleInputChange}/>
                    <button onClick={this.addSkill}>Add Skill</button></React.Fragment>}
                    <div id="members">
                        <h3>Members&nbsp;{this.state.team && '(' + this.state.team.numMembers + '/' + this.state.team.maxMembers + ')'}</h3>
                        {this.state.team && this.state.team.teamMembers ? this.state.team.teamMembers.map(user => {
                            return <Link key={user.id} to={`/profile/${user.id}`}>{user.username || user.name || user.id}</Link>
                        }) : null}
                    </div>
                    {this.state.isOwner && <button onClick={this.toggleEdit}>Edit Team Info</button>}
                    <div id="errors">
                        {this.showErrors()}
                    </div>
                </div>
                <div id="right" style={{minWidth:200, flexGrow:1}}>
                    <div id="chat-log" style={{width:'100%', padding:'0px 8px', border:'1px solid #555', backgroundColor:'#eee', height:window.innerHeight * 0.6, overflowY:'scroll'}}>
                        {this.state.team && this.state.messages ? this.state.messages.map((msg,i) => {
                            if(msg.type === 'file') {
                                return <p key={"msg"+i}>
                                    <span style={{fontWeight:'bold'}}>
                                        <Link to={`/profile/${msg.senderId}`}>{msg.senderId === this.myId ? 'You' : msg.sender}</Link>&nbsp;
                                    </span>
                                    uploaded&nbsp;
                                    <a target='_blank' href={(PRODUCTION ? production_url : local_url) + '/documents/' + msg.fileId + '?token=' + window.localStorage.getItem('token')}>
                                        {msg.filename}
                                    </a>
                                </p>
                            }
                            if(msg.type === 'join') {
                                return <p key={"msg"+i}>
                                    <span style={{fontWeight:'bold'}}>
                                        <Link to={`/profile/${msg.senderId}`}>{msg.senderId === this.myId ? 'You' : msg.sender}</Link>&nbsp;joined the team.
                                    </span>
                                </p>
                            }
                            if(msg.type === 'full') {
                                return <p key={"msg"+i}>
                                    <span style={{fontWeight:'bold'}}>
                                        The team is now full.
                                    </span>
                                </p>
                            }
                            return <p key={"msg"+i}><span style={{fontWeight:'bold'}}><Link to={`/profile/${msg.senderId}`}>{msg.senderId === this.myId ? 'You' : msg.sender}</Link>:  </span>{msg.body}</p>
                        }) : null}
                    </div>
                    <div style={{display:'flex'}}>
                        <input disabled={this.state.disableChat} style={{flexGrow:1}} type="text" name="chatmsg" id="chat-textbox" placeholder="Type a message to chat" value={this.state.chatmsg} onChange={this.handleInputChange}/>
                        <button style={{width:50}} disabled={this.state.disableChat} onClick={this.sendChatMsg}>Send</button>
                    </div>
                    <form encType='multipart/form-data' onSubmit={this.upload}><input type="file" required ref={this.fileRef} name="doc" onChange={e => console.log(e.target.value)}/><button>Upload File</button></form>
                </div>
            </div>
        );
    }
    componentWillUnmount() {
        this.socket.disconnect();
    }
}

const FileSelectModal = props => {
    return (
        <div id="modal-background">
            <div id="modal-body">
                <h4>Upload File</h4>
                <form>
                    <input type="file" />
                </form>
            </div>
        </div>
    )
}

export default TeamDashboard;
