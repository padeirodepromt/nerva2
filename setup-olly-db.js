#!/usr/bin/env node

import pkg from 'pg';
const { Client } = pkg;

// Carregar variáveis de ambiente
import dotenv from 'dotenv';
dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

async function setupOllyDatabase() {
  try {
    await client.connect();
    console.log('✅ Conectado ao banco de dados Prana');

    // Criar tabelas do Olly
    await client.query(`
      CREATE TABLE IF NOT EXISTS olly_sessions (
        id TEXT PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        ended_at TIMESTAMP WITH TIME ZONE,
        metadata JSONB DEFAULT '{}'::jsonb
      );

      CREATE TABLE IF NOT EXISTS olly_messages (
        id TEXT PRIMARY KEY,
        session_id TEXT NOT NULL REFERENCES olly_sessions(id) ON DELETE CASCADE,
        role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
        content TEXT NOT NULL,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        metadata JSONB DEFAULT '{}'::jsonb
      );

      CREATE TABLE IF NOT EXISTS olly_campaigns (
        id TEXT PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        platform TEXT NOT NULL CHECK (platform IN ('meta_ads', 'google_ads', 'tiktok', 'linkedin')),
        campaign_name TEXT NOT NULL,
        campaign_data JSONB DEFAULT '{}'::jsonb,
        status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS olly_analyses (
        id TEXT PRIMARY KEY,
        campaign_id TEXT NOT NULL REFERENCES olly_campaigns(id) ON DELETE CASCADE,
        analysis_type TEXT NOT NULL,
        results JSONB NOT NULL,
        confidence NUMERIC(3,2),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS olly_optimizations (
        id TEXT PRIMARY KEY,
        campaign_id TEXT NOT NULL REFERENCES olly_campaigns(id) ON DELETE CASCADE,
        suggestions JSONB NOT NULL,
        priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
        applied BOOLEAN DEFAULT FALSE,
        applied_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS olly_user_settings (
        user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
        preferences JSONB DEFAULT '{}'::jsonb,
        api_keys JSONB DEFAULT '{}'::jsonb,
        notification_settings JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS olly_files (
        id TEXT PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        filename TEXT NOT NULL,
        storage_path TEXT NOT NULL,
        file_type TEXT NOT NULL,
        file_size BIGINT,
        metadata JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS olly_audit_log (
        id TEXT PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        action TEXT NOT NULL,
        entity_type TEXT,
        entity_id TEXT,
        changes JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS olly_task_queue (
        id TEXT PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        task_type TEXT NOT NULL,
        payload JSONB NOT NULL,
        status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
        result JSONB,
        error_message TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        started_at TIMESTAMP WITH TIME ZONE,
        completed_at TIMESTAMP WITH TIME ZONE
      );
    `);

    console.log('✅ Tabelas criadas com sucesso');

    // Criar índices para performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_olly_sessions_user ON olly_sessions(user_id);
      CREATE INDEX IF NOT EXISTS idx_olly_sessions_started ON olly_sessions(started_at DESC);
      
      CREATE INDEX IF NOT EXISTS idx_olly_messages_session ON olly_messages(session_id);
      CREATE INDEX IF NOT EXISTS idx_olly_messages_timestamp ON olly_messages(timestamp DESC);
      
      CREATE INDEX IF NOT EXISTS idx_olly_campaigns_user ON olly_campaigns(user_id);
      CREATE INDEX IF NOT EXISTS idx_olly_campaigns_platform ON olly_campaigns(platform);
      CREATE INDEX IF NOT EXISTS idx_olly_campaigns_created ON olly_campaigns(created_at DESC);
      
      CREATE INDEX IF NOT EXISTS idx_olly_analyses_campaign ON olly_analyses(campaign_id);
      CREATE INDEX IF NOT EXISTS idx_olly_analyses_type ON olly_analyses(analysis_type);
      
      CREATE INDEX IF NOT EXISTS idx_olly_optimizations_campaign ON olly_optimizations(campaign_id);
      CREATE INDEX IF NOT EXISTS idx_olly_optimizations_applied ON olly_optimizations(applied);
      
      CREATE INDEX IF NOT EXISTS idx_olly_files_user ON olly_files(user_id);
      CREATE INDEX IF NOT EXISTS idx_olly_files_created ON olly_files(created_at DESC);
      
      CREATE INDEX IF NOT EXISTS idx_olly_audit_user ON olly_audit_log(user_id);
      CREATE INDEX IF NOT EXISTS idx_olly_audit_action ON olly_audit_log(action);
      
      CREATE INDEX IF NOT EXISTS idx_olly_task_user ON olly_task_queue(user_id);
      CREATE INDEX IF NOT EXISTS idx_olly_task_status ON olly_task_queue(status);
    `);

    console.log('✅ Índices criados com sucesso');

    // Criar função para atualizar updated_at automaticamente
    await client.query(`
      CREATE OR REPLACE FUNCTION update_timestamp()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      DROP TRIGGER IF EXISTS update_olly_campaigns_timestamp ON olly_campaigns;
      CREATE TRIGGER update_olly_campaigns_timestamp
      BEFORE UPDATE ON olly_campaigns
      FOR EACH ROW
      EXECUTE FUNCTION update_timestamp();

      DROP TRIGGER IF EXISTS update_olly_user_settings_timestamp ON olly_user_settings;
      CREATE TRIGGER update_olly_user_settings_timestamp
      BEFORE UPDATE ON olly_user_settings
      FOR EACH ROW
      EXECUTE FUNCTION update_timestamp();
    `);

    console.log('✅ Triggers criados com sucesso');

    console.log('\n🎉 ========================================');
    console.log('✅ TABELAS DO OLLY CONFIGURADAS COM SUCESSO!');
    console.log('   ========================================');
    console.log('\n📊 Tabelas criadas:');
    console.log('   • olly_sessions');
    console.log('   • olly_messages');
    console.log('   • olly_campaigns');
    console.log('   • olly_analyses');
    console.log('   • olly_optimizations');
    console.log('   • olly_user_settings');
    console.log('   • olly_files');
    console.log('   • olly_audit_log');
    console.log('   • olly_task_queue');
    console.log('\n⚡ Índices e triggers configurados\n');

  } catch (error) {
    console.error('❌ Erro ao criar tabelas:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

setupOllyDatabase();
