import React, {Component} from 'react';
import {Button, Buttonalgorithm, ButtonGroup, Container, Table} from 'reactstrap';
import AppNavbar from './AppNavbar';
import axios from "axios";

class MyEvaluationList extends Component {

    constructor(props) {
        super(props);
        this.state = {evaluations: [], isLoading: true};
        this.checkValue = this.checkValue.bind(this);
    }

    componentDidMount() {
        this.setState({isLoading: true});
        axios.get("http://localhost:8080/api/my_evaluations", {
            headers: {Authorization: `Bearer ${localStorage.getItem("authorization")}`}
        }).then(res => {
            if (res.status === 200) {
                this.setState({evaluations: res.data, isLoading: false})
                console.log(this.state.evaluations)
            } else {
                alert("Authentication failure");
            }
        });
    }

    checkValue(evaluation){
        if(typeof evaluation.parameters[0] != 'undefined'){
            return evaluation.parameters[0].value;
        }
        return "/";
    }

    async remove(id) {
        await fetch(`http://localhost:8080/api/evaluations/delete/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem("authorization")}`
            }
        }).then(() => {
            let updatedEvaluations = [...this.state.evaluations].filter(i => i.id !== id);
            this.setState({evaluations: updatedEvaluations});
        });
    }


    render() {
        const {evaluations, isLoading} = this.state;

        if (isLoading) {
            return <p>Loading...</p>;
        }


        const evaluationList = evaluations.map(evaluation => {

            return <tr key={evaluation.id}>
                <td style={{whiteSpace: 'nowrap'}}>{evaluation.algorithm.name}</td>
                <td style={{whiteSpace: 'nowrap'}}>{evaluation.accuracy}</td>
                <td style={{whiteSpace: 'nowrap'}}>{evaluation.precision}</td>
                <td style={{whiteSpace: 'nowrap'}}>{evaluation.recall}</td>
                <td style={{whiteSpace: 'nowrap'}}>{evaluation.f1}</td>
                <td style={{whiteSpace: 'nowrap'}}>{evaluation.dataset.name}</td>
                <td style={{whiteSpace: 'nowrap'}}>{this.checkValue(evaluation)}</td>

                <Button size="sm" color="danger" onClick={(e) => { if (window.confirm('Are you sure you want to delete this item?')) this.remove(evaluation.id) } }>
                    Delete
                </Button>

            </tr>
        });

        return (
            <div>
                <AppNavbar/>
                <Container fluid>
                    <h3>My Evaluations</h3>
                    <Table className="mt-4">
                        <thead>
                        <tr>
                            <th width="20%">Algorithm</th>
                            <th>Accuracy</th>
                            <th>Precision</th>
                            <th>Recall</th>
                            <th>F1</th>
                            <th>Dataset name</th>
                            <th>Parameter</th>
                        </tr>
                        </thead>
                        <tbody>
                        {evaluationList}
                        </tbody>
                    </Table>
                </Container>
            </div>
        );
    }
}

export default MyEvaluationList;