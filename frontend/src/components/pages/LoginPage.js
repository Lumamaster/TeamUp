import React from 'react';
import '../../App.css';

class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
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
    handleLogin = e => {
        e.preventDefault();
        let errors = [];
        if(!this.state.email || this.state.email.length === 0) {
            errors.push('The email field cannot be blank.');
        } else if(!this.state.email.match('^([A-Z]|[a-z]|[0-9]){1,480}@purdue\.edu$')) {
            errors.push('Please enter a valid Purdue email address.')
        }
        if(!this.state.password || this.state.password.length === 0) {
            errors.push('The password field cannot be blank.');
        } else if(this.state.password.length > 140) {
            /* TODO: Match a regex for the password. */
            errors.push('Please enter a valid password.')
        }

        this.setState({
            errors:errors
        });

        if(errors.length === 0) {
            /* TODO submit this to the backend */
            let payload = {
                email: this.state.email,
                password: this.state.password
            }
            console.log("POST to the login endpoint:",payload);
        }
    }
    render() {
        return (
            <div className="container">
                <h1>Log In</h1>
                <form>
                    <input 
                        name="email"
                        type="text"
                        onChange={this.handleInputChange}
                        placeholder="Email"
                        autoComplete="username"
                    />
                    <br/>
                    <input
                        name="password"
                        type="password"
                        onChange={this.handleInputChange}
                        placeholder="Password"
                        autoComplete="current-password"
                    />
                    <br/>
                    <button onClick={this.handleLogin}>Log In</button>
                </form>
                <div id="errors">
                    {this.showErrors()}
                </div>
            </div>
        );
    }
}

export default LoginPage;
