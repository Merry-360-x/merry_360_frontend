#!/usr/bin/env node

/**
 * ADMIN ACCOUNT CREATOR
 * Creates admin account in Supabase
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import readline from 'readline';

// Colors
const green = '\x1b[32m';
const red = '\x1b[31m';
const yellow = '\x1b[33m';
const blue = '\x1b[34m';
const cyan = '\x1b[36m';
const bold = '\x1b[1m';
const reset = '\x1b[0m';

// Load environment
const envContent = readFileSync('.env', 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
    const [key, ...values] = trimmed.split('=');
    env[key.trim()] = values.join('=').trim();
  }
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

console.log('\n' + '╔' + '═'.repeat(68) + '╗');
console.log('║' + ' '.repeat(20) + `${bold}${cyan}ADMIN ACCOUNT CREATOR${reset}` + ' '.repeat(25) + '║');
console.log('╚' + '═'.repeat(68) + '╝\n');

console.log(`${blue}This will create an admin account for MERRY360X.${reset}\n`);
console.log(`${yellow}Admin emails configured in system:${reset}`);
console.log(`  • admin@merry360x.com`);
console.log(`  • bebisdavy@gmail.com\n`);

async function createAdmin() {
  try {
    // Get admin details
    const email = await question(`${cyan}Admin Email${reset} (press Enter for bebisdavy@gmail.com): `);
    const adminEmail = email.trim() || 'bebisdavy@gmail.com';

    const password = await question(`${cyan}Admin Password${reset} (min 8 characters): `);
    
    if (password.length < 8) {
      console.log(`\n${red}❌ Password must be at least 8 characters${reset}\n`);
      rl.close();
      return;
    }

    const firstName = await question(`${cyan}First Name${reset}: `);
    const lastName = await question(`${cyan}Last Name${reset}: `);

    console.log(`\n${yellow}Creating admin account...${reset}\n`);

    // Create account
    const { data, error } = await supabase.auth.signUp({
      email: adminEmail,
      password: password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          role: 'admin'
        }
      }
    });

    if (error) {
      if (error.message.includes('already registered')) {
        console.log(`${yellow}⚠️  Account already exists. Trying to sign in...${reset}\n`);
        
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: adminEmail,
          password: password,
        });

        if (signInError) {
          console.log(`${red}❌ Sign in failed: ${signInError.message}${reset}`);
          console.log(`\n${yellow}The account exists but password is different.${reset}`);
          console.log(`${yellow}Please use the password reset feature or contact support.${reset}\n`);
        } else {
          console.log(`${green}✅ Successfully signed in!${reset}\n`);
          console.log(`${bold}Admin Account Details:${reset}`);
          console.log(`  Email: ${adminEmail}`);
          console.log(`  User ID: ${signInData.user.id}`);
          console.log(`  Role: Admin\n`);
          
          console.log(`${green}${bold}You can now log in with these credentials!${reset}\n`);
        }
      } else {
        throw error;
      }
    } else {
      console.log(`${green}${bold}╔═══════════════════════════════════════════════════════════╗${reset}`);
      console.log(`${green}${bold}║                                                           ║${reset}`);
      console.log(`${green}${bold}║  ✅ ADMIN ACCOUNT CREATED SUCCESSFULLY! ✅               ║${reset}`);
      console.log(`${green}${bold}║                                                           ║${reset}`);
      console.log(`${green}${bold}╚═══════════════════════════════════════════════════════════╝${reset}\n`);

      console.log(`${bold}Account Details:${reset}`);
      console.log(`  Email: ${adminEmail}`);
      console.log(`  User ID: ${data.user?.id}`);
      console.log(`  Name: ${firstName} ${lastName}`);
      console.log(`  Role: Admin\n`);

      console.log(`${cyan}${bold}Admin Privileges:${reset}`);
      console.log(`  ✅ Access to AI Advisor admin controls`);
      console.log(`  ✅ 3 clearance levels (Support Agent, Manager, Administrator)`);
      console.log(`  ✅ Can interrupt AI conversations`);
      console.log(`  ✅ Real-time Supabase data access\n`);

      console.log(`${yellow}Note: If email confirmation is required, check your inbox.${reset}\n`);

      console.log(`${bold}Login URLs:${reset}`);
      console.log(`  Local: http://localhost:5174/`);
      console.log(`  Production: https://merry-360-frontend-2bzu70ix6-das-48ca2629.vercel.app\n`);

      console.log(`${green}You can now log in with your admin credentials!${reset}\n`);
    }

  } catch (error) {
    console.log(`\n${red}❌ Error: ${error.message}${reset}\n`);
    console.log(`${yellow}Possible solutions:${reset}`);
    console.log(`  1. Check Supabase Auth is enabled`);
    console.log(`  2. Disable email confirmation in Supabase settings`);
    console.log(`  3. Check .env has correct Supabase credentials\n`);
  } finally {
    rl.close();
  }
}

createAdmin();
