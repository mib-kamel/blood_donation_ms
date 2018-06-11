import React, { Component } from 'react';
import { ModalContainer, ModalDialog } from 'react-modal-dialog';
import { Push, hashHistory } from 'react-router';
import { bloodGroups } from '../utils';

import { updateDonor, fetchDonor, deleteDonor } from '../../services/donors.service';
import DonorForm from './donorForm';

export default class UpdateDonor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            donorData: undefined,
            validPhone: true,
            validMail: true,
            validName: true,
            validBloodGroup: true
        }
    }

    componentWillMount() {
        //Fetch the donor data from the server if not fetched yet
        if (!this.state.donorData) {
            fetchDonor(this.props.params.id, donorData => {
                if (!donorData) this.setState({ notValidID: true });
                else this.setState({ donorData })
            });
        }
    }

    //Donor update action
    submitAction(donorData, validName, validMail, validPhone, validBloodGroup) {
        if (!donorData) {
            this.setState({ validPhone, validMail, validName, validBloodGroup });
            return;
        }
        updateDonor(this.props.params.id, donorData, (updatedData) => {
            this.setState({
                validPhone: true,
                validMail: true,
                validName: true,
                validBloodGroup: true,
                updated: true
            })
        })
    }

    //Donor delete action
    deleteAction() {
        deleteDonor(this.state.donorData.id, (res) => {
            hashHistory.push('/');
        });
    }

    //validation message modal close
    closeModal = () => this.setState({ validPhone: true, validMail: true, validName: true, validBloodGroup: true })

    //back to index function which will be called if the update is done and the user press done button
    backToIndex = () => hashHistory.push('/')

    render() {
        return (
            <div>
                {
                    /* the notValidID state which will be true if the fetch donor message couldn't get the donor data  */
                    this.state.notValidID && <div className="center">Please enter a valid URL</div>
                }
                {
                    /* the panel which contain the update form*/
                    this.state.donorData ?
                        <div className="panel panel-default">
                            <div className="panel-heading panel-heading-transparent">
                                <h2 className="panel-title bold">Update donor</h2>
                            </div>
                            <div className="panel-body">
                                <DonorForm donorData={this.state.donorData} formSumbit={this.submitAction.bind(this)} cancelAction={this.backToIndex} deleteAction={this.deleteAction.bind(this)} />
                            </div>
                        </div> : !this.state.notValidID && <div className="center">Loading your info...</div>
                }

                {
                    /* validation message modal */
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

                {
                    /* the message which will be displayed if it is successfuly updated*/
                    this.state.updated &&
                    <ModalContainer>
                        <ModalDialog>
                            <div className="row">
                                <div className="panel panel-default donor-panel">
                                    <div className="panel-heading panel-heading-transparent">
                                        <h2 className="panel-title bold">Done</h2>
                                    </div>
                                    <div className="panel-body">
                                        <label>Your data is saved and will be available for the patients to contact you.</label>
                                        <label>You can edit/delete your info again throught: <b style={{wordWrap: 'break-word'}}>{URL}#/donors/{this.state.donorData.id}</b></label><br />
                                        <div className="row">
                                            <div className="col-md-12 center">
                                                <button onClick={this.backToIndex} className="btn btn-teal"><i className="fa fa-check"></i>Done</button>
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