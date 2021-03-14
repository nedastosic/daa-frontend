import React, {Component} from 'react';
import {Container} from 'reactstrap';
import AppNavbar from './AppNavbar';
import Toast from 'react-bootstrap/Toast'
import TextField from '@material-ui/core/TextField';
import 'bootstrap/dist/css/bootstrap.css';
import Chart from "react-google-charts";
import Select from 'react-select';

const customStyles = {
    option: (provided, state) => ({
        ...provided,
        margin:"top 5%",
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
            k: '',
            inputLayer: '',
            outputLayer: '',
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
            confusionMatrix: '',
            correctlyClassified: '',
            incorrectlyClassified: '',
            showChart: false,
        };
        this.setK = this.setK.bind(this);
        this.setInputLayer = this.setInputLayer.bind(this);
        this.setOutputLayer = this.setOutputLayer.bind(this);
        this.setHiddenLayer = this.setHiddenLayer.bind(this);
        this.setNumberOfHiddenLayers = this.setNumberOfHiddenLayers.bind(this);
        this.setLearningRate = this.setLearningRate.bind(this);
        this.setMaxError = this.setMaxError.bind(this);
        this.setMaxIterations = this.setMaxIterations.bind(this);
        this.setClassName = this.setK.bind(this);
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
                    algorithms: [{
                        value: '',
                        display: 'Choose an algorithm',
                        label: 'Choose an algorithm'
                    }].concat(algorithms)
                });
            }).catch(error => {
            console.log(error);
        });
    }


    async submit(e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', this.state.file);
        console.log("K VALUE " + e.target.elements.k.value);

        let params;

        if (this.state.selectedAlgorithm === 1) {
            params = JSON.stringify({
                k: e.target.elements.k.value,
            });
        } else if (this.state.selectedAlgorithm === 4){
            params = JSON.stringify({
                inputLayer : e.target.elements.inputLayer.value,
                outputLayer : e.target.elements.outputLayer.value,
                hiddenLayer : e.target.elements.hiddenLayer.value,
                numberOfHiddenLayers : e.target.elements.numberOfHiddenLayers.value,
                learningRate : e.target.elements.learningRate.value,
                maxError : e.target.elements.maxError.value,
                maxIterations : e.target.elements.maxIterations.value,
            });
        }


        formData.append('params', params);

        /*if (e.target.elements.k.value === '')
            formData.append('params', {k: 0});
        else
            formData.append('params', {k: 0});*/
        formData.append('className', e.target.elements.className.value);
        formData.append('algorithm', this.state.selectedAlgorithm);

        console.log("SELECTED " + this.state.selectedAlgorithm);

        for (var pair of formData.entries()) {
            console.log(pair[0]+ ', ' + pair[1]);
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

                this.setState({'accuracy': response.evaluation.accuracy});
                this.setState({'precision': response.evaluation.precision});
                this.setState({'recall': response.evaluation.recall});
                this.setState({'f1': response.evaluation.f1});
                this.setState({'correctlyClassified': response.correctlyClassifiedInstances});
                this.setState({'incorrectlyClassified': response.incorrectlyClassifiedInstances});
                this.setState({'confusionMatrix': response.confusionMatrix});
                this.setState({'showChart': true});
            } else {
                this.state.status = 'FAILED';
            }

        });
    }

    setFile(e) {
        this.setState({file: e.target.files[0]});
    }

    setK(event) {
        this.setState({k: event.target.value});
    }

    setInputLayer(event) {
        this.setState({inputLayer: event.target.value});
    }

    setOutputLayer(event) {
        this.setState({outputLayer: event.target.value});
    }

    setHiddenLayer(event) {
        this.setState({hiddenLayer: event.target.value});
    }

    setNumberOfHiddenLayers(event) {
        this.setState({numberOfHiddenLayers: event.target.value});
    }

    setLearningRate(event) {
        this.setState({learningRate: event.target.value});
    }

    setMaxError(event) {
        this.setState({maxError: event.target.value});
    }

    setMaxIterations(event) {
        this.setState({maxIterations: event.target.value});
    }

    setClassName(event1) {
        this.setState({className: event1.target.value});
    }


    render() {

        return (
            <div>
                <AppNavbar/>
                <Container fluid>

                    <form onSubmit={e => this.submit(e)}>
                        <h2>New evaluation</h2>
                        <br></br>
                        <div>
                            <input type="file" onChange={e => this.setFile(e)}/>
                        </div>


                        <div>
                            <TextField id="standard-basic" label="K parameter" name="k"/>
                        </div>
                        <div>
                            <TextField id="standard-basic" label="Input layer neurons" name="inputLayer"/>
                        </div>
                        <div>
                            <TextField id="standard-basic" label="Output layer neurons" name="outputLayer"/>
                        </div>
                        <div>
                            <TextField id="standard-basic" label="Hidden layer neurons" name="hiddenLayer"/>
                        </div>
                        <div>
                            <TextField id="standard-basic" label="Number of hidden layers" name="numberOfHiddenLayers"/>
                        </div>
                        <div>
                            <TextField id="standard-basic" label="Learning rate" name="learningRate"/>
                        </div>
                        <div>
                            <TextField id="standard-basic" label="Maximum error" name="maxError"/>
                        </div>
                        <div>
                            <TextField id="standard-basic" label="Maximum iterations" name="maxIterations"/>
                        </div>
                        <div>
                            <TextField id="standard-basic" label="Class name" name="className"/>
                        </div>
                        <br></br>
                        <div style={{width:"30%"}} class="react-select-container">
                            <Select styles={customStyles}
                                    onChange={(e) => this.setState({selectedAlgorithm: e.value})}
                                    options={this.state.algorithms}/>
                        </div>
                        <br></br>
                        <button className="btn btn-primary" type="submit">Upload</button>
                        <br></br>
                        <br></br>
                    </form>
                    <form style={{display: (this.state.showChart === true) ? "block" : "none", float: "left"}}>
                        <h3>Results</h3>
                        <div>Accuracy: {this.state.accuracy}</div>
                        <div>Precision: {this.state.precision}</div>
                        <div>Recall: {this.state.recall}</div>
                        <div>F1: {this.state.f1}</div>
                    </form>



                    <br></br>
                    <br></br>

                    <div style={{display: (this.state.showChart === true) ? "block" : "none", float: "left"}}>
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
                            /*rootProps={{ 'data-testid': '1' }}*/
                        />
                    </div>

                    <div style={{display: (this.state.showChart === true) ? "block" : "none", float: "left"}}>
                        <Chart
                            width={'500px'}
                            height={'300px'}
                            chartType="Bar"
                            display='block'
                            loader={<div>Loading Chart</div>}
                            data={[
                                ['Parameter', 'Value'],
                                ['Accuracy', this.state.accuracy],
                                ['Precision', this.state.precision],
                                ['Recall', this.state.recall],
                                ['F1', this.state.f1],
                            ]}
                            options={{
                                title: '',
                            }}
                        />
                    </div>


                    <Toast show={this.state.toaster}>
                        <Toast.Header>
                            <strong className="mr-auto">Message</strong>
                        </Toast.Header>
                        <Toast.Body>{this.state.status}</Toast.Body>
                    </Toast>
                </Container>
            </div>
        );
    }
}

export default NewEvaluation;