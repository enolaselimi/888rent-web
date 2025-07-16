import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Star, Calendar, Users, Fuel, Settings } from 'lucide-react';
import { useCars } from '../hooks/useCars';
import { useReviews } from '../hooks/useReviews';
import { Car, Review } from '../types';

interface CarsPageProps {
  onReserve: (carId: string) => void;
}

const CarsPage: React.FC<CarsPageProps> = ({ onReserve }) => {
  const { cars, loading: carsLoading } = useCars();
  const [expandedCar, setExpandedCar] = useState<string | null>(null);

  const getCarReviews = (carId: string) => {
    // This will be handled by individual car review fetching
    return [];
  };

  const getAverageRating = (reviews: Review[]) => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  };

  const toggleExpanded = (carId: string) => {
    setExpandedCar(expandedCar === carId ? null : carId);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (carsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading cars...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Our Premium Fleet
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose from our carefully selected collection of premium vehicles. 
            Each car is maintained to the highest standards and ready for your journey.
          </p>
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {cars.map((car) => {
            const isExpanded = expandedCar === car.id;

            return (
              <CarCard
                key={car.id}
                car={car}
                isExpanded={isExpanded}
                onToggleExpanded={() => toggleExpanded(car.id)}
                onReserve={() => onReserve(car.id)}
                renderStars={renderStars}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

interface CarCardProps {
  car: Car;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  onReserve: () => void;
  renderStars: (rating: number) => React.ReactNode;
}

const CarCard: React.FC<CarCardProps> = ({ 
  car, 
  isExpanded, 
  onToggleExpanded, 
  onReserve, 
  renderStars 
}) => {
  const { reviews, loading: reviewsLoading } = useReviews(car.id);
  
  const getAverageRating = (reviews: Review[]) => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  };

  const averageRating = getAverageRating(reviews);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Car Image */}
      <div className="relative h-64">
        <img
          src={car.image}
          alt={car.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full font-semibold">
          €{car.price}/day
        </div>
      </div>

      {/* Car Info */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {car.name}
            </h3>
            <p className="text-gray-600">
              {car.year} • {car.engine} • {car.transmission}
            </p>
          </div>
          {reviews.length > 0 && (
            <div className="flex items-center space-x-1">
              <div className="flex">
                {renderStars(Math.round(averageRating))}
              </div>
              <span className="text-sm text-gray-600">
                ({reviews.length})
              </span>
            </div>
          )}
        </div>

        {/* Quick Specs */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            <span>5 Seats</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Fuel className="h-4 w-4" />
            <span>{car.fuel}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Settings className="h-4 w-4" />
            <span>{car.transmission}</span>
          </div>
        </div>

        {/* See More Button */}
        <button
          onClick={onToggleExpanded}
          className="flex items-center space-x-1 text-red-500 hover:text-red-600 transition-colors mb-4"
        >
          <span>See more</span>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="border-t pt-4 space-y-4">
            {/* Description */}
            {car.description && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                <p className="text-gray-600 text-sm">{car.description}</p>
              </div>
            )}

            {/* Features */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Features</h4>
              <div className="flex flex-wrap gap-2">
                {car.features.map((feature, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">
                Customer Reviews ({reviews.length})
              </h4>
              {reviewsLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500 mx-auto"></div>
                </div>
              ) : reviews.length > 0 ? (
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {reviews.map((review) => (
                    <div key={review.id} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">
                            {review.userName}
                          </span>
                          <div className="flex">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No reviews yet</p>
              )}
            </div>
          </div>
        )}

        {/* Reserve Button */}
        <button
          onClick={onReserve}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <Calendar className="h-5 w-5" />
          <span>Reserve Now</span>
        </button>
      </div>
    </div>
  );
};

export default CarsPage;