#!/bin/bash

# HuskyKennel Backend Startup Script

echo "🚀 Starting HuskyKennel Backend Server..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "📝 Please copy env.example to .env and fill in your environment variables:"
    echo "   cp env.example .env"
    echo "   # Then edit .env with your API keys and database URLs"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if dist folder exists (for production)
if [ "$1" = "prod" ]; then
    if [ ! -d "dist" ]; then
        echo "🔨 Building project..."
        npm run build
    fi
    echo "🏭 Starting production server..."
    npm start
else
    echo "🛠️  Starting development server..."
    npm run dev
fi