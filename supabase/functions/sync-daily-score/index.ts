import { handleCors } from "../_shared/cors.ts";
import { errorResponse, jsonResponse } from "../_shared/http.ts";
import { getAuthenticatedUser, getServiceClient } from "../_shared/supabase.ts";

Deno.serve(async (req) => {
  const cors = handleCors(req);
  if (cors) return cors;
  if (req.method !== "POST") return errorResponse("Method not allowed", 405);

  try {
    const user = await getAuthenticatedUser(req);
    const body = await req.json();
    const date = String(body.date ?? "");

    if (!date) {
      return errorResponse("date is required");
    }

    const supabase = getServiceClient();
    const { data, error } = await supabase.rpc("sync_daily_score", {
      p_user_id: user.id,
      p_date: date,
    });

    if (error) return errorResponse(error.message, 400);
    return jsonResponse({ score: data });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Unexpected error", 401);
  }
});

