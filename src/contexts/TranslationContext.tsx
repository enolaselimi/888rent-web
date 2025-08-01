import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'al';

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};

interface TranslationProviderProps {
  children: ReactNode;
}


type TranslationKeys = { [key: string]: string };

const translations: Record<Language, TranslationKeys> = {

  en: {
    // Header
    'nav.home': 'Home',
    'nav.about': 'About Us',
    'nav.cars': 'Cars',
    'nav.reserve': 'Reserve',
    'nav.admin': 'Admin Panel',
    'nav.profile': 'My Reservations',
    'nav.login': 'Login',
    'nav.signup': 'Sign Up',
    'nav.logout': 'Logout',
    'nav.welcome': 'Welcome',

    // Home Page
    'home.title': 'Welcome to 888Rent',
    'home.subtitle': 'Premium Car Rental Services in Albania',
    'home.description': 'Experience the freedom of the road with our modern fleet of premium vehicles. From business trips to family vacations, we provide reliable, comfortable, and affordable car rental solutions across Albania.',
    'home.reserve.now': 'Reserve Now',
    'home.view.fleet': 'View Our Fleet',
    'home.why.choose.title': 'Why Choose 888Rent?',
    'home.why.choose.subtitle': 'We\'re committed to providing exceptional car rental experiences with unmatched service quality and reliability.',
    'home.feature.modern.fleet': 'Modern Fleet',
    'home.feature.modern.fleet.desc': 'Premium vehicles from top brands, regularly maintained and updated',
    'home.feature.24.7': '24/7 Availability',
    'home.feature.24.7.desc': 'Book anytime, pick up anytime - we adapt to your schedule',
    'home.feature.insurance': 'Full Insurance',
    'home.feature.insurance.desc': 'Complete coverage and peace of mind for every rental',
    'home.feature.locations': 'Multiple Locations',
    'home.feature.locations.desc': 'Convenient pickup and drop-off points across Albania',
    'home.feature.service': 'Premium Service',
    'home.feature.service.desc': 'Exceptional customer care and support throughout your journey',
    'home.feature.trusted': 'Trusted by Thousands',
    'home.feature.trusted.desc': 'Join our satisfied customers who choose 888Rent for reliability',
    'home.cta.title': 'Ready to Hit the Road?',
    'home.cta.subtitle': 'Book your perfect car today and experience the difference with 888Rent. Premium vehicles, competitive prices, and exceptional service await you.',
    'home.cta.button': 'Start Your Reservation',
    'home.stats.customers': 'Happy Customers',
    'home.stats.vehicles': 'Premium Vehicles',
    'home.stats.locations': 'Pickup Locations',
    'home.stats.support': 'Customer Support',
    'home.contact.title': 'Get in Touch',
    'home.contact.subtitle': 'Ready to experience the 888Rent difference? Contact us today to learn more about our services or to make a reservation.',
    'home.contact.phone': 'Phone',
    'home.contact.email': 'Email',
    'home.contact.hours': 'Hours',
    'home.contact.hours.value': '24/7 Service Available',

    // About Page
    'about.title': 'About 888Rent',
    'about.subtitle': 'Your trusted partner for premium car rental services in Albania. We\'re committed to making your journey comfortable, safe, and memorable.',
    'about.story.title': 'Our Story',
    'about.story.p1': 'Founded with a vision to revolutionize car rental services in Albania, 888Rent has grown from a small local business to a trusted name in premium vehicle rentals. Our journey began with a simple belief: every customer deserves exceptional service and reliable transportation.',
    'about.story.p2': 'Today, we proudly serve hundreds of satisfied customers, from business travelers and tourists to local residents who need temporary transportation solutions. Our commitment to quality, reliability, and customer satisfaction has made us a preferred choice for car rentals across Albania.',
    'about.story.p3': 'We continue to invest in our fleet, technology, and team to ensure that every 888Rent experience is seamless, professional, and exceeds expectations.',
    'about.mission.title': 'Our Mission',
    'about.mission.text': 'To provide exceptional car rental experiences that empower our customers to explore Albania with confidence, comfort, and convenience.',
    'about.vision.title': 'Our Vision',
    'about.vision.text': 'To be Albania\'s leading car rental company, recognized for our premium fleet, outstanding customer service, and innovative solutions that make travel effortless.',
    'about.services.title': 'Our Services',
    'about.services.subtitle': 'We offer comprehensive car rental solutions designed to meet diverse transportation needs with uncompromising quality and service excellence.',
    'about.service.fleet.title': 'Premium Fleet',
    'about.service.fleet.desc': 'Our carefully selected vehicles represent the best in automotive excellence. From luxury sedans to efficient compacts, every car in our fleet is meticulously maintained and regularly updated to ensure optimal performance and comfort.',
    'about.service.scheduling.title': 'Flexible Scheduling',
    'about.service.scheduling.desc': 'We understand that travel plans can change. That\'s why we offer 24/7 booking and flexible pickup/drop-off times. Whether you need a car at dawn or midnight, we\'re here to accommodate your schedule.',
    'about.service.locations.title': 'Strategic Locations',
    'about.service.locations.desc': 'With pickup points at Tirana Airport, Vlora Airport, and Vlora Port, we\'ve positioned ourselves where you need us most. Our locations are chosen for maximum convenience and accessibility.',
    'about.service.protection.title': 'Complete Protection',
    'about.service.protection.desc': 'Every rental includes comprehensive insurance coverage. Drive with confidence knowing you\'re fully protected. Our insurance packages are designed to give you peace of mind throughout your journey.',
    'about.why.choose.title': 'Why Choose 888Rent?',
    'about.why.choose.subtitle': 'Our commitment to excellence sets us apart in the Albanian car rental market. Here\'s what makes us the preferred choice for discerning customers.',
    'about.why.customer.title': 'Customer-Centric Approach',
    'about.why.customer.desc': 'Your satisfaction is our priority. Our dedicated team goes above and beyond to ensure every aspect of your rental experience exceeds expectations.',
    'about.why.excellence.title': 'Proven Excellence',
    'about.why.excellence.desc': 'Years of experience in the Albanian car rental market have taught us what matters most to our customers. We\'ve refined our services based on real feedback and needs.',
    'about.why.expertise.title': 'Local Expertise',
    'about.why.expertise.desc': 'As a local Albanian company, we understand the unique needs of both residents and visitors. We provide insider knowledge and personalized recommendations.',
    'about.why.process.title': 'Quick & Easy Process',
    'about.why.process.desc': 'Our streamlined booking process gets you on the road faster. Simple online reservations, quick paperwork, and efficient vehicle handover save you valuable time.',

    // Cars Page
    'cars.title': 'Our Premium Fleet',
    'cars.subtitle': 'Choose from our carefully selected collection of premium vehicles. Each car is maintained to the highest standards and ready for your journey.',
    'cars.see.more': 'See more',
    'cars.seats': 'Seats',
    'cars.reserve.now': 'Reserve Now',
    'cars.description': 'Description',
    'cars.features': 'Features',
    'cars.reviews': 'Customer Reviews',
    'cars.no.reviews': 'No reviews yet',
    'cars.loading': 'Loading cars...',

    // Reserve Page
    'reserve.title': 'Reserve Your Car',
    'reserve.step.dates': 'Dates & Location',
    'reserve.step.car': 'Select Car',
    'reserve.step.details': 'Customer Details',
    'reserve.when.where': 'When and Where?',
    'reserve.pickup.details': 'Pickup Details',
    'reserve.pickup.date': 'Pickup Date',
    'reserve.pickup.time': 'Pickup Time',
    'reserve.pickup.location': 'Pickup Location',
    'reserve.dropoff.details': 'Dropoff Details',
    'reserve.dropoff.date': 'Dropoff Date',
    'reserve.dropoff.time': 'Dropoff Time',
    'reserve.dropoff.location': 'Dropoff Location',
    'reserve.select.time': 'Select time',
    'reserve.select.location': 'Select location',
    'reserve.next': 'Next',
    'reserve.back': 'Back',
    'reserve.available.cars': 'Available Cars',
    'reserve.customer.details': 'Customer Details',
    'reserve.full.name': 'Full Name',
    'reserve.email': 'Email Address',
    'reserve.phone': 'Phone Number',
    'reserve.license': 'Upload Driver\'s License',
    'reserve.summary': 'Reservation Summary',
    'reserve.car': 'Car',
    'reserve.pickup': 'Pickup',
    'reserve.dropoff': 'Dropoff',
    'reserve.location': 'Location',
    'reserve.total': 'Total',
    'reserve.confirm': 'Confirm Reservation',
    'reserve.creating': 'Creating Reservation...',

    // Profile Page
    'profile.title': 'Welcome back',
    'profile.subtitle': 'Manage your reservations and reviews',
    'profile.reservations': 'My Reservations',
    'profile.reviews': 'My Reviews',
    'profile.no.reservations': 'No reservations yet',
    'profile.no.reviews': 'No reviews yet',
    'profile.write.review': 'Write Review',
    'profile.loading': 'Loading your profile...',
    'profile.login.required': 'Please log in to view your profile',

    // Admin Page
    'admin.title': 'Admin Dashboard',
    'admin.subtitle': 'Manage your car rental business',
    'admin.overview': 'Overview',
    'admin.cars': 'Cars',
    'admin.reservations': 'Reservations',
    'admin.users': 'Users',
    'admin.business.overview': 'Business Overview',
    'admin.total.cars': 'Total Cars',
    'admin.active.reservations': 'Active Reservations',
    'admin.total.users': 'Total Users',
    'admin.available.cars': 'Available Cars',
    'admin.total.reservations': 'Total Reservations',
    'admin.total.revenue': 'Total Revenue',
    'admin.manage.cars': 'Manage Cars',
    'admin.add.car': 'Add Car',
    'admin.edit': 'Edit',
    'admin.delete': 'Delete',
    'admin.available': 'Available',
    'admin.unavailable': 'Unavailable',
    'admin.manage.reservations': 'Manage Reservations',
    'admin.customer': 'Customer',
    'admin.car': 'Car',
    'admin.dates': 'Dates',
    'admin.total': 'Total',
    'admin.status': 'Status',
    'admin.actions': 'Actions',
    'admin.confirm': 'Confirm',
    'admin.cancel': 'Cancel',
    'admin.registered.users': 'Registered Users',
    'admin.name': 'Name',
    'admin.email': 'Email',
    'admin.phone': 'Phone',
    'admin.role': 'Role',
    'admin.admin': 'Admin',
    'admin.user': 'User',
    'admin.access.denied': 'Access Denied',
    'admin.no.permission': 'You don\'t have permission to access this page.',

    // Auth Modal
    'auth.signin': 'Sign In',
    'auth.create.account': 'Create Account',
    'auth.full.name': 'Full Name',
    'auth.phone.number': 'Phone Number',
    'auth.email.username': 'Email Address or Username',
    'auth.email.address': 'Email Address',
    'auth.password': 'Password',
    'auth.please.wait': 'Please wait...',
    'auth.no.account': 'Don\'t have an account?',
    'auth.have.account': 'Already have an account?',
    'auth.sign.up': 'Sign up',
    'auth.sign.in': 'Sign in',

    // Common
    'common.loading': 'Loading...',
    'common.day': 'day',
    'common.pending': 'pending',
    'common.confirmed': 'confirmed',
    'common.cancelled': 'cancelled',
    'common.completed': 'completed',
    'common.automatic': 'Automatic',
    'common.manual': 'Manual',
    'common.petrol': 'Petrol',
    'common.diesel': 'Diesel',
    'common.petrol.gas': 'Petrol + Gas',
  },
  al: {
    // Header
    'nav.home': 'Kryefaqja',
    'nav.about': 'Rreth Nesh',
    'nav.cars': 'Makinat',
    'nav.reserve': 'Rezervo',
    'nav.admin': 'Paneli Admin',
    'nav.profile': 'Rezervimet e Mia',
    'nav.login': 'Hyrje',
    'nav.signup': 'Regjistrohu',
    'nav.logout': 'Dalje',
    'nav.welcome': 'Mirësevini',

    // Home Page
    'home.title': 'Mirësevini në 888Rent',
    'home.subtitle': 'Shërbime Premium të Makinave me Qera në Shqipëri',
    'home.description': 'Përjetoni lirinë e rrugës me flotën tonë moderne të automjeteve premium. Nga udhëtimet e biznesit deri tek pushimet familjare, ne ofrojmë zgjidhje të besueshme, të rehatshme dhe të përballueshme për makinat me qera në të gjithë Shqipërinë.',
    'home.reserve.now': 'Rezervo Tani',
    'home.view.fleet': 'Shiko Flotën Tonë',
    'home.why.choose.title': 'Pse të Zgjidhni 888Rent?',
    'home.why.choose.subtitle': 'Ne jemi të përkushtuar për të ofruar përvojat e jashtëzakonshme të makinave me qera me cilësi dhe besueshmëri të pashembullt shërbimi.',

    'home.feature.modern.fleet': 'Flotë Moderne',
    'home.feature.modern.fleet.desc': 'Automjete premium nga markat kryesore, të mirëmbajtura dhe të përditësuara rregullisht',
    'home.feature.24.7': 'Disponueshmëri 24/7',
    'home.feature.24.7.desc': 'Rezervoni në çdo kohë, merrni në çdo kohë - ne përshtatemi me orarin tuaj',
    'home.feature.insurance': 'Sigurim i Plotë',

    'home.feature.insurance.desc': 'Mbulim i plotë dhe qetësi mendore për çdo qera',

    'home.feature.locations': 'Lokacione të Shumta',
    'home.feature.locations.desc': 'Pika të përshtatshme marrjeje dhe kthimi në të gjithë Shqipërinë',
    'home.feature.service': 'Shërbim Premium',
    'home.feature.service.desc': 'Kujdes i jashtëzakonshëm për klientin dhe mbështetje gjatë gjithë udhëtimit tuaj',
    'home.feature.trusted': 'I Besuar nga Mijëra',
    'home.feature.trusted.desc': 'Bashkohuni me klientët tanë të kënaqur që zgjedhin 888Rent për besueshmëri',
    'home.cta.title': 'Gati për të Dalë në Rrugë?',
    'home.cta.subtitle': 'Rezervoni makinën tuaj të përsosur sot dhe përjetoni ndryshimin me 888Rent. Automjete premium, çmime konkurruese dhe shërbim i jashtëzakonshëm ju presin.',
    'home.cta.button': 'Filloni Rezervimin Tuaj',
    'home.stats.customers': 'Klientë të Kënaqur',
    'home.stats.vehicles': 'Automjete Premium',
    'home.stats.locations': 'Lokacione Marrjeje',
    'home.stats.support': 'Mbështetje Klienti',
    'home.contact.title': 'Kontaktoni',
    'home.contact.subtitle': 'Gati për të përjetuar ndryshimin 888Rent? Kontaktoni sot për të mësuar më shumë rreth shërbimeve tona ose për të bërë një rezervim.',
    'home.contact.phone': 'Telefon',
    'home.contact.email': 'Email',
    'home.contact.hours': 'Orari',
    'home.contact.hours.value': 'Shërbim 24/7 i Disponueshëm',

    // About Page
    'about.title': 'Rreth 888Rent',

    'about.subtitle': 'Partneri juaj i besuar për shërbime premium të makinave me qera në Shqipëri. Ne jemi të përkushtuar për ta bërë udhëtimin tuaj të rehatshëm, të sigurt dhe të paharrueshëm.',
    'about.story.title': 'Historia Jonë',
    'about.story.p1': 'E themeluar me një vizion për të revolucionarizuar shërbimet e makinave me qera në Shqipëri, 888Rent është rritur nga një biznes i vogël lokal në një emër të besuar në qeratë e automjeteve premium. Udhëtimi ynë filloi me një besim të thjeshtë: çdo klient meriton shërbim të jashtëzakonshëm dhe transport të besueshëm.',
    'about.story.p2': 'Sot, ne shërbejmë me krenari qindra klientë të kënaqur, nga udhëtarët e biznesit dhe turistët deri tek banorët lokalë që kanë nevojë për zgjidhje transporti të përkohshëm. Përkushtimi ynë ndaj cilësisë, besueshmërisë dhe kënaqësisë së klientit na ka bërë një zgjedhje të preferuar për makinat me qera në të gjithë Shqipërinë.',
    'about.story.p3': 'Ne vazhdojmë të investojmë në flotën tonë, teknologjinë dhe ekipin për të siguruar që çdo përvojë 888Rent të jetë e qetë, profesionale dhe të tejkalojë pritshmëritë.',
    'about.mission.title': 'Misioni Ynë',
    'about.mission.text': 'Të ofrojmë përvojat e jashtëzakonshme të makinave me qera që u mundësojnë klientëve tanë të eksplorojnë Shqipërinë me besim, rehati dhe përshtatshmëri.',
    'about.vision.title': 'Vizioni Ynë',
    'about.vision.text': 'Të jemi kompania kryesuese e makinave me qera në Shqipëri, e njohur për flotën tonë premium, shërbimin e shkëlqyer të klientit dhe zgjidhjet novatore që e bëjnë udhëtimin të lehtë.',
    'about.services.title': 'Shërbimet Tona',
    'about.services.subtitle': 'Ne ofrojmë zgjidhje gjithëpërfshirëse të makinave me qera të dizajnuara për të përmbushur nevojat e ndryshme të transportit me cilësi dhe shërbim të pakompromis.',

    'about.service.fleet.title': 'Flotë Premium',
    'about.service.fleet.desc': 'Automjetet tona të zgjedhura me kujdes përfaqësojnë më të mirën në përsosmërinë e automobilave. Nga sedanet luksoze deri tek kompaktet efikase, çdo makinë në flotën tonë është mirëmbajtur me kujdes dhe përditësuar rregullisht për të siguruar performancë dhe rehati optimale.',
    'about.service.scheduling.title': 'Planifikim Fleksibël',
    'about.service.scheduling.desc': 'Ne kuptojmë që planet e udhëtimit mund të ndryshojnë. Prandaj ne ofrojmë rezervim 24/7 dhe kohë fleksibël marrjeje/kthimi. Nëse keni nevojë për një makinë në agim ose në mesnatë, ne jemi këtu për t\'ju përshtatur orarit tuaj.',
    'about.service.locations.title': 'Lokacione Strategjike',
    'about.service.locations.desc': 'Me pika marrjeje në Aeroportin e Tiranës, Aeroportin e Vlorës dhe Portin e Vlorës, ne jemi pozicionuar atje ku ju keni më shumë nevojë. Lokacionet tona janë zgjedhur për përshtatshmëri dhe akses maksimal.',
    'about.service.protection.title': 'Mbrojtje e Plotë',

    'about.service.protection.desc': 'Çdo qera përfshin mbulim gjithëpërfshirës sigurimesh. Drejtoni me besim duke ditur se jeni plotësisht të mbrojtur. Paketat tona të sigurimeve janë dizajnuar për t\'ju dhënë qetësi mendore gjatë gjithë udhëtimit tuaj.',
    'about.why.choose.title': 'Pse të Zgjidhni 888Rent?',
    'about.why.choose.subtitle': 'Përkushtimi ynë ndaj përsosmërisë na dallon në tregun shqiptar të makinave me qera. Ja çfarë na bën zgjedhjen e preferuar për klientët e kujdesshëm.',
    'about.why.customer.title': 'Qasje e Centruar tek Klienti',
    'about.why.customer.desc': 'Kënaqësia juaj është prioriteti ynë. Ekipi ynë i përkushtuar bën më shumë se sa duhet për të siguruar që çdo aspekt i përvojës suaj të qerasë të tejkalojë pritshmëritë.',
    'about.why.excellence.title': 'Përsosmëri e Provuar',
    'about.why.excellence.desc': 'Vitet e përvojës në tregun shqiptar të makinave me qera na kanë mësuar se çfarë ka më shumë rëndësi për klientët tanë. Ne kemi rafinuar shërbimet tona bazuar në reagime dhe nevoja reale.',

    'about.why.expertise.title': 'Ekspertizë Lokale',
    'about.why.expertise.desc': 'Si një kompani lokale shqiptare, ne kuptojmë nevojat unike të banorëve dhe vizitorëve. Ne ofrojmë njohuri nga brenda dhe rekomandime të personalizuara.',
    'about.why.process.title': 'Proces i Shpejtë dhe i Lehtë',
    'about.why.process.desc': 'Procesi ynë i thjeshtuar i rezervimit ju çon në rrugë më shpejt. Rezervime të thjeshta online, dokumentacion i shpejtë dhe dorëzim efikas i automjetit ju kursejnë kohë të çmuar.',

    // Cars Page
    'cars.title': 'Flota Jonë Premium',
    'cars.subtitle': 'Zgjidhni nga koleksioni ynë i zgjedhur me kujdes i automjeteve premium. Çdo makinë është mirëmbajtur në standardet më të larta dhe gati për udhëtimin tuaj.',
    'cars.see.more': 'Shiko më shumë',
    'cars.seats': 'Vende',
    'cars.reserve.now': 'Rezervo Tani',
    'cars.description': 'Përshkrimi',
    'cars.features': 'Karakteristikat',
    'cars.reviews': 'Vlerësimet e Klientëve',
    'cars.no.reviews': 'Ende pa vlerësime',
    'cars.loading': 'Duke ngarkuar makinat...',

    // Reserve Page
    'reserve.title': 'Rezervoni Makinën Tuaj',
    'reserve.step.dates': 'Datat dhe Lokacioni',
    'reserve.step.car': 'Zgjidhni Makinën',
    'reserve.step.details': 'Detajet e Klientit',
    'reserve.when.where': 'Kur dhe Ku?',
    'reserve.pickup.details': 'Detajet e Marrjes',
    'reserve.pickup.date': 'Data e Marrjes',
    'reserve.pickup.time': 'Ora e Marrjes',
    'reserve.pickup.location': 'Lokacioni i Marrjes',
    'reserve.dropoff.details': 'Detajet e Kthimit',
    'reserve.dropoff.date': 'Data e Kthimit',
    'reserve.dropoff.time': 'Ora e Kthimit',
    'reserve.dropoff.location': 'Lokacioni i Kthimit',
    'reserve.select.time': 'Zgjidhni orën',
    'reserve.select.location': 'Zgjidhni lokacionin',
    'reserve.next': 'Tjetër',
    'reserve.back': 'Mbrapa',
    'reserve.available.cars': 'Makinat e Disponueshme',
    'reserve.customer.details': 'Detajet e Klientit',
    'reserve.full.name': 'Emri i Plotë',
    'reserve.email': 'Adresa Email',
    'reserve.phone': 'Numri i Telefonit',
    'reserve.license': 'Ngarko Patentën e Drejtimit',
    'reserve.summary': 'Përmbledhja e Rezervimit',
    'reserve.car': 'Makina',
    'reserve.pickup': 'Marrja',
    'reserve.dropoff': 'Kthimi',
    'reserve.location': 'Lokacioni',
    'reserve.total': 'Totali',
    'reserve.confirm': 'Konfirmo Rezervimin',
    'reserve.creating': 'Duke krijuar rezervimin...',

    // Profile Page
    'profile.title': 'Mirësevini përsëri',
    'profile.subtitle': 'Menaxhoni rezervimet dhe vlerësimet tuaja',
    'profile.reservations': 'Rezervimet e Mia',
    'profile.reviews': 'Vlerësimet e Mia',
    'profile.no.reservations': 'Ende pa rezervime',
    'profile.no.reviews': 'Ende pa vlerësime',
    'profile.write.review': 'Shkruaj Vlerësim',
    'profile.loading': 'Duke ngarkuar profilin tuaj...',
    'profile.login.required': 'Ju lutemi hyni për të parë profilin tuaj',

    // Admin Page
    'admin.title': 'Paneli i Administratorit',

    'admin.subtitle': 'Menaxhoni biznesin tuaj të makinave me qera',

    'admin.overview': 'Përmbledhje',
    'admin.cars': 'Makinat',
    'admin.reservations': 'Rezervimet',
    'admin.users': 'Përdoruesit',
    'admin.business.overview': 'Përmbledhja e Biznesit',
    'admin.total.cars': 'Totali i Makinave',
    'admin.active.reservations': 'Rezervime Aktive',
    'admin.total.users': 'Totali i Përdoruesve',
    'admin.available.cars': 'Makina të Disponueshme',
    'admin.total.reservations': 'Totali i Rezervimeve',
    'admin.total.revenue': 'Të Ardhurat Totale',
    'admin.manage.cars': 'Menaxho Makinat',
    'admin.add.car': 'Shto Makinë',
    'admin.edit': 'Ndrysho',
    'admin.delete': 'Fshi',
    'admin.available': 'E Disponueshme',
    'admin.unavailable': 'Jo e Disponueshme',
    'admin.manage.reservations': 'Menaxho Rezervimet',
    'admin.customer': 'Klienti',
    'admin.car': 'Makina',
    'admin.dates': 'Datat',
    'admin.total': 'Totali',
    'admin.status': 'Statusi',
    'admin.actions': 'Veprimet',
    'admin.confirm': 'Konfirmo',
    'admin.cancel': 'Anulo',
    'admin.registered.users': 'Përdorues të Regjistruar',
    'admin.name': 'Emri',
    'admin.email': 'Email',
    'admin.phone': 'Telefoni',
    'admin.role': 'Roli',
    'admin.admin': 'Administrator',
    'admin.user': 'Përdorues',
    'admin.access.denied': 'Aksesi i Mohuar',
    'admin.no.permission': 'Nuk keni leje për të hyrë në këtë faqe.',

    // Auth Modal
    'auth.signin': 'Hyrje',
    'auth.create.account': 'Krijo Llogari',
    'auth.full.name': 'Emri i Plotë',
    'auth.phone.number': 'Numri i Telefonit',
    'auth.email.username': 'Adresa Email ose Emri i Përdoruesit',
    'auth.email.address': 'Adresa Email',
    'auth.password': 'Fjalëkalimi',
    'auth.please.wait': 'Ju lutemi prisni...',
    'auth.no.account': 'Nuk keni llogari?',
    'auth.have.account': 'Keni tashmë një llogari?',
    'auth.sign.up': 'Regjistrohuni',
    'auth.sign.in': 'Hyni',

    // Common
    'common.loading': 'Duke ngarkuar...',
    'common.day': 'ditë',
    'common.pending': 'në pritje',
    'common.confirmed': 'konfirmuar',
    'common.cancelled': 'anuluar',
    'common.completed': 'përfunduar',
    'common.automatic': 'Automatik',
    'common.manual': 'Manual',
    'common.petrol': 'Benzinë',
    'common.diesel': 'Naftë',
    'common.petrol.gas': 'Benzinë + Gaz',
  }
};

export const TranslationProvider: React.FC<TranslationProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');


  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const value: TranslationContextType = {
    language,
    setLanguage,
    t
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};