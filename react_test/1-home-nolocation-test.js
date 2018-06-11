import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import Home from '../react/src/components/home';

describe("1- test home page with no location", function () {

    var home = mount(<Home />);

    it("It should find 3 .row div", function () {
        expect(home.find('.row').length).to.equal(3);
    });

    it("It should render the donors and patients buttons", () => {
        const labels = home.find('a label');
        expect(labels.length).to.equal(2);
        expect(labels.first().text()).to.equal("Register as a donor.");
        expect(labels.at(1).text()).to.equal("See all near donors.");
    })

    it("It should render the donors button disabled", () => {
        expect(home.find('.disabled').length).to.equal(1);
        expect(home.find('.disabled').first().text()).to.equal("DonorRegister as a donor.");
    })

});