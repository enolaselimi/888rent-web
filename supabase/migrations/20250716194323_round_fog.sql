/*
  # Fix all RLS policies for reservations table

  This migration completely rebuilds the RLS policies for the reservations table to ensure:
  1. Anyone (including anonymous users) can create reservations
  2. Authenticated users can read their own reservations
  3. Admins can manage all reservations
  4. No conflicting policies that block anonymous insertions

  ## Changes Made
  1. Drop all existing policies to start fresh
  2. Create new policies with proper permissions
  3. Ensure no conflicts between policies
*/

-- Drop all existing policies for reservations table
DROP POLICY IF EXISTS "Admins can manage all reservations" ON reservations;
DROP POLICY IF EXISTS "Users can read own reservations" ON reservations;
DROP POLICY IF EXISTS "anyone_can_create_reservations" ON reservations;
DROP POLICY IF EXISTS "Users can insert own data" ON reservations;
DROP POLICY IF EXISTS "Allow authenticated users to create reservations for their reservati" ON reservations;

-- Create new comprehensive policies

-- 1. Allow anyone (including anonymous users) to create reservations
CREATE POLICY "allow_anonymous_reservations"
  ON reservations
  FOR INSERT
  TO public
  WITH CHECK (true);

-- 2. Allow authenticated users to read their own reservations
CREATE POLICY "users_read_own_reservations"
  ON reservations
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- 3. Allow admins to read all reservations
CREATE POLICY "admins_read_all_reservations"
  ON reservations
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.is_admin = true
    )
  );

-- 4. Allow admins to update all reservations
CREATE POLICY "admins_update_all_reservations"
  ON reservations
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.is_admin = true
    )
  );

-- 5. Allow admins to delete reservations
CREATE POLICY "admins_delete_reservations"
  ON reservations
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.is_admin = true
    )
  );