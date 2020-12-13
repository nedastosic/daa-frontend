import React, {Component} from 'react';
import {Button, Buttonalgorithm, ButtonGroup, Container, Table} from 'reactstrap';
import AppNavbar from './AppNavbar';
import axios from "axios";
import {  CSVDownload } from "react-csv";

class DownloadDatasetsList extends Component {

    constructor(props) {
        super(props);
        this.state = {datasets: [], isLoading: true, a:''};
        this.checkValue = this.checkValue.bind(this);
    }

    componentDidMount() {
        this.setState({isLoading: true});
        axios.get("http://localhost:8080/api/datasets", {
            headers: {Authorization: `Bearer ${localStorage.getItem("authorization")}`}
        }).then(res => {
            if (res.status === 200) {
                this.setState({datasets: res.data, isLoading: false})
                console.log(this.state.datasets)
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

    downloadDataset = (id) => {
        console.log("id " + id)
        fetch(`http://localhost:8080/api/datasets/${id}`, {
            method: 'GET',
            headers: new Headers({
                'Authorization': `Bearer ${localStorage.getItem("authorization")}`,
            }),
        }).then(async response => {
            const result =await response.blob();
            console.log(result);
            const file = new Blob([result], {type: 'text/plain'});
            // element.href = URL.createObjectURL(file);
            // element.download = "myFile.txt";
            // var blob = new Blob([result], { type: 'csv' });
            var url = URL.createObjectURL(file);
            window.open(url);
            /*console.log(response.body);
            const filename =  response.headers.get('Content-Disposition').split('filename=')[1];
            response.blob().then(blob => {
                let url = window.URL.createObjectURL(blob);
                let a = document.createElement('a');
                a.href = url;
                a.download = filename;
                a.click();
            console.log(response.body);
            });*/
        });


    }

    render() {
        const {datasets, isLoading} = this.state;

        if (isLoading) {
            return <p>Loading...</p>;
        }


        const datasetList = datasets.map(dataset => {

            return <tr key={dataset.id}>
                <td style={{whiteSpace: 'nowrap'}}>{dataset.name}</td>
                <td><button className="btn btn-primary" onClick={(e) => this.downloadDataset(dataset.id)}>Preview</button></td>
            </tr>
        });

        return (
            <div>
                <AppNavbar/>
                <Container fluid>
                    <h3>Datasets</h3>
                    <Table className="mt-4">
                        <thead>
                        <tr>
                            <th width="20%">Name</th>
                            <th>Preview</th>
                        </tr>
                        </thead>
                        <tbody>
                        {datasetList}
                        </tbody>
                    </Table>
                </Container>
            </div>
        );
    }
}

export default DownloadDatasetsList;