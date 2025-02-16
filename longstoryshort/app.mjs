/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */

export const shortenUrl = async (event, context) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Shortern URL Success',
    })
  };

  return response;
};

export const expandUrl = async (event, context) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Expand URL',
    })
  };

  return response;
};
