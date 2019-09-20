import React from 'react';
import '../../App.css';
/*Team {
    teamName: string; contains team name
    teamMembers: string array; contains names of all team teamMembers
    owner: string; contains email of project owner (team creator)
    info: string; contains notes about project ideas
    requestedSkills: string array; list of skills that the team is looking for
    numMembers: int; number of members in the team
    open: boolean; whether the team is open or restricted. true means open
    alive: boolean; whether the group is active or project has ended. true means active
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
            fetch('/listteams')
            .then(response => response.json())
            .then(data => {
                this.setState({
                    teams: data.teamlist
                })
            })
    }
    renderTableData(){
        return  this.state.teams.map((team, index)=>{
            const {teamName, owner, info, requestedSkills, numMembers, open, alive, maxMembers, course} = team
            return(
                <tr>
                    <td>{teamName}</td>
                    <td>{owner}</td>
                    <td>{info}</td>
                    <td>{requestedSkills}</td>
                    <td>{numMembers}</td>
                    <td>{open}</td>
                    <td>{alive}</td>
                    <td>{maxMembers}</td>
                    <td>{course}</td>
                </tr>
            )
        })
    }
    renderTableHeader(){
        if(this.state.teams == ''){
            return
        }
        let header = Object.keys(this.state.teams[0])
            return header.map((key, index) => {
            return <th key={index}>{key.toUpperCase()}</th>
      })
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