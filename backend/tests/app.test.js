import supertest from 'supertest';
import app from "../app.js";

const request = supertest(app); // Bind the app to supertest 

describe('GET /', () => {
    test('we receive a success response', async () => {
        const response = await request.get('/');
        // console.log(response);
        expect(response.statusCode).toBe(200);
    });

    test('returns hello name correctly', async () => {
        const response = await request.post('/hello').send({
            name: 'Aurélie'
        });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Hello Aurélie'); // Check the response body
        // expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    });
});

/*
    the supertest request function and we can pass in the HTTP server object (which is our case the app object from express) then we make a request to a certain endpoint.

    The super test is going to take this HTTP server and bind it to whatever port it wants to bind it to. Then we get the response object that contains wll the details from the HTTP response then we can use it in our test.

    Using ES6 modules specify before running
    NODE_OPTIONS=--experimental-vm-modules npx jest
*/