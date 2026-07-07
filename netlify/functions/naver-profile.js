const https = require('https');

exports.handler = async function(event) {
  const token = event.queryStringParameters && event.queryStringParameters.token;

  if (!token) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'No token provided' })
    };
  }

  return new Promise((resolve) => {
    const options = {
      hostname: 'openapi.naver.com',
      path: '/v1/nid/me',
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + token }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        resolve({
          statusCode: 200,
          headers: { 'Access-Control-Allow-Origin': '*' },
          body: data
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        statusCode: 500,
        body: JSON.stringify({ error: err.message })
      });
    });

    req.end();
  });
};
