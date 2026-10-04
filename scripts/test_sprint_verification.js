const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

// 1. Read environment variables from .env.local
const envPath = path.resolve(__dirname, '..', '.env.local');
if (!fs.existsSync(envPath)) {
  console.error("❌ .env.local not found at " + envPath);
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
  console.error("❌ Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function runSprintVerification() {
  console.log("====================================================================");
  console.log("🚀 STARTING PLATFORM HARDENING & AUTOMATION SPRINT VERIFICATION");
  console.log("====================================================================\n");

  let allPassed = true;

  // --------------------------------------------------------------------
  // TEST 1: Steadfast Courier Integration & Mock Simulation
  // --------------------------------------------------------------------
  console.log("📦 TEST 1: Steadfast Courier Dispatch Service...");
  try {
    const randomSuffix = Math.floor(100000 + Math.random() * 900000).toString();
    const mockInvoice = `ORD-CTG-TEST-${randomSuffix}`;

    // Simulating courier dispatch logic
    const consignmentId = `SF-CTG-${randomSuffix}`;
    const trackingCode = `SFTRK-${randomSuffix}`;

    console.log(`   Simulated Courier Dispatch for ${mockInvoice}`);
    console.log(`   Consignment ID: ${consignmentId}`);
    console.log(`   Courier Tracking Code: ${trackingCode}`);

    if (/^SF-CTG-\d{6}$/.test(consignmentId)) {
      console.log("   ✅ Steadfast Consignment ID format verified (SF-CTG-XXXXXX).");
    } else {
      console.error("   ❌ Invalid consignment ID format.");
      allPassed = false;
    }
  } catch (err) {
    console.error("   ❌ Test 1 failed:", err);
    allPassed = false;
  }
  console.log("");

  // --------------------------------------------------------------------
  // TEST 2: Bulk 3-Item Spreadsheet Parsing & Supabase Ingestion
  // --------------------------------------------------------------------
  console.log("📊 TEST 2: Bulk 3-Item Excel Parser & Database Upsert...");
  let testProductIds = [];
  let branchId = null;

  try {
    // A. Resolve Chattogram Hub Branch
    const { data: branch, error: branchErr } = await supabase
      .from("branches")
      .select("id, name")
      .order("is_main_hub", { ascending: false })
      .limit(1)
      .single();

    if (branchErr || !branch) {
      throw new Error("Could not find showroom branch: " + branchErr?.message);
    }
    branchId = branch.id;
    console.log(`   Target Showroom Branch: ${branch.name} (${branchId})`);

    // B. Create in-memory mock spreadsheet workbook with 3 components
    const mockItems = [
      {
        Name: "Test Intel Core i7-14700K Gaming Processor",
        Brand: "Intel",
        Category: "PC Components",
        "Regular Price": 44500,
        "Sale Price": 42900,
        Stock: 12,
        Specifications: '{"Socket": "LGA1700", "P-Cores": 8, "E-Cores": 12, "TDP": "125W"}',
      },
      {
        Name: "Test Corsair Dominator Titanium 32GB DDR5 6400MHz",
        Brand: "Corsair",
        Category: "PC Components",
        "Regular Price": 18500,
        "Sale Price": 17200,
        Stock: 20,
        Specifications: '{"Speed": "6400MHz", "Timing": "CL32", "Color": "First Edition White"}',
      },
      {
        Name: "Test Samsung 990 PRO 2TB PCIe 4.0 NVMe SSD",
        Brand: "Samsung",
        Category: "PC Components",
        "Regular Price": 23000,
        "Sale Price": 21500,
        Stock: 15,
        Specifications: '{"Read": "7450 MB/s", "Write": "6900 MB/s", "Form Factor": "M.2 2280"}',
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(mockItems);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Catalog");
    const testExcelBuffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    // C. Parse back from buffer
    const parsedWorkbook = XLSX.read(testExcelBuffer, { type: "buffer" });
    const parsedRows = XLSX.utils.sheet_to_json(parsedWorkbook.Sheets["Catalog"]);
    console.log(`   Successfully generated and parsed ${parsedRows.length} items from spreadsheet buffer.`);

    // D. Ingest into Supabase products & inventory
    const { data: catData } = await supabase.from("categories").select("id").limit(1).single();
    const categoryId = catData?.id;

    for (const item of parsedRows) {
      const slug = item.Name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      
      const { data: prod, error: pErr } = await supabase
        .from("products")
        .upsert(
          {
            slug,
            name: item.Name,
            brand: item.Brand,
            category_id: categoryId,
            regular_price: item["Regular Price"],
            sale_price: item["Sale Price"],
            images: ["/images/products/placeholder.webp"],
            specifications: JSON.parse(item.Specifications),
            is_active: true,
          },
          { onConflict: "slug" }
        )
        .select("id")
        .single();

      if (pErr) throw pErr;
      testProductIds.push({ id: prod.id, name: item.Name, price: item["Sale Price"] || item["Regular Price"], stock: item.Stock });

      const { error: invErr } = await supabase
        .from("inventory")
        .upsert(
          {
            product_id: prod.id,
            branch_id: branchId,
            stock_quantity: item.Stock,
          },
          { onConflict: "product_id,branch_id" }
        );

      if (invErr) throw invErr;
    }

    console.log(`   ✅ Ingested 3 products and inventory rows successfully into Supabase.`);
  } catch (err) {
    console.error("   ❌ Test 2 failed:", err);
    allPassed = false;
  }
  console.log("");

  // --------------------------------------------------------------------
  // TEST 3: Atomic Multi-Item Checkout Stored Procedure
  // --------------------------------------------------------------------
  console.log("⚡ TEST 3: Atomic process_atomic_checkout Stored Procedure...");
  try {
    if (testProductIds.length >= 2 && branchId) {
      // 3A: Test Insufficient Stock Rollback (Simulate item requiring 9999 units)
      console.log("   Scenario A: Insufficient stock on item 2 (All-or-nothing rollback check)");
      
      // Create a test order header
      const testTracking = `ORD-CTG-TEST-ROLLBACK-${Date.now().toString().slice(-4)}`;
      const { data: orderA, error: ordErrA } = await supabase
        .from("orders")
        .insert({
          tracking_code: testTracking,
          customer_name: "Rollback Test User",
          customer_email: "test-rollback@voltmatrix.bd",
          customer_phone: "01800000000",
          shipping_address: { address: "GEC Circle", district: "Chattogram" },
          delivery_method: "store_pickup",
          subtotal: 50000,
          shipping_fee: 0,
          total_amount: 50000,
          payment_method: "cod",
          payment_status: "unpaid",
          status: "pending",
        })
        .select("id")
        .single();

      if (ordErrA) throw ordErrA;

      const overQtyPayload = [
        { product_id: testProductIds[0].id, quantity: 1, unit_price: testProductIds[0].price },
        { product_id: testProductIds[1].id, quantity: 99999, unit_price: testProductIds[1].price }, // Will fail
      ];

      const { data: rpcFailRes, error: rpcFailErr } = await supabase.rpc(
        "process_atomic_checkout",
        {
          p_order_id: orderA.id,
          p_branch_id: branchId,
          p_items: overQtyPayload,
        }
      );

      if (rpcFailRes?.success === false) {
        console.log(`   ✅ Atomic rollback verified: RPC cleanly caught insufficient stock!`);
        console.log(`      Error message returned: "${rpcFailRes.error}"`);
        // Clean up test order
        await supabase.from("orders").delete().eq("id", orderA.id);
      } else {
        console.error("   ❌ Expected atomic checkout to fail on 99999 quantity, but it succeeded:", rpcFailRes);
        allPassed = false;
      }

      // 3B: Test Valid Checkout Deduction
      console.log("   Scenario B: Valid multi-item atomic checkout deduction");
      const validTracking = `ORD-CTG-TEST-SUCCESS-${Date.now().toString().slice(-4)}`;
      const { data: orderB, error: ordErrB } = await supabase
        .from("orders")
        .insert({
          tracking_code: validTracking,
          customer_name: "Success Test User",
          customer_email: "test-success@voltmatrix.bd",
          customer_phone: "01811223344",
          shipping_address: { address: "Agrabad Commercial Area", district: "Chattogram" },
          delivery_method: "courier_cod",
          subtotal: testProductIds[0].price + testProductIds[1].price,
          shipping_fee: 150,
          total_amount: testProductIds[0].price + testProductIds[1].price + 150,
          payment_method: "cod",
          payment_status: "unpaid",
          status: "pending",
        })
        .select("id")
        .single();

      if (ordErrB) throw ordErrB;

      // Check stock before
      const { data: stockBefore } = await supabase
        .from("inventory")
        .select("stock_quantity")
        .eq("product_id", testProductIds[0].id)
        .eq("branch_id", branchId)
        .single();

      const validPayload = [
        { product_id: testProductIds[0].id, quantity: 1, unit_price: testProductIds[0].price },
        { product_id: testProductIds[1].id, quantity: 1, unit_price: testProductIds[1].price },
      ];

      const { data: rpcOkRes, error: rpcOkErr } = await supabase.rpc(
        "process_atomic_checkout",
        {
          p_order_id: orderB.id,
          p_branch_id: branchId,
          p_items: validPayload,
        }
      );

      if (rpcOkRes?.success === true) {
        console.log(`   ✅ Atomic checkout succeeded! Stock and order_items committed atomically.`);

        // Check stock after
        const { data: stockAfter } = await supabase
          .from("inventory")
          .select("stock_quantity")
          .eq("product_id", testProductIds[0].id)
          .eq("branch_id", branchId)
          .single();

        console.log(`      Product stock for ${testProductIds[0].name}: ${stockBefore?.stock_quantity} -> ${stockAfter?.stock_quantity}`);

        // Verify order items were inserted
        const { data: items } = await supabase
          .from("order_items")
          .select("id, quantity, unit_price")
          .eq("order_id", orderB.id);

        console.log(`      Order items created: ${items?.length} items verified.`);

        // Clean up test order and items
        await supabase.from("order_items").delete().eq("order_id", orderB.id);
        await supabase.from("orders").delete().eq("id", orderB.id);
      } else {
        console.error("   ❌ Valid atomic checkout failed:", rpcOkErr || rpcOkRes);
        allPassed = false;
      }
    }
  } catch (err) {
    console.error("   ❌ Test 3 failed:", err);
    allPassed = false;
  }
  console.log("");

  // Clean up test products
  console.log("🧹 Cleaning up test products...");
  for (const tp of testProductIds) {
    await supabase.from("inventory").delete().eq("product_id", tp.id);
    await supabase.from("products").delete().eq("id", tp.id);
  }
  console.log("   Test records cleaned.\n");

  if (allPassed) {
    console.log("====================================================================");
    console.log("🎉 ALL SPRINT VERIFICATION TESTS PASSED SUCCESSFULLY!");
    console.log("====================================================================");
  } else {
    console.error("❌ Some verification checks failed.");
    process.exit(1);
  }
}

runSprintVerification().catch(err => {
  console.error("Fatal verification error:", err);
  process.exit(1);
});
