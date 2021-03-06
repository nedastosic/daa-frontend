import React, { Component } from "react";
import axios from 'axios';

class login extends Component {
    constructor(props) {
        super(props);
        // this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.state = {username:'', password:''};


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
        }).catch(e=>{
            console.log(e.message);
        });
    };

    handleChange(evt) {
        const value = evt.target.value;
        this.setState({ [evt.target.name]: value});
    }

    handleDashboard() {
        this.props.history.push("/new_evaluation");

    }

    render() {
        return (
            <div>
                <div class="wrapper">
                    <form class="form-signin" onSubmit={this.handleFormSubmit}>
                        <h2 class="form-signin-heading">Please login</h2>
                        <div className="form-group">
                            <input type="text"
                                   name="username"
                                   class="form-control"
                                   placeholder="User name"
                                   value={this.state.username}
                                   onChange={ this.handleChange }
                            />
                        </div>
                        <div className="form-group">
                            <input type="password"
                                   name="password"
                                   class="form-control"
                                   placeholder="password"
                                   value={this.state.password}
                                   onChange={ this.handleChange }
                            />
                        </div>
                        <button class="btn btn-lg btn-primary btn-block" type="submit">
                            Login
                        </button>
                    </form>
                </div>
            </div>
        );
    }
}
export default login;