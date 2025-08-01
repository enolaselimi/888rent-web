import React from 'react';
import { Car, Shield, Clock, MapPin, Users, Award, Heart, Zap } from 'lucide-react';
import { useTranslation } from '../contexts/TranslationContext';

const AboutPage: React.FC = () => {
  const { t } = useTranslation();

  const services = [
    {
      icon: Car,
      title: t('about.service.fleet.title'),
      description: t('about.service.fleet.desc')
    },
    {
      icon: Clock,
      title: t('about.service.scheduling.title'),
      description: t('about.service.scheduling.desc')
    },
    {
      icon: MapPin,
      title: t('about.service.locations.title'),
      description: t('about.service.locations.desc')
    },
    {
      icon: Shield,
      title: t('about.service.protection.title'),
      description: t('about.service.protection.desc')
    }
  ];

  const whyChooseUs = [
    {
      icon: Users,
      title: t('about.why.customer.title'),
      description: t('about.why.customer.desc')
    },
    {
      icon: Award,
      title: t('about.why.excellence.title'),
      description: t('about.why.excellence.desc')
    },
    {
      icon: Heart,
      title: t('about.why.expertise.title'),
      description: t('about.why.expertise.desc')
    },
    {
      icon: Zap,
      title: t('about.why.process.title'),
      description: t('about.why.process.desc')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-black to-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t('about.title').split('888Rent')[0]}<span className="text-red-500">888</span>Rent
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t('about.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('about.story.title')}</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  {t('about.story.p1')}
                </p>
                <p>
                  {t('about.story.p2')}
                </p>
                <p>
                  {t('about.story.p3')}
                </p>
              </div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">{t('about.mission.title')}</h3>
              <p className="text-gray-600 mb-6">
                {t('about.mission.text')}
              </p>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">{t('about.vision.title')}</h3>
              <p className="text-gray-600">
                {t('about.vision.text')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('about.services.title')}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('about.services.subtitle')}
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
              {t('about.why.choose.title').split('888Rent')[0]}<span className="text-red-500">888</span>Rent?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('about.why.choose.subtitle')}
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
          <h2 className="text-3xl font-bold mb-6">{t('home.contact.title')}</h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            {t('home.contact.subtitle')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-2">{t('home.contact.phone')}</h3>
              <p className="text-gray-300">+355 69 386 1363</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">{t('home.contact.email')}</h3>
              <p className="text-gray-300">888rentalcars@gmail.com</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">{t('home.contact.hours')}</h3>
              <p className="text-gray-300">{t('home.contact.hours.value')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;