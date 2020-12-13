import React, {Component} from 'react';
import './App.css';
import Home from './Home';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import login from "./login";
import AlgorithmList from './AlgorithmList';
import UserList from "./UserList";
import NewEvaluation from "./NewEvaluation";
import MyEvaluationList from "./MyEvaluationList";
import DownloadDatasetsList from "./DownloadDatasetsList";

class App extends Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/" component={login}/>
                    <Route path='/algorithms' exact={true} component={AlgorithmList}/>
                    <Route path='/users' exact={true} component={UserList}/>
                    <Route path='/new_evaluation' exact={true} component={NewEvaluation}/>
                    <Route path='/my_evaluations' exact={true} component={MyEvaluationList}/>
                    <Route path='/datasets' exact={true} component={DownloadDatasetsList}/>
                </Switch>
            </Router>
        )
    }
}

export default App;