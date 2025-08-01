import React, { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, Car, User, Phone, Mail, Upload, ArrowRight, ArrowLeft } from 'lucide-react';
import { useTranslation } from '../contexts/TranslationContext';
import { useCars } from '../hooks/useCars';
import { useReservations } from '../hooks/useReservations';
import { Car as CarType, Reservation } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

interface ReservePageProps {
  selectedCarId?: string;
}

const ReservePage: React.FC<ReservePageProps> = ({ selectedCarId }) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { cars } = useCars();
  const { createReservation, getReservationsBetweenDates} = useReservations();
  const { showSuccess, showError, showInfo } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [reservationData, setReservationData] = useState({
    pickupDate: '',
    pickupTime: '',
    pickupLocation: '',
    dropoffDate: '',
    dropoffTime: '',
    dropoffLocation: '',
    selectedCarId: selectedCarId || '',
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    patentDocument: null as File | null,
    userId: user?.id || null
  });
  const [filteredCars, setFilteredCars] = useState<CarType[]>(cars);
  const [nextClicked, setNextClicked] = useState<boolean>(false);

  useEffect(() => {
    updateAvailableCars();
  }, [reservationData.pickupDate, reservationData.dropoffDate, cars]);

  const locations = [
    'Tirana Airport',
    'Vlora Airport', 
    'Vlora Port'
  ];

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  const handleInputChange = (field: string, value: string) => {
    setReservationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReservationData(prev => ({
        ...prev,
        patentDocument: file
      }));
    }
  };

  const updateAvailableCars = async () => {
  if (!reservationData.pickupDate || !reservationData.dropoffDate) {
    setFilteredCars(cars); 
    return;
  }

  const overlappingReservations = await getReservationsBetweenDates(
    reservationData.pickupDate,
    reservationData.dropoffDate
  );

  const reservedCarIds = new Set(overlappingReservations.map(r => r.car_id));

  const available = cars.filter(car => !reservedCarIds.has(car.id));
    setFilteredCars(available);
  };

  useEffect(() => {
    if(step == 1 && selectedCarId){
      setNextClicked(false);
    }
  },[step])

  useEffect(() => {
    const checkAndAutoAdvance = async () => {
      if (selectedCarId && reservationData.pickupDate && reservationData.dropoffDate && nextClicked == true) {
        const isSelectedCarAvailable = filteredCars.some(x => x.id == selectedCarId);
          if (isSelectedCarAvailable) {
            setReservationData(prev => ({ ...prev, selectedCarId }));
            setStep(3); // Skip step 2 if car is available
            showInfo('Car selected', 'Your selected car is available.');
          } else {
            setStep(2);
            showError('Car not available', 'The selected car is not available on these dates. Please choose from the available options.');
            setReservationData(prev => ({ ...prev, selectedCarId: '' }));
          }
      }
    };

    checkAndAutoAdvance();
  }, [nextClicked, selectedCarId]);

  // const getAvailableCars = () => {
  //   return cars.filter(car => car.available);
  // };

  const getSelectedCar = () => {
    return cars.find(car => car.id === reservationData.selectedCarId);
  };

  const calculateTotalPrice = () => {
    const car = getSelectedCar();
    if (!car || !reservationData.pickupDate || !reservationData.dropoffDate) return 0;

    const pickup = new Date(reservationData.pickupDate);
    const dropoff = new Date(reservationData.dropoffDate);
    const days = Math.ceil((dropoff.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24));
    
    return days * car.price;
  };

  const handleNext = () => {
    if (step === 1) {
      if (!reservationData.pickupDate || !reservationData.pickupTime || 
          !reservationData.pickupLocation || !reservationData.dropoffDate || 
          !reservationData.dropoffTime || !reservationData.dropoffLocation) {
        showError('Missing Information', 'Please fill in all fields');
        return;
      }
      
      // Validate dates
      const pickup = new Date(reservationData.pickupDate);
      const dropoff = new Date(reservationData.dropoffDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (pickup < today) {
        showError('Invalid Date', 'Pickup date cannot be in the past');
        return;
      }
      
      if (dropoff <= pickup) {
        showError('Invalid Date', 'Dropoff date must be after pickup date');
        return;
      }
      if (selectedCarId) {
        setNextClicked(true);
      }
      setStep(2);
    } else if (step === 2) {
      if (!reservationData.selectedCarId) {
        showError('No Car Selected', 'Please select a car');
        return;
      }
      setStep(3);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reservationData.fullName || !reservationData.email || !reservationData.phone) {
      showError('Missing Information', 'Please fill in all required fields');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(reservationData.email)) {
      showError('Invalid Email', 'Please enter a valid email address');
      return;
    }

    // Validate phone format (basic validation)
    if (reservationData.phone.length < 8) {
      showError('Invalid Phone', 'Please enter a valid phone number');
      return;
    }

    setLoading(true);

    try {
      if(reservationData.selectedCarId == ''){
        showError('Car Not Selected', 'You have not selected a car. Please go back and try again.');
      }
      const reservation: Omit<Reservation, 'id' | 'createdAt'> = {
        userId: reservationData.userId || null,
        carId: reservationData.selectedCarId,
        fullName: reservationData.fullName,
        email: reservationData.email,
        phone: reservationData.phone,
        pickupDate: reservationData.pickupDate,
        pickupTime: reservationData.pickupTime,
        pickupLocation: reservationData.pickupLocation,
        dropoffDate: reservationData.dropoffDate,
        dropoffTime: reservationData.dropoffTime,
        dropoffLocation: reservationData.dropoffLocation,
        totalPrice: calculateTotalPrice(),
        status: 'pending',
        patentDocument: reservationData.patentDocument?.name
      };

      await createReservation(reservation);

      const car = getSelectedCar();
      showSuccess(
        'Reservation Submitted!', 
        `Your ${car?.name} reservation for €${calculateTotalPrice()} has been submitted successfully. You will receive a confirmation email shortly.`
      );
      
      // Reset form
      setStep(1);
      setReservationData({
        pickupDate: '',
        pickupTime: '',
        pickupLocation: '',
        dropoffDate: '',
        dropoffTime: '',
        dropoffLocation: '',
        selectedCarId: '',
        fullName: user?.fullName || '',
        email: user?.email || '',
        phone: user?.phone || '',
        patentDocument: null,
        userId: user?.id || null
      });
    } catch (error) {
      console.error('Error creating reservation:', error);
      showError('Reservation Failed', 'Failed to create reservation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('reserve.title')}</h1>
          <div className="flex justify-center items-center space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNumber ? 'bg-red-500 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-12 h-1 mx-2 ${
                    step > stepNumber ? 'bg-red-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center space-x-8 mt-2 text-sm text-gray-600">
            <span className={step >= 1 ? 'text-red-500 font-medium' : ''}>{t('reserve.step.dates')}</span>
            <span className={step >= 2 ? 'text-red-500 font-medium' : ''}>{t('reserve.step.car')}</span>
            <span className={step >= 3 ? 'text-red-500 font-medium' : ''}>{t('reserve.step.details')}</span>
          </div>
        </div>

        {/* Step 1: Dates and Locations */}
        {step === 1 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('reserve.when.where')}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pickup */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <MapPin className="h-5 w-5 text-red-500 mr-2" />
                  {t('reserve.pickup.details')}
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('reserve.pickup.date')}
                  </label>
                  <input
                    type="date"
                    value={reservationData.pickupDate}
                    onChange={(e) => handleInputChange('pickupDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('reserve.pickup.time')}
                  </label>
                  <select
                    value={reservationData.pickupTime}
                    onChange={(e) => handleInputChange('pickupTime', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">{t('reserve.select.time')}</option>
                    {timeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('reserve.pickup.location')}
                  </label>
                  <select
                    value={reservationData.pickupLocation}
                    onChange={(e) => handleInputChange('pickupLocation', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">{t('reserve.select.location')}</option>
                    {locations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dropoff */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <MapPin className="h-5 w-5 text-red-500 mr-2" />
                  {t('reserve.dropoff.details')}
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('reserve.dropoff.date')}
                  </label>
                  <input
                    type="date"
                    value={reservationData.dropoffDate}
                    onChange={(e) => handleInputChange('dropoffDate', e.target.value)}
                    min={reservationData.pickupDate || new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('reserve.dropoff.time')}
                  </label>
                  <select
                    value={reservationData.dropoffTime}
                    onChange={(e) => handleInputChange('dropoffTime', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">{t('reserve.select.time')}</option>
                    {timeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('reserve.dropoff.location')}
                  </label>
                  <select
                    value={reservationData.dropoffLocation}
                    onChange={(e) => handleInputChange('dropoffLocation', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">{t('reserve.select.location')}</option>
                    {locations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={handleNext}
                className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-md transition-colors flex items-center space-x-2"
              >
                <span>{t('reserve.next')}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Car Selection */}
        {step === 2 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">{t('reserve.available.cars')}</h2>
              <button
                onClick={() => setStep(1)}
                className="text-gray-600 hover:text-gray-800 flex items-center space-x-1"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>{t('reserve.back')}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCars.map((car) => (
                <div
                  key={car.id}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    reservationData.selectedCarId === car.id
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleInputChange('selectedCarId', car.id)}
                >
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-32 object-cover rounded-md mb-3"
                  />
                  <h3 className="font-semibold text-gray-900">{car.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {car.year} • {car.engine} • {car.transmission}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-red-500">€{car.price}/{t('common.day')}</span>
                    {reservationData.selectedCarId === car.id && (
                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={handleNext}
                className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-md transition-colors flex items-center space-x-2"
              >
                <span>{t('reserve.next')}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Customer Details */}
        {step === 3 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">{t('reserve.customer.details')}</h2>
              <button
                onClick={() => setStep(2)}
                className="text-gray-600 hover:text-gray-800 flex items-center space-x-1"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>{t('reserve.back')}</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('reserve.full.name')} *
                  </label>
                  <input
                    type="text"
                    value={reservationData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('reserve.email')} *
                  </label>
                  <input
                    type="email"
                    value={reservationData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('reserve.phone')} *
                  </label>
                  <input
                    type="tel"
                    value={reservationData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('reserve.license')}
                  </label>
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    accept="image/*,.pdf"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              {/* Reservation Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">{t('reserve.summary')}</h3>
                {getSelectedCar() && (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>{t('reserve.car')}:</span>
                      <span>{getSelectedCar()?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('reserve.pickup')}:</span>
                      <span>{reservationData.pickupDate} at {reservationData.pickupTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('reserve.dropoff')}:</span>
                      <span>{reservationData.dropoffDate} at {reservationData.dropoffTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('reserve.location')}:</span>
                      <span>{reservationData.pickupLocation}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg border-t pt-2">
                      <span>{t('reserve.total')}:</span>
                      <span className="text-red-500">€{calculateTotalPrice()}</span>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t('reserve.creating') : t('reserve.confirm')}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservePage;