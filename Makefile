# Makefile for Laravel Docker Setup

# Variables
DC = docker compose
APP = $(DC) exec app

.PHONY: up down restart build logs shell artisan migrate composer npm test

# Docker Control
up:
	$(DC) up -d

down:
	$(DC) down

restart: down up

build:
	$(DC) build

logs:
	$(DC) logs -f

# Application Shell
shell:
	$(APP) bash

# Laravel Artisan
artisan:
	$(APP) php artisan $(cmd)

migrate:
	$(APP) php artisan migrate

fresh:
	$(APP) php artisan migrate:fresh --seed

migrate-refresh:
	$(APP) php artisan migrate:refresh

# Composer
composer:
	$(APP) composer $(cmd)

install:
	$(APP) composer install

update:
	$(APP) composer update

# Node / NPM
npm:
	$(APP) npm $(cmd)

npm-install:
	$(APP) npm install

npm-dev:
	$(APP) npm run dev

npm-build:
	$(APP) npm run build

# Testing
test:
	$(APP) php artisan test
