import React, { useState, useEffect } from 'react';
import { Car, Users, Calendar, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCars } from '../hooks/useCars';
import { useReservations } from '../hooks/useReservations';
import { supabase } from '../lib/supabase';
import { Car as CarType, Reservation, User } from '../types';

const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const { cars, refetch: refetchCars } = useCars();
  const { reservations, updateReservationStatus } = useReservations();
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [showCarModal, setShowCarModal] = useState(false);
  const [editingCar, setEditingCar] = useState<CarType | null>(null);
  const [loading, setLoading] = useState(false);
  const [carFormData, setCarFormData] = useState({
    name: '',
    year: new Date().getFullYear(),
    engine: '',
    transmission: 'Automatic',
    fuel: 'Petrol',
    price: 0,
    image: '',
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  const handleCarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingCar) {
        // Update existing car
        const { error } = await supabase
          .from('cars')
          .update({
            name: carFormData.name,
            year: carFormData.year,
            engine: carFormData.engine,
            fuel_type: carFormData.fuel,
            transmission: carFormData.transmission,
            price_per_day: carFormData.price,
            image_url: carFormData.image,
            description: carFormData.description,
            features: carFormData.features,
            available: carFormData.available
          })
          .eq('id', editingCar.id);

        if (error) throw error;
      } else {
        // Add new car
        const { error } = await supabase
          .from('cars')
          .insert({
            name: carFormData.name,
            year: carFormData.year,
            engine: carFormData.engine,
            fuel_type: carFormData.fuel,
            transmission: carFormData.transmission,
            price_per_day: carFormData.price,
            image_url: carFormData.image,
            description: carFormData.description,
            features: carFormData.features,
            available: carFormData.available
          });

        if (error) throw error;
      }

      await refetchCars();
      setShowCarModal(false);
      setEditingCar(null);
      resetCarForm();
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
      image: '',
      description: '',
      features: [],
      available: true
    });
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
      image: car.image,
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

  const getCarById = (carId: string) => {
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
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your car rental business</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: Calendar },
                { id: 'cars', label: 'Cars', icon: Car },
                { id: 'reservations', label: 'Reservations', icon: Calendar },
                { id: 'users', label: 'Users', icon: Users }
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
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Business Overview</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <div className="flex items-center">
                      <Car className="h-8 w-8 text-blue-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-blue-600">Total Cars</p>
                        <p className="text-2xl font-bold text-blue-900">{stats.totalCars}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-6 rounded-lg">
                    <div className="flex items-center">
                      <Calendar className="h-8 w-8 text-green-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-green-600">Active Reservations</p>
                        <p className="text-2xl font-bold text-green-900">{stats.activeReservations}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 p-6 rounded-lg">
                    <div className="flex items-center">
                      <Users className="h-8 w-8 text-purple-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-purple-600">Total Users</p>
                        <p className="text-2xl font-bold text-purple-900">{stats.totalUsers}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-50 p-6 rounded-lg">
                    <div className="flex items-center">
                      <Car className="h-8 w-8 text-red-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-red-600">Available Cars</p>
                        <p className="text-2xl font-bold text-red-900">{stats.availableCars}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-6 rounded-lg">
                    <div className="flex items-center">
                      <Calendar className="h-8 w-8 text-yellow-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-yellow-600">Total Reservations</p>
                        <p className="text-2xl font-bold text-yellow-900">{stats.totalReservations}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-indigo-50 p-6 rounded-lg">
                    <div className="flex items-center">
                      <div className="text-2xl">€</div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-indigo-600">Total Revenue</p>
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
                  <h2 className="text-2xl font-bold text-gray-900">Manage Cars</h2>
                  <button
                    onClick={() => setShowCarModal(true)}
                    className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Car</span>
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
                            {car.available ? 'Available' : 'Unavailable'}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditCar(car)}
                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-md text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                          >
                            <Edit className="h-4 w-4" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteCar(car.id)}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-md text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Delete</span>
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
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Reservations</h2>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Car
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Dates
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
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
                                {reservation.status}
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
                                      Confirm
                                    </button>
                                    <button
                                      onClick={() => updateReservationStatus(reservation.id, 'cancelled')}
                                      className="text-red-600 hover:text-red-900"
                                    >
                                      Cancel
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
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Registered Users</h2>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Phone
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Reservations
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
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
                                {user.isAdmin ? 'Admin' : 'User'}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={carFormData.image}
                    onChange={(e) => setCarFormData(prev => ({ ...prev, image: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
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