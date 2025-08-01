/*
  # Fix reservation policies for anonymous users

  1. Policy Changes
    - Update INSERT policies to allow anonymous users to create reservations
    - Ensure anonymous users can create reservations without authentication
    - Keep existing policies for authenticated users intact

  2. Security
    - Anonymous users can only INSERT reservations
    - They cannot SELECT, UPDATE, or DELETE reservations
    - Authenticated users maintain full access to their own reservations
    - Admins maintain full access to all reservations
*/

-- Drop existing INSERT policies for reservations
DROP POLICY IF EXISTS "anonymous_users_can_create_reservations" ON reservations;
DROP POLICY IF EXISTS "authenticated_users_can_create_reservations" ON reservations;

-- Create new INSERT policy that allows both anonymous and authenticated users
CREATE POLICY "anyone_can_create_reservations"
  ON reservations
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Ensure authenticated users can still read their own reservations
-- (This policy should already exist, but let's make sure)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'reservations' 
    AND policyname = 'Users can read own reservations'
  ) THEN
    CREATE POLICY "Users can read own reservations"
      ON reservations
      FOR SELECT
      TO authenticated
      USING (user_id = auth.uid());
  END IF;
END $$;

-- Ensure admins can manage all reservations
-- (This policy should already exist, but let's make sure)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'reservations' 
    AND policyname = 'Admins can manage all reservations'
  ) THEN
    CREATE POLICY "Admins can manage all reservations"
      ON reservations
      FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM users 
          WHERE users.id = auth.uid() 
          AND users.is_admin = true
        )
      );
  END IF;
END $$;