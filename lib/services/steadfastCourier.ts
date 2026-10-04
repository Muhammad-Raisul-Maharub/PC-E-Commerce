/**
 * Steadfast Courier API Integration Service
 * Base URL: https://portal.steadfast.com.bd/api/v1 (or https://portal.packzy.com/api/v1)
 *
 * Pluggable & Modular Architecture:
 * - Real API: Authenticates using Api-Key & Secret-Key headers.
 * - Realistic Mock Fallback: When STEADFAST_API_KEY is not defined, simulates
 *   instant consignment generation with realistic IDs (SF-CTG-XXXXXX) for testing.
 */

export interface SteadfastOrderPayload {
  invoice: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_address: string;
  cod_amount: number;
  note?: string;
}

export interface CourierDispatchResult {
  success: boolean;
  provider: "steadfast" | "mock";
  consignment_id: string;
  tracking_code: string;
  status: string;
  message?: string;
  isMock: boolean;
  raw?: unknown;
}

/**
 * Creates an automated shipment consignment with Steadfast Courier.
 * If API keys are absent, cleanly falls back to simulated dispatch.
 */
export async function createSteadfastConsignment(
  orderData: SteadfastOrderPayload
): Promise<CourierDispatchResult> {
  const apiKey = process.env.STEADFAST_API_KEY || process.env.NEXT_PUBLIC_STEADFAST_API_KEY;
  const secretKey = process.env.STEADFAST_SECRET_KEY || process.env.NEXT_PUBLIC_STEADFAST_SECRET_KEY;
  const baseUrl = process.env.STEADFAST_BASE_URL || "https://portal.steadfast.com.bd/api/v1";

  // Check if live API keys are provided
  if (!apiKey || !secretKey) {
    console.log(
      `[Courier Service: Mock Mode] STEADFAST_API_KEY not configured. Simulating dispatch for invoice: ${orderData.invoice}`
    );

    const randomSuffix = Math.floor(100000 + Math.random() * 900000).toString();
    const mockConsignmentId = `SF-CTG-${randomSuffix}`;
    const mockTrackingCode = `SFTRK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    return {
      success: true,
      provider: "mock",
      consignment_id: mockConsignmentId,
      tracking_code: mockTrackingCode,
      status: "in_review",
      message: "Order booked successfully via Steadfast Courier (Simulated Sandbox).",
      isMock: true,
      raw: {
        invoice: orderData.invoice,
        recipient_name: orderData.recipient_name,
        cod_amount: orderData.cod_amount,
        simulated_at: new Date().toISOString(),
      },
    };
  }

  try {
    const endpoint = `${baseUrl}/create_order`;

    const bodyPayload = {
      invoice: orderData.invoice,
      recipient_name: orderData.recipient_name,
      recipient_phone: orderData.recipient_phone,
      recipient_address: orderData.recipient_address,
      cod_amount: Math.round(orderData.cod_amount),
      note: orderData.note || "Fragile computer component. Handle with care.",
    };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Api-Key": apiKey,
        "Secret-Key": secretKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyPayload),
    });

    const data = await response.json();

    if (!response.ok || data.status !== 200) {
      console.error("[Steadfast Courier API Error]", data);
      return {
        success: false,
        provider: "steadfast",
        consignment_id: "",
        tracking_code: "",
        status: "failed",
        message: data?.message || `Courier API responded with status ${response.status}`,
        isMock: false,
        raw: data,
      };
    }

    const consignment = data.consignment || {};

    return {
      success: true,
      provider: "steadfast",
      consignment_id: String(consignment.consignment_id || `SF-${Date.now()}`),
      tracking_code: String(consignment.tracking_code || consignment.invoice || orderData.invoice),
      status: String(consignment.status || "booked"),
      message: data.message || "Order consignment created successfully on Steadfast portal.",
      isMock: false,
      raw: data,
    };
  } catch (err: unknown) {
    console.error("[Steadfast Courier Network Exception]", err);
    return {
      success: false,
      provider: "steadfast",
      consignment_id: "",
      tracking_code: "",
      status: "error",
      message: err instanceof Error ? err.message : "Network error contacting Steadfast API",
      isMock: false,
    };
  }
}
