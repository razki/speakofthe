import React, { Component } from "react";
import PageHelmet from "../component/common/Helmet";
import Breadcrumb from "../elements/common/Breadcrumb";
import { FiChevronUp } from "react-icons/fi";
import ScrollToTop from 'react-scroll-up';
import Header from "../component/header/Header";
import Footer from "../component/footer/Footer";
class Service extends Component{
    render(){
        return(
            <React.Fragment>
                <PageHelmet pageTitle='Careers' />
                <Header headertransparent="header--transparent" colorblack="color--black" logoname="speakofthelogo.png" />
                <Breadcrumb title={'Careers'}   />
                <div className="service-area ptb--120 bg_color--5">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="section-title text-center mb--30">
                                    <h2>No positions currently available.</h2>
                                    <p>Please check back often.</p>
                                </div>
                            </div>
                        </div>
                        <div style={{ minHeight: 650 }}>
                            
                        </div>
                    </div>
                </div>
                <div className="backto-top">
                    <ScrollToTop showUnder={160}>
                        <FiChevronUp />
                    </ScrollToTop>
                </div>
                <Footer />
            </React.Fragment>
        )
    }
}
export default Service;