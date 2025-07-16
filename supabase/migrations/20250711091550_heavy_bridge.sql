/*
  # Fix reservations table RLS policy for inserts

  1. Changes
    - Drop the existing restrictive insert policy for reservations
    - Create a new policy that allows both authenticated users and guests to create reservations
    - Allow inserts when user_id matches authenticated user OR when user_id is null (guest reservations)

  2. Security
    - Maintains security by ensuring users can only create reservations for themselves
    - Allows guest reservations (user_id = null) for non-authenticated users
    - Keeps existing read policies intact
*/

-- Drop the existing restrictive insert policy
DROP POLICY IF EXISTS "Users can create reservations" ON reservations;

-- Create a new policy that allows both authenticated users and guest reservations
CREATE POLICY "Allow reservation creation for users and guests"
  ON reservations
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (auth.uid() = user_id) OR (user_id IS NULL)
  );

-- Also create a policy for anonymous users (guests) to insert reservations
CREATE POLICY "Allow guest reservations"
  ON reservations
  FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL);