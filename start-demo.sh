#!/bin/bash

# WebTimeWise Demo Server
echo "🚀 Starting WebTimeWise Demo..."
echo "📱 Demo will be available at: http://localhost:8080"
echo "🎯 Press Ctrl+C to stop the server"
echo ""

# Start Python HTTP server
python3 -m http.server 8080 