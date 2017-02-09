"use strict";

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const should = chai.should();

chai.use(chaiHttp);


describe('Measurements RESTful Endpoint', () => {

    describe('Add a measurement', () => {

        it('should add the measurement when valid', (done) => {
            const measurement = {
                timestamp: "2015-09-01T16:00:00.000Z",
                temperature: 27.1,
                dewPoint: 16.7,
                precipitation: 0
            };
            chai.request(server)
                .post('/measurements')
                .send(measurement)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.temperature.should.equal(measurement.temperature);
                    res.body.dewPoint.should.equal(measurement.dewPoint);
                    res.body.precipitation.should.equal(measurement.precipitation);
                    done();
                });

        });

        it('should not add the measurement with invalid value', (done) => {
            const measurement = {
                timestamp: "2015-09-01T16:00:00.000Z",
                temperature: 'not a number',
                dewPoint: 16.7,
                precipitation: 0
            };
            chai.request(server)
            .post('/measurements')
            .send(measurement)
            .end((err, res) => {
                res.should.have.status(400);
                done();
            });

        });

        it('should not add measurement without POST body', (done) => {
            chai.request(server)
            .post('/measurements')
            .end((err, res) => {
                res.should.have.status(400);
                done();
            });

        });

        it('should not add measurements without a timestamp', (done) => {
            const measurement = {
                temperature: 27.1,
                dewPoint: 16.7,
                precipitation: 0
            };
            chai.request(server)
            .post('/measurements')
            .send(measurement)
            .end((err, res) => {
                res.should.have.status(400);
                done();
            });

        });
    });

    describe('Get a measurement', () => {
        const measurements = [
            {
                timestamp: '2015-09-01T16:00:00.000Z',
                temperature: 27.1,
                dewPoint: 16.7,
                precipitation: 0
            },
            {
                timestamp: '2015-09-01T16:10:00.000Z',
                temperature: 27.3,
                dewPoint: 16.9,
                precipitation: 0
            },
            {
                timestamp: '2015-09-01T16:20:00.000Z',
                temperature: 27.5,
                dewPoint: 17.1,
                precipitation: 0
            },
            {
                timestamp: '2015-09-01T16:30:00.000Z',
                temperature: 27.4,
                dewPoint: 17.3,
                precipitation: 0
            },
            {
                timestamp: '2015-09-01T16:40:00.000Z',
                temperature: 27.2,
                dewPoint: 17.2,
                precipitation: 0
            },
            {
                timestamp: '2015-09-01T16:40:00.000Z',
                temperature: 28.1,
                dewPoint: 18.3,
                precipitation: 0
            }
        ];

        beforeEach( (done)=>{
            chai.request(server)
                .post('/measurements')
                .send(measurements)
                .end( (err, res) => {
                    done();
                });
        });

        it('should be able to retrieve a measurement', (done) => {
            chai.request(server)
            .get('/measurements/2015-09-01T16:20:00.000Z')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.temperature.should.equal(27.5);
                res.body.dewPoint.should.equal(17.1);
                res.body.precipitation.should.equal(0);
                done();
            });
        });

        it('should not be able to retrieve a measurement that does not exist', (done) => {
            chai.request(server)
            .get('/measurements/2015-09-01T16:50:00.000Z')
            .end((err, res) => {
                res.should.have.status(404);
                done();
            });
        });

    });
});