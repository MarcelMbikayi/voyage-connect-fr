-- ========== FINANCIAL MODULE ==========

-- Step 1: Create commissions table
CREATE TABLE public.commissions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    rate NUMERIC NOT NULL CHECK (rate >= 0 AND rate <= 1), -- e.g., 0.10 for 10%
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_commissions_updated_at
  BEFORE UPDATE ON public.commissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Step 2: Create invoices table
CREATE TYPE public.invoice_status AS ENUM ('draft', 'open', 'paid', 'void');
CREATE TABLE public.invoices (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    total_amount NUMERIC NOT NULL,
    status public.invoice_status NOT NULL DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Step 3: Create payouts table
CREATE TYPE public.payout_status AS ENUM ('pending', 'processing', 'paid', 'failed');
CREATE TABLE public.payouts (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    payout_date TIMESTAMP WITH TIME ZONE,
    status public.payout_status NOT NULL DEFAULT 'pending',
    transaction_reference TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;


-- ========== CUSTOMER SUPPORT MODULE ==========

-- Step 4: Create support_tickets table
CREATE TYPE public.ticket_status AS ENUM ('open', 'in_progress', 'closed');
CREATE TYPE public.ticket_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TABLE public.support_tickets (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    status public.ticket_status NOT NULL DEFAULT 'open',
    priority public.ticket_priority NOT NULL DEFAULT 'medium',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_support_tickets_updated_at
  BEFORE UPDATE ON public.support_tickets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Step 5: Create ticket_replies table
CREATE TABLE public.ticket_replies (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    ticket_id UUID NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, -- The user who replied
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
ALTER TABLE public.ticket_replies ENABLE ROW LEVEL SECURITY;


-- ========== RLS POLICIES ==========

-- commissions policies
CREATE POLICY "Allow platform admins to manage commissions"
ON public.commissions FOR ALL USING (
    (SELECT platform_role FROM public.profiles WHERE user_id = auth.uid()) = 'admin'
);
CREATE POLICY "Allow company members to view their commissions"
ON public.commissions FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.company_members WHERE company_id = commissions.company_id AND user_id = auth.uid())
);

-- invoices policies
CREATE POLICY "Allow platform admins to manage invoices"
ON public.invoices FOR ALL USING (
    (SELECT platform_role FROM public.profiles WHERE user_id = auth.uid()) = 'admin'
);
CREATE POLICY "Allow company members to view their invoices"
ON public.invoices FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.company_members WHERE company_id = invoices.company_id AND user_id = auth.uid())
);

-- payouts policies
CREATE POLICY "Allow platform admins to manage payouts"
ON public.payouts FOR ALL USING (
    (SELECT platform_role FROM public.profiles WHERE user_id = auth.uid()) = 'admin'
);
CREATE POLICY "Allow company members to view their payouts"
ON public.payouts FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.invoices i
        JOIN public.company_members cm ON i.company_id = cm.company_id
        WHERE i.id = payouts.invoice_id AND cm.user_id = auth.uid()
    )
);

-- support_tickets policies
CREATE POLICY "Users can manage their own support tickets"
ON public.support_tickets FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Platform admins can view all support tickets"
ON public.support_tickets FOR SELECT USING (
    (SELECT platform_role FROM public.profiles WHERE user_id = auth.uid()) = 'admin'
);

-- ticket_replies policies
CREATE POLICY "Users can manage replies on their own tickets"
ON public.ticket_replies FOR ALL USING (
    EXISTS (SELECT 1 FROM public.support_tickets WHERE id = ticket_replies.ticket_id AND user_id = auth.uid())
);

CREATE POLICY "Platform admins can manage all ticket replies"
ON public.ticket_replies FOR ALL USING (
    (SELECT platform_role FROM public.profiles WHERE user_id = auth.uid()) = 'admin'
);