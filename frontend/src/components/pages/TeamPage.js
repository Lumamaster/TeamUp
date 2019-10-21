import React from 'react';
import '../../App.css';
import {Link} from 'react-router-dom';
import {PRODUCTION, production_url, local_url} from '../../env.json';
/*Team {
    teamName: string; contains team name
    teamMembers: object array; contains ids and usernames of all team team members
    owner: object; contains id and username of team owner
    info: string; contains notes about project ideas
    requestedSkills: string array; list of skills that the team is looking for
    numMembers: int; number of members in the team
    open: boolean; whether the team is open or restricted. true means open
    course: string; contains course name/num
    maxMembers: int; maximum number of members for the team
}*/
class TeamPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            joinedteams: JSON.parse(window.localStorage.getItem('teams')),
            email: "",
            password: "",
            teams: [
            ],
            errors: [],
            filter: ""
        }
    }
    joinTeam = async e => {
        const {id} = e.target
        const joined = this.state.joinedteams.map(team => team.id).indexOf(id) !== -1
        const url = `/teams/${joined ? 'leave' : 'join'}/${id}`
        const fetchParams = {
            headers: {
                Authorization: 'Bearer ' + window.localStorage.getItem('token')
            },
            method:'GET'
        }
        const res = await fetch((PRODUCTION ? production_url : local_url) + url, fetchParams)
        if(res.status === 200) {
            //Success
            alert(`Successfully ${joined ? 'left':'joined'} team`)
            let {joinedteams, teams} = this.state;
            if(joined) {
                joinedteams.splice(joinedteams.map(team => team.id).indexOf(id),1)
                teams.map(team => {
                    if(team._id === id) team.numMembers--;
                    return team;
                })
            } else {
                teams.map(team => {
                    if(team._id === id) {
                        team.numMembers++;
                        joinedteams.push({id:id, name:team.teamName})
                    }
                    return team;
                })
            }
            this.setState({
                joinedteams:joinedteams,
                teams:teams
            })
            window.localStorage.setItem('teams', JSON.stringify(joinedteams))
        } else if(res.status >= 500) {
            alert("Server error")
        } else {
            //Bad request, team full, etc.
            const body = await res.json()
            alert(body.err)
        }
    }
    componentDidMount(){
            fetch((PRODUCTION ? production_url : local_url) + '/teams')
            .then(response => response.json())
            .then(data => {
                //console.log(data);
                this.setState({
                    teams: data
                })
            })
    }
    renderTableData(){
        const joinedteamIds = this.state.joinedteams.map(team => team.id)
        return  this.state.teams.map((team, index)=>{
            const {teamName, owner, info, requestedSkills, numMembers, open, maxMembers, course, _id} = team
            const joined = joinedteamIds.indexOf(_id) !== -1 ? true : false
            return(
                <tr key={'team'+ _id}>
                    <td><Link id={teamName} to={`/teams/${_id}`}>{teamName || 'Untitled Team'}</Link></td>
                    <td><Link to={owner ? `/profile/${owner.id}` : '#'}>{owner ? owner.username || owner.name || 'None' : 'None'}</Link></td>
                    <td>{info || 'None'}</td>
                    <td>{requestedSkills ? requestedSkills.join(', ') || 'None' : 'None'}</td>
                    <td>{numMembers || 0}</td>
                    <td>{open ? 'Open' : 'Apply'}</td>
                    <td>{maxMembers || 'N/A'}</td>
                    <td>{course || 'N/A'}</td>
                    <td><button name="join-leave-button" onClick={this.joinTeam} id={_id}>{joined ? 'Leave' : 'Join'}</button></td>
                </tr>
            )
        })
    }
    updateFilter = e => {
        const newFilter = e.target.value;
        this.setState({filter:newFilter})
        let url = (PRODUCTION ? production_url : local_url)
        url += '/teams'
        if(newFilter !== '') {
            url += `?search=${newFilter}`
        }
        //console.log(url)
        fetch(url)
        .then(response => response.json())
        .then(data => {
            //console.log(data);
            this.setState({
                teams: data
            })
        })
        .catch(err => console.error(err))
    }
    renderTableHeader(){
        return(
            <React.Fragment>
                <td>Name</td>
                <td>Owner</td>
                <td>Info</td>
                <td>Requested Skills</td>
                <td># Members</td>
                <td>Open</td>
                <td>Member Limit</td>
                <td>Course</td>
                <td></td>
            </React.Fragment>
        )
    }
    render(){
        return(
            <React.Fragment>
                <div className="container">
                    <input style={{width:'100%'}} type="text" name="filter" onChange={this.updateFilter} placeholder="Search teams by name, info, course or requested skills"/>
                </div>
                <div>
                    <table id='teams'>
                        <tbody>
                            <tr>{this.renderTableHeader()}</tr>
                            {this.renderTableData()}
                        </tbody>
                    </table>
                </div>     
            </React.Fragment>
        );
    }
}
export default TeamPage;