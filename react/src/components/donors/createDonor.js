import React, { Component } from 'react';
import { ModalContainer, ModalDialog } from 'react-modal-dialog';
import { bloodGroups } from '../utils';

import { createDonor } from '../../services/donors.service';
import DonorForm from './donorForm';

//The component which contains the donor form component and it messages
export default class CreateDonor extends Component {
    constructor(props) {
        super(props);
        // the dafault state
        this.state = {
            validPhone: true,
            validMail: true,
            validName: true,
            validBloodGroup: true
        }
    }

    //The action which will be run if the submit button clicked
    submitAction(donorData, validName, validMail, validPhone, validBloodGroup) {
        if (!donorData) {
            this.setState({ validPhone, validMail, validName, validBloodGroup });
            return;
        }
        //add current latitude and longotude to donor data
        donorData.lat = this.props.lat;
        donorData.lng = this.props.lng;
        createDonor(donorData, (newDonor) => {
            this.setState({
                validPhone: true,
                validMail: true,
                validName: true,
                validBloodGroup: true,
                newDonorID: newDonor.id
            })
        })
    }

    closeModal = (e) => {
        if (this.state.newDonorID) this.props.cancelAction(e);
        this.setState({ validPhone: true, validMail: true, validName: true, validBloodGroup: true, newDonorID: undefined })
    }

    render() {
        return (
            <div>
                {/* The donor form modal container */}
                <ModalContainer>
                    <ModalDialog>
                        <div className="row">
                            <div className="panel panel-default donor-panel">
                                <div className="panel-heading panel-heading-transparent">
                                    <h2 className="panel-title bold">New donor</h2>
                                </div>
                                <div className="panel-body">
                                    <DonorForm formSumbit={this.submitAction.bind(this)} cancelAction={this.props.cancelAction} />
                                </div>
                            </div>
                        </div>
                    </ModalDialog>
                </ModalContainer>

                {
                    /* The form invalid messages container
                    it will be displayed if the entered donor data is invalid */
                    (!this.state.validPhone || !this.state.validMail || !this.state.validName || !this.state.validBloodGroup) &&
                    <ModalContainer onClose={this.closeModal}>
                        <ModalDialog onClose={this.closeModal}>
                            <div className="row">
                                <div className="panel panel-default donor-panel">
                                    <div className="panel-heading panel-heading-transparent">
                                        <h2 className="panel-title bold">Invalid data:</h2>
                                    </div>
                                    <div className="panel-body">
                                        {!this.state.validName && <label>The first name and the last name must be between 3 - 20 english characters.</label>}
                                        {!this.state.validMail && <label>You must enter a valid mail (ex: aaaa@b.co).</label>}
                                        {!this.state.validPhone && <label>You must enter a valid phone number (ex: +xx xxx xxxx xxx or 00xx xxx xxxx xxx).</label>}
                                        {!this.state.validBloodGroup && <label>The blood group must be one of {bloodGroups.toString()}.</label>}
                                    </div>
                                </div>
                            </div>
                        </ModalDialog>
                    </ModalContainer>
                }

                {/* The donor creation confirmation popup
                    which will display the donor edit link also */}
                {
                    this.state.newDonorID &&
                    <ModalContainer>
                        <ModalDialog>
                            <div className="row">
                                <div className="panel panel-default donor-panel">
                                    <div className="panel-heading panel-heading-transparent">
                                        <h2 className="panel-title bold">Done</h2>
                                    </div>
                                    <div className="panel-body">
                                        <label>Your data is saved and will be available for the patients to contact you.</label>
                                        <label>You can edit/delete your info throught: <b style={{wordWrap: 'break-word'}}>{URL}#/donors/{this.state.newDonorID}</b></label><br />
                                        <div className="row">
                                            <div className="col-md-12 center">
                                                <button onClick={this.closeModal} className="btn btn-teal"><i className="fa fa-check"></i>Done</button>
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