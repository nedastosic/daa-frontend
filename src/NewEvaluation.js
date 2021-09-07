import React, {Component} from 'react';
import {Container} from 'reactstrap';
import AppNavbar from './AppNavbar';
import 'bootstrap/dist/css/bootstrap.css';
import Chart from "react-google-charts";
import Select from 'react-select';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Popup from "react-popup";

const customStyles = {
    option: (provided, state) => ({
        ...provided,
        margin: "top 5%",
        // borderBottom: '2px dotted green',
        color: state.isSelected ? 'white' : 'black',
        backgroundColor: state.isSelected ? '#4da6ff' : 'white',
    }),
    control: (provided) => ({
        ...provided,
    })
}


class NewEvaluation extends Component {


    constructor(props) {
        super(props);
        this.state = {
            file: '',
            fileName: "CSV file",
            k: '',
            hiddenLayer: '',
            numberOfHiddenLayers: '',
            learningRate: '',
            maxError: '',
            maxIterations: '',
            className: '',
            toaster: false,
            eval: [], isLoading: true,
            algorithms: [], isLoadingAlgorithms: true,
            selectedAlgorithm: '',
            accuracy: '',
            precision: '',
            recall: '',
            f1: '',
            correctlyClassified: '',
            incorrectlyClassified: '',
            truePositives: '',
            falsePositives: '',
            falseNegatives: '',
            trueNegatives: '',
            histogramData: '',
            pcaData: [],
            showChart: false,
            showResults: false,
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    componentDidMount() {
        this.setState({isLoadingAlgorithms: true});
        fetch('http://localhost:8080/api/algorithms', {
            method: 'GET',
            headers: new Headers({
                'Authorization': `Bearer ${localStorage.getItem("authorization")}`,
            })
        }).then((response) => {
            return response.json();
        })
            .then(data => {
                let algorithms = data.map(algorithm => {
                    return {value: algorithm.id, display: algorithm.name, label: algorithm.name}
                });
                this.setState({
                    algorithms: algorithms
                });
            }).catch(error => {
            console.log(error);
        });
    }


    submit(e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', this.state.file);

        let params;

        if (this.state.selectedAlgorithm === 1) {
            params = JSON.stringify({
                k: e.target.elements.k.value,
            });
        } else if (this.state.selectedAlgorithm === 4) {
            params = JSON.stringify({
                hiddenLayer: e.target.elements.hiddenLayer.value,
                numberOfHiddenLayers: e.target.elements.numberOfHiddenLayers.value,
                learningRate: e.target.elements.learningRate.value,
                maxError: e.target.elements.maxError.value,
                maxIterations: e.target.elements.maxIterations.value,
            });
        }


        formData.append('params', params);

        formData.append('className', e.target.elements.className ? e.target.elements.className.value : '');
        formData.append('algorithm', this.state.selectedAlgorithm);

        console.log("SELECTED " + this.state.selectedAlgorithm);

        for (var pair of formData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }

        fetch('http://localhost:8080/api/ingest', {
            method: 'POST',
            headers: new Headers({
                'Authorization': `Bearer ${localStorage.getItem("authorization")}`,
            }),
            body: formData
        }).then(async (res) => {
            const response = await res.json();
            if (res.status === 200) {
                this.state.status = 'COMPLETED';
                console.log(response.evaluation);
                console.log(response.evaluation === null);
                if (response.evaluation){
                console.log(JSON.parse(response.pcaResult));
                this.setState({'accuracy': response.evaluation.accuracy});
                this.setState({'precision': response.evaluation.precision});
                this.setState({'recall': response.evaluation.recall});
                this.setState({'f1': response.evaluation.f1});
                this.setState({'correctlyClassified': response.correctlyClassifiedInstances});
                this.setState({'incorrectlyClassified': response.incorrectlyClassifiedInstances});
                this.setState({'truePositives': response.truePositives});
                this.setState({'falsePositives': response.falsePositives});
                this.setState({'falseNegatives': response.falseNegatives});
                this.setState({'trueNegatives': response.trueNegatives});
                this.setState({'showCharts': true});
                this.setState({'showResults': true});
                this.setState({'histogramData': JSON.parse(response.histogramData)});
                this.setState({'pcaData': [['X', 'Y']].concat(JSON.parse(response.pcaResult))});
                }else{
                    Popup.alert('An error occurred while performing and saving evaluation');

                }
                console.log(this.state.pcaData);
            } else {
                this.state.status = 'FAILED';
            }

        }).catch((error) => {
            Popup.alert('Invalid username or/and password!');
        });
    }

    setFile(e) {
        this.setState({file: e.target.files[0]});
        this.setState({fileName: e.target.files[0].name});
    }

    handleInputChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;
        this.setState({[name]: value});
    }

    handleSubmit(event) {
        event.preventDefault();
        this.submit(event);
    }

    generateForm() {
        switch (this.state.selectedAlgorithm) {
            case 1:
                return (
                    <Card>
                        <Card.Header>Step 2: Configure your algorithm</Card.Header>
                        <Card.Body>
                            <Form.Group>
                                <Form.Label>K parameter</Form.Label>
                                <Form.Control type="number" name="k" value={this.state.k}
                                              onChange={this.handleInputChange} placeholder="Enter value"/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Class name</Form.Label>
                                <Form.Control type="text" name="className" value={this.state.className}
                                              onChange={this.handleInputChange} placeholder="Enter class name"/>
                            </Form.Group>
                            <Button variant="primary" type="submit">Evaluate</Button>
                        </Card.Body>
                    </Card>
                );
            case 2:
            case 3:
                return (
                    <Card>
                        <Card.Header>Step 2: Configure your algorithm</Card.Header>
                        <Card.Body>
                            <Form.Group>
                                <Form.Label>Class name</Form.Label>
                                <Form.Control type="text" name="className" value={this.state.className}
                                              onChange={this.handleInputChange} placeholder="Enter class name"/>
                                <Form.Text className="text-muted">
                                    Note: No hyperparameters available for selected algorithm :)
                                </Form.Text>
                            </Form.Group>
                            <Button variant="primary" type="submit">Evaluate</Button>
                        </Card.Body>
                    </Card>
                );
            case 4:
                return (
                    <Card>
                        <Card.Header>Step 2: Configure your algorithm</Card.Header>
                        <Card.Body>
                            <Form.Group>
                                <Form.Label>Hidden layer neurons</Form.Label>
                                <Form.Control type="number" name="hiddenLayer" value={this.state.hiddenLayer}
                                              onChange={this.handleInputChange} placeholder="Enter value"/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Number of hidden layers</Form.Label>
                                <Form.Control type="number" name="numberOfHiddenLayers"
                                              value={this.state.numberOfHiddenLayers}
                                              onChange={this.handleInputChange} placeholder="Enter value"/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Learning rate</Form.Label>
                                <Form.Control type="number" name="learningRate" value={this.state.learningRate}
                                              onChange={this.handleInputChange} placeholder="Enter value"/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Maximum error</Form.Label>
                                <Form.Control type="number" name="maxError" value={this.state.maxError}
                                              onChange={this.handleInputChange} placeholder="Enter value"/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Maximum iterations</Form.Label>
                                <Form.Control type="number" name="maxIterations" value={this.state.maxIterations}
                                              onChange={this.handleInputChange} placeholder="Enter value"/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Class name</Form.Label>
                                <Form.Control type="text" name="className" value={this.state.className}
                                              onChange={this.handleInputChange} placeholder="Enter class name"/>
                                <Form.Text className="text-muted">
                                </Form.Text>
                            </Form.Group>
                            <Button variant="primary" type="submit">Evaluate</Button>
                        </Card.Body>
                    </Card>
                );
            default:
                return (
                    <div></div>
                );
        }
    }

    generateResults() {

        if (this.state.showResults) {
            return (<Card>
                <Card.Header>Evaluation results</Card.Header>
                <Card.Body>

                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>Accuracy</th>
                            <th>Precision</th>
                            <th>Recall</th>
                            <th>F1</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>{((this.state.accuracy) * 100).toFixed(4)} %</td>
                            <td>{((this.state.precision) * 100).toFixed(4)} %</td>
                            <td>{((this.state.recall) * 100).toFixed(4)} %</td>
                            <td>{((this.state.f1) * 100).toFixed(4)} %</td>
                        </tr>
                        </tbody>
                    </Table>

                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th></th>
                            <th>Predicted positive</th>
                            <th>Predicted negative</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th>Actual positive</th>
                            <td>{this.state.truePositives}</td>
                            <td>{this.state.falseNegatives}</td>
                        </tr>
                        <tr>
                            <th>Actual negative</th>
                            <td>{this.state.falsePositives}</td>
                            <td>{this.state.trueNegatives}</td>
                        </tr>
                        </tbody>
                    </Table>


                    <div style={{float: "left"}}>
                        <Chart show={this.state.showChart}
                               width={'500px'}
                               height={'300px'}
                               chartType="PieChart"
                               loader={<div>Loading Chart</div>}
                               data={[
                                   ['Correctly Classified Instances', 'Incorrectly Classified Instances'],
                                   ['Correctly Classified Instances', this.state.correctlyClassified],
                                   ['Incorrectly Classified Instances', this.state.incorrectlyClassified]
                               ]}
                               options={{
                                   title: '',
                               }}
                        />
                    </div>

                </Card.Body>
            </Card>);
        } else {
            return (<div></div>);
        }
    }

    generateHistograms() {
        if (Object.keys(this.state.histogramData).length > 0) {

            const result = [];
            for (const key of Object.keys(this.state.histogramData)) {
                const chartData = [];
                chartData.push(['value', 'count']);
                for (const value of Object.keys(this.state.histogramData[key])) {
                    const count = this.state.histogramData[key][value];
                    chartData.push([parseFloat(value), count]);
                }
                result.push([key, chartData]);
            }

            const histogramsList = result.map(chartData => {
                return (
                    <div style={{float: "left"}}>
                        <Chart
                            width={'200px'}
                            height={'200px'}
                            chartType="ColumnChart"
                            display='block'
                            loader={<div>Loading Chart</div>}
                            data={chartData[1]}
                            options={{
                                title: chartData[0],
                                bar: {groupWidth: '100%'},
                                legend: {position: 'none'},
                                titleTextStyle: {
                                    fontSize: 15
                                }
                            }}
                        />
                    </div>)
            });


            return (<Card>
                <Card.Header>Data distribution histograms</Card.Header>
                <Card.Body>
                    {histogramsList}
                </Card.Body>
            </Card>);
        } else {
            return (<div></div>);
        }
    }

    generatePcaChart() {
        if (this.state.showResults) {
            return (
                <Card>
                    <Card.Header>Principal components analysis</Card.Header>
                    <Card.Body>
                        <Chart
                            width={'600px'}
                            height={'400px'}
                            chartType="ScatterChart"
                            loader={<div>Loading Chart</div>}
                            data={
                                this.state.pcaData
                            }
                            options={{
                                hAxis: {title: 'X'},
                                vAxis: {title: 'Y'},
                                legend: 'none',
                            }}
                            rootProps={{'data-testid': '1'}}
                        />
                    </Card.Body>
                </Card>);
        } else {
            return (<div></div>);
        }
    }


    render() {

        return (
            <div>
                <AppNavbar/>
                <Container maxWidth="md">
                    <Popup />
                    <Form onSubmit={this.handleSubmit}>
                        <Card>
                            <Card.Header>Step 1: Choose dataset and algorithm</Card.Header>
                            <Card.Body>
                                <Form.Group>
                                    <Form.Label>Choose your dataset</Form.Label>
                                    <Form.File
                                        id="custom-file"
                                        name="file"
                                        onChange={e => this.setFile(e)}
                                        label={this.state.fileName}
                                        custom/>
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Choose an algorithm</Form.Label>
                                    <Select styles={customStyles}
                                            onChange={(e) => this.setState({selectedAlgorithm: e.value})}
                                            options={this.state.algorithms}/>
                                </Form.Group>

                            </Card.Body>
                        </Card>
                        {this.generateForm()}
                    </Form>
                    {this.generateHistograms()}
                    {this.generatePcaChart()}
                    {this.generateResults()}


                </Container>
            </div>
        );
    }
}

export default NewEvaluation;