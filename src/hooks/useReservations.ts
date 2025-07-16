import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Reservation } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { sendReservationConfirmation } from '../utils/emailService';
import { useCars } from './useCars';

export const useReservations = () => {
  const { user } = useAuth();
  const { cars } = useCars();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReservations = async () => {
    if (!user) {
      setReservations([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      let query = supabase.from('reservations').select('*');

      // If not admin, only fetch user's reservations
      if (!user.isAdmin) {
        query = query.eq('user_id', user.id);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        setError(error.message);
        return;
      }

      const formattedReservations: Reservation[] = data.map(res => ({
        id: res.id,
        userId: res.user_id,
        carId: res.car_id,
        fullName: res.full_name,
        email: res.email,
        phone: res.phone,
        pickupDate: res.pickup_date,
        pickupTime: res.pickup_time,
        pickupLocation: res.pickup_location,
        dropoffDate: res.dropoff_date,
        dropoffTime: res.dropoff_time,
        dropoffLocation: res.dropoff_location,
        totalPrice: res.total_amount,
        status: res.status as 'pending' | 'confirmed' | 'completed' | 'cancelled',
        createdAt: res.created_at,
        patentDocument: res.patent_document
      }));

      setReservations(formattedReservations);
    } catch (err) {
      setError('Failed to fetch reservations');
      console.error('Error fetching reservations:', err);
    } finally {
      setLoading(false);
    }
  };

  const createReservation = async (reservationData: Omit<Reservation, 'id' | 'createdAt'>) => {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .insert({
          user_id: reservationData.userId,
          car_id: reservationData.carId,
          pickup_date: reservationData.pickupDate,
          pickup_time: reservationData.pickupTime,
          pickup_location: reservationData.pickupLocation,
          dropoff_date: reservationData.dropoffDate,
          dropoff_time: reservationData.dropoffTime,
          dropoff_location: reservationData.dropoffLocation,
          full_name: reservationData.fullName,
          email: reservationData.email,
          phone: reservationData.phone,
          patent_document: reservationData.patentDocument,
          total_amount: reservationData.totalPrice,
          status: reservationData.status
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Send confirmation email
      const car = cars.find(c => c.id === reservationData.carId);
      if (car && data) {
        const reservation: Reservation = {
          id: data.id,
          userId: data.user_id,
          carId: data.car_id,
          fullName: data.full_name,
          email: data.email,
          phone: data.phone,
          pickupDate: data.pickup_date,
          pickupTime: data.pickup_time,
          pickupLocation: data.pickup_location,
          dropoffDate: data.dropoff_date,
          dropoffTime: data.dropoff_time,
          dropoffLocation: data.dropoff_location,
          totalPrice: data.total_amount,
          status: data.status as 'pending' | 'confirmed' | 'completed' | 'cancelled',
          createdAt: data.created_at,
          patentDocument: data.patent_document
        };

        try {
          await sendReservationConfirmation(reservation, car);
          console.log('Confirmation email sent successfully');
        } catch (emailError) {
          console.error('Failed to send confirmation email:', emailError);
          // Don't throw error here as reservation was created successfully
        }
      }

      if (user) {
        await fetchReservations();
      }
      return data;
    } catch (err) {
      console.error('Error creating reservation:', err);
      throw err;
    }
  };

  const updateReservationStatus = async (reservationId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ status })
        .eq('id', reservationId);

      if (error) {
        throw error;
      }

      await fetchReservations();
    } catch (err) {
      console.error('Error updating reservation:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [user]);

  return { 
    reservations, 
    loading, 
    error, 
    refetch: fetchReservations,
    createReservation,
    updateReservationStatus
  };
};