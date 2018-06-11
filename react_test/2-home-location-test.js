import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import Home from '../react/src/components/home';

describe("2- test home page with location", function () {

    var home;
    beforeEach(() => {
        global.navigator.geolocation = {
            getCurrentPosition: fn => fn({ coords: { longitude: 30, latitude: 30 } })
        }
        home = shallow(<Home />);
    });

    afterEach(() => {
        global.navigator.geolocation = undefined;
    });


    it("It should find 2 .row divs", function () {
        expect(home.find('.row').length).to.equal(2);
    });

    it("It should render the no disabled button", () => {
        expect(home.find('.disabled').length).to.equal(0);
        // expect(home.find('.disabled').first().text()).to.equal("DonorRegister as a donor.");
    })

});