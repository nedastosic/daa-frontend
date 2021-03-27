import React, {Component} from 'react';
import {Button, Container, Table} from 'reactstrap';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import { BsFillInfoCircleFill } from 'react-icons/bs';
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

    checkValue(evaluation) {
        let params = '';
        for (const item of evaluation.parameters){
            params += item.parameterCodelist.name + ' = ' + item.value + ';';
        }

        if (params === '') {
            params = 'No parameters'
        }

        return (<OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{params}</Tooltip>}>
            <BsFillInfoCircleFill />
        </OverlayTrigger>)
    }

    downloadDataset = (id, name) => {
        fetch(`http://localhost:8080/api/datasets/${id}`, {
            method: 'GET',
            headers: new Headers({
                'Authorization': `Bearer ${localStorage.getItem("authorization")}`,
            }),
        }).then(async response => {
            const result =await response.blob();
            console.log(result);
            const file = new Blob([result], {type: 'text/csv'});
            var url = URL.createObjectURL(file);
            var tempLink = document.createElement('a');
            tempLink.href = url;
            tempLink.setAttribute('download', name);
            tempLink.click();
        });
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
                <td style={{whiteSpace: 'nowrap'}}>{(new Date(evaluation.timestamp)).getDate()}/{(new Date(evaluation.timestamp)).getMonth() + 1}/{(new Date(evaluation.timestamp)).getFullYear()} {(new Date(evaluation.timestamp)).toTimeString().split(' ')[0]}</td>
                <td style={{whiteSpace: 'nowrap'}}>{((evaluation.accuracy) * 100).toFixed(4)} %</td>
                <td style={{whiteSpace: 'nowrap'}}>{((evaluation.precision) * 100).toFixed(4)} %</td>
                <td style={{whiteSpace: 'nowrap'}}>{((evaluation.recall) * 100).toFixed(4)} %</td>
                <td style={{whiteSpace: 'nowrap'}}>{((evaluation.f1) * 100).toFixed(4)} %</td>
                <td><button className="btn btn-link" onClick={(e) => this.downloadDataset(evaluation.dataset.id, evaluation.dataset.name)}>{evaluation.dataset.name}</button></td>
                <td style={{whiteSpace: 'nowrap'}}>{this.checkValue(evaluation)}</td>

                <Button size="sm" color="danger" onClick={(e) => {
                    if (window.confirm('Are you sure you want to delete this item?')) this.remove(evaluation.id)
                }}>
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
                            <th>Date</th>
                            <th>Accuracy</th>
                            <th>Precision</th>
                            <th>Recall</th>
                            <th>F1</th>
                            <th>Dataset name</th>
                            <th>Parameter</th>
                            <th></th>
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