import React from 'react';
import '../../App.css';
import {PRODUCTION, production_url} from '../../env.json';

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
    handleLogin = async e => {
        e.preventDefault();
        let errors = [];
        if(!this.state.email || this.state.email.length === 0) {
            errors.push('The email field cannot be blank.');
        } else if(! /\@purdue\.edu/.test(this.state.email)) {
            errors.push('Please enter a valid Purdue email address.')
        }
        if(!this.state.password || this.state.password.length === 0) {
            errors.push('The password field cannot be blank.');
        } else if(! /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/.test(this.state.password) || this.state.password.length > 140) {
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
            let fetchParams = {
                method: 'POST',
                headers:{
                    "content-type":"application/json; charset=UTF-8"
                },
                body: JSON.stringify(payload)
            }
            const res = await fetch((PRODUCTION ? production_url : '') + '/login',fetchParams);
            //console.log(res);
            if(res.status === 200) {
                //Success!
                let {token, teams} = await res.json();
                document.dispatchEvent(new Event('login'))
                //console.log(token);
                window.localStorage.setItem('token', token);
                window.localStorage.setItem('teams', JSON.stringify(teams))
                //alert('Success!')
                this.props.history.push('/profile')
            } else {
                const data = await res.json()
                if(data.err) errors.push(data.err);
                this.setState({
                    errors:errors
                })
            }
            //console.log("POST to the login endpoint:",payload);
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
                        id="email"
                        onChange={this.handleInputChange}
                        placeholder="Email"
                        autoComplete="username"
                    />
                    <br/>
                    <input
                        name="password"
                        type="password"
                        id="password"
                        onChange={this.handleInputChange}
                        placeholder="Password"
                        autoComplete="current-password"
                    />
                    <br/>
                    <button name="loginbutton" id="login" onClick={this.handleLogin}>Log In</button>
                </form>
                <div id="errors">
                    {this.showErrors()}
                </div>
            </div>
        );
    }
}

export default LoginPage;
