import React, { useState } from 'react';
import { Calendar, Car, MapPin, Star, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useReservations } from '../hooks/useReservations';
import { useReviews } from '../hooks/useReviews';
import { useCars } from '../hooks/useCars';
import { Reservation, Review } from '../types';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { cars } = useCars();
  const { reservations, loading: reservationsLoading } = useReservations();
  const { reviews, createReview } = useReviews();
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: ''
  });
  const [submittingReview, setSubmittingReview] = useState(false);

  const getCarById = (carId: string | null) => {
    return cars.find(car => car.id === carId);
  };

  const canReview = (reservation: Reservation) => {
    const dropoffDate = new Date(reservation.dropoffDate);
    const today = new Date();
    const hasReview = reviews.some(review => review.reservationId === reservation.id);
    
    return dropoffDate < today && !hasReview && reservation.status === 'confirmed';
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedReservation || !user) return;

    setSubmittingReview(true);

    try {
      await createReview({
        userId: user.id,
        carId: selectedReservation.carId,
        reservationId: selectedReservation.id,
        rating: reviewData.rating,
        comment: reviewData.comment
      });

      setShowReviewModal(false);
      setSelectedReservation(null);
      setReviewData({ rating: 5, comment: '' });
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-yellow-600 bg-yellow-100';
    }
  };

  const renderStars = (rating: number, interactive = false, onChange?: (rating: number) => void) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
        onClick={interactive && onChange ? () => onChange(i + 1) : undefined}
      />
    ));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your profile</h2>
        </div>
      </div>
    );
  }

  if (reservationsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.fullName}!
          </h1>
          <p className="text-gray-600">Manage your reservations and reviews</p>
        </div>

        {/* Reservations */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Reservations</h2>
          
          {reservations.length === 0 ? (
            <div className="text-center py-8">
              <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No reservations yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reservations.map((reservation) => {
                const car = getCarById(reservation.carId);
                if (!car) return null;

                return (
                  <div key={reservation.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="flex items-start space-x-4">
                        <img
                          src={car.image}
                          alt={car.name}
                          className="w-20 h-16 object-cover rounded-md"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900">{car.name}</h3>
                          <p className="text-sm text-gray-600">{car.year} • {car.engine}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{reservation.pickupDate} - {reservation.dropoffDate}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4" />
                              <span>{reservation.pickupLocation}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 md:mt-0 flex flex-col items-end space-y-2">
                        <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(reservation.status)}`}>
                          {getStatusIcon(reservation.status)}
                          <span className="capitalize">{reservation.status}</span>
                        </div>
                        <div className="text-lg font-bold text-gray-900">
                          €{reservation.totalPrice}
                        </div>
                        {canReview(reservation) && (
                          <button
                            onClick={() => {
                              setSelectedReservation(reservation);
                              setShowReviewModal(true);
                            }}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                          >
                            Write Review
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Reviews</h2>
          
          {reviews.length === 0 ? (
            <div className="text-center py-8">
              <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No reviews yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => {
                const car = getCarById(review.carId);
                if (!car) return null;

                return (
                  <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start space-x-4">
                      <img
                        src={car.image}
                        alt={car.name}
                        className="w-16 h-12 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">{car.name}</h3>
                          <span className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex">
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-sm text-gray-600">({review.rating}/5)</span>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Write a Review
              </h3>
              
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <div className="flex space-x-1">
                    {renderStars(reviewData.rating, true, (rating) => 
                      setReviewData(prev => ({ ...prev, rating }))
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comment
                  </label>
                  <textarea
                    value={reviewData.comment}
                    onChange={(e) => setReviewData(prev => ({ ...prev, comment: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Share your experience with this car..."
                    required
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;