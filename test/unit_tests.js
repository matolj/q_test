//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Book = require('../backend/models/Book');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

describe('Books And Login', () => {

    describe('/GET book', () => {
        it('it should GET all the books and should get message OK', (done) => {
            chai.request(server)
                .get('/authors')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('message');
                    res.body.should.have.property('books');
                    res.body.books.should.be.a('array');
                    res.body.books.length.should.be.greaterThan(0);
                    res.body.message.should.be.eql('OK');
                    done();
            });
        });
    });

    describe('/POST authenticate', () => {
        it('it should make my user log in', (done) => {
            let credentials = {
                username: "mate.oljica1@gmail.com",
                password: "testadmin"
            }
            chai.request(server)
                .post('/users/authenticate')
                .send(credentials)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('token');
                    res.body.role.should.be.eql('Admin');
                    done();
            });
        });
    });


});
