/**
 * AI Platform Integration Module for Node-RED
 * Provides custom functions to interact with the AI Automation Platform backend
 */

const axios = require('axios');

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000';

class AIPlatformIntegration {
    constructor() {
        this.apiClient = axios.create({
            baseURL: API_BASE_URL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    /**
     * Execute workflow via backend API
     */
    async executeWorkflow(workflowData) {
        try {
            const response = await this.apiClient.post('/api/v1/workflows/execute', workflowData);
            return response.data;
        } catch (error) {
            throw new Error(`Workflow execution failed: ${error.message}`);
        }
    }

    /**
     * Send email via backend API
     */
    async sendEmail(emailData) {
        try {
            const response = await this.apiClient.post('/api/v1/email/send', emailData);
            return response.data;
        } catch (error) {
            throw new Error(`Email sending failed: ${error.message}`);
        }
    }

    /**
     * Get workflow templates from backend
     */
    async getWorkflowTemplates() {
        try {
            const response = await this.apiClient.get('/api/v1/workflows/templates');
            return response.data;
        } catch (error) {
            throw new Error(`Failed to fetch templates: ${error.message}`);
        }
    }

    /**
     * Save workflow to backend
     */
    async saveWorkflow(workflowData) {
        try {
            const response = await this.apiClient.post('/api/v1/workflows', workflowData);
            return response.data;
        } catch (error) {
            throw new Error(`Failed to save workflow: ${error.message}`);
        }
    }

    /**
     * Get AI advice for workflow optimization
     */
    async getWorkflowAdvice(workflowData) {
        try {
            const response = await this.apiClient.post('/api/v1/ai/workflow-advice', workflowData);
            return response.data;
        } catch (error) {
            throw new Error(`Failed to get AI advice: ${error.message}`);
        }
    }

    /**
     * Trigger scheduled task
     */
    async scheduleTask(taskData) {
        try {
            const response = await this.apiClient.post('/api/v1/scheduler/tasks', taskData);
            return response.data;
        } catch (error) {
            throw new Error(`Failed to schedule task: ${error.message}`);
        }
    }
}

module.exports = new AIPlatformIntegration();