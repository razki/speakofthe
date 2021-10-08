import React, { Component } from "react";

const ServiceList = [
    {
        icon: '03',
        title: 'Discovery & Design',
        description: 'Undertaking greenfield projects, existing digital transformation work or speculative ideas. Cloud first architecture and design input.'
    },
    {
        icon: '02',
        title: 'Development & Stability',
        description: 'Open-source technology and cloud infrastructure empowering robust and scalable applications.'
    },
    {
        icon: '01',
        title: 'Delivery & Support Handover',
        description: 'Intuitive design and software, coupled with tailored training and continuous support packages.'
    },
]

class ServiceOne extends Component{
    render(){
        return(
            <React.Fragment>
                <div className="row">
                    {ServiceList.map( (val , i) => (
                        <div className="col-lg-4 col-md-6 col-sm-6 col-12" key={i}>
                            <div className="service service__style--1">
                                <div className="icon">
                                    <img src={`/assets/images/icons/icon-${val.icon}.png`} alt="Software Consultancy"/>
                                </div>
                                <div className="content">
                                    <h4 className="title">{val.title}</h4>
                                    <p>{val.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </React.Fragment>
        )
    }
}
export default ServiceOne;