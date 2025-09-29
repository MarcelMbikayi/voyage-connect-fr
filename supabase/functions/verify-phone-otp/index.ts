import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { handleCors } from "../shared/cors/index.ts";

serve(async (req) => {
  const corsResponse = handleCors();
  if (corsResponse) {
    return corsResponse;
  }

  try {
    // Create a Supabase client with the user's auth token
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
    );

    // Get the currently authenticated user
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
    }

    const { phone, otp_code } = await req.json();
    if (!phone || !otp_code) {
      return new Response(JSON.stringify({ error: "phone and otp_code are required." }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    // Find the OTP entry in the database
    const { data: otpEntry, error: otpError } = await supabaseClient
      .from("otp_verifications")
      .select("id, expires_at")
      .eq("user_id", user.id)
      .eq("phone", phone)
      .eq("otp_code", otp_code)
      .eq("verified", false)
      .single();

    if (otpError || !otpEntry) {
      return new Response(JSON.stringify({ error: "Invalid OTP." }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    // Check if the OTP has expired
    if (new Date(otpEntry.expires_at) < new Date()) {
      return new Response(JSON.stringify({ error: "OTP has expired." }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    // Mark the OTP as verified
    const { error: updateOtpError } = await supabaseClient
      .from("otp_verifications")
      .update({ verified: true })
      .eq("id", otpEntry.id);

    if (updateOtpError) {
      throw updateOtpError;
    }

    // Update the user's profile to mark the phone as verified
    const { error: updateProfileError } = await supabaseClient
      .from("profiles")
      .update({ phone_verified: true, phone: phone })
      .eq("user_id", user.id);

    if (updateProfileError) {
      // If this fails, we should ideally roll back the OTP verification
      // For now, we will log the error and proceed
      console.error("Failed to update profile after OTP verification:", updateProfileError);
      throw updateProfileError;
    }

    return new Response(JSON.stringify({ message: "Phone number verified successfully." }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});