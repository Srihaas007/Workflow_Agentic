#!/usr/bin/env node

/**
 * Integration Test Script
 * Tests the integration between Node-RED, Backend API, and Frontend
 */

const axios = require('axios');

async function testIntegration() {
    console.log('🔍 Testing AI Automation Platform Integration...\n');

    // Test 1: Node-RED Health Check
    try {
        console.log('1️⃣ Testing Node-RED Health...');
        const nodeRedHealth = await axios.get('http://localhost:1880/health');
        console.log('✅ Node-RED is healthy:', nodeRedHealth.data);
    } catch (error) {
        console.log('❌ Node-RED health check failed:', error.message);
    }

    // Test 2: Backend API Health Check
    try {
        console.log('\n2️⃣ Testing Backend API...');
        const backendHealth = await axios.get('http://localhost:8000/health');
        console.log('✅ Backend API is healthy:', backendHealth.data);
    } catch (error) {
        console.log('❌ Backend API health check failed:', error.message);
    }

    // Test 3: Integration Status
    try {
        console.log('\n3️⃣ Testing Integration Status...');
        const integrationStatus = await axios.get('http://localhost:1880/api/integration/status');
        console.log('✅ Integration status:', integrationStatus.data);
    } catch (error) {
        console.log('❌ Integration status check failed:', error.message);
    }

    // Test 4: Frontend accessibility
    try {
        console.log('\n4️⃣ Testing Frontend accessibility...');
        const frontendResponse = await axios.get('http://localhost:3000', { timeout: 5000 });
        console.log('✅ Frontend is accessible (status:', frontendResponse.status, ')');
    } catch (error) {
        console.log('❌ Frontend accessibility check failed:', error.message);
    }

    console.log('\n🎉 Integration test completed!');
    console.log('\n📋 Summary of Services:');
    console.log('🌐 Frontend (React): http://localhost:3000');
    console.log('🚀 Backend API (FastAPI): http://localhost:8000');
    console.log('🔧 Node-RED Editor: http://localhost:1880/node-red');
    console.log('🔌 Node-RED Flows API: http://localhost:1880/api/flows');
    console.log('\n💡 To access the workflow builder with Node-RED integration:');
    console.log('   1. Go to http://localhost:3000 (will redirect to /workflows)');
    console.log('   2. Click "Open Node-RED" button to access advanced flows');
    console.log('   3. Use login: admin / password for Node-RED');
}

// Run the test
testIntegration().catch(console.error);