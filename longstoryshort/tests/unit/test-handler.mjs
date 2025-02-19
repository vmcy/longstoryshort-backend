'use strict';

import { shortenUrl, expandUrl } from '../../app.mjs';
import { expect } from 'chai';

import event_short_valid_url from '../../../events/event_short_valid_url.json' with { type: 'json' };
import event_short_missing_url from '../../../events/event_short_missing_url.json' with { type: 'json' };
import event_short_invalid_url from '../../../events/event_short_invalid_url.json' with { type: 'json' };

import event_expand_valid_url from '../../../events/event_expand_valid_url.json' with { type: 'json' };
import event_expand_missing_url from '../../../events/event_expand_missing_url.json' with { type: 'json' };
import event_expand_nonexistent_url from '../../../events/event_expand_nonexistent_url.json' with { type: 'json' };

// Placeholder
var event, context;

describe('Shorten URL', function () {
    // Should shorten valid URL
    it('verifies successful response', async () => {
        const response = await shortenUrl(event_short_valid_url, context)
        expect(response).to.be.an('object');
        expect(response.statusCode).to.equal(200);
        expect(response.body).to.be.an('string');

        let result = JSON.parse(response.body);
        expect(result).to.be.an('object');
        expect(result.messageCode).to.equal(0);
        expect(result.message).to.be.equal("URL successfully shortened");

        let data = result.data;
        expect(data).to.be.an('object');
        expect(data.originalUrl).to.be.equal(event_short_valid_url.body.url);
        expect(data.shortUrl).to.be.an('string');
        expect(data.shortUrl).to.have.length.above(1);
    });

    // Should throw error for missing original URL
    it('verifies missing original url response', async () => {
        const response = await shortenUrl(event_short_missing_url, context)
        expect(response).to.be.an('object');
        expect(response.statusCode).to.equal(400);
        expect(response.body).to.be.an('string');

        let result = JSON.parse(response.body);
        expect(result).to.be.an('object');
        expect(result.messageCode).to.equal(1);
        expect(result.message).to.be.equal("missing required field: url");
    });

    // Should throw error for invalid original URL
    it('verifies invalid original url response', async () => {
        const response = await shortenUrl(event_short_invalid_url, context)
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
    it('verifies successful response', async () => {
        const response = await expandUrl(event_expand_valid_url, context)
        expect(response).to.be.an('object');
        expect(response.statusCode).to.equal(200);
        expect(response.body).to.be.an('string');

        let result = JSON.parse(response.body);
        expect(result).to.be.an('object');
        expect(result.messageCode).to.equal(0);
        expect(result.message).to.be.equal("URL successfully expanded");

        let data = result.data
        expect(data).to.be.an('object');
        expect(data.shortId).to.be.equal(event_expand_valid_url.queryStringParameters.shortid);
        expect(data.expandUrl).to.be.an('string');
        expect(data.expandUrl).to.have.length.above(1);
        expect(data.expandUrl).to.be.equal("https://forum.lowyat.net");
    });

    // Should throw error for missing short URL ID
    it('verifies missing short url response', async () => {
        const response = await expandUrl(event_expand_missing_url, context)
        expect(response).to.be.an('object');
        expect(response.statusCode).to.equal(400);
        expect(response.body).to.be.an('string');

        let result = JSON.parse(response.body);
        expect(result).to.be.an('object');
        expect(result.messageCode).to.equal(1);
        expect(result.message).to.be.equal("missing required field: shortid");
    });

    // Should throw error for non-existent short URL
    it('verifies non-existent short url response', async () => {
        const response = await expandUrl(event_expand_nonexistent_url, context)
        expect(response).to.be.an('object');
        expect(response.statusCode).to.equal(404);
        expect(response.body).to.be.an('string');

        let result = JSON.parse(response.body);
        expect(result).to.be.an('object');
        expect(result.messageCode).to.equal(3);
        expect(result.message).to.be.equal("non-existent short url provided");
    });
});