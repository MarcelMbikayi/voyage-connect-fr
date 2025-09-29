import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { handleCors } from "../shared/cors/index.ts";

serve(async (req) => {
  const corsResponse = handleCors();
  if (corsResponse) {
    return corsResponse;
  }

  try {
    const { to, subject, body } = await req.json();
    console.log(`Sending notification to: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body}`);

    // TODO: Integrate with an email/SMS provider (e.g., Twilio, SendGrid)
    // 1. Use the provider's API to send the notification.
    // 2. Log the notification status.

    return new Response(
      JSON.stringify({ message: "Notification sent successfully." }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }
});