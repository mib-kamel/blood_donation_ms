import React, { Component } from 'react';

import CreateDonor from './createDonor';
import ReactEsriMap, { BaseMapLayer, Markers } from '../../../maps/index';

export default class DonorMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //Create modal state
            modalIsOpen: false,
            lng: 1000000,
            lat: 1000000
        }
        if (props.lat && props.lat != 1000000) {
            this.state.lat = props.lat;
            this.state.lng = props.lng;
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.lat && nextProps.lat != 1000000) {
            this.setState({ lat: nextProps.lat, lng: nextProps.lng })
        }
    }

    //show the createDonor if he clicked on the marker
    openModal() {
        this.setState({ modalIsOpen: true })
    }
    closeModal(e) {
        e.preventDefault();
        this.setState({ modalIsOpen: false })
    }

    onMapClick(event) {
        this.setState({ lat: event.latlng.lat, lng: event.latlng.lng })
        this.forceUpdate();
    }

    render() {
        //the marker array which is my marker only in the donor map
        const markers = [
            {
                lat: this.state.lat,
                lng: this.state.lng,
                // marker type is 0 when it refers to my marker
                markerType: 0,
                onClick: this.openModal.bind(this)
            }
        ]

        return (
            <div className="row">
                <div className="col-md-12">
                    {
                        /* check if the received donor lat is right */
                        this.state.lat != 1000000 ?
                            <div className="row">
                                <div className="col-md-12" style={{ marginLeft: '27px' }}>
                                    Or you can click on the marker to register as a donor.<br />
                                </div>
                                <div className='col-md-12 samplemap'>
                                    <ReactEsriMap lat={this.state.lat} lng={this.state.lng} onMapClick={this.onMapClick.bind(this)}>
                                        <Markers markers={markers}></Markers>
                                        <BaseMapLayer></BaseMapLayer>
                                    </ReactEsriMap>
                                </div >
                            </div> :
                            /* The location detection permision refused or not answered yet */
                            this.state.noLocation ? <div className="center">No location available.</div> :
                                <div className="center">Loading...</div>
                    }
                    {
                        /* show the createDonor if he clicked on the marker */
                        this.state.modalIsOpen &&
                        <div>
                            <CreateDonor cancelAction={this.closeModal.bind(this)} lat={this.state.lat} lng={this.state.lng} />
                        </div>
                    }

                </div >
            </div >
        )
    }
}