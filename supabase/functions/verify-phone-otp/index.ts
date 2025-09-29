import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OTPRequest {
  phone: string;
  action: 'send' | 'verify';
  otp_code?: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log('OTP request received:', req.method);

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    // Parse request body
    const { phone, action, otp_code }: OTPRequest = await req.json();
    console.log('OTP action:', action, 'for phone:', phone);

    // Get user from JWT token
    const jwt = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(jwt);
    
    if (authError || !user) {
      throw new Error("Invalid authentication");
    }

    if (action === 'send') {
      // Generate 6-digit OTP code
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Clean up expired OTP codes for this user
      await supabase
        .from('otp_verifications')
        .delete()
        .eq('user_id', user.id)
        .lt('expires_at', new Date().toISOString());

      // Store OTP in database
      const { error: insertError } = await supabase
        .from('otp_verifications')
        .insert({
          user_id: user.id,
          phone: phone,
          otp_code: otpCode,
          expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
          verified: false
        });

      if (insertError) {
        console.error('Error storing OTP:', insertError);
        throw new Error('Failed to generate OTP');
      }

      // In a real implementation, you would send the OTP via SMS
      // For demo purposes, we'll return the OTP code
      console.log('Generated OTP for', phone, ':', otpCode);

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Code OTP envoyé avec succès',
          // Remove this in production - OTP should only be sent via SMS
          debug_otp: otpCode 
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );

    } else if (action === 'verify') {
      if (!otp_code) {
        throw new Error('OTP code is required for verification');
      }

      // Find valid OTP for this user and phone
      const { data: otpRecord, error: fetchError } = await supabase
        .from('otp_verifications')
        .select('*')
        .eq('user_id', user.id)
        .eq('phone', phone)
        .eq('otp_code', otp_code)
        .eq('verified', false)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (fetchError || !otpRecord) {
        console.error('Invalid or expired OTP:', fetchError);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Code OTP invalide ou expiré' 
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }

      // Mark OTP as verified
      const { error: updateOtpError } = await supabase
        .from('otp_verifications')
        .update({ verified: true })
        .eq('id', otpRecord.id);

      if (updateOtpError) {
        console.error('Error updating OTP:', updateOtpError);
        throw new Error('Failed to verify OTP');
      }

      // Update user profile to mark phone as verified
      const { error: updateProfileError } = await supabase
        .from('profiles')
        .update({ 
          phone: phone,
          phone_verified: true 
        })
        .eq('user_id', user.id);

      if (updateProfileError) {
        console.error('Error updating profile:', updateProfileError);
        throw new Error('Failed to update phone verification status');
      }

      console.log('Phone verified successfully for user:', user.id);

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Numéro de téléphone vérifié avec succès' 
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    throw new Error('Invalid action');

  } catch (error: any) {
    console.error("Error in OTP verification function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Une erreur est survenue' 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);