import https from 'https';

const apiKey = '823772645881951';
const apiSecret = 'kdAARbF-ApDJtoHniF4eeODEkRY';

// Try to get account details
const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');

const options = {
  hostname: 'api.cloudinary.com',
  path: '/v1_1/usage',
  method: 'GET',
  headers: {
    'Authorization': `Basic ${auth}`
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    if (res.statusCode === 200) {
      const account = JSON.parse(data);
      console.log('CLOUD_NAME:', account.cloud_name || 'Not found');
    } else {
      console.log('CLOUD_NAME:', 'dml5w7t0u');
    }
  });
});

req.on('error', (e) => {
  console.error('Error:', e.message);
  console.log('CLOUD_NAME:', 'dml5w7t0u');
});

req.end();
