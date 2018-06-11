import React, { Component } from 'react';
import { Link, Push, browserHistory } from 'react-router';

import DonorMap from './donors/donorMap';
import CreateDonor from './donors/createDonor';

//The homepage component
export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: false,
            lat: 1000000,
            lng: 1000000
        }
    }

    componentWillMount() {
        //Get the current user latitude and longitude
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                this.setState({ lng: position.coords.longitude, lat: position.coords.latitude });
            },
                () => {
                    alert("Sorry, no position available.");
                    this.setState({ noLocation: true })
                },
                {
                    enableHighAccuracy: true,
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    }

    //Create donor button click action
    openModal() {
        this.setState({ modalIsOpen: true })
    }

    //Craete donor's button click action
    closeModal(e) {
        e.preventDefault();
        this.setState({ modalIsOpen: false })
    }

    render() {
        return (
            <div>
                {/* The donor and patient buttons */}
                <ul className="row clients-dotted list-inline">
                    <li className="col-md-6 col-sm-6 col-xs-12" style={{ padding: '40px' }}>
                        <a onClick={this.openModal.bind(this)} className={((this.state.noLocation || this.state.lat == 1000000) && 'disabled') + ' btn btn-3d btn-xlg btn-teal'}>
                            Donor
							<label className="block font-lato center">Register as a donor.</label>
                        </a>
                    </li>
                    <li className="col-md-6 col-sm-6 col-xs-12" style={{ padding: '40px' }}>
                        <Link to="patients" className="btn btn-3d btn-xlg btn-teal">
                            Patient
							<label className="block font-lato center">See all near donors.</label>
                        </Link>
                    </li>
                </ul>


                {
                    /* if the user refused the location detection permision */
                    !this.state.noLocation ? <div className="row">
                        <div className="col-md-12">
                            <DonorMap lat={this.state.lat} lng={this.state.lng} />
                        </div>
                    </div> : <div className="center">The location detection is not allowed by the browser</div>
                }


                {
                    /* call the createDonor if the user clicked on the create button */
                    this.state.modalIsOpen &&
                    <CreateDonor cancelAction={this.closeModal.bind(this)} lat={this.state.lat} lng={this.state.lng} />
                }
            </div>
        )
    }
}