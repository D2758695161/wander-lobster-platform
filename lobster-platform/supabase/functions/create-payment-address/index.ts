// ============================================================
// Supabase Edge Function: create-payment-address
// 生成任务托管地址（使用固定平台钱包）
// ============================================================

const PLATFORM_WALLET = "TPAPC39xtYjVNj1CQnqftXzJfi7BqCRnaN";

interface CreatePaymentAddressRequest {
  task_id: string;
  amount?: number;
  currency?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    const body: CreatePaymentAddressRequest = await req.json();
    const { task_id, amount, currency } = body;

    if (!task_id) {
      return new Response(
        JSON.stringify({ error: "task_id is required" }),
        { status: 400, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
      );
    }

    // 使用固定平台钱包地址
    // 在生产环境中，可以使用 TRON API 为每个任务生成唯一地址
    const depositAddress = PLATFORM_WALLET;

    return new Response(
      JSON.stringify({
        success: true,
        address: depositAddress,
        platform_address: PLATFORM_WALLET,
        task_id,
        instructions: {
          network: "TRC20 (Tron)",
          currency: "USDT",
          warning: "请向以下地址转入 USDT (TRC20)：",
          amount_note: amount ? `建议转入 ${amount} USDT` : "请转入任务预算对应的 USDT 金额",
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Internal server error", details: String(error) }),
      { status: 500, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
    );
  }
});
