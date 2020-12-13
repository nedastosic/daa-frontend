import React, {Component} from 'react';
import {Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink} from 'reactstrap';
import {Link, Route} from 'react-router-dom';
import NewEvaluation from "./NewEvaluation";

export default class AppNavbar extends Component {
    constructor(props) {
        super(props);
        this.state = {isOpen: false};
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    render() {
        return <Navbar color="dark" dark expand="md">
            <NavbarBrand tag={Link} to="/my_evaluations">Home</NavbarBrand>
            <NavbarToggler onClick={this.toggle}/>
            <Collapse isOpen={this.state.isOpen} navbar>
                <Nav navbar>
                    <NavItem>
                        <NavLink href="/new_evaluation">New evaluation</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink href="/my_evaluations">My evaluations</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink href="/datasets">Datasets</NavLink>
                    </NavItem>

                </Nav>
            </Collapse>
        </Navbar>;
    }
}