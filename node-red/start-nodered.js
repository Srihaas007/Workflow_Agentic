#!/usr/bin/env node

/**
 * Node-RED Startup Script for AI Automation Platform
 * This script starts Node-RED with custom configuration and integration
 */

const RED = require('node-red');
const http = require('http');
const express = require('express');
const path = require('path');

// Load settings
const settings = require('./settings.js');

// Create Express app
const app = express();

// Add CORS middleware for frontend integration
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Credentials', true);
    
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// Create HTTP server
const server = http.createServer(app);

// Initialize Node-RED
RED.init(server, settings);

// Serve the editor UI from /node-red
app.use(settings.httpAdminRoot, RED.httpAdmin);

// Serve the HTTP nodes from /api/flows
app.use(settings.httpNodeRoot, RED.httpNode);

// Add health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'Node-RED AI Automation Platform',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Add integration status endpoint
app.get('/api/integration/status', (req, res) => {
    res.json({
        nodeRed: 'running',
        backendAPI: 'http://localhost:8000',
        frontend: 'http://localhost:3000',
        editorUrl: `http://localhost:${settings.uiPort}/node-red`
    });
});

// Start the server
server.listen(settings.uiPort, () => {
    console.log('🚀 AI Automation Platform - Node-RED Integration Started');
    console.log(`📊 Editor UI: http://localhost:${settings.uiPort}/node-red`);
    console.log(`🔌 HTTP API: http://localhost:${settings.uiPort}/api/flows`);
    console.log(`💓 Health Check: http://localhost:${settings.uiPort}/health`);
    console.log(`🔗 Integration Status: http://localhost:${settings.uiPort}/api/integration/status`);
    console.log('');
    console.log('📝 Default login: admin / password');
    console.log('🎨 Theme: Violet (matching your frontend)');
    console.log('');
});

// Start Node-RED runtime
RED.start().then(() => {
    console.log('✅ Node-RED runtime started successfully');
    console.log('🤖 AI Platform integration modules loaded');
}).catch((err) => {
    console.error('❌ Failed to start Node-RED:', err);
    process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down Node-RED gracefully...');
    RED.stop().then(() => {
        process.exit(0);
    });
});