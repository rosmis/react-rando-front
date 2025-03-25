# Makefile for Development Environment

# Targets
.PHONY: init up down restart logs clean

# Initialize entire development environment
init:
	@bash init-dev-env.sh