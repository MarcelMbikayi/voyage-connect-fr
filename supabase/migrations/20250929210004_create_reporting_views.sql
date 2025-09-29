-- Step 1: Create a view for daily sales per company
CREATE OR REPLACE VIEW public.daily_sales_view AS
SELECT
    b.company_id,
    c.name AS company_name,
    DATE(b.created_at) AS sale_date,
    SUM(b.total_price) AS total_sales,
    COUNT(b.id) AS total_bookings
FROM
    public.bookings b
JOIN
    public.companies c ON b.company_id = c.id
WHERE
    b.status = 'confirmed'
GROUP BY
    b.company_id,
    c.name,
    DATE(b.created_at)
ORDER BY
    sale_date DESC,
    company_name;

-- Enable RLS on the view
ALTER VIEW public.daily_sales_view OWNER TO postgres;
ALTER TABLE public.daily_sales_view ENABLE ROW LEVEL SECURITY;

-- RLS Policy for daily_sales_view
CREATE POLICY "Allow company members to see their own sales data"
ON public.daily_sales_view
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.company_members
        WHERE company_members.company_id = daily_sales_view.company_id
        AND company_members.user_id = auth.uid()
    )
);

CREATE POLICY "Allow platform admins to see all sales data"
ON public.daily_sales_view
FOR SELECT
USING (
    (SELECT platform_role FROM public.profiles WHERE user_id = auth.uid()) = 'admin'
);


-- Step 2: Create a view for route occupancy
CREATE OR REPLACE VIEW public.route_occupancy_view AS
SELECT
    s.id AS schedule_id,
    r.id AS route_id,
    r.name AS route_name,
    c.id AS company_id,
    c.name AS company_name,
    v.capacity,
    s.departure_time,
    (
        SELECT COUNT(*)
        FROM public.bookings b
        WHERE b.schedule_id = s.id AND b.status = 'confirmed'
    ) AS booked_seats,
    (
        (
            SELECT COUNT(*)::NUMERIC
            FROM public.bookings b
            WHERE b.schedule_id = s.id AND b.status = 'confirmed'
        ) / v.capacity
    ) * 100 AS occupancy_percentage
FROM
    public.schedules s
JOIN
    public.routes r ON s.route_id = r.id
JOIN
    public.vehicles v ON s.vehicle_id = v.id
JOIN
    public.companies c ON r.company_id = c.id;

-- Enable RLS on the view
ALTER VIEW public.route_occupancy_view OWNER TO postgres;
ALTER TABLE public.route_occupancy_view ENABLE ROW LEVEL SECURITY;

-- RLS Policy for route_occupancy_view
CREATE POLICY "Allow company members to see their own route occupancy"
ON public.route_occupancy_view
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.company_members
        WHERE company_members.company_id = route_occupancy_view.company_id
        AND company_members.user_id = auth.uid()
    )
);

CREATE POLICY "Allow platform admins to see all route occupancy"
ON public.route_occupancy_view
FOR SELECT
USING (
    (SELECT platform_role FROM public.profiles WHERE user_id = auth.uid()) = 'admin'
);