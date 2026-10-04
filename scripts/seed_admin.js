const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// 1. Read environment variables from .env.local
const envPath = path.resolve(__dirname, '..', '.env.local');
if (!fs.existsSync(envPath)) {
  console.error("❌ .env.local file not found at " + envPath);
  process.exit(1);
}

const envFile = fs.readFileSync(envPath, 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [k, ...v] = trimmed.split('=');
    if (k && v.length) env[k.trim()] = v.join('=').trim();
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

// 2. Initialize Supabase Admin client with service_role privileges
const supabase = createClient(supabaseUrl, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const ADMIN_EMAIL = 'admin@test.com';
const ADMIN_PASSWORD = 'AdminPassword123!';
const ADMIN_FULL_NAME = 'VoltMatrix Chief Administrator';

async function seedAdmin() {
  console.log("==================================================");
  console.log("🚀 Starting One-Time Backend Admin Seed Script");
  console.log(`📡 Connecting to Supabase: ${supabaseUrl}`);
  console.log("==================================================");

  let userId = null;

  // Step 1: Check if admin user already exists in auth.users
  const { data: userList, error: listErr } = await supabase.auth.admin.listUsers();
  if (listErr) {
    console.error("❌ Error listing users:", listErr.message);
    process.exit(1);
  }

  const existingUser = userList.users.find(u => u.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase());

  if (existingUser) {
    console.log(`ℹ️ User ${ADMIN_EMAIL} already exists (ID: ${existingUser.id}). Updating credentials...`);
    userId = existingUser.id;

    // Update password and ensure email_confirm is true
    const { data: updatedUser, error: updateErr } = await supabase.auth.admin.updateUserById(userId, {
      password: ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: {
        full_name: ADMIN_FULL_NAME,
        role: 'admin'
      }
    });

    if (updateErr) {
      console.error("❌ Failed to update auth user:", updateErr.message);
      process.exit(1);
    }
    console.log("✅ Auth user updated with email_confirm: true and new password.");
  } else {
    console.log(`➕ Creating auth user for ${ADMIN_EMAIL}...`);
    const { data: created, error: createErr } = await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: {
        full_name: ADMIN_FULL_NAME,
        role: 'admin'
      }
    });

    if (createErr) {
      console.error("❌ Failed to create auth user:", createErr.message);
      process.exit(1);
    }

    userId = created.user.id;
    console.log(`✅ Auth user created successfully (ID: ${userId}) with email_confirm: true.`);
  }

  // Step 2: Ensure public.profiles has role = 'admin'
  console.log("🔄 Ensuring public.profiles row exists with role = 'admin'...");

  // First check if profile row was automatically populated by auth trigger
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (existingProfile) {
    console.log("ℹ️ Found existing profile in public.profiles. Updating role to 'admin'...");
    const { error: pUpdateErr } = await supabase
      .from('profiles')
      .update({
        role: 'admin',
        full_name: ADMIN_FULL_NAME,
        email: ADMIN_EMAIL,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (pUpdateErr) {
      console.error("❌ Error updating profile:", pUpdateErr.message);
      process.exit(1);
    }
  } else {
    console.log("ℹ️ Inserting new profile into public.profiles with role = 'admin'...");
    const { error: pInsertErr } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email: ADMIN_EMAIL,
        full_name: ADMIN_FULL_NAME,
        role: 'admin',
        preferences: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (pInsertErr) {
      console.error("❌ Error inserting profile:", pInsertErr.message);
      process.exit(1);
    }
  }

  // Step 3: Verify that account exists in public.profiles and has role = 'admin'
  console.log("🔍 Verifying verified account in public.profiles...");
  const { data: verifiedProfile, error: verifyErr } = await supabase
    .from('profiles')
    .select('id, email, full_name, role, created_at, updated_at')
    .eq('id', userId)
    .single();

  if (verifyErr || !verifiedProfile) {
    console.error("❌ Verification failed:", verifyErr?.message || "Profile not found");
    process.exit(1);
  }

  if (verifiedProfile.role !== 'admin') {
    console.error(`❌ Role verification failed! Expected 'admin', found '${verifiedProfile.role}'`);
    process.exit(1);
  }

  // Also seed a few catalog products from HARDWARE_PRODUCTS so admin product list has real UUID rows to edit
  console.log("📦 Checking Supabase products table...");
  const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
  if (productCount === 0 || productCount === null) {
    console.log("🌱 Seeding initial products for real-time testing...");
    const initialSeed = [
      {
        slug: 'amd-ryzen-7-7800x3d',
        name: 'AMD Ryzen 7 7800X3D Gaming Processor',
        brand: 'AMD',
        regular_price: 52000,
        sale_price: 49500,
        images: ['https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&auto=format&fit=crop&q=80'],
        specifications: { socket: 'AM5', tdp: '120W' }
      },
      {
        slug: 'asus-rog-strix-rtx4080-super',
        name: 'ASUS ROG Strix GeForce RTX 4080 SUPER OC 16GB',
        brand: 'ASUS',
        regular_price: 155000,
        sale_price: 148000,
        images: ['https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80'],
        specifications: { vram: '16GB GDDR6X', tdp: '320W' }
      }
    ];

    for (const item of initialSeed) {
      await supabase.from('products').upsert(item, { onConflict: 'slug' });
    }
  }

  console.log("==================================================");
  console.log("🎉 SUCCESS! Verified Test Admin Account Ready");
  console.log("==================================================");
  console.log(`📧 Email:    ${verifiedProfile.email}`);
  console.log(`🔑 Password: ${ADMIN_PASSWORD}`);
  console.log(`🛡️ Role:     ${verifiedProfile.role}`);
  console.log(`🆔 User ID:  ${verifiedProfile.id}`);
  console.log("==================================================");
  console.log("You can now log in at: http://localhost:3000/auth/login");
  console.log("==================================================");
}

seedAdmin().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
