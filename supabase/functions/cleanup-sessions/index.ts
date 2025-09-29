import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  console.log('Session cleanup request received');

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Clean up expired sessions
    const { data: expiredSessions, error: fetchError } = await supabase
      .from('user_sessions')
      .select('id, user_id')
      .eq('is_active', true)
      .lt('expires_at', new Date().toISOString());

    if (fetchError) {
      console.error('Error fetching expired sessions:', fetchError);
      throw new Error('Failed to fetch expired sessions');
    }

    if (expiredSessions && expiredSessions.length > 0) {
      const { error: updateError } = await supabase
        .from('user_sessions')
        .update({ is_active: false })
        .in('id', expiredSessions.map(s => s.id));

      if (updateError) {
        console.error('Error updating expired sessions:', updateError);
        throw new Error('Failed to update expired sessions');
      }

      console.log(`Cleaned up ${expiredSessions.length} expired sessions`);
    }

    // Clean up old OTP verification codes (older than 1 hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { error: otpCleanupError } = await supabase
      .from('otp_verifications')
      .delete()
      .lt('created_at', oneHourAgo);

    if (otpCleanupError) {
      console.error('Error cleaning up OTP codes:', otpCleanupError);
    } else {
      console.log('Cleaned up old OTP verification codes');
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Session cleanup completed successfully',
        expired_sessions_count: expiredSessions?.length || 0
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error in session cleanup function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Une erreur est survenue lors du nettoyage' 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);