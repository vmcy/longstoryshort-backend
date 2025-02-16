'use strict';

import { shortenUrl, expandUrl } from '../../app.mjs';
import { expect } from 'chai';
var event, context;

describe('Shorten URL', function () {
    // Should shorten valid URL
    it('verifies successful response', async () => {
        const response = await shortenUrl(event, context)
        expect(response).to.be.an('object');
        expect(response.statusCode).to.equal(200);
        expect(response.body).to.be.an('string');

        let result = JSON.parse(response.body);
        expect(result).to.be.an('object');
        expect(result.messageCode).to.equal(0);
        expect(result.message).to.be.equal("URL successfully shortened");

        let data = JSON.parse(result.data);
        expect(data).to.be.an('object');
        expect(data.originalUrl).to.be.equal(event.body.originalUrl);
        expect(data.shortUrl).to.be.an('string');
        expect(data.shortUrl).to.have.lengthOf(1);
    });

    // Should throw error for missing original URL
    it('verifies empty original url response', async () => {
        const response = await shortenUrl(event, context)
        expect(response).to.be.an('object');
        expect(response.statusCode).to.equal(400);
        expect(response.body).to.be.an('string');

        let result = JSON.parse(response.body);
        expect(result).to.be.an('object');
        expect(result.messageCode).to.equal(1);
        expect(result.message).to.be.equal("missing required field: url");
    });

    // Should throw error for invalid original URL
    it('verifies invalid url response', async () => {
        const response = await shortenUrl(event, context)
        expect(response).to.be.an('object');
        expect(response.statusCode).to.equal(422);
        expect(response.body).to.be.an('string');

        let result = JSON.parse(response.body);
        expect(result).to.be.an('object');
        expect(result.messageCode).to.equal(2);
        expect(result.message).to.be.equal("invalid url provided");
    });
});

describe('Expand URL', function () {
    // Should expand a shortened URL correctly

    // Should throw error for missing short URL

    // Should throw error for non-existent short URL
});