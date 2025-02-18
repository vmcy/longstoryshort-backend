import { isValidUrl, hasRequiredProperty, generateUniqueID } from './utils.mjs';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

import config from './config.mjs';

const ddbClient = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

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
      CreatedTimestamp: Date.now(),
      ExpiryTimestamp: Date.now() + config.DEFAULT_SHORT_URL_EXPIRY_DURATION_DAY * 24 * 60 * 60 * 1000
    }
  });

  try {
    await ddbDocClient.send(ddbPutCommand);
    return {
      statusCode: 200,
      body: JSON.stringify({
        messageCode: 0,
        message: 'URL successfully shortened',
        data: {
          originalUrl: originalUrl,
          shortUrl: `${config.DOMAIN}/${generateUniqueID()}`
        }
      })
    };
  } catch (error) {
    console.error('Error inserting item: ', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        messageCode: 99,
        message: `unexpected error: ${error.stack}`,
      })
    };
  }
};

export const expandUrl = async (event, context) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      messageCode: 0,
      message: 'Expand URL',
    })
  };

  return response;
};
