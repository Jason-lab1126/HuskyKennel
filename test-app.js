#!/usr/bin/env node

// Simple test script to verify the app is working
import http from 'http';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🧪 Testing HuskyKennel App...\n');

// Test 1: Check if frontend can start
console.log('1️⃣ Testing frontend dependencies...');
try {
  const packageJson = JSON.parse(fs.readFileSync(join(__dirname, 'package.json'), 'utf8'));
  const requiredDeps = ['react', 'react-dom', '@supabase/supabase-js', 'lucide-react'];
  const missingDeps = requiredDeps.filter(dep => !packageJson.dependencies[dep]);

  if (missingDeps.length === 0) {
    console.log('✅ Frontend dependencies are installed');
  } else {
    console.log('❌ Missing dependencies:', missingDeps.join(', '));
    console.log('   Run: npm install');
  }
} catch (error) {
  console.log('❌ Error reading package.json');
}

// Test 2: Check if backend can start
console.log('\n2️⃣ Testing backend dependencies...');
try {
  const serverPackageJson = JSON.parse(fs.readFileSync(join(__dirname, 'src/server/package.json'), 'utf8'));
  const requiredServerDeps = ['express', 'cors', 'dotenv', 'openai', '@supabase/supabase-js'];
  const missingServerDeps = requiredServerDeps.filter(dep => !serverPackageJson.dependencies[dep]);

  if (missingServerDeps.length === 0) {
    console.log('✅ Backend dependencies are installed');
  } else {
    console.log('❌ Missing backend dependencies:', missingServerDeps.join(', '));
    console.log('   Run: cd src/server && npm install');
  }
} catch (error) {
  console.log('❌ Error reading server package.json');
}

// Test 3: Check if backend server is running
console.log('\n3️⃣ Testing backend server...');
const testBackend = () => {
  const req = http.request({
    hostname: 'localhost',
    port: 3001,
    path: '/health',
    method: 'GET',
    timeout: 5000
  }, (res) => {
    if (res.statusCode === 200) {
      console.log('✅ Backend server is running on port 3001');
    } else {
      console.log('❌ Backend server responded with status:', res.statusCode);
    }
  });

  req.on('error', (error) => {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Backend server is not running');
      console.log('   Start it with: cd src/server && npm run dev');
    } else {
      console.log('❌ Error connecting to backend:', error.message);
    }
  });

  req.on('timeout', () => {
    console.log('❌ Backend server connection timed out');
  });

  req.end();
};

testBackend();

// Test 4: Check environment files
console.log('\n4️⃣ Checking environment setup...');

const envFiles = [
  { path: '.env', name: 'Frontend .env' },
  { path: 'src/server/.env', name: 'Backend .env' }
];

envFiles.forEach(({ path: envPath, name }) => {
  if (fs.existsSync(join(__dirname, envPath))) {
    console.log(`✅ ${name} exists`);
  } else {
    console.log(`❌ ${name} is missing`);
    console.log(`   Create it with the required environment variables`);
  }
});

console.log('\n📋 Summary:');
console.log('- If you see ❌ errors above, follow the instructions to fix them');
console.log('- If all tests pass ✅, your app should be ready to run');
console.log('- Check QUICK_START.md for detailed setup instructions');
console.log('\n🚀 To start the app:');
console.log('1. Backend: cd src/server && npm run dev');
console.log('2. Frontend: npm run dev (in another terminal)');