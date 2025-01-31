// import chai from 'chai';
// import chaiHttp from 'chai-http';
// import Client from '../models/Client';
// import { server } from '..';

// chai.should();
// chai.use(chaiHttp);

// describe('Client', () => {
//     beforeEach((done) => {
//         Client.deleteMany({}, () => {
//         done();
//         });
//     });

//     describe('/POST registerClient', () => {
//         it('it should register a new client', (done) => {
//         const client = {
//             document: '123456789',
//             names: 'John Doe',
//             email: 'john@example.com',
//             cellphone: '1234567890'
//         };
//         chai.request(server)
//             .post('/api/registerClient')
//             .send(client)
//             .end((err, res) => {
//                 res.should.have.status(200);
//                 res.body.should.be.a('object');
//                 res.body.should.have.property('success').eql(true);
//                 done();
//             });
//         });
//     });

//   // Add more tests for other endpoints
// });