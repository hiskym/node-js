# Fitness Shop

Jednoduchý e-shop vytvořený jako školní projekt.

## Použité technologie

### Frontend

- Next.js 16
- React
- TypeScript
- TanStack Query

### Backend

- NestJS
- TypeScript

### Databáze

- SQLite
- Drizzle ORM

### Architektura

Monorepo pomocí pnpm workspace.

# Funkcionality

## Veřejná část

- Výpis produktů
- Detail produktu
- Vyhledávání produktů
- Filtrování podle kategorií
- Košík (localStorage)
- Checkout
- Odeslání objednávky

## Administrace

- Přihlášení administrátora
- Správa produktů
- Správa kategorií
- Správa variant
- Správa obrázků
- Upload obrázků
- Přehled objednávek
- Změna stavu objednávky

# Struktura projektu

apps/
├── api
└── web

packages/
└── db

# Instalace a spuštění

## 1. Instalace závislostí

pnpm install

## 2. Migrace databáze

pnpm db:generate
pnpm db:migrate

## 3. Naplnění testovacími daty

pnpm db:seed

## 4. Spuštění backendu

pnpm --filter api dev

## 5. Spuštění frontendu

pnpm --filter web dev

# Testovací administrátor

Email:
admin@example.com

Heslo:
admin123