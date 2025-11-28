const http = require('http');

const BASE_URL = 'http://localhost:3005';

async function checkPage(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      resolve(res.statusCode);
    }).on('error', () => {
      resolve(0);
    });
  });
}

async function verify() {
  console.log('🔍 Quick Verification\n');
  console.log('='.repeat(50));

  // Homepage
  const homeStatus = await checkPage(BASE_URL);
  console.log(`Homepage: ${homeStatus === 200 ? '✓' : '✗'} (${homeStatus})`);

  // Products
  console.log('\nProduct Pages:');
  for (let i = 1; i <= 12; i++) {
    const status = await checkPage(`${BASE_URL}/products/${i}`);
    console.log(`  Product ${i}: ${status === 200 ? '✓' : '✗'} (${status})`);
  }

  // Categories
  console.log('\nCategory Pages:');
  const categoryIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 14];
  for (const id of categoryIds) {
    const status = await checkPage(`${BASE_URL}/category/${id}`);
    console.log(`  Category ${id}: ${status === 200 ? '✓' : '✗'} (${status})`);
  }

  // Menu pages
  console.log('\nMenu Pages:');
  const menuPages = ['menu', 'reports', 'coupons', 'settings', 'support', 'terms', 'privacy'];
  for (const page of menuPages) {
    const status = await checkPage(`${BASE_URL}/${page}`);
    console.log(`  ${page}: ${status === 200 ? '✓' : '✗'} (${status})`);
  }

  console.log('\n' + '='.repeat(50));
  console.log('✅ Verification Complete!');
}

// Wait 3 seconds for server to be ready
setTimeout(verify, 3000);
