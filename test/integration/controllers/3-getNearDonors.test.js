var chai = require('chai');
var request = require('supertest'),
    should = require('should');

var expect = chai.expect;

describe('Get near donors', function () {
    var insertedDonorsId = [];
    var donor1 = {
        firstName: 'testA', lastName: 'nameA', mail: 'test1@test.com',
        phone: '0020 109 2111 121', bloodGroup: 'A+', lng: '30.001', lat: '30.9901'
    }, donor2 = {
        firstName: 'testB', lastName: 'nameB', mail: 'test2@test.com',
        phone: '0020 109 2111 122', bloodGroup: 'B+', lng: '30.101', lat: '33.0001'
    }, donor3 = {
        firstName: 'testC', lastName: 'nameC', mail: 'test3@test.com',
        phone: '0020 109 2111 123', bloodGroup: 'A-', lng: '25.001', lat: '32.8601'
    }, donor4 = {
        firstName: 'testD', lastName: 'nameD', mail: 'test4@test.com',
        phone: '0020 109 2111 124', bloodGroup: 'AB+', lng: '30.041', lat: '31.0001'
    }
    before(function (done) {
        done(null, sails);
        Donors.destroy().exec((err, res) => { });
    });

    it('Add the donor to db to test', function (done) {
        request(sails.hooks.http.app)
            .post('/api/donors')
            .send(donor1)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.text).not.to.equal("invalid data");
                expect(res.body).to.have.property('id');
                insertedDonorsId.push(res.body.id);
                console.log(insertedDonorsId)
                done();
            });
    });

    it('Add the donor to db to test', function (done) {
        request(sails.hooks.http.app)
            .post('/api/donors')
            .send(donor2)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.text).not.to.equal("invalid data");
                expect(res.body).to.have.property('id');
                insertedDonorsId.push(res.body.id);
                done();
            });

    });

    it('Add the donor to db to test', function (done) {
        request(sails.hooks.http.app)
            .post('/api/donors')
            .send(donor3)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.text).not.to.equal("invalid data");
                expect(res.body).to.have.property('id');
                insertedDonorsId.push(res.body.id);
                done();
            });

    });

    it('Add the donor to db to test', function (done) {
        request(sails.hooks.http.app)
            .post('/api/donors')
            .send(donor4)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.text).not.to.equal("invalid data");
                expect(res.body).to.have.property('id');
                insertedDonorsId.push(res.body.id);
                done();
            });
    });

    it('Invalid data when no coords found', function (done) {
        request(sails.hooks.http.app)
            .post('/api/getDonors')
            .send({})
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.text).to.equal("invalid data");
                done();
            });
    });


    it('Get the nearest donors to me in the specified range', function (done) {
        var maxLat = 31.1, minLat = 30.8;
        var maxLng = 30.1, minLng = 30;
        request(sails.hooks.http.app)
            .post('/api/getDonors')
            .send({ maxLat, minLat, maxLng, minLng })
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.text).not.to.equal("invalid data");
                expect(res.body).have.length(2);
                expect(res.body[0].firstName).to.equal("testA");
                expect(res.body[1].firstName).to.equal("testD");
                done();
            });
    });

    it('Get no donors if far range specified', function (done) {
        var maxLat = 1, minLat = -1;
        var maxLng = -5, minLng = -10;
        request(sails.hooks.http.app)
            .post('/api/getDonors')
            .send({ maxLat, minLat, maxLng, minLng })
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.text).not.to.equal("invalid data");
                expect(res.body).have.length(0);
                done();
            });
    });


});
