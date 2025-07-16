import React from 'react';
import { Car, Shield, Clock, MapPin, Star, Users } from 'lucide-react';

interface HomePageProps {
  onPageChange: (page: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onPageChange }) => {
  const features = [
    {
      icon: Car,
      title: 'Modern Fleet',
      description: 'Premium vehicles from top brands, regularly maintained and updated'
    },
    {
      icon: Clock,
      title: '24/7 Availability',
      description: 'Book anytime, pick up anytime - we adapt to your schedule'
    },
    {
      icon: Shield,
      title: 'Full Insurance',
      description: 'Complete coverage and peace of mind for every rental'
    },
    {
      icon: MapPin,
      title: 'Multiple Locations',
      description: 'Convenient pickup and drop-off points across Albania'
    },
    {
      icon: Star,
      title: 'Premium Service',
      description: 'Exceptional customer care and support throughout your journey'
    },
    {
      icon: Users,
      title: 'Trusted by Thousands',
      description: 'Join our satisfied customers who choose 888Rent for reliability'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-black via-gray-900 to-black text-white py-20">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to <span className="text-red-500">888</span>Rent
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300">
            Premium Car Rental Services in Albania
          </p>
          <p className="text-lg mb-10 text-gray-400 max-w-3xl mx-auto">
            Experience the freedom of the road with our modern fleet of premium vehicles. 
            From business trips to family vacations, we provide reliable, comfortable, 
            and affordable car rental solutions across Albania.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onPageChange('reserve')}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all transform hover:scale-105"
            >
              Reserve Now
            </button>
            <button
              onClick={() => onPageChange('cars')}
              className="bg-transparent border-2 border-white hover:bg-white hover:text-black text-white font-bold py-4 px-8 rounded-lg text-lg transition-all"
            >
              View Our Fleet
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose <span className="text-red-500">888</span>Rent?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're committed to providing exceptional car rental experiences with 
              unmatched service quality and reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg mb-4">
                  <feature.icon className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Hit the Road?
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Book your perfect car today and experience the difference with 888Rent. 
            Premium vehicles, competitive prices, and exceptional service await you.
          </p>
          <button
            onClick={() => onPageChange('reserve')}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all transform hover:scale-105"
          >
            Start Your Reservation
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-red-500 mb-2">500+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-red-500 mb-2">6</div>
              <div className="text-gray-600">Premium Vehicles</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-red-500 mb-2">3</div>
              <div className="text-gray-600">Pickup Locations</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-red-500 mb-2">24/7</div>
              <div className="text-gray-600">Customer Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="py-12 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Ready to experience the 888Rent difference? Contact us today to learn more about 
            our services or to make a reservation.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-2">Phone</h3>
              <p className="text-gray-300">+355 69 386 1363</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Email</h3>
              <p className="text-gray-300">888rentalcars@gmail.com</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Hours</h3>
              <p className="text-gray-300">24/7 Service Available</p>
            </div>
          </div>
        </div>
      </section>
    </div>
    
  );
};

export default HomePage;