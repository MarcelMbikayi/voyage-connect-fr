-- This view is designed to provide all the necessary information for the trip search results page.
-- It denormalizes data from schedules, routes, companies, and vehicles, and calculates available seats.
CREATE OR REPLACE VIEW public.detailed_schedules_view AS
SELECT
    s.id,
    c.name AS company_name,
    s.departure_time,
    s.arrival_time,
    r.start_location,
    r.end_location,
    r.base_price AS price,
    (v.capacity - (
        SELECT COUNT(*)
        FROM public.bookings b
        WHERE b.schedule_id = s.id AND b.status = 'confirmed'
    )) AS available_seats
FROM
    public.schedules s
JOIN
    public.routes r ON s.route_id = r.id
JOIN
    public.vehicles v ON s.vehicle_id = v.id
JOIN
    public.companies c ON r.company_id = c.id;

-- Enable RLS on the view
ALTER VIEW public.detailed_schedules_view OWNER TO postgres;
ALTER TABLE public.detailed_schedules_view ENABLE ROW LEVEL SECURITY;

-- RLS Policy for the view to make it publicly readable
CREATE POLICY "Allow public read access to detailed schedules"
ON public.detailed_schedules_view
FOR SELECT
USING (true);