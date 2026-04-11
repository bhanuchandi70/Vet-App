const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, '../vet_app.db');

let db;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  }
  return db;
}

function initializeDatabase() {
  const db = getDb();

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      phone TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS vets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      specialization TEXT NOT NULL,
      qualifications TEXT NOT NULL,
      experience_years INTEGER NOT NULL,
      clinic_name TEXT NOT NULL,
      area TEXT NOT NULL,
      city TEXT NOT NULL DEFAULT 'Delhi NCR',
      address TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      rating REAL DEFAULT 4.5,
      review_count INTEGER DEFAULT 0,
      consultation_fee INTEGER NOT NULL,
      image_url TEXT,
      about TEXT,
      pet_types TEXT NOT NULL,
      languages TEXT DEFAULT 'Hindi, English',
      available_days TEXT NOT NULL,
      slot_duration INTEGER DEFAULT 30,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      vet_id INTEGER NOT NULL,
      pet_name TEXT NOT NULL,
      pet_type TEXT NOT NULL,
      pet_age TEXT,
      appointment_date TEXT NOT NULL,
      appointment_time TEXT NOT NULL,
      reason TEXT,
      status TEXT DEFAULT 'confirmed',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (vet_id) REFERENCES vets(id)
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vet_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
      comment TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (vet_id) REFERENCES vets(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);

  seedVetsIfEmpty(db);

  console.log('Database initialized successfully');
}

function seedVetsIfEmpty(db) {
  const count = db.prepare('SELECT COUNT(*) as count FROM vets').get();
  if (count.count > 0) return;

  const vets = [
    {
      name: 'Dr. Rajesh Kumar',
      specialization: 'Small Animal Medicine',
      qualifications: 'BVSc & AH, MVSc (Small Animal Medicine), IVSA Member',
      experience_years: 15,
      clinic_name: 'PetCare Clinic Gurugram',
      area: 'Gurugram',
      address: 'Shop 14, DLF Phase 2, Sikanderpur, Gurugram, Haryana 122002',
      phone: '+91 98765 43210',
      email: 'dr.rajesh@petcaregurugram.com',
      rating: 4.8,
      review_count: 312,
      consultation_fee: 600,
      about: 'Dr. Rajesh Kumar is a highly experienced veterinarian specializing in small animals. He has treated thousands of pets over 15 years and is known for his gentle approach and accurate diagnoses. He completed his MVSc from IVRI Bareilly and has trained in advanced surgical techniques.',
      pet_types: 'Dogs,Cats,Rabbits',
      languages: 'Hindi, English',
      available_days: 'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
      slot_duration: 30,
    },
    {
      name: 'Dr. Priya Sharma',
      specialization: 'Exotic Animal & Avian Medicine',
      qualifications: 'BVSc & AH, MVSc (Exotic Animals), Certified Avian Vet',
      experience_years: 8,
      clinic_name: 'Exotic Paws Clinic',
      area: 'Noida Sector 18',
      address: 'A-47, Sector 18, Noida, Uttar Pradesh 201301',
      phone: '+91 98112 34567',
      email: 'dr.priya@exoticpaws.in',
      rating: 4.7,
      review_count: 198,
      consultation_fee: 800,
      about: 'Dr. Priya Sharma is Delhi NCR\'s leading exotic animal veterinarian, specializing in birds, reptiles, and small mammals. She completed her exotic animal medicine certification from Tufts University and has a special interest in avian surgery and husbandry.',
      pet_types: 'Birds,Reptiles,Rabbits,Guinea Pigs,Hamsters',
      languages: 'Hindi, English',
      available_days: 'Monday,Wednesday,Friday,Saturday,Sunday',
      slot_duration: 45,
    },
    {
      name: 'Dr. Amit Singh',
      specialization: 'Veterinary Surgery & Oncology',
      qualifications: 'BVSc & AH, MVSc (Surgery), PhD (Oncology), FVSA',
      experience_years: 20,
      clinic_name: 'Advanced Vet Surgery Centre',
      area: 'Saket, South Delhi',
      address: '3rd Floor, Select CityWalk Complex, Saket, New Delhi 110017',
      phone: '+91 99100 11223',
      email: 'dr.amit@advsurgery.com',
      rating: 4.9,
      review_count: 547,
      consultation_fee: 1200,
      about: 'Dr. Amit Singh is one of the most accomplished veterinary surgeons in India with 20 years of experience. He specializes in complex soft tissue and orthopedic surgeries and is the only veterinary oncologist in Delhi NCR. He has performed over 5000 successful surgeries.',
      pet_types: 'Dogs,Cats',
      languages: 'Hindi, English, Punjabi',
      available_days: 'Tuesday,Wednesday,Thursday,Friday,Saturday',
      slot_duration: 60,
    },
    {
      name: 'Dr. Neha Gupta',
      specialization: 'Veterinary Dentistry & Oral Surgery',
      qualifications: 'BVSc & AH, Certified Veterinary Dentist (AVDC)',
      experience_years: 10,
      clinic_name: 'DentaPet Clinic',
      area: 'Dwarka Sector 12',
      address: 'Plot 22, Pocket 3, Sector 12, Dwarka, New Delhi 110075',
      phone: '+91 97184 56789',
      email: 'dr.neha@dentapet.com',
      rating: 4.6,
      review_count: 163,
      consultation_fee: 700,
      about: 'Dr. Neha Gupta is a certified veterinary dentist and one of the few specialists in dental care for pets in Delhi NCR. She offers comprehensive dental services including cleaning, extractions, root canals, and orthodontic care for dogs and cats.',
      pet_types: 'Dogs,Cats',
      languages: 'Hindi, English',
      available_days: 'Monday,Tuesday,Thursday,Friday,Saturday',
      slot_duration: 45,
    },
    {
      name: 'Dr. Vikram Patel',
      specialization: 'Emergency & Critical Care',
      qualifications: 'BVSc & AH, MVSc (Critical Care), VECCS Certified',
      experience_years: 12,
      clinic_name: 'PetER Emergency Hospital',
      area: 'Faridabad',
      address: 'Sector 15, Near YMCA, Faridabad, Haryana 121007',
      phone: '+91 98304 78901',
      email: 'dr.vikram@peter-emergency.com',
      rating: 4.5,
      review_count: 289,
      consultation_fee: 900,
      about: 'Dr. Vikram Patel runs the only dedicated 24/7 emergency veterinary hospital in Faridabad. With 12 years of critical care experience, he has saved countless lives. His clinic is equipped with ICU, ventilators, and advanced monitoring equipment for critically ill pets.',
      pet_types: 'Dogs,Cats,Birds,Rabbits',
      languages: 'Hindi, English, Gujarati',
      available_days: 'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
      slot_duration: 30,
    },
    {
      name: 'Dr. Sunita Rao',
      specialization: 'Veterinary Dermatology',
      qualifications: 'BVSc & AH, MVSc (Dermatology), ECVD Diplomat',
      experience_years: 7,
      clinic_name: 'DermaPet Clinic',
      area: 'Noida Sector 62',
      address: 'B-12, Sector 62, Noida, Uttar Pradesh 201309',
      phone: '+91 96502 34561',
      email: 'dr.sunita@dermapet.in',
      rating: 4.7,
      review_count: 142,
      consultation_fee: 850,
      about: 'Dr. Sunita Rao is a board-certified veterinary dermatologist specializing in skin diseases, allergies, and ear conditions in pets. She is trained in intradermal skin testing and immunotherapy and regularly conducts workshops on pet skin health across NCR.',
      pet_types: 'Dogs,Cats,Rabbits',
      languages: 'Hindi, English, Kannada',
      available_days: 'Monday,Wednesday,Friday,Saturday',
      slot_duration: 45,
    },
    {
      name: 'Dr. Arjun Mehta',
      specialization: 'Veterinary Orthopedics & Rehabilitation',
      qualifications: 'BVSc & AH, MVSc (Orthopedics), Certified Canine Rehabilitation Therapist',
      experience_years: 18,
      clinic_name: 'OrthoVet & Rehab Centre',
      area: 'Cyber City, Gurugram',
      address: 'Tower B, DLF Cyber City, Sector 24, Gurugram, Haryana 122002',
      phone: '+91 98712 90123',
      email: 'dr.arjun@orthovet.com',
      rating: 4.8,
      review_count: 378,
      consultation_fee: 1000,
      about: 'Dr. Arjun Mehta is a specialist in veterinary orthopedics and physical rehabilitation. He has performed over 3000 orthopedic procedures including hip replacements, cruciate ligament repairs, and fracture fixations. He also offers comprehensive rehabilitation therapy with hydrotherapy and physiotherapy.',
      pet_types: 'Dogs,Cats',
      languages: 'Hindi, English',
      available_days: 'Tuesday,Wednesday,Thursday,Friday,Saturday',
      slot_duration: 60,
    },
    {
      name: 'Dr. Kavita Joshi',
      specialization: 'Small Animal Medicine & Preventive Care',
      qualifications: 'BVSc & AH, MVSc (Internal Medicine)',
      experience_years: 9,
      clinic_name: 'Happy Paws Clinic',
      area: 'Preet Vihar, East Delhi',
      address: '45 Vikas Marg, Preet Vihar, Delhi 110092',
      phone: '+91 95821 67890',
      email: 'dr.kavita@happypaws.com',
      rating: 4.6,
      review_count: 224,
      consultation_fee: 500,
      about: 'Dr. Kavita Joshi is a compassionate veterinarian known for her patient-centred approach and excellent client communication. She focuses on preventive care, nutrition counselling, and early disease detection. Her clinic in East Delhi is one of the most accessible and affordable quality vet services in the area.',
      pet_types: 'Dogs,Cats,Guinea Pigs',
      languages: 'Hindi, English',
      available_days: 'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
      slot_duration: 30,
    },
    {
      name: 'Dr. Raman Batra',
      specialization: 'Large & Farm Animal Medicine',
      qualifications: 'BVSc & AH, MVSc (Large Animal Medicine)',
      experience_years: 14,
      clinic_name: 'Batra Large Animal Clinic',
      area: 'Ghaziabad',
      address: 'Near UPSIDC, Loni Road, Ghaziabad, Uttar Pradesh 201102',
      phone: '+91 98993 45678',
      email: 'dr.raman@batraclinic.com',
      rating: 4.4,
      review_count: 91,
      consultation_fee: 600,
      about: 'Dr. Raman Batra is a large animal specialist serving the farming communities around Ghaziabad. He has extensive experience with cattle, buffaloes, horses, and goats. He also provides farm visit services and assists urban residents who keep horses or small livestock.',
      pet_types: 'Cattle,Horses,Goats,Sheep,Dogs',
      languages: 'Hindi, English, Haryanvi',
      available_days: 'Monday,Tuesday,Wednesday,Thursday,Friday',
      slot_duration: 45,
    },
    {
      name: 'Dr. Anita Verma',
      specialization: 'General Veterinary Practice & Nutrition',
      qualifications: 'BVSc & AH, Certified Pet Nutritionist',
      experience_years: 6,
      clinic_name: 'NutriVet Clinic',
      area: 'Noida Extension (Greater Noida West)',
      address: 'GH-6, Sector 1, Noida Extension, Gautam Buddh Nagar 201306',
      phone: '+91 97112 23456',
      email: 'dr.anita@nutrivetclinic.com',
      rating: 4.5,
      review_count: 117,
      consultation_fee: 450,
      about: 'Dr. Anita Verma combines general veterinary practice with specialized knowledge in pet nutrition. She offers tailored diet plans for pets with chronic conditions like obesity, diabetes, and kidney disease. Her clinic in Noida Extension serves the rapidly growing residential community in the area.',
      pet_types: 'Dogs,Cats,Rabbits,Hamsters',
      languages: 'Hindi, English',
      available_days: 'Monday,Wednesday,Thursday,Friday,Saturday,Sunday',
      slot_duration: 30,
    },
    {
      name: 'Dr. Suresh Nair',
      specialization: 'Veterinary Neurology & Internal Medicine',
      qualifications: 'BVSc & AH, MVSc, PhD (Neurology), DECVN Diplomat',
      experience_years: 22,
      clinic_name: 'NeuroVet Institute',
      area: 'Hauz Khas, South Delhi',
      address: '7B, Sri Aurobindo Marg, Hauz Khas, New Delhi 110016',
      phone: '+91 99990 12345',
      email: 'dr.suresh@neurovet.in',
      rating: 4.9,
      review_count: 634,
      consultation_fee: 1500,
      about: 'Dr. Suresh Nair is the foremost veterinary neurologist in India with a PhD in Neurology and European board certification. He specializes in epilepsy, intervertebral disc disease, brain tumours, and neuromuscular disorders. He has published over 40 research papers and trains other vets across India.',
      pet_types: 'Dogs,Cats',
      languages: 'Hindi, English, Malayalam',
      available_days: 'Monday,Tuesday,Wednesday,Thursday,Friday',
      slot_duration: 60,
    },
    {
      name: 'Dr. Pooja Agarwal',
      specialization: 'Veterinary Ophthalmology',
      qualifications: 'BVSc & AH, MVSc (Ophthalmology), DACVO Diplomat',
      experience_years: 11,
      clinic_name: 'PetEye Vision Centre',
      area: 'Dwarka Sector 23',
      address: 'Plot 8, Sector 23, Dwarka, New Delhi 110077',
      phone: '+91 96710 34567',
      email: 'dr.pooja@peteye.com',
      rating: 4.7,
      review_count: 203,
      consultation_fee: 900,
      about: 'Dr. Pooja Agarwal is a board-certified veterinary ophthalmologist and one of only three such specialists in Delhi NCR. She diagnoses and treats cataracts, glaucoma, retinal diseases, corneal ulcers, and performs phacoemulsification (cataract surgery). Her clinic has the latest slit lamp and electroretinography equipment.',
      pet_types: 'Dogs,Cats,Birds,Rabbits',
      languages: 'Hindi, English',
      available_days: 'Tuesday,Wednesday,Friday,Saturday,Sunday',
      slot_duration: 45,
    },
  ];

  const insert = db.prepare(`
    INSERT INTO vets (name, specialization, qualifications, experience_years, clinic_name, area, address, phone, email, rating, review_count, consultation_fee, about, pet_types, languages, available_days, slot_duration)
    VALUES (@name, @specialization, @qualifications, @experience_years, @clinic_name, @area, @address, @phone, @email, @rating, @review_count, @consultation_fee, @about, @pet_types, @languages, @available_days, @slot_duration)
  `);

  const insertMany = db.transaction((vets) => {
    for (const vet of vets) insert.run(vet);
  });

  insertMany(vets);
  console.log(`Seeded ${vets.length} vets into database`);
}

module.exports = { getDb, initializeDatabase };
