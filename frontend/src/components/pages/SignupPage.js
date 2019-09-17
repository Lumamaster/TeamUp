import React from 'react';
import '../../App.css';

class SignupPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            screenname:"",
            password: "",
            password2: "",
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
    handleLogin =async e => {
        e.preventDefault();
        let errors = [];
        if(!this.state.email || this.state.email.length === 0) {
            errors.push('The email field cannot be blank.');
        } else if(! /\@purdue\.edu/.test(this.state.email)) {
            errors.push('Please enter a valid Purdue email address.')
        }
        if(!this.state.screenname || this.state.screenname.length === 0) {
            errors.push('The screen name field cannot be blank.');
        } else if(! /^[0-9a-zA-Z@#$%^&*()_]/.test(this.state.screenname) || this.state.screenname.length < 5 || this.state.screenname.length > 16) {
            errors.push('Please enter a valid screen name.')
        }
        if(!this.state.password || this.state.password.length === 0) {
            errors.push('The password field cannot be blank.');
        } else if(! /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/.test(this.state.password) || this.state.password.length > 140) {
            errors.push('Please enter a valid password.')
        }
        if(this.state.password !== this.state.password2) {
            errors.push('The two passwords do not match.')
        }

        this.setState({
            errors:errors
        });

        if(errors.length === 0) {
            /* TODO submit this to the backend */
            let payload = {
                email: this.state.email,
                screenname: this.state.screenname,
                password: this.state.password
            }
            let fetchParams = {
                method: 'POST',
                headers:{
                    "content-type":"application/json; charset=UTF-8"
                },
                body: JSON.stringify(payload)
            }
            const res = await fetch('/signup',fetchParams);
            console.log(res);
            if(res.status === 201) {
                //Success!
                alert('Success!')
            } else {
                const data = await res.json()
                if(data.err) errors.push(data.err);
                this.setState({
                    errors:errors
                })
            }
            //console.log("POST to the signup endpoint:",payload);
        }
    }
    render() {
        return (
            <div className="container">
                <h1>Sign Up</h1>
                <form>
                    <input 
                        name="email"
                        type="text"
                        onChange={this.handleInputChange}
                        placeholder="Email"
                        autoComplete="email"
                    />
                    <br/>
                    <input 
                        name="screenname"
                        type="text"
                        onChange={this.handleInputChange}
                        placeholder="Screen name"
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
                    <input
                        name="password2"
                        type="password"
                        onChange={this.handleInputChange}
                        placeholder="Confirm Password"
                        autoComplete="current-password"
                    />
                    <br/>
                    <button onClick={this.handleLogin}>Sign Up</button>
                </form>
                <div id="errors">
                    {this.showErrors()}
                </div>
            </div>
        );
    }
}

export default SignupPage;
