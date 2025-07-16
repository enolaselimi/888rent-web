import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Review } from '../types';
import { useAuth } from '../contexts/AuthContext';

export const useReviews = (carId?: string) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('reviews')
        .select(`
          *,
          users!inner(full_name)
        `);

      if (carId) {
        query = query.eq('car_id', carId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        setError(error.message);
        return;
      }

      const formattedReviews: Review[] = data.map(review => ({
        id: review.id,
        userId: review.user_id,
        carId: review.car_id,
        reservationId: review.reservation_id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.created_at,
        userName: review.users.full_name || 'Anonymous'
      }));

      setReviews(formattedReviews);
    } catch (err) {
      setError('Failed to fetch reviews');
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const createReview = async (reviewData: Omit<Review, 'id' | 'createdAt' | 'userName'>) => {
    if (!user) {
      throw new Error('User must be logged in to create a review');
    }

    try {
      console.log('Creating review with data:', reviewData, 'User ID:', user.id);
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          user_id: reviewData.userId,
          car_id: reviewData.carId,
          reservation_id: reviewData.reservationId,
          rating: reviewData.rating,
          comment: reviewData.comment
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      await fetchReviews();
      return data;
    } catch (err: any) {
      console.error('Error creating review:', err?.message || err);
      throw err;
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [carId]);

  return { 
    reviews, 
    loading, 
    error, 
    refetch: fetchReviews,
    createReview
  };
};