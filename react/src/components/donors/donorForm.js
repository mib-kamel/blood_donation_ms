import React, { Component } from 'react';
import { bloodGroups } from '../utils';

//The donor form component which will be used in update and create the donor
export default class DonorForm extends Component {

    constructor(props) {
        super(props);
        let donorData = this.props.donorData;
        //default state for donor update
        if (donorData) {
            this.state = {
                donorFirstName: donorData.firstName,
                donorLastName: donorData.lastName,
                donorMail: donorData.mail,
                donorPhone: donorData.phone,
                bloodGroup: donorData.bloodGroup
            }
        }
        //default state for donor create
        else this.state = {
            donorFirstName: "",
            donorLastName: "",
            donorMail: "",
            donorPhone: "",
            bloodGroup: ""
        }
    }

    inputChanged(event) {
        //Check the taget id to change the proper state value
        const id = event.target.id;
        const value = event.target.value;
        if (id === "first_name") this.setState({ donorFirstName: value })
        if (id === "last_name") this.setState({ donorLastName: value })
        else if (id === "mail") this.setState({ donorMail: value })
        else if (id === "phone") this.setState({ donorPhone: value })
        else if (id === "blood_group") this.setState({ bloodGroup: value })
    }

    formSumbited(event) {
        //to prevent the default submit action
        event.preventDefault();
        const donorData = {
            firstName: this.state.donorFirstName,
            lastName: this.state.donorLastName,
            mail: this.state.donorMail,
            phone: this.state.donorPhone,
            bloodGroup: this.state.bloodGroup
        };

        //the first and last name must be between (3-30) english characters
        const validName = /^[a-zA-Z ]{3,30}$/.test(donorData.firstName) && /^[a-zA-Z ]{3,30}$/.test(donorData.lastName);

        //mail validation (ex: abc@y.co)
        const validMail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(donorData.mail);

        //the phone number must be 00xx xxx xxx xxxx xxx or +xx xxx xxxx xxx
        const validPhone = /^(00|\+)[0-9]{2}\s[0-9]{3}\s[0-9]{4}\s[0-9]{3}$/.test(donorData.phone);

        //The blood group must be one of A+,A-,B+,B-,O+,O-,AB+,AB-.
        //The valid blood group are in ../utils.js
        const validBloodGroup = bloodGroups.some(group => group === donorData.bloodGroup);

        //if one parameter is not valid send value false to the caller and the validty of each paramter
        if (!validName || !validMail || !validPhone || !validBloodGroup) {
            //For the testing purpose
            this.setState({ formValid: false })
            this.props.formSumbit(false, validName, validMail, validPhone, validBloodGroup)
            return;
        }

        //For the testing purpose
        this.setState({ formValid: true })

        //if all parameters are valid send the data object to the create/update cb
        this.props.formSumbit(donorData);
    }

    //Render the form
    render() {
        return (
            <form onSubmit={this.formSumbited.bind(this)} id="donorForm">
                <div className="form-group">
                    <div className="row">
                        <div className="col-md-12">
                            <label htmlFor="first_name">First name</label>
                            <input type="text" value={this.state.donorFirstName} onChange={this.inputChanged.bind(this)} className="form-control" id="first_name" required />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <label htmlFor="last_name">Last name</label>
                            <input type="text" value={this.state.donorLastName} onChange={this.inputChanged.bind(this)} className="form-control" id="last_name" required />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <label htmlFor="mail">Email address</label>
                            <input type="mail" value={this.state.donorMail} onChange={this.inputChanged.bind(this)} className="form-control" id="mail" required />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <label htmlFor="phone">Contact number</label>
                            <input type="text" value={this.state.donorPhone} onChange={this.inputChanged.bind(this)} className="form-control" id="phone" required />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <label htmlFor="phone">Blood group</label>
                            <input type="text" value={this.state.bloodGroup} onChange={this.inputChanged.bind(this)} className="form-control" id="blood_group" required />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 center">
                        <br />
                        <button className="btn btn-teal" id="saveButton"><i className="fa fa-check"></i>Save</button>&nbsp;&nbsp;&nbsp;&nbsp;
                        {
                            /* show the remove button if its action is in the props, we be displayed in donor update */
                            this.props.deleteAction &&
                            <span>
                                <a className="btn btn-red" onClick={this.props.deleteAction}><i className="fa fa-close"></i>Delete</a>&nbsp;&nbsp;&nbsp;&nbsp;
                            </span>
                        }
                        <button className="btn btn-default" onClick={this.props.cancelAction}><i className="fa fa-close"></i>Cancel</button>
                    </div>
                </div>
            </form>
        )
    }
}