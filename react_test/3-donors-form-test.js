import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import DonorForm from '../react/src/components/donors/donorForm';



describe("3- test the donors form", function () {

    //The action which will be run if the submit button clicked
    const submitAction = (donorData, validName, validMail, validPhone, validBloodGroup) => { }

    var form = mount(<DonorForm formSumbit={submitAction} />);




    it("It should render 5 form inputs", () => {
        expect(form.find('input').length).to.equal(5);
    })

    it("It should render 5 title labels", () => {
        var labels = form.find('label');
        expect(labels.length).to.equal(5);

        expect(labels.at(0).text()).to.equal("First name");
        expect(labels.at(1).text()).to.equal("Last name");
        expect(labels.at(2).text()).to.equal("Email address");
        expect(labels.at(3).text()).to.equal("Contact number");
        expect(labels.at(4).text()).to.equal("Blood group");
    })

    it("It should not accept invalid phone number", () => {
        form.setState({
            donorFirstName: "Cross",
            donorLastName: "Over",
            donorMail: "cross@over.com",
            donorPhone: "0220202020",
            bloodGroup: "A+"
        })
        form.find('#donorForm').simulate("submit");
        expect(form.state().formValid).to.equal(false);
    })

    it("It should not accept invalid blood type", () => {
        form.setState({
            donorFirstName: "Cross",
            donorLastName: "Over",
            donorMail: "cross@over.com",
            donorPhone: "0020 109 2111 121",
            bloodGroup: "AZ"
        })
        form.find('#donorForm').simulate("submit");
        expect(form.state().formValid).to.equal(false);
    })

    it("It should accept the valid data", () => {
        form.setState({
            donorFirstName: "Cross",
            donorLastName: "Over",
            donorMail: "cross@over.com",
            donorPhone: "0020 109 2111 121",
            bloodGroup: "A+"
        })
        form.find('#donorForm').simulate("submit");
        expect(form.state().formValid).to.equal(true);
    })
});