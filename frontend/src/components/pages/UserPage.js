import React from 'react';
import '../../App.css';

class UserPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: []
        }
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
            <div className="container"><h1>user page</h1></div>
            <div className="container"><h1>Get info from backend</h1></div>
            <div className="container"><button onClick={this.edit}>Edit Profile Picture</button></div>
            </div>
        );
    }
}
export default UserPage;