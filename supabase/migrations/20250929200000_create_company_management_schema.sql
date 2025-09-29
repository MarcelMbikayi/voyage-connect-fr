-- Step 1: Create a table for companies
CREATE TABLE public.companies (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    contact_email TEXT,
    contact_phone TEXT,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Add a trigger to update the 'updated_at' column on every update
CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable Row Level Security for the companies table
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Step 2: Create an enum type for company roles
CREATE TYPE public.company_role AS ENUM ('admin', 'member', 'driver');

-- Step 3: Create a table to link users to companies
CREATE TABLE public.company_members (
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role public.company_role NOT NULL DEFAULT 'member',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    PRIMARY KEY (company_id, user_id)
);

-- Enable Row Level Security for the company_members table
ALTER TABLE public.company_members ENABLE ROW LEVEL SECURITY;

-- Step 4: Define RLS policies

-- Policy for companies: Allow members to view their own company's details.
CREATE POLICY "Allow members to view their own company"
ON public.companies
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.company_members
    WHERE company_members.company_id = companies.id
      AND company_members.user_id = auth.uid()
  )
);

-- Policy for companies: Allow company admins to update company details.
CREATE POLICY "Allow admins to update their own company"
ON public.companies
FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM public.company_members
    WHERE company_members.company_id = companies.id
      AND company_members.user_id = auth.uid()
      AND company_members.role = 'admin'
  )
);

-- Policy for company_members: Allow users to view their own membership.
CREATE POLICY "Users can view their own membership"
ON public.company_members
FOR SELECT
USING (auth.uid() = user_id);

-- Policy for company_members: Allow company admins to manage members of their company.
CREATE POLICY "Admins can manage members of their company"
ON public.company_members
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.company_members AS cm
    WHERE cm.company_id = company_members.company_id
      AND cm.user_id = auth.uid()
      AND cm.role = 'admin'
  )
);

-- Policy for company_members: Allow users to leave a company (delete their own membership).
-- This is a more specific policy than the admin one, so I'll create it.
-- The admin policy already allows deletion, but this allows a user to delete themselves even if they are not an admin.
CREATE POLICY "Users can leave a company"
ON public.company_members
FOR DELETE
USING (auth.uid() = user_id);