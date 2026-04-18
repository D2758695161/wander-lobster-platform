// ============================================================
// Supabase Edge Function: release-payment
// 从托管释放 USDT 给 winner
// ============================================================

const PLATFORM_WALLET = "TPAPC39xtYjVNj1CQnqftXzJfi7BqCRnaN";
const TRONGRID_API = "https://api.trongrid.io";

interface ReleasePaymentRequest {
  task_id: string;
  winner_id: string;
  amount: number;
  winner_address: string;
}

async function sendTronTransaction(
  toAddress: string,
  amount: number,
  privateKey: string
): Promise<{ success: boolean; tx_hash?: string; error?: string }> {
  // Note: In production, use proper TRON SDK with hot wallet private key
  // This is a placeholder - actual implementation would use @tronweb/modules
  try {
    // Simulate transaction broadcast
    // In production: use TronWeb to sign and broadcast USDT transfer
    const txHash = "0x" + Array.from({ length: 64 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join("");
    
    return { success: true, tx_hash: txHash };
  } catch (error) {
    return { success: false, error: String(error) };
  }
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
    const body: ReleasePaymentRequest = await req.json();
    const { task_id, winner_id, amount, winner_address } = body;

    if (!task_id || !winner_id || !amount || !winner_address) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: task_id, winner_id, amount, winner_address" }),
        { status: 400, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
      );
    }

    // Note: This function requires service role key
    // In production, implement actual USDT transfer using TRON API
    // with platform hot wallet private key (environment variable)
    
    // Placeholder response - actual implementation would:
    // 1. Verify task status is 'completed'
    // 2. Verify caller is task owner
    // 3. Transfer USDT from platform wallet to winner's address
    // 4. Record transaction in database
    
    return new Response(
      JSON.stringify({
        success: true,
        message: "Payment release initiated",
        task_id,
        winner_id,
        amount,
        to_address: winner_address,
        platform_wallet: PLATFORM_WALLET,
        note: "In production, implement actual USDT TRC20 transfer via TronWeb SDK",
        // tx_hash would be populated after actual transaction
        tx_hash: null,
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
