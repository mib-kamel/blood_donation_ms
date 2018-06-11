import React, { Component } from 'react';
import { Link } from 'react-router';
import ReactEsriMap, { BaseMapLayer, Markers } from '../../../maps/index';

import DonorInfo from './donorInfo';

//The patients page component
export default class PatientsHome extends Component {
    //Check if the donors socket is not watched
    firstWatch = true;

    constructor(props) {
        super(props);
        this.state = {
            donorsLoaded: false,
            donorsReLoading: false,
            lat: 1000000,
            lng: 1000000,
            selectedDonor: false
        }
    }

    //The get donors method which take the map bounds as paramter to send it with the fetch serve request
    getDonors(mapBounds) {
        this.setState({ donorsReLoading: true });
        //The bound info object
        var requestData = {
            maxLat: mapBounds._northEast.lat,
            minLat: mapBounds._southWest.lat,
            maxLng: mapBounds._northEast.lng,
            minLng: mapBounds._southWest.lng
        };

        //save 'this' to be used in the io request
        var self = this;

        //Fetch the near donors with io post request to subscribe to the fetched donors updates
        io.socket.post('/api/getDonors', requestData, function(donors, jwres) {
            self.setState({ donors, loadingDonors: false, donorsLoaded: true, donorsReLoading: false });
            self.forceUpdate();
        })
        // if you didn't watch the donors updates before
        if (this.firstWatch) {
            this.firstWatch = false;
            //donors update action
            io.socket.on('donors', function(event) {
                if (event.verb === "updated") {
                    //if the donor is updated reset it's state
                    let newDonors = [];
                    //to update the donor state with the new changes
                    self.state.donors.forEach(donor => {
                        if (donor.id === event.id) {
                            newDonors.push(event.data);
                        }
                        else newDonors.push(donor);
                        //to update the selectedDonor with the new changes
                        if (self.state.selectedDonor && event.id === self.state.selectedDonor.id) {
                            self.setState({ selectedDonor: event.data });
                        }
                    })
                    self.setState({ donors: newDonors });
                    self.forceUpdate();
                } else if (event.verb === "destroyed") {
                    //if the donor is destroyed delete it from the state
                    let newDonors = self.state.donors.filter(donor => {
                        if (self.state.selectedDonor && event.id === self.state.selectedDonor.id) {
                            self.setState({ selectedDonor: false });
                        }
                        return donor.id !== event.id
                    });
                    self.setState({ donors: newDonors });
                    self.forceUpdate();
                }
            })
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

    //Close the selected donor modal
    closeModal(e) {
        e.preventDefault();
        this.setState({ selectedDonor: false })
    }

    //if the map is zoomed or draged call setBounds function with the new bounds
    //it is a callback function which will be executed in map.js after the map dragging or zooming
    onDragEnd(event) {
        this.setBounds(mapBounds);
    }
    onZoomed(event) {
        this.setBounds(mapBounds);
    }
    ////////////////////////////////////////////////

    //set the bounds state with the new bounds and then call getDonors function
    setBounds(mapBounds) {
        this.setState({ mapBounds })
        this.getDonors(mapBounds);
    }
    
    //donor pin click action
    onDonorClick(index) {
        this.setState({ selectedDonor: this.state.donors[index] })
    }

    render() {
        //My location marker
        let markers = [
            {
                lat: this.state.lat,
                lng: this.state.lng,
                markerType: 0
            }
        ]

        //donors location markers
        let donorsMarkers = [];
        if (this.state.donors) {
            this.state.donors.forEach((donor, index) => donorsMarkers.push({
                lat: donor.lat,
                lng: donor.lng,
                markerType: 1,
                onClick: this.onDonorClick.bind(this, index)
            }))
        }
        return (
            <div>
                {
                    this.state.loadingDonors && <div style={{ marginLeft: '27px' }}>Loading donors...</div>
                }

                {
                    (this.state.lat != 1000000) ?
                        <div className="row">
                            <div className="col-md-12">
                                {this.state.donorsReLoading ? <div style={{ marginLeft: '42px' }}>Loading near doners.</div> : <div style={{ marginLeft: '42px' }}>The red pins represent the donors and the blue represents you.</div>}
                                <div className='col-md-12 samplemap'>
                                    <ReactEsriMap lat={this.state.lat} lng={this.state.lng} onDragEnd={this.setBounds.bind(this)} onZoomed={this.setBounds.bind(this)} onLoad={this.setBounds.bind(this)} >               
                                        <Markers markers={markers} center={true}></Markers>
                                        <Markers markers={donorsMarkers}></Markers>
                                        <BaseMapLayer></BaseMapLayer>
                                    </ReactEsriMap>
                                </div >
                            </div>
                        </div> :
                        this.state.noLocation ? <div className="center">No location available.</div> :
                            <div className="center">Loading...</div>
                }

                {
                    this.state.selectedDonor && <DonorInfo donorData={this.state.selectedDonor} closeAction={this.closeModal.bind(this)} />
                }
            </div>
        )
    }
}