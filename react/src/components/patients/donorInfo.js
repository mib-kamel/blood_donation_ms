import React, { Component } from 'react';
import { ModalContainer, ModalDialog } from 'react-modal-dialog';

//The donor info modal container component
export default class DonorInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // To determine if the donor phone & mail displayed or 'show contact info' message
            showInfo: false
        }
    }

    render() {
        const donorData = this.props.donorData;
        return (
            <div>
                {
                    /*if the props donorData is found */
                    donorData && <ModalContainer>
                        <ModalDialog>
                            <div className="row">
                                <div className="panel panel-default donor-panel">
                                    <div className="panel-heading panel-heading-transparent">
                                        <h2 className="panel-title bold">{donorData.firstName + " " + donorData.lastName}</h2>
                                    </div>
                                    <div className="panel-body">
                                        <label>Blood group: {donorData.bloodGroup}</label>
                                        {
                                            /* To determine if the donor phone & mail displayed or 'show contact info' message */
                                            this.state.showInfo ?
                                                <div>
                                                    <label>Mail: {donorData.mail}</label>
                                                    <label>Phone: {donorData.phone}</label>
                                                </div> : <a onClick={() => this.setState({ showInfo: true })}>show contact info</a>
                                        }
                                        <div className="row">
                                            <div className="col-md-12 center">
                                                <button onClick={this.props.closeAction} className="btn btn-teal"><i className="fa fa-check"></i>Done</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ModalDialog>
                    </ModalContainer>
                }
            </div>
        )
    }
}