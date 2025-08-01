import React, { useState, useEffect } from 'react';
import { Car, Users, Calendar, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useTranslation } from '../contexts/TranslationContext';
import { useAuth } from '../contexts/AuthContext';
import { useCars } from '../hooks/useCars';
import { useReservations } from '../hooks/useReservations';
import { supabase } from '../lib/supabase';
import { Car as CarType, Reservation, User } from '../types';

const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { cars, refetch: refetchCars } = useCars();
  const { reservations, updateReservationStatus } = useReservations();
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [showCarModal, setShowCarModal] = useState(false);
  const [editingCar, setEditingCar] = useState<CarType | null>(null);
  const [loading, setLoading] = useState(false);
  const [newFeature, setNewFeature] = useState('');
  const [carFormData, setCarFormData] = useState({
    name: '',
    year: new Date().getFullYear(),
    engine: '',
    transmission: 'Automatic',
    fuel: 'Petrol',
    price: 0,
    image: null as File | null,
    description: '',
    features: [] as string[],
    available: true
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        return;
      }

      const formattedUsers: User[] = data.map(u => ({
        id: u.id,
        email: u.email,
        fullName: u.full_name || '',
        phone: u.phone || '',
        isAdmin: u.is_admin || false
      }));

      setUsers(formattedUsers);
      console.log(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('admin.access.denied')}</h2>
          <p className="text-gray-600">{t('admin.no.permission')}</p>
        </div>
      </div>
    );
  }

  const handleCarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = editingCar?.image || '';

      if (carFormData.image instanceof File) {
        const fileExt = carFormData.image.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('cars')
          .upload(filePath, carFormData.image, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl }
        } = supabase.storage.from('cars').getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      const carData = {
        name: carFormData.name,
        year: carFormData.year,
        engine: carFormData.engine,
        fuel_type: carFormData.fuel,
        transmission: carFormData.transmission,
        price_per_day: carFormData.price,
        image_url: imageUrl,
        description: carFormData.description,
        features: carFormData.features,
        available: carFormData.available
      };

      if (editingCar) {
        const { error } = await supabase
          .from('cars')
          .update(carData)
          .eq('id', editingCar.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('cars').insert(carData);
        if (error) throw error;
      }

      await refetchCars();
      setShowCarModal(false);
      setEditingCar(null);
      resetCarForm();
      setNewFeature('');
    } catch (error) {
      console.error('Error saving car:', error);
      alert('Failed to save car. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetCarForm = () => {
    setCarFormData({
      name: '',
      year: new Date().getFullYear(),
      engine: '',
      transmission: 'Automatic',
      fuel: 'Petrol',
      price: 0,
      image: null,
      description: '',
      features: [],
      available: true
    });
    setNewFeature('');
  };

  const addFeature = () => {
    if (newFeature.trim() && !carFormData.features.includes(newFeature.trim())) {
      setCarFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (featureToRemove: string) => {
    setCarFormData(prev => ({
      ...prev,
      features: prev.features.filter(feature => feature !== featureToRemove)
    }));
  };

  const handleFeatureKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addFeature();
    }
  };

  const handleEditCar = (car: CarType) => {
    setEditingCar(car);
    setCarFormData({
      name: car.name,
      year: car.year,
      engine: car.engine,
      transmission: car.transmission,
      fuel: car.fuel,
      price: car.price,
      image: null,
      description: car.description || '',
      features: car.features,
      available: car.available
    });
    setShowCarModal(true);
  };

  const handleDeleteCar = async (carId: string) => {
    if (!confirm('Are you sure you want to delete this car?')) return;

    try {
      const { error } = await supabase
        .from('cars')
        .delete()
        .eq('id', carId);

      if (error) throw error;

      await refetchCars();
    } catch (error) {
      console.error('Error deleting car:', error);
      alert('Failed to delete car. Please try again.');
    }
  };

  const getCarById = (carId: string | null) => {
    return cars.find(car => car.id === carId);
  };

  const stats = {
    totalCars: cars.length,
    availableCars: cars.filter(car => car.available).length,
    totalReservations: reservations.length,
    activeReservations: reservations.filter(res => res.status === 'confirmed').length,
    totalUsers: users.length,
    totalRevenue: reservations
      .filter(res => res.status === 'confirmed')
      .reduce((sum, res) => sum + res.totalPrice, 0)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('admin.title')}</h1>
          <p className="text-gray-600">{t('admin.subtitle')}</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: t('admin.overview'), icon: Calendar },
                { id: 'cars', label: t('admin.cars'), icon: Car },
                { id: 'reservations', label: t('admin.reservations'), icon: Calendar },
                { id: 'users', label: t('admin.users'), icon: Users }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('admin.business.overview')}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <div className="flex items-center">
                      <Car className="h-8 w-8 text-blue-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-blue-600">{t('admin.total.cars')}</p>
                        <p className="text-2xl font-bold text-blue-900">{stats.totalCars}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-6 rounded-lg">
                    <div className="flex items-center">
                      <Calendar className="h-8 w-8 text-green-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-green-600">{t('admin.active.reservations')}</p>
                        <p className="text-2xl font-bold text-green-900">{stats.activeReservations}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 p-6 rounded-lg">
                    <div className="flex items-center">
                      <Users className="h-8 w-8 text-purple-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-purple-600">{t('admin.total.users')}</p>
                        <p className="text-2xl font-bold text-purple-900">{stats.totalUsers}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-50 p-6 rounded-lg">
                    <div className="flex items-center">
                      <Car className="h-8 w-8 text-red-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-red-600">{t('admin.available.cars')}</p>
                        <p className="text-2xl font-bold text-red-900">{stats.availableCars}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-6 rounded-lg">
                    <div className="flex items-center">
                      <Calendar className="h-8 w-8 text-yellow-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-yellow-600">{t('admin.total.reservations')}</p>
                        <p className="text-2xl font-bold text-yellow-900">{stats.totalReservations}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-indigo-50 p-6 rounded-lg">
                    <div className="flex items-center">
                      <div className="text-2xl">€</div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-indigo-600">{t('admin.total.revenue')}</p>
                        <p className="text-2xl font-bold text-indigo-900">€{stats.totalRevenue}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Cars Tab */}
            {activeTab === 'cars' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">{t('admin.manage.cars')}</h2>
                  <button
                    onClick={() => setShowCarModal(true)}
                    className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>{t('admin.add.car')}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cars.map((car) => (
                    <div key={car.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={car.image}
                        alt={car.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-1">{car.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {car.year} • {car.engine} • {car.transmission}
                        </p>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-lg font-bold text-red-500">€{car.price}/day</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            car.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {car.available ? t('admin.available') : t('admin.unavailable')}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditCar(car)}
                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-md text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                          >
                            <Edit className="h-4 w-4" />
                            <span>{t('admin.edit')}</span>
                          </button>
                          <button
                            onClick={() => handleDeleteCar(car.id)}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-md text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>{t('admin.delete')}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reservations Tab */}
            {activeTab === 'reservations' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('admin.manage.reservations')}</h2>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('admin.customer')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('admin.car')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('admin.dates')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('admin.total')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('admin.status')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('admin.actions')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {reservations.map((reservation) => {
                        const car = getCarById(reservation.carId);
                        return (
                          <tr key={reservation.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {reservation.fullName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {reservation.email}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {car?.name || 'Unknown Car'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {reservation.pickupDate} - {reservation.dropoffDate}
                              </div>
                              <div className="text-sm text-gray-500">
                                {reservation.pickupLocation}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                €{reservation.totalPrice}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                reservation.status === 'confirmed'
                                  ? 'bg-green-100 text-green-800'
                                  : reservation.status === 'cancelled'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {t(`common.${reservation.status}`)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                {reservation.status === 'pending' && (
                                  <>
                                    <button
                                      onClick={() => updateReservationStatus(reservation.id, 'confirmed')}
                                      className="text-green-600 hover:text-green-900"
                                    >
                                      {t('admin.confirm')}
                                    </button>
                                    <button
                                      onClick={() => updateReservationStatus(reservation.id, 'cancelled')}
                                      className="text-red-600 hover:text-red-900"
                                    >
                                      {t('admin.cancel')}
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('admin.registered.users')}</h2>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('admin.name')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('admin.email')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('admin.phone')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('admin.reservations')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('admin.role')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {users.map((user) => {
                        const userReservations = reservations.filter(res => res.userId === user.id);
                        return (
                          <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {user.fullName}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {user.email}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {user.phone}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {userReservations.length}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                user.isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {user.isAdmin ? t('admin.admin') : t('admin.user')}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Car Modal */}
      {showCarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {editingCar ? 'Edit Car' : 'Add New Car'}
              </h3>
              
              <form onSubmit={handleCarSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Car Name
                    </label>
                    <input
                      type="text"
                      value={carFormData.name}
                      onChange={(e) => setCarFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Year
                    </label>
                    <input
                      type="number"
                      value={carFormData.year}
                      onChange={(e) => setCarFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Engine
                    </label>
                    <input
                      type="text"
                      value={carFormData.engine}
                      onChange={(e) => setCarFormData(prev => ({ ...prev, engine: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Transmission
                    </label>
                    <select
                      value={carFormData.transmission}
                      onChange={(e) => setCarFormData(prev => ({ ...prev, transmission: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="Automatic">Automatic</option>
                      <option value="Manual">Manual</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fuel Type
                    </label>
                    <select
                      value={carFormData.fuel}
                      onChange={(e) => setCarFormData(prev => ({ ...prev, fuel: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Petrol + Gas">Petrol + Gas</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price per Day (€)
                    </label>
                    <input
                      type="number"
                      value={carFormData.price}
                      onChange={(e) => setCarFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Car Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setCarFormData((prev) => ({
                        ...prev,
                        image: e.target.files?.[0] || null
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    required={!editingCar} // only required when adding a new car
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={carFormData.description}
                    onChange={(e) => setCarFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                {/* Features Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Car Features
                  </label>
                  
                  {/* Add New Feature */}
                  <div className="flex space-x-2 mb-3">
                    <input
                      type="text"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      onKeyPress={handleFeatureKeyPress}
                      placeholder="Add a feature (e.g., Air Conditioning, GPS, etc.)"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <button
                      type="button"
                      onClick={addFeature}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors flex items-center space-x-1"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add</span>
                    </button>
                  </div>

                  {/* Features List */}
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {carFormData.features.length === 0 ? (
                      <p className="text-sm text-gray-500 italic">No features added yet</p>
                    ) : (
                      carFormData.features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md"
                        >
                          <span className="text-sm text-gray-700">{feature}</span>
                          <button
                            type="button"
                            onClick={() => removeFeature(feature)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                            title="Remove feature"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-2">
                    Features help customers understand what's included with the car rental.
                  </p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="available"
                    checked={carFormData.available}
                    onChange={(e) => setCarFormData(prev => ({ ...prev, available: e.target.checked }))}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <label htmlFor="available" className="ml-2 block text-sm text-gray-900">
                    Available for rental
                  </label>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCarModal(false);
                      setEditingCar(null);
                      resetCarForm();
                      setNewFeature('');
                    }}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Saving...' : (editingCar ? 'Update Car' : 'Add Car')}
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

export default AdminPage;