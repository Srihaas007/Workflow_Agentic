/**
 * Node-RED Configuration for AI Automation Platform
 * This configuration integrates Node-RED with the existing backend API
 */

module.exports = {
    // Runtime settings
    uiPort: process.env.NODE_RED_PORT || 1880,
    uiHost: "0.0.0.0",

    // Editor settings
    httpAdminRoot: '/node-red',
    httpNodeRoot: '/api/flows',
    
    // Cross-origin settings for frontend integration
    httpNodeCors: {
        origin: ["http://localhost:3000", "http://localhost:3001"],
        credentials: true
    },

    // Enable HTTPS for security (optional)
    // https: {},

    // User directory for flows and credentials
    userDir: './node-red-data/',

    // Flow file settings
    flowFile: 'flows.json',
    flowFilePretty: true,

    // Security settings
    adminAuth: {
        type: "credentials",
        users: [{
            username: "admin",
            password: "$2a$08$zZWtXTja0fB1pzD4sHCMyOCMYz2Z6dNbM6tl8sJogENOMcxWV9DN.", // "password"
            permissions: "*"
        }]
    },

    // Editor theme
    editorTheme: {
        page: {
            title: "AI Automation Platform - Node-RED",
            favicon: "/absolute/path/to/theme/icon",
            css: "/absolute/path/to/custom/css/file",
            scripts: "/absolute/path/to/custom/script/file"
        },
        header: {
            title: "AI Automation Platform",
            image: "/absolute/path/to/header/image"
        },
        deployButton: {
            type: "simple",
            label: "Deploy",
            icon: "/absolute/path/to/deploy/icon"
        },
        menu: { 
            "menu-item-import-library": false,
            "menu-item-export-library": false,
            "menu-item-keyboard-shortcuts": false,
            "menu-item-help": {
                label: "AI Platform Help",
                url: "http://localhost:3000/help"
            }
        },
        userMenu: false,
        login: {
            image: "/absolute/path/to/login/page/big/image"
        },
        palette: {
            editable: true,
            catalogues: ['https://catalogue.nodered.org/catalogue.json'],
            theme: [
                {
                    category: ".*",
                    type: ".*",
                    color: "#8b5cf6"
                }
            ]
        },
        projects: {
            enabled: true,
            workflow: {
                mode: "manual"
            }
        },
        codeEditor: {
            lib: "ace",
            options: {
                theme: "vs-dark"
            }
        }
    },

    // Function node settings
    functionGlobalContext: {
        // Global variables for the AI platform
        API_BASE_URL: 'http://localhost:8000',
        FRONTEND_URL: 'http://localhost:3000',
        os: require('os'),
        // Custom modules for AI platform integration
        aiPlatform: require('./ai-platform-integration')
    },

    // Export settings for sharing workflows
    exportGlobalContextKeys: false,

    // Context storage
    contextStorage: {
        default: {
            module: "localfilesystem"
        }
    },

    // Logging
    logging: {
        console: {
            level: "info",
            metrics: false,
            audit: false
        }
    },

    // Enable project feature
    projects: {
        enabled: true
    }
};