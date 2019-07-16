import React, { Component } from 'react';
import '../login/Login.css';
import { GOOGLE_AUTH_URL, ACCESS_TOKEN } from '../../constants';
import { login, getOTP, validateOTP } from '../../util/APIUtils';
import { Link, Redirect } from 'react-router-dom'
import googleLogo from '../../img/google-logo.png';
import Alert from 'react-s-alert';

class LoginWithOTP extends Component {
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
                    <LoginFormWithOTP {...this.props} />
                    <span className="signup-link">New user? <Link to="/signup">Sign up!</Link></span>
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


class LoginFormWithOTP extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showOTPInput: false,
            showMobileInput: true,
            mobileNumber: '',
            otp: '',
            authenticated: false
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleValidateOTP = this.handleValidateOTP.bind(this);
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

        const otpRequest = Object.assign({}, this.state);

        getOTP(otpRequest)
            .then(response => {
                Alert.success(response.message);
                this.setState({
                    showMobileInput: false,
                    showOTPInput: true
                })
            }).catch(error => {
                Alert.error((error && error.message) || 'Oops! Something went wrong. Please try again!');
            });
    }

    handleValidateOTP(event) {
        event.preventDefault();

        const validateOtpRequest = Object.assign({}, this.state);

        validateOTP(validateOtpRequest)
            .then(response => {
                console.log("Validate otp response is:-", response);
                localStorage.setItem(ACCESS_TOKEN, response.accessToken);
                Alert.success("You're successfully logged in!");
                this.setState({
                    authenticated: true
                });
            }).catch(error => {
                Alert.error((error && error.message) || 'Oops! Something went wrong. Please try again!');
            });
    }

    render() {
        if (this.state.authenticated) {
            return <Redirect to={{
                pathname: "/profile",
                state: { from: this.props.location }
            }} />;
        }
        else {
            return (
                <div>
                    <form onSubmit={this.handleSubmit} style={{ 'display': !this.state.showMobileInput ? 'none' : '' }}>
                        <div className="form-item">
                            <input type="number" name="mobileNumber"
                                className="form-control" placeholder="Mobile Number"
                                value={this.state.mobileNumber} onChange={this.handleInputChange} required />
                        </div>
                        <div className="form-item">
                            <button type="submit" className="btn btn-block btn-primary">Send OTP</button>
                        </div>
                    </form >
                    <form onSubmit={this.handleValidateOTP} style={{ 'display': !this.state.showOTPInput ? 'none' : '' }}>
                        <div className="form-item">
                            <input type="text" name="otp"
                                className="form-control" placeholder="OTP"
                                value={this.state.otp} onChange={this.handleInputChange} required />
                        </div>
                        <div className="form-item">
                            <button type="submit" className="btn btn-block btn-primary">Login</button>
                        </div>
                    </form >
                </div >
            );
        }
    }
}

export default LoginWithOTP;
