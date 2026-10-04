import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";

export interface OrderReceiptItem {
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderReceiptData {
  customerName: string;
  customerEmail: string;
  trackingCode: string;
  deliveryMethod: "store_pickup" | "courier_cod" | string;
  totalAmount: number;
  subtotal: number;
  shippingFee: number;
  items: OrderReceiptItem[];
  shippingAddress?: {
    district?: string;
    thana?: string;
    address?: string;
  };
  pickupBranchName?: string;
  paymentMethod?: string;
}

export interface EmailDispatchResult {
  success: boolean;
  mock?: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Initializes Resend client if API key is configured.
 */
function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey.trim() === "" || apiKey === "re_your_api_key_here") {
    return null;
  }
  return new Resend(apiKey);
}

/**
 * Generates responsive, high-performance HTML receipt for customer orders.
 */
function buildReceiptHtml(data: OrderReceiptData, trackingUrl: string): string {
  const fulfillmentTitle =
    data.deliveryMethod === "store_pickup"
      ? "Chattogram Flagship Showroom Pickup"
      : "Standard Courier Delivery (Cash on Delivery)";

  const fulfillmentLocation =
    data.deliveryMethod === "store_pickup"
      ? data.pickupBranchName || "Chattogram Main Hub (GEC Circle / Agrabad Area)"
      : `${data.shippingAddress?.address || ""}, ${data.shippingAddress?.thana || ""}, ${data.shippingAddress?.district || "Bangladesh"}`;

  const itemsHtml = data.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #1e293b; color: #f8fafc; font-size: 13px; font-weight: 600;">
          ${item.name}
        </td>
        <td style="padding: 12px 8px; border-bottom: 1px solid #1e293b; color: #94a3b8; font-size: 13px; text-align: center; font-family: monospace;">
          x${item.quantity}
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #1e293b; color: #f8fafc; font-size: 13px; text-align: right; font-family: monospace; font-weight: bold;">
          ৳${(item.unitPrice * item.quantity).toLocaleString()}
        </td>
      </tr>`
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation - ${data.trackingCode}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #020617; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #020617; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #0f172a; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);">
          <!-- Header Banner -->
          <tr>
            <td style="padding: 32px 32px 24px; background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%); border-bottom: 1px solid #1e293b;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="display: inline-block; font-size: 18px; font-weight: 900; letter-spacing: 0.05em; color: #ffffff;">
                      VOLT<span style="color: #ef4444;">MATRIX</span>
                    </span>
                    <span style="display: block; font-family: monospace; font-size: 10px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 4px;">
                      High-Performance Hardware Foundry • Chattogram Hub
                    </span>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; background-color: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.3); color: #f87171; font-family: monospace; font-size: 11px; font-weight: bold; padding: 4px 10px; rounded-radius: 9999px; border-radius: 20px;">
                      CONFIRMED
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Confirmation Intro -->
          <tr>
            <td style="padding: 28px 32px 16px;">
              <h1 style="margin: 0 0 8px; font-size: 20px; font-weight: 800; color: #ffffff;">
                Order Confirmation &amp; Consignment Receipt
              </h1>
              <p style="margin: 0; font-size: 13px; color: #94a3b8; line-height: 1.5;">
                Hello <strong style="color: #f8fafc;">${data.customerName}</strong>, your consignment has been successfully logged into our Chattogram central dispatch pipeline.
              </p>
            </td>
          </tr>

          <!-- Tracking Pill Card -->
          <tr>
            <td style="padding: 0 32px 24px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #1e293b; border-radius: 12px; padding: 16px 20px;">
                <tr>
                  <td>
                    <span style="font-family: monospace; font-size: 10px; text-transform: uppercase; color: #64748b; letter-spacing: 0.08em; display: block;">
                      Consignment Tracking Code
                    </span>
                    <span style="font-family: monospace; font-size: 18px; font-weight: 900; color: #38bdf8; letter-spacing: 0.05em;">
                      ${data.trackingCode}
                    </span>
                  </td>
                  <td align="right">
                    <a href="${trackingUrl}" style="display: inline-block; background-color: #ef4444; color: #ffffff; text-decoration: none; font-size: 12px; font-weight: bold; padding: 10px 18px; border-radius: 8px; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.35);">
                      Track Order Live &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Items Spec Table -->
          <tr>
            <td style="padding: 0 32px 24px;">
              <span style="font-family: monospace; font-size: 11px; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.08em; font-weight: bold; display: block; margin-bottom: 10px;">
                Itemized Component Specifications
              </span>
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                <thead>
                  <tr style="border-bottom: 2px solid #334155;">
                    <th align="left" style="padding-bottom: 8px; font-size: 10px; font-family: monospace; color: #64748b; text-transform: uppercase;">Hardware Component</th>
                    <th align="center" style="padding-bottom: 8px; font-size: 10px; font-family: monospace; color: #64748b; text-transform: uppercase;">Qty</th>
                    <th align="right" style="padding-bottom: 8px; font-size: 10px; font-family: monospace; color: #64748b; text-transform: uppercase;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Financial Calculation Breakdown -->
          <tr>
            <td style="padding: 0 32px 28px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #020617; border: 1px solid #1e293b; border-radius: 12px; padding: 16px 20px;">
                <tr>
                  <td style="font-size: 12px; color: #94a3b8; padding: 4px 0;">Subtotal</td>
                  <td align="right" style="font-size: 12px; font-family: monospace; color: #f8fafc; font-weight: bold; padding: 4px 0;">৳${data.subtotal.toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="font-size: 12px; color: #94a3b8; padding: 4px 0;">Delivery Fee</td>
                  <td align="right" style="font-size: 12px; font-family: monospace; color: #f8fafc; font-weight: bold; padding: 4px 0;">
                    ${data.shippingFee === 0 ? '<span style="color: #34d399;">Free (Showroom Pickup)</span>' : `৳${data.shippingFee.toLocaleString()}`}
                  </td>
                </tr>
                <tr style="border-top: 1px solid #1e293b;">
                  <td style="font-size: 14px; font-weight: 800; color: #ffffff; padding: 10px 0 0;">Total (BDT)</td>
                  <td align="right" style="font-size: 16px; font-family: monospace; font-weight: 900; color: #ef4444; padding: 10px 0 0;">
                    ৳${data.totalAmount.toLocaleString()}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Fulfillment & Showroom Details -->
          <tr>
            <td style="padding: 0 32px 32px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-top: 1px solid #1e293b; padding-top: 20px;">
                <tr>
                  <td>
                    <span style="font-family: monospace; font-size: 10px; color: #64748b; text-transform: uppercase; font-weight: bold; display: block; margin-bottom: 4px;">
                      Fulfillment Mode
                    </span>
                    <span style="font-size: 12px; font-weight: bold; color: #f8fafc; display: block; margin-bottom: 2px;">
                      ${fulfillmentTitle}
                    </span>
                    <span style="font-size: 11px; color: #94a3b8; display: block; line-height: 1.4;">
                      ${fulfillmentLocation}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer & Hotline -->
          <tr>
            <td style="padding: 24px 32px; background-color: #020617; border-top: 1px solid #1e293b; text-align: center;">
              <p style="margin: 0 0 6px; font-size: 11px; color: #64748b; font-family: monospace;">
                Chattogram Central Tech Hub • Support Hotline: <strong style="color: #cbd5e1;">+880 1800-000000</strong>
              </p>
              <p style="margin: 0; font-size: 10px; color: #475569;">
                VoltMatrix Commerce • GEC Circle / Agrabad Commercial Area, Chattogram, Bangladesh
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Sends a transactional order confirmation receipt to the customer.
 * Uses Resend when API key is present; falls back to structured console telemetry in dev.
 */
export async function sendOrderReceiptEmail(
  orderData: OrderReceiptData
): Promise<EmailDispatchResult> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const trackingUrl = `${siteUrl.replace(/\/$/, "")}/track-order?code=${encodeURIComponent(
    orderData.trackingCode
  )}`;

  const resend = getResendClient();

  if (!resend) {
    // Graceful Mock Fallback: Log detailed receipt to server stdout
    console.log("====================================================================");
    console.log("📧 [TRANSACTIONAL EMAIL DISPATCHER - DEV FALLBACK MOCK]");
    console.log(`To:          ${orderData.customerName} <${orderData.customerEmail}>`);
    console.log(`Tracking:    ${orderData.trackingCode}`);
    console.log(`Fulfillment: ${orderData.deliveryMethod}`);
    console.log(`Total:       ৳${orderData.totalAmount.toLocaleString()} BDT`);
    console.log(`Items:       ${orderData.items.map((i) => `${i.name} (x${i.quantity})`).join(", ")}`);
    console.log(`Track Link:  ${trackingUrl}`);
    console.log("Status:      Simulated 200 OK (RESEND_API_KEY not configured in .env.local)");
    console.log("====================================================================");

    return {
      success: true,
      mock: true,
      messageId: `mock_${Date.now()}_${orderData.trackingCode}`,
    };
  }

  try {
    const fromAddress =
      process.env.RESEND_FROM_EMAIL || "VoltMatrix Hardware <orders@resend.dev>";

    const htmlContent = buildReceiptHtml(orderData, trackingUrl);

    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: [orderData.customerEmail],
      subject: `Order Confirmed: ${orderData.trackingCode} - VoltMatrix Chattogram Hub`,
      html: htmlContent,
    });

    if (error) {
      console.error("Resend API delivery error:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    console.log(`✅ [EMAIL DISPATCHER] Receipt sent to ${orderData.customerEmail} (ID: ${data?.id})`);
    return {
      success: true,
      messageId: data?.id,
    };
  } catch (err: unknown) {
    console.error("Unexpected error in sendOrderReceiptEmail:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to dispatch email",
    };
  }
}

/**
 * Subscribes a user email into public.newsletter_subscribers.
 */
export async function subscribeNewsletter(
  email: string
): Promise<{ success: boolean; message: string }> {
  const normalized = (email || "").trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!normalized || !emailRegex.test(normalized)) {
    return {
      success: false,
      message: "Please provide a valid email address.",
    };
  }

  try {
    const admin = createAdminClient();

    const { error } = await admin
      .from("newsletter_subscribers")
      .upsert(
        {
          email: normalized,
          is_active: true,
          subscribed_at: new Date().toISOString(),
        },
        { onConflict: "email" }
      );

    if (error) {
      console.error("Error subscribing to newsletter:", error);
      return {
        success: false,
        message: error.message || "Failed to subscribe to newsletter.",
      };
    }

    return {
      success: true,
      message: "You have successfully subscribed to VoltMatrix hardware updates.",
    };
  } catch (err: unknown) {
    console.error("Newsletter subscription exception:", err);
    return {
      success: false,
      message: err instanceof Error ? err.message : "An unexpected error occurred.",
    };
  }
}
