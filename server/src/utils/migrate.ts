import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { Client } from 'pg';
import { createClient } from '@supabase/supabase-js';

// Load variables from .env relative to this file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const runMigrations = async () => {
  const sqlPath = path.resolve(__dirname, '../../../supabase/migrations/001_initial_schema.sql');
  
  if (!fs.existsSync(sqlPath)) {
    console.error(`❌ Migration file not found at: ${sqlPath}`);
    process.exit(1);
  }

  const sqlContent = fs.readFileSync(sqlPath, 'utf-8');
  console.log(`🌱 Found migration script at: ${sqlPath}`);

  const databaseUrl = process.env.DATABASE_URL;
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Approach 1: Direct PostgreSQL Connection
  if (databaseUrl && !databaseUrl.includes('[password]') && !databaseUrl.includes('[project-ref]')) {
    console.log('🔄 Attempting direct PostgreSQL connection migration...');
    let client: Client | null = null;
    try {
      client = new Client({
        connectionString: databaseUrl,
        ssl: {
          rejectUnauthorized: false // Required for Supabase Cloud DB SSL connections
        }
      });
      await client.connect();
      console.log('🔌 Connected to PostgreSQL database.');
      
      // Execute the migration SQL script
      await client.query(sqlContent);
      console.log('✅ Migrations applied successfully via direct database connection!');
      process.exit(0);
    } catch (dbError: any) {
      console.error('❌ Direct PostgreSQL migration failed:', dbError.message);
    } finally {
      if (client) {
        await client.end();
      }
    }
  } else if (databaseUrl) {
    console.log('⚠️ DATABASE_URL contains placeholder values. Skipping direct PostgreSQL connection.');
  }

  // Approach 2: Supabase API with Service Role Key RPC fallback
  if (supabaseUrl && serviceRoleKey) {
    console.log('🔄 Attempting migration via Supabase RPC Client with Service Role Key...');
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false }
    });

    try {
      // Call standard Postgres executor RPC if configured
      const { data, error } = await supabase.rpc('execute_sql', {
        sql_query: sqlContent
      });

      if (error) {
        throw error;
      }

      console.log('✅ Migrations applied successfully via Supabase RPC client!');
      process.exit(0);
    } catch (rpcError: any) {
      console.warn('⚠️ Supabase RPC migration failed:', rpcError.message);
      console.log('\n💡 To apply migrations via Supabase client, you must first create the following helper function in your Supabase SQL Editor:\n');
      console.log(`
create or replace function execute_sql(sql_query text)
returns void language plpgsql security definer as $$
begin
  execute sql_query;
end;
$$;
      `);
      console.log('Alternatively, define the direct PostgreSQL database connection string in your .env:\n');
      console.log('DATABASE_URL=postgres://postgres:[password]@db.[project-ref].supabase.co:6543/postgres\n');
    }
  }

  if (!databaseUrl && (!supabaseUrl || !serviceRoleKey)) {
    console.error('❌ Missing configuration. Please configure either DATABASE_URL or SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in server/.env.');
    process.exit(1);
  }
};

runMigrations();
