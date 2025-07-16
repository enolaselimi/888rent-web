/*
  # Insert Initial Data for 888Rent

  1. Cars Data
    - Insert the 6 cars from the requirements
    - Set appropriate features and descriptions

  2. Admin User
    - Create admin user entry (will be handled via auth trigger)
*/

-- Insert initial cars data
INSERT INTO cars (name, year, engine, fuel_type, transmission, price_per_day, image_url, description, features) VALUES
(
  'Volkswagen Passat CC',
  2014,
  '2.0 TDI',
  'Diesel',
  'Automatic',
  45.00,
  'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Elegant and comfortable sedan perfect for business trips and long journeys.',
  '["Air Conditioning", "GPS Navigation", "Bluetooth", "Leather Seats", "Sunroof"]'::jsonb
),
(
  'Mercedes-Benz C-Class',
  2013,
  '3.0L V6',
  'Petrol + Gas',
  'Automatic',
  65.00,
  'https://images.pexels.com/photos/1719648/pexels-photo-1719648.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Luxury sedan with premium features and exceptional comfort.',
  '["Premium Sound", "Climate Control", "Navigation", "Premium Interior", "Safety Package"]'::jsonb
),
(
  'Audi A6 Quattro',
  2013,
  '3.0 TDI',
  'Diesel',
  'Automatic',
  70.00,
  'https://images.pexels.com/photos/1719648/pexels-photo-1719648.jpeg?auto=compress&cs=tinysrgb&w=800',
  'All-wheel drive luxury sedan with superior handling and performance.',
  '["All-Wheel Drive", "Premium Audio", "Heated Seats", "Navigation", "Sport Package"]'::jsonb
),
(
  'Volkswagen Jetta',
  2013,
  '2.5L',
  'Petrol + Gas',
  'Automatic',
  40.00,
  'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Reliable and fuel-efficient compact sedan ideal for city driving.',
  '["Fuel Efficient", "Spacious Interior", "Safety Features", "Comfort Package"]'::jsonb
),
(
  'BMW 5 Series (F10)',
  2012,
  '520D 2.0',
  'Diesel',
  'Automatic',
  60.00,
  'https://images.pexels.com/photos/1719648/pexels-photo-1719648.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Executive sedan with dynamic performance and luxury amenities.',
  '["Sport Mode", "Premium Interior", "Advanced Safety", "Performance Package"]'::jsonb
),
(
  'Volkswagen Passat SEL',
  2013,
  '2.0 TDI',
  'Diesel',
  'Automatic',
  50.00,
  'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Premium sedan with executive features and superior comfort.',
  '["Executive Package", "Comfort Seats", "Advanced Tech", "Premium Sound"]'::jsonb
);