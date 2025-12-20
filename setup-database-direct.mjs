import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function setupDatabase() {
  console.log('🔧 Setting up Merry360X database...\n');

  // Read the SQL file
  const sql = fs.readFileSync('COMPLETE_DATABASE_SETUP.sql', 'utf8');

  // Split into individual statements (rough split by semicolons)
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  console.log(`📝 Found ${statements.length} SQL statements to execute\n`);

  let successCount = 0;
  let errorCount = 0;

  // Execute each statement
  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i] + ';';
    
    // Skip comments and DO blocks (they won't work via RPC)
    if (statement.includes('RAISE NOTICE') || statement.includes('DO $$')) {
      continue;
    }

    try {
      const { data, error } = await supabase.rpc('exec_sql', { sql_query: statement });
      
      if (error) {
        console.log(`❌ Statement ${i + 1} failed:`, error.message);
        errorCount++;
      } else {
        successCount++;
        if ((i + 1) % 10 === 0) {
          console.log(`✅ Executed ${i + 1}/${statements.length} statements...`);
        }
      }
    } catch (err) {
      console.log(`❌ Error on statement ${i + 1}:`, err.message);
      errorCount++;
    }
  }

  console.log(`\n================================================`);
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${errorCount}`);
  console.log(`================================================\n`);

  // Verify tables exist
  console.log('🔍 Verifying tables...\n');
  
  const tables = ['profiles', 'properties', 'tours', 'transport_services', 'bookings', 'stories'];
  
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    
    if (error) {
      console.log(`❌ ${table}: NOT ACCESSIBLE (${error.message})`);
    } else {
      console.log(`✅ ${table}: Exists and accessible`);
    }
  }

  console.log('\n✅ Database setup complete!\n');
}

setupDatabase().catch(console.error);
