import { corsHeaders } from "../cors.ts";

export const handleCors = () => {
  if (Deno.env.get("DENO_ENV") !== "production") {
    return new Response("ok", { headers: corsHeaders });
  }
  return null;
};