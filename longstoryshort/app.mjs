import { isValidUrl, hasRequiredProperty, generateUniqueID } from './utils.mjs';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";

import config from './config.mjs';

const ddbClient = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

const corsHeader = {
  "Access-Control-Allow-Headers" : "Content-Type",
  "Access-Control-Allow-Origin": config.DOMAIN, 
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS"
}

export const shortenUrl = async (event, context) => {
  let body;
  let originalUrl;

  if (typeof event.body === 'string') {
    body = JSON.parse(event.body);
  } else {
    body = event.body;
  }

  if (!hasRequiredProperty(body, 'url')) {
    return {
      statusCode: 400,
      headers: corsHeader,
      body: JSON.stringify({
        messageCode: 1,
        message: "missing required field: url"
      })
    };
  }

  originalUrl = body.url;

  if (!isValidUrl(originalUrl)) {
    return {
      statusCode: 422,
      headers: corsHeader,
      body: JSON.stringify({
        messageCode: 2,
        message: "invalid url provided"
      })
    };
  }

  const shortUrlId = generateUniqueID();

  const ddbPutCommand = new PutCommand({
    TableName: "UrlShortenerTable",
    Item: {
      ShortId: shortUrlId,
      OriginalUrl: originalUrl,
      CreatedTimestamp: (Date.now() / 1000 | 0),
      ExpiryTimestamp: ((Date.now() + config.DEFAULT_SHORT_URL_EXPIRY_DURATION_DAY * 24 * 60 * 60 * 1000) / 1000) | 0
    }
  });

  try {
    await ddbDocClient.send(ddbPutCommand);
    return {
      statusCode: 200,
      headers: corsHeader,
      body: JSON.stringify({
        messageCode: 0,
        message: 'URL successfully shortened',
        data: {
          originalUrl: originalUrl,
          shortUrl: `${config.DOMAIN}/${shortUrlId}`
        }
      })
    };
  } catch (error) {
    console.error('Error inserting item: ', error);
    return {
      statusCode: 500,
      headers: corsHeader,
      body: JSON.stringify({
        messageCode: 99,
        message: `unexpected error: ${error.stack}`,
      })
    };
  }
};

export const expandUrl = async (event, context) => {
  let queryStringParameters;
  let shortId;

  if (typeof event.queryStringParameters === 'string') {
    queryStringParameters = JSON.parse(event.queryStringParameters);
  } else {
    queryStringParameters = event.queryStringParameters;
  }

  if (!hasRequiredProperty(queryStringParameters, 'shortid')) {
    return {
      statusCode: 400,
      headers: corsHeader,
      body: JSON.stringify({
        messageCode: 1,
        message: "missing required field: shortid"
      })
    };
  }

  shortId = queryStringParameters.shortid;

  const ddbGetCommand = new GetCommand({
    TableName: "UrlShortenerTable",
    Key: {
      ShortId: shortId,
    },
  });

  try {
    const response = await ddbDocClient.send(ddbGetCommand);

    if (!hasRequiredProperty(response, 'Item')) {
      return {
        statusCode: 404,
        headers: corsHeader,
        body: JSON.stringify({
          messageCode: 3,
          message: "non-existent short url provided"
        })
      };
    }

    let item = response.Item;

    return {
      statusCode: 200,
      headers: corsHeader,
      body: JSON.stringify({
        messageCode: 0,
        message: 'URL successfully expanded',
        data: {
          shortId: shortId,
          expandUrl: item.OriginalUrl
        }
      })
    };
  } catch (error) {
    console.error('Error getting item: ', error);
    return {
      statusCode: 500,
      headers: corsHeader,
      body: JSON.stringify({
        messageCode: 99,
        message: `unexpected error: ${error.stack}`,
      })
    };
  }
};
