// src/db/index.js
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import 'dotenv/config';
import * as schema from './schema.js';

// String de conexão do Supabase (obtida do .env)
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL não encontrada. Verifique seu arquivo .env');
}

// Cliente Postgres otimizado para conexão
const client = postgres(connectionString, { prepare: false });

// Inicializa o Drizzle ORM com o schema e o cliente Postgres
export const db = drizzle(client, { schema });