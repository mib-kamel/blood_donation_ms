var chai = require('chai');
var request = require('supertest'),
    should = require('should');

var expect = chai.expect;

describe('Update and delete donor data', function () {
    var insertedDonorId;
    var validDonorData = {
        firstName: 'test', lastName: 'name', mail: 'test@test.com',
        phone: '0020 109 2111 121', bloodGroup: 'A+', lng: '30.001', lat: '31.0001'
    }
    before(function (done) {
        done(null, sails);
        Donors.destroy().exec((err, res) => { });
    });

    it('Add the donor to db to test', function (done) {
        request(sails.hooks.http.app)
            .post('/api/donors')
            .send(validDonorData)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.text).not.to.equal("invalid data");
                expect(res.body).to.have.property('id');
                insertedDonorId = res.body.id;
                done();
            });
    });

    it('Should return invalid data when wrong phone number found', function (done) {
        var sendData = JSON.parse(JSON.stringify(validDonorData))
        sendData.phone = 0021232344;
        request(sails.hooks.http.app)
            .post('/api/donors/' + insertedDonorId)
            .send(sendData)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.text).to.equal("invalid data");
                done();
            });
    });

    it('Should return invalid id when wrong id found', function (done) {
        request(sails.hooks.http.app)
            .post('/api/donors/' + insertedDonorId + 1)
            .send(validDonorData)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.text).to.equal("invalid id");
                done();
            });
    });

    it('Should return updated when every thing is ok', function (done) {
        request(sails.hooks.http.app)
            .post('/api/donors/' + insertedDonorId)
            .send(validDonorData)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.text).to.equal("updated");
                done();
            });
    });

    it('Should return deleted when i delete id', function (done) {
        request(sails.hooks.http.app)
            .delete('/api/donors/' + insertedDonorId)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.text).to.equal("deleted");
                done();
            });
    });

    it('Should find no donors', function (done) {
        request(sails.hooks.http.app)
            .get('/api/donors/')
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body).have.length(0);
                done();
            });
    });
});
