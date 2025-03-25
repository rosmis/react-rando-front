#!/bin/bash

# Exit on any error
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Setup backend .env file
setup_backend_env() {
    echo -e "${YELLOW}Setting up backend environment...${NC}"
    
    # Check if .env exists, if not create from example
    if [ ! -f .env ]; then
        cp .env.example .env
        echo -e "${GREEN}Created .env for backend${NC}"

        APP_KEY=$(php -r "echo 'base64:' . base64_encode(random_bytes(32));")

        sed -i "" "s|^APP_KEY=.*|APP_KEY=$APP_KEY|" .env
        
        echo -e "${GREEN}Generated database credentials and application key${NC}"
    fi
}

# Setup frontend .env file
setup_frontend_env() {
    echo -e "${YELLOW}Setting up frontend environment...${NC}"
    
    if [ ! -f .env ]; then
        cp .env.example .env
        echo -e "${GREEN}Created .env for frontend${NC}"
        
        read -p "Enter your VITE_MAPBOX_ACCESS_TOKEN (sent to teams DM): " VITE_MAPBOX_ACCESS_TOKEN
        sed -i "" "s|^VITE_MAPBOX_ACCESS_TOKEN=.*|VITE_MAPBOX_ACCESS_TOKEN=$VITE_MAPBOX_ACCESS_TOKEN|" .env
    fi

    # Install dependencies
    npm install
}

# Initialize development environment
init_dev_env() {
    echo -e "${YELLOW}Initializing development environment...${NC}"
    
    # Validate Docker is running
    if ! docker info >/dev/null 2>&1; then
        echo -e "${RED}Error: Docker is not running.${NC}"
        exit 1
    fi

    cd backend
    
    # Start services
    docker-compose up -d
    
    # Wait for services to initialize
    sleep 5

    docker-compose exec web php artisan db:seed
    
    echo -e "${GREEN}🎉Development environment initialized successfully!🎉${NC}"
}

# Main function
main() {
    # Validate dependencies
    command -v docker >/dev/null 2>&1 || { echo -e "${RED}Docker is not installed${NC}"; exit 1; }
    command -v docker-compose >/dev/null 2>&1 || { echo -e "${RED}Docker Compose is not installed${NC}"; exit 1; }
    command -v npm >/dev/null 2>&1 || { echo -e "${RED}npm is not installed${NC}"; exit 1; }

    # Change to backend directory to setup .env
    cd backend
    setup_backend_env
    cd ..

    # Change to frontend directory to setup .env
    cd frontend
    setup_frontend_env
    cd ..
    
    # Run initialization
    init_dev_env
}

# Run main function
main