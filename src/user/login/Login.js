import React, { Component } from 'react';
import './Login.css';
import { GOOGLE_AUTH_URL, ACCESS_TOKEN } from '../../constants';
import { login } from '../../util/APIUtils';
import { Link, Redirect } from 'react-router-dom'
import googleLogo from '../../img/google-logo.png';
import Alert from 'react-s-alert';

class Login extends Component {
    componentDidMount() {
        if (this.props.location.state && this.props.location.state.error) {
            setTimeout(() => {
                Alert.error(this.props.location.state.error, {
                    timeout: 5000
                });
                this.props.history.replace({
                    pathname: this.props.location.pathname,
                    state: {}
                });
            }, 100);
        }
    }

    render() {
        if (this.props.authenticated) {
            console.log("is authemticated from Login component", this.props.authenticated)
            console.log("this.props.location", this.props.location);
            return <Redirect
                to={{
                    pathname: "/",
                    state: { from: this.props.location }
                }} />;
        }

        return (
            <div className="login-container">
                <div className="login-content">
                    <h1 className="login-title">Login</h1>
                    <SocialLogin />
                    <div className="or-separator">
                        <span className="or-text">OR</span>
                    </div>
                    <LoginForm {...this.props} />
                    <div>
                        <span className="signup-link">New user? <Link to="/signup">Sign up!</Link></span>
                    </div>
                    <div>
                        <span className="signup-link">login with otp <Link to="/login-with-otp">Login with OTP</Link></span>
                    </div>
                </div>
            </div>
        );
    }
}

class SocialLogin extends Component {
    render() {
        return (
            <div className="social-login">
                <a className="btn btn-block social-btn google" href={GOOGLE_AUTH_URL}>
                    <img src={googleLogo} alt="Google" /> Log in with Google</a>
            </div>
        );
    }
}


class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const inputName = target.name;
        const inputValue = target.value;

        this.setState({
            [inputName]: inputValue
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        const loginRequest = Object.assign({}, this.state);

        login(loginRequest)
            .then(response => {
                // console.log("response token is:-", response);
                localStorage.setItem(ACCESS_TOKEN, response.accessToken);
                Alert.success("You're successfully logged in!");
                window.location.reload()
            }).catch(error => {
                Alert.error((error && error.message) || 'Oops! Something went wrong. Please try again!');
            });
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <div className="form-item">
                    <input type="email" name="email"
                        className="form-control" placeholder="Email"
                        value={this.state.email} onChange={this.handleInputChange} required />
                </div>
                <div className="form-item">
                    <input type="password" name="password"
                        className="form-control" placeholder="Password"
                        value={this.state.password} onChange={this.handleInputChange} required />
                </div>
                <div className="form-item">
                    <button type="submit" className="btn btn-block btn-primary">Login</button>
                </div>
            </form>
        );
    }
}

export default Login
