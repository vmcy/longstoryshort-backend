'use strict';

import { shortenUrl, expandUrl } from '../../app.mjs';
import { expect } from 'chai';
var event, context;

describe('Tests index', function () {
    it('verifies successful response', async () => {
        const result = await shortenUrl(event, context)

        expect(result).to.be.an('object');
        expect(result.statusCode).to.equal(200);
        expect(result.body).to.be.an('string');

        let response = JSON.parse(result.body);

        expect(response).to.be.an('object');
        expect(response.message).to.be.equal("Shortern URL Success");
    });

    // Should shorten valid URL

    // Should expand a shortened URL correctly

    // Should throw error for invalid URL

    // Should throw error for non-existent short URL

    // Should throw error for empty short URL

    // Show throw error for empty expand URL
});
