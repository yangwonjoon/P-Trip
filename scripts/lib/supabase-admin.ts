/**
 * Supabase Admin 클라이언트 (service role key)
 * INSERT/UPDATE 등 관리 작업용 — 브라우저에 노출 금지
 */
import { createClient } from "@supabase/supabase-js";
import { requireEnv } from "./env";

const supabaseUrl = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
