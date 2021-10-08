import React, { Component } from "react";
import ScrollToTop from 'react-scroll-up';
import { FiChevronUp } from "react-icons/fi";
import Header from "../component/header/Header";
import Footer from "../component/footer/Footer";

import SliderOne from "../component/slider/SliderOne";
import About from "../component/HomeLayout/homeOne/About";
import Helmet from "../component/common/Helmet";

class Main extends Component{
    render(){
        return(
            <div className="active-dark"> 
                <Helmet pageTitle="Home" />
                <Header headertransparent="header--transparent" colorblack="color--black" logoname="speakofthelogo.png" />

                <div className="slider-wrapper">
                    <SliderOne />
                </div>

                <div className="about-area about-position-top pb--120 bg_color--1">
                    <About />
                </div>

                <div className="backto-top">
                    <ScrollToTop showUnder={160}>
                        <FiChevronUp />
                    </ScrollToTop>
                </div>
                <Footer />
                
            </div>
        )
    }
}
export default Main;