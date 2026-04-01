// ============================================================
// Supabase Edge Function: verify-payment
// 验证 USDT 托管充值
// ============================================================

const PLATFORM_WALLET = "TPAPC39xtYjVNj1CQnqftXzJfi7BqCRnaN";
const TRONSCAN_API = "https://apilist.tronscan.org/api";

interface VerifyPaymentRequest {
  task_id: string;
  expected_amount?: number;
  address?: string;
}

interface TronTransaction {
  txID: string;
  from_address: string;
  to_address: string;
  contract_type: string;
  amount: number;
  block_timestamp: number;
  token_info?: {
    symbol: string;
    decimals: number;
  };
}

async function getTronTransfers(address: string): Promise<TronTransaction[]> {
  try {
    const url = `${TRONSCAN_API}/transfer?address=${address}&token=TR7NHqjeKQxqYb2JCL1n8KQ8iJ5bKjB4N8&direction=in&limit=50&start=0`;
    const response = await fetch(url);
    if (!response.ok) return [];
    const data = await response.json();
    return data.data || [];
  } catch {
    return [];
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
    const body: VerifyPaymentRequest = await req.json();
    const { task_id, expected_amount, address } = body;

    if (!task_id) {
      return new Response(
        JSON.stringify({ error: "task_id is required" }),
        { status: 400, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
      );
    }

    const depositAddress = address || PLATFORM_WALLET;
    const transfers = await getTronTransfers(depositAddress);

    // 找到来自用户的 USDT 转入交易
    const usdtTransfer = transfers.find((t) => {
      if (!t.token_info || t.token_info.symbol !== "USDT") return false;
      const amountInUsdt = t.amount / 1e6; // USDT decimals = 6
      if (expected_amount) {
        return amountInUsdt >= expected_amount * 0.95; // 5% tolerance
      }
      return amountInUsdt > 0;
    });

    if (usdtTransfer) {
      const amount = usdtTransfer.amount / 1e6;
      return new Response(
        JSON.stringify({
          success: true,
          confirmed: true,
          tx_hash: usdtTransfer.txID,
          amount,
          from_address: usdtTransfer.from_address,
          block_timestamp: usdtTransfer.block_timestamp,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        confirmed: false,
        message: "No USDT deposit found yet",
        check_address: depositAddress,
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
