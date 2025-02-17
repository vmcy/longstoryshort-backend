import { isValidUrl, hasRequiredProperty, generateUniqueID } from './utils.mjs';
import config from './config.mjs';

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

  const successResponse = {
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

  return successResponse;
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
