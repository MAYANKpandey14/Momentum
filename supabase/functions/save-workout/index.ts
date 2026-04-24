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
    const type = String(body.type ?? "");
    const durationMinutes = body.durationMinutes == null ? null : Number(body.durationMinutes);
    const notes = body.notes == null ? null : String(body.notes);
    const exercises = Array.isArray(body.exercises) ? body.exercises : [];

    if (!date || !type.trim()) {
      return errorResponse("date and type are required");
    }

    const supabase = getServiceClient();
    const { data, error } = await supabase.rpc("save_workout_log", {
      p_user_id: user.id,
      p_date: date,
      p_type: type,
      p_duration_minutes: durationMinutes,
      p_notes: notes,
      p_exercises: exercises,
    });

    if (error) return errorResponse(error.message, 400);
    return jsonResponse({ score: data });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Unexpected error", 401);
  }
});

