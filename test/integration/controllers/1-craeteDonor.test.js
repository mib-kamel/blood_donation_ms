var chai = require('chai');
var request = require('supertest'),
    should = require('should');

var expect = chai.expect;

describe('Create  donor', function () {
    var insertedDonorId;
    var validDonorData = {
        firstName: 'test', lastName: 'name', mail: 'test@test.com',
        phone: '0020 109 2111 121', bloodGroup: 'A+', lng: '30.001', lat: '31.0001'
    }
    before(function (done) {
        done(null, sails);
        Donors.destroy().exec((err, res) => { });
    });

    it('Should return invalid data when no body found', function (done) {
        request(sails.hooks.http.app)
            .post('/api/donors')
            .send({})
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.text).to.equal("invalid data");
                done();
            });
    });

    it('Should return invalid data when no user latitude found', function (done) {
        var sendData = JSON.parse(JSON.stringify(validDonorData))
        delete sendData.lat;
        request(sails.hooks.http.app)
            .post('/api/donors')
            .send(sendData)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.text).to.equal("invalid data");
                done();
            });
    });

    it('Should return invalid data when wrong phone number found', function (done) {
        var sendData = JSON.parse(JSON.stringify(validDonorData))
        sendData.phone = 0021232344;
        request(sails.hooks.http.app)
            .post('/api/donors')
            .send(sendData)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.text).to.equal("invalid data");
                done();
            });
    });

    it('Should add the donor to the db and return his id', function (done) {
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

    it('Get the inserted donor and make sure that its ip is saved', function (done) {
        request(sails.hooks.http.app)
            .get('/api/donors/' + insertedDonorId)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body).to.be.an('object');
                expect(res.body.ip).to.be.a('string');
                expect(res.body).include.keys(validDonorData);
                done();
            });
    });
});
