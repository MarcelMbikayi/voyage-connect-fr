-- This script seeds the database with sample data for testing and development.
-- It assumes the initial dummy users from the first migration exist.

-- Use a specific user for seeding data
-- User: alice.lola@example.com, ID: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
DO $$
DECLARE
    v_user_id UUID := 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
    v_company_id UUID;
    v_vehicle_id UUID;
    v_route_id UUID;
    v_schedule_id UUID;
    v_seat_id UUID;
    v_booking_id UUID;
    v_invoice_id UUID;
    v_ticket_id UUID;
    v_service_class_id UUID;
BEGIN

-- 1. Company
INSERT INTO public.companies (name, contact_email, contact_phone, address)
VALUES ('Congo Express', 'contact@congoexpress.com', '+243810000001', '123 Avenue Lumumba, Kinshasa')
RETURNING id INTO v_company_id;

-- 2. Company Member (Alice is an admin of Congo Express)
INSERT INTO public.company_members (company_id, user_id, role)
VALUES (v_company_id, v_user_id, 'admin');

-- 3. Vehicle
INSERT INTO public.vehicles (company_id, type, capacity, registration_number)
VALUES (v_company_id, 'bus', 50, 'KIN-001-CE')
RETURNING id INTO v_vehicle_id;

-- 4. Service Class
INSERT INTO public.service_classes (company_id, name, price_modifier)
VALUES (v_company_id, 'Standard', 1.0)
RETURNING id INTO v_service_class_id;

-- 5. Seats (Just one for simplicity, in a real scenario this would be a loop)
INSERT INTO public.seats (vehicle_id, seat_number, service_class_id)
VALUES (v_vehicle_id, 'A1', v_service_class_id)
RETURNING id INTO v_seat_id;

-- 6. Route
INSERT INTO public.routes (company_id, name, start_location, end_location, distance_km)
VALUES (v_company_id, 'Kinshasa - Matadi', 'Kinshasa', 'Matadi', 350)
RETURNING id INTO v_route_id;

-- 7. Schedule
INSERT INTO public.schedules (route_id, vehicle_id, departure_time, arrival_time)
VALUES (v_route_id, v_vehicle_id, NOW() + INTERVAL '1 day', NOW() + INTERVAL '1 day' + INTERVAL '8 hours')
RETURNING id INTO v_schedule_id;

-- 8. Cancellation Policy
INSERT INTO public.cancellation_policies (company_id, name, refund_percentage, hours_before_departure)
VALUES (v_company_id, 'Standard Refund', 0.80, 24);

-- 9. Booking
INSERT INTO public.bookings (user_id, schedule_id, company_id, num_seats, status, total_price, seat_id)
VALUES (v_user_id, v_schedule_id, v_company_id, 1, 'confirmed', 25.00, v_seat_id)
RETURNING id INTO v_booking_id;

-- 10. Payment
INSERT INTO public.payments (booking_id, amount, currency, payment_method, status, transaction_id)
VALUES (v_booking_id, 25.00, 'USD', 'Mobile Money', 'succeeded', 'TXN_12345ABC');

-- 11. Commission
INSERT INTO public.commissions (company_id, rate, description)
VALUES (v_company_id, 0.10, 'Standard 10% commission');

-- 12. Invoice
INSERT INTO public.invoices (company_id, issue_date, due_date, total_amount, status)
VALUES (v_company_id, NOW(), NOW() + INTERVAL '30 days', 2.50, 'open')
RETURNING id INTO v_invoice_id;

-- 13. Payout
INSERT INTO public.payouts (invoice_id, amount, status)
VALUES (v_invoice_id, 2.50, 'pending');

-- 14. Support Ticket
INSERT INTO public.support_tickets (user_id, subject, description, status, priority)
VALUES (v_user_id, 'Login Issue', 'I cannot reset my password.', 'open', 'high')
RETURNING id INTO v_ticket_id;

-- 15. Ticket Reply
INSERT INTO public.ticket_replies (ticket_id, user_id, message)
VALUES (v_ticket_id, v_user_id, 'Please ignore, I have resolved the issue.');

END $$;