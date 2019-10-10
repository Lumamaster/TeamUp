import React from 'react';
import '../../App.css';
import {Link} from 'react-router-dom';
import {PRODUCTION, production_url, local_url} from '../../env.json';
import io from 'socket.io-client';

class TeamDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            team: null,
            chatmsg:'',
            notetext:'',
            errors: [], 
            disableChat: true
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
    }

    showMessage = msg => {
        console.log("Got a message", msg);
        if(msg.senderId !== this.myId) {
            let {messages} = this.state;
            messages.push(msg);
            this.setState({messages})
        }
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
        this.setState({
            team:await res.json()
        })
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
        let {messages} = this.state;
        messages.push({
            sender:"You",
            senderId:"",
            body:this.state.chatmsg
        })
        this.socket.emit('message', this.state.chatmsg)
        this.setState({
            messages:messages,
            chatmsg:''
        })
    }
    showErrors = () => {
        return this.state.errors.map(err => <p className="color-error" key={err}>{err}</p>)
    }
    render() {
        return (
            <div className="container" style={{display:'flex', flexDirection:'row', flexWrap:'wrap'}}>
                <div id="left" style={{minWidth:200, flexGrow:1}}>
                    {this.state.team ? <h1>{this.state.team.teamName}</h1> : null}
                    {this.state.team ? <h4>{this.state.team.course}</h4> : null}
                    {this.state.team ? <p>{this.state.team.info}</p> : null}
                    <div id="members">
                        <h3>Members</h3>
                        {this.state.team && this.state.team.teamMembers ? this.state.team.teamMembers.map(user => {
                            return <Link key={user.id} to={`/profile/${user.id}`}>{user.username || user.name || user.id}</Link>
                        }) : null}
                    </div>
                    <div id="notes">
                        <h3>Notes</h3>
                        {this.state.team && this.state.team.notes ? this.state.team.notes.map((note,i) => {
                            return <p key={'note'+i}><span style={{fontWeight:'bold'}}>{note.author}:   </span>{note.body}</p>
                        }) : <p>No notes</p>}
                    </div>
                    <div id="errors">
                        {this.showErrors()}
                    </div>
                </div>
                <div id="right" style={{minWidth:200, flexGrow:1}}>
                    <div id="chat-log" style={{width:'100%', padding:'0px 8px', border:'1px solid #555', backgroundColor:'#eee', height:window.innerHeight * 0.6, overflowY:'scroll'}}>
                        {this.state.team && this.state.messages ? this.state.messages.map((msg,i) => {
                            return <p key={"msg"+i}><span style={{fontWeight:'bold'}}><Link to={`/profile/${msg.senderId}`}>{msg.senderId === this.myId ? 'You' : msg.sender}</Link>:  </span>{msg.body}</p>
                        }) : null}
                    </div>
                    <div style={{display:'flex'}}>
                        <input disabled={this.state.disableChat} style={{flexGrow:1}} type="text" name="chatmsg" id="chat-textbox" placeholder="Type a message to chat" value={this.state.chatmsg} onChange={this.handleInputChange}/>
                        <button style={{width:50}} disabled={this.state.disableChat} onClick={this.sendChatMsg}>Send</button>
                    </div>
                </div>
            </div>
        );
    }
    componentWillUnmount() {
        this.socket.disconnect();
    }
}

export default TeamDashboard;
