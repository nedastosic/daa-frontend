import React, {Component} from "react";
import {Container} from 'reactstrap';
import Card from 'react-bootstrap/Card';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from 'axios';

class login extends Component {
    constructor(props) {
        super(props);
        // this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.state = {username: '', password: ''};


        this.handleChange = this.handleChange.bind(this);
    }

    handleFormSubmit = event => {
        event.preventDefault();

        const endpoint = "http://localhost:8080/authenticate";

        const user_object = {
            username: this.state.username,
            password: this.state.password
        };
        axios.post(endpoint, user_object).then(res => {

            console.log(res);
            localStorage.setItem("authorization", res.data.token);
            return this.handleDashboard();
        }).catch(e => {
            console.log(e.message);
        });
    };

    handleChange(evt) {
        const value = evt.target.value;
        this.setState({[evt.target.name]: value});
    }

    handleDashboard() {
        this.props.history.push("/new_evaluation");

    }

    render() {
        return (

            <Container className="Login">

                        <form className="form-signin" onSubmit={this.handleFormSubmit}>
                            <h4>Please login</h4>
                            <div className="form-group">
                                <input type="text"
                                       name="username"
                                       className="form-control"
                                       placeholder="Username"
                                       value={this.state.username}
                                       onChange={this.handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <input type="password"
                                       name="password"
                                       className="form-control"
                                       placeholder="Password"
                                       value={this.state.password}
                                       onChange={this.handleChange}
                                />
                            </div>
                            <button className="btn btn-lg btn-primary btn-block" type="submit">
                                Login
                            </button>
                        </form>
            </Container>




        );
    }
}

export default login;