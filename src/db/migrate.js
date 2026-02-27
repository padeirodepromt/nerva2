// src/db/migrate.js
// Script para executar as migrações da base de dados num ambiente Node.js, agora com mais logs.
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import 'dotenv/config';

console.log('--- A INICIAR SCRIPT DE MIGRAÇÃO ---');

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in .env file');
}

console.log('DATABASE_URL encontrada.');

const runMigrate = async () => {
  let connection;
  try {
    console.log('A tentar conectar à base de dados...');
    connection = postgres(process.env.DATABASE_URL, { max: 1 });
    const db = drizzle(connection);
    console.log('Conexão estabelecida com sucesso.');

    console.log('A iniciar a migração do Drizzle...');
    await migrate(db, { migrationsFolder: 'drizzle' });
    console.log('--- MIGRAÇÃO CONCLUÍDA COM SUCESSO! ---');
  } catch (error) {
    console.error('--- ERRO DURANTE A MIGRAÇÃO: ---', error);
    process.exit(1);
  } finally {
    if (connection) {
      console.log('A fechar a conexão com a base de dados.');
      await connection.end();
    }
  }
};

runMigrate();

