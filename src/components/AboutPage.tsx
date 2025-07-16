import React from 'react';
import { Car, Shield, Clock, MapPin, Users, Award, Heart, Zap } from 'lucide-react';

const AboutPage: React.FC = () => {
  const services = [
    {
      icon: Car,
      title: 'Premium Fleet',
      description: 'Our carefully selected vehicles represent the best in automotive excellence. From luxury sedans to efficient compacts, every car in our fleet is meticulously maintained and regularly updated to ensure optimal performance and comfort.'
    },
    {
      icon: Clock,
      title: 'Flexible Scheduling',
      description: 'We understand that travel plans can change. That\'s why we offer 24/7 booking and flexible pickup/drop-off times. Whether you need a car at dawn or midnight, we\'re here to accommodate your schedule.'
    },
    {
      icon: MapPin,
      title: 'Strategic Locations',
      description: 'With pickup points at Tirana Airport, Vlora Airport, and Vlora Port, we\'ve positioned ourselves where you need us most. Our locations are chosen for maximum convenience and accessibility.'
    },
    {
      icon: Shield,
      title: 'Complete Protection',
      description: 'Every rental includes comprehensive insurance coverage. Drive with confidence knowing you\'re fully protected. Our insurance packages are designed to give you peace of mind throughout your journey.'
    }
  ];

  const whyChooseUs = [
    {
      icon: Users,
      title: 'Customer-Centric Approach',
      description: 'Your satisfaction is our priority. Our dedicated team goes above and beyond to ensure every aspect of your rental experience exceeds expectations.'
    },
    {
      icon: Award,
      title: 'Proven Excellence',
      description: 'Years of experience in the Albanian car rental market have taught us what matters most to our customers. We\'ve refined our services based on real feedback and needs.'
    },
    {
      icon: Heart,
      title: 'Local Expertise',
      description: 'As a local Albanian company, we understand the unique needs of both residents and visitors. We provide insider knowledge and personalized recommendations.'
    },
    {
      icon: Zap,
      title: 'Quick & Easy Process',
      description: 'Our streamlined booking process gets you on the road faster. Simple online reservations, quick paperwork, and efficient vehicle handover save you valuable time.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-black to-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About <span className="text-red-500">888</span>Rent
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Your trusted partner for premium car rental services in Albania. 
              We're committed to making your journey comfortable, safe, and memorable.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Founded with a vision to revolutionize car rental services in Albania, 888Rent has grown 
                  from a small local business to a trusted name in premium vehicle rentals. Our journey 
                  began with a simple belief: every customer deserves exceptional service and reliable transportation.
                </p>
                <p>
                  Today, we proudly serve hundreds of satisfied customers, from business travelers and 
                  tourists to local residents who need temporary transportation solutions. Our commitment 
                  to quality, reliability, and customer satisfaction has made us a preferred choice for 
                  car rentals across Albania.
                </p>
                <p>
                  We continue to invest in our fleet, technology, and team to ensure that every 888Rent 
                  experience is seamless, professional, and exceeds expectations.
                </p>
              </div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Mission</h3>
              <p className="text-gray-600 mb-6">
                To provide exceptional car rental experiences that empower our customers to explore 
                Albania with confidence, comfort, and convenience.
              </p>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Vision</h3>
              <p className="text-gray-600">
                To be Albania's leading car rental company, recognized for our premium fleet, 
                outstanding customer service, and innovative solutions that make travel effortless.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We offer comprehensive car rental solutions designed to meet diverse transportation needs 
              with uncompromising quality and service excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div key={index} className="flex space-x-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg">
                    <service.icon className="h-6 w-6 text-red-500" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose <span className="text-red-500">888</span>Rent?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our commitment to excellence sets us apart in the Albanian car rental market. 
              Here's what makes us the preferred choice for discerning customers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {whyChooseUs.map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-lg mr-4">
                    <item.icon className="h-5 w-5 text-red-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {item.title}
                  </h3>
                </div>
                <p className="text-gray-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-16 bg-black text-white">
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

export default AboutPage;