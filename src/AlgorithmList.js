import React, {Component} from 'react';
import {Button, Buttonalgorithm, ButtonGroup, Container, Table} from 'reactstrap';
import AppNavbar from './AppNavbar';
import {Link} from 'react-router-dom';
import axios from "axios";

class AlgorithmList extends Component {

    constructor(props) {
        super(props);
        this.state = {algorithms: [], isLoading: true};
        this.remove = this.remove.bind(this);
    }

    componentDidMount() {
        this.setState({isLoading: true});
        axios.get("http://localhost:8080/api/algorithms", {
            headers: {Authorization: `Bearer ${localStorage.getItem("authorization")}`}
        }).then(res => {
            if (res.status === 200) {
                this.setState({algorithms: res.data, isLoading: false})
            } else {
                alert("Authentication failure");
            }
        });
        // fetch('http://localhost:8080/api/algorithms')
        //     .then(response => response.json())
        //     .then(data => this.setState({algorithms: data, isLoading: false}));
    }

    async remove(id) {
        await fetch(`/api/algorithm/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(() => {
            let updatedalgorithms = [...this.state.algorithms].filter(i => i.id !== id);
            this.setState({algorithms: updatedalgorithms});
        });
    }

    render() {
        const {algorithms, isLoading} = this.state;

        if (isLoading) {
            return <p>Loading...</p>;
        }

        const algorithmList = algorithms.map(algorithm => {
            return <tr key={algorithm.id}>
                <td style={{whiteSpace: 'nowrap'}}>{algorithm.name}</td>
                <td>
                    <ButtonGroup>
                        <Button size="sm" color="primary" tag={Link} to={"/algorithms/" + algorithm.id}>Edit</Button>
                        <Button size="sm" color="danger" onClick={() => this.remove(algorithm.id)}>Delete</Button>
                    </ButtonGroup>
                </td>
            </tr>
        });

        return (
            <div>
                <AppNavbar/>
                <Container fluid>
                    <div className="float-right">
                        <Button color="success" tag={Link} to="/algorithms/new">Add algorithm</Button>
                    </div>
                    <h3>My Algorithms</h3>
                    <Table className="mt-4">
                        <thead>
                        <tr>
                            <th width="20%">Name</th>
                        </tr>
                        </thead>
                        <tbody>
                        {algorithmList}
                        </tbody>
                    </Table>
                </Container>
            </div>
        );
    }
}

export default AlgorithmList;