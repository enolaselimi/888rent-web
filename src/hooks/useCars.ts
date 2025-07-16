import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Car } from '../types';

export const useCars = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('available', true)
        .order('created_at', { ascending: true });

      if (error) {
        setError(error.message);
        return;
      }

      const formattedCars: Car[] = data.map(car => ({
        id: car.id,
        name: car.name,
        year: car.year,
        engine: car.engine,
        transmission: car.transmission,
        fuel: car.fuel_type,
        price: car.price_per_day,
        image: car.image_url,
        features: car.features || [],
        available: car.available || false,
        description: car.description || ''
      }));

      setCars(formattedCars);
    } catch (err) {
      setError('Failed to fetch cars');
      console.error('Error fetching cars:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  return { cars, loading, error, refetch: fetchCars };
};