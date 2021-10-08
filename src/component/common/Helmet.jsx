import React, { Component } from "react";
import {Helmet} from 'react-helmet'

class PageHelmet extends Component{
    render(){
        return(
            <React.Fragment>
                <Helmet>
                    <title>{this.props.pageTitle} | SPEAKOFTHE - Software Consulting</title>
                    <meta name="description" content="SPEAKOFTHE – Consulting for public and private sector software engineering projects." />
                </Helmet>
            </React.Fragment>
        )
    }
}


export default PageHelmet;
