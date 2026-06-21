const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function test() {
  fs.writeFileSync('dummy_axios.jpg', 'fake image data');
  const loginRes = await axios.post('http://localhost:5001/api/auth/login', {
    email: 'admin@nyxnestworks.com',
    password: 'AdminPassword2026!'
  });
  const token = loginRes.data.token;

  const data = new FormData();
  data.append('title', 'Test Axios Upload');
  data.append('category', 'sales');
  data.append('description', 'testing');
  
  const images = ['dummy_axios.jpg']; // simulate multiple
  for (let i = 0; i < images.length; i++) {
    data.append('images', fs.createReadStream(images[i]));
  }

  try {
    const res = await axios.post('http://localhost:5001/api/properties', data, {
      headers: { 
        Authorization: `Bearer ${token}` 
      }
    });
    console.log('Success:', res.data.title);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}
test();
