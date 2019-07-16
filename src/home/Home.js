import React, { Component } from 'react';
import './Home.css';

class Home extends Component {
    componentDidMount() {
        console.log("this.props are:-", this.props);
    }

    render() {
        return (
            <div className="home-container">
                <div className="container">
                    <div className="graf-bg-container">
                        <div className="graf-layout">
                            <h1>Welcome to Login App</h1>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Home;