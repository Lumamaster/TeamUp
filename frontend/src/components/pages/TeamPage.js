import React from 'react';
import '../../App.css';
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
            email: "",
            password: "",
            teams: [
                //{ teamName: 'team1', owner: 'owner1', info: 'this is info', requestedSkills: 'skills', numMembers: 1, open: 1, alive: 1, maxMembers: 6, course: 'cs180' },
                //{ teamName: 'team2', owner: 'owner2', info: 'stuff', requestedSkills: 'good skills', numMembers: 5, open: 1, alive: 1, maxMembers: 6, course: 'cs354' },
                //{ teamName: 'team3', owner: 'owner3', info: 'this is info', requestedSkills: 'skills', numMembers: 1, open: 1, alive: 1, maxMembers: 6, course: 'cs180' },
            ],
            errors: []
        }
    }
    componentDidMount(){
            fetch('/teams')
            .then(response => response.json())
            .then(data => {
                //console.log(data);
                this.setState({
                    teams: data
                })
            })
    }
    renderTableData(){
        return  this.state.teams.map((team, index)=>{
            const {teamName, owner, info, requestedSkills, numMembers, open, maxMembers, course} = team
            return(
                <tr key={teamName}>
                    <td>{teamName || 'Untitled Team'}</td>
                    <td>{owner ? owner.username || 'None' : 'None'}</td>
                    <td>{info || 'None'}</td>
                    <td>{requestedSkills ? requestedSkills.join(', ') || 'None' : 'None'}</td>
                    <td>{numMembers || 0}</td>
                    <td>{open ? 'Open' : 'Apply'}</td>
                    <td>{maxMembers || 'N/A'}</td>
                    <td>{course || 'N/A'}</td>
                </tr>
            )
        })
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
            </React.Fragment>
        )
    }
    render(){
        return(
           <div>
            <table id='teams'>
               <tbody>
                   <tr>{this.renderTableHeader()}</tr>
                  {this.renderTableData()}
               </tbody>
            </table>
           </div>     
        );
    }
}
export default TeamPage;