import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { handleCors } from "../shared/cors/index.ts";

const RESERVATION_DURATION_MINUTES = 10;

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

    const { schedule_id, seat_id } = await req.json();
    if (!schedule_id || !seat_id) {
      return new Response(JSON.stringify({ error: "schedule_id and seat_id are required." }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    // Check for existing permanent bookings for this seat
    const { data: existingBooking, error: bookingError } = await supabaseClient
      .from("bookings")
      .select("id")
      .eq("schedule_id", schedule_id)
      .eq("seat_id", seat_id) // Assuming seat_id is added to bookings table
      .in("status", ["confirmed"])
      .single();

    if (bookingError && bookingError.code !== 'PGRST116') { // Ignore 'PGRST116' (No rows found)
        throw bookingError;
    }
    if (existingBooking) {
        return new Response(JSON.stringify({ error: "Seat is already booked." }), { status: 409, headers: { "Content-Type": "application/json" } });
    }

    // Create the temporary reservation
    const expires_at = new Date(Date.now() + RESERVATION_DURATION_MINUTES * 60 * 1000).toISOString();
    const { data: reservation, error } = await supabaseClient
      .from("temporary_reservations")
      .insert({
        schedule_id,
        seat_id,
        user_id: user.id,
        expires_at,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // unique_violation
        return new Response(JSON.stringify({ error: "Seat is currently held by another user." }), { status: 409, headers: { "Content-Type": "application/json" } });
      }
      throw error;
    }

    return new Response(JSON.stringify(reservation), {
      headers: { "Content-Type": "application/json" },
      status: 201,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});

/*
Note: I need to add a `seat_id` column to the `bookings` table.
I will create a new migration for this small change.
Also, a cron job should be set up to periodically delete expired temporary reservations.
This can be done with pg_cron:
`SELECT cron.schedule('*/5 * * * *', $$DELETE FROM public.temporary_reservations WHERE expires_at < NOW()$$);`
*/