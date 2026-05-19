#!/bin/bash
echo ""
echo "  ██╗  ██╗███████╗██╗  ██╗██╗   ██╗███████╗"
echo "  ██║  ██║██╔════╝╚██╗██╔╝██║   ██║██╔════╝"
echo "  ██║  ██║█████╗   ╚███╔╝ ██║   ██║███████╗"
echo "  ██║  ██║██╔══╝   ██╔██╗ ██║   ██║╚════██║"
echo "  ╚████╔╝ ███████╗██╔╝ ██╗╚██████╔╝███████║"
echo "   ╚═══╝  ╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝"
echo "                Knowledge OS"
echo ""

# Copy .env if missing
if [ ! -f ".env" ]; then
  cp .env.example .env
  echo "[SETUP] .env created. Add your ANTHROPIC_API_KEY for AI features."
fi

# Install deps
if [ ! -d "node_modules" ]; then
  echo "[INSTALL] Installing server dependencies..."
  npm install
fi

if [ ! -d "client/node_modules" ]; then
  echo "[INSTALL] Installing client dependencies..."
  cd client && npm install && cd ..
fi

echo ""
echo "[START] Starting NEXUS..."
echo "  API  → http://localhost:3001"
echo "  App  → http://localhost:5173"
echo ""

# Start both in parallel
node server/index.js &
SERVER_PID=$!

cd client
npm run dev &
CLIENT_PID=$!
cd ..

sleep 3
# Open browser
if command -v open &>/dev/null; then open http://localhost:5173
elif command -v xdg-open &>/dev/null; then xdg-open http://localhost:5173; fi

echo "Press Ctrl+C to stop NEXUS."
wait $SERVER_PID $CLIENT_PID
