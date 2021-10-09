import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import './index.scss';

import PageScrollTop from './component/PageScrollTop';

import DarkMain from './dark/Main';
import Service from "./elements/Service";
import Contact from "./elements/Contact";
import error404 from "./elements/error404";

import { BrowserRouter, Switch, Route  } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
class Root extends Component{
    render(){
        return(
            <BrowserRouter basename={'/'}>
                <PageScrollTop>
                    <Switch>
                        <Route exact path={"/"} component={DarkMain}/>
                        <Route exact path={"/careers"} component={Service}/>
                        <Route exact path={"/contact"} component={Contact}/>
                        <Route path={"/404"} component={error404}/>
                        <Route component={error404}/>
                    </Switch>
                </PageScrollTop>
            </BrowserRouter>
        )
    }
}

ReactDOM.render(<Root/>, document.getElementById('root'));
serviceWorker.register();