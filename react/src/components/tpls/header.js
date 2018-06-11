import React from 'react';
import { Link } from 'react-router';

export default function (props) {
    return (
        <div id="header" className="sticky clearfix">
            <header id="topNav">
                <div className="container">
                    <Link className="logo pull-left scrollTo" to="/">
                        <img src="images/cross_over.png" alt="" style={{padding:"10px", maxHeight:"70px"}}/>
                    </Link>
                </div>
            </header>
        </div>
    );
}