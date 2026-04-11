const express = require('express');
const { getDb } = require('../db/database');

const router = express.Router();

// GET /api/vets — list all vets with optional filters
router.get('/', (req, res) => {
  const { area, specialization, pet_type, search, sort } = req.query;
  const db = getDb();

  let query = 'SELECT * FROM vets WHERE 1=1';
  const params = [];

  if (area && area !== 'all') {
    query += ' AND area LIKE ?';
    params.push(`%${area}%`);
  }

  if (specialization && specialization !== 'all') {
    query += ' AND specialization LIKE ?';
    params.push(`%${specialization}%`);
  }

  if (pet_type && pet_type !== 'all') {
    query += ' AND pet_types LIKE ?';
    params.push(`%${pet_type}%`);
  }

  if (search) {
    query += ' AND (name LIKE ? OR specialization LIKE ? OR clinic_name LIKE ? OR area LIKE ?)';
    const term = `%${search}%`;
    params.push(term, term, term, term);
  }

  if (sort === 'rating') {
    query += ' ORDER BY rating DESC';
  } else if (sort === 'fee_asc') {
    query += ' ORDER BY consultation_fee ASC';
  } else if (sort === 'fee_desc') {
    query += ' ORDER BY consultation_fee DESC';
  } else if (sort === 'experience') {
    query += ' ORDER BY experience_years DESC';
  } else {
    query += ' ORDER BY rating DESC';
  }

  const vets = db.prepare(query).all(...params);
  const parsed = vets.map(v => ({
    ...v,
    pet_types: v.pet_types.split(','),
    available_days: v.available_days.split(','),
  }));

  res.json(parsed);
});

// GET /api/vets/areas — list distinct areas
router.get('/areas', (req, res) => {
  const db = getDb();
  const rows = db.prepare('SELECT DISTINCT area FROM vets ORDER BY area').all();
  res.json(rows.map(r => r.area));
});

// GET /api/vets/specializations — list distinct specializations
router.get('/specializations', (req, res) => {
  const db = getDb();
  const rows = db.prepare('SELECT DISTINCT specialization FROM vets ORDER BY specialization').all();
  res.json(rows.map(r => r.specialization));
});

// GET /api/vets/:id
router.get('/:id', (req, res) => {
  const db = getDb();
  const vet = db.prepare('SELECT * FROM vets WHERE id = ?').get(req.params.id);
  if (!vet) return res.status(404).json({ error: 'Vet not found' });

  const reviews = db.prepare(`
    SELECT r.rating, r.comment, r.created_at, u.name as user_name
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    WHERE r.vet_id = ?
    ORDER BY r.created_at DESC
    LIMIT 10
  `).all(req.params.id);

  res.json({
    ...vet,
    pet_types: vet.pet_types.split(','),
    available_days: vet.available_days.split(','),
    reviews,
  });
});

// GET /api/vets/:id/slots — get available time slots for a date
router.get('/:id/slots', (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ error: 'Date is required' });

  const db = getDb();
  const vet = db.prepare('SELECT available_days, slot_duration FROM vets WHERE id = ?').get(req.params.id);
  if (!vet) return res.status(404).json({ error: 'Vet not found' });

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const d = new Date(date);
  const dayName = dayNames[d.getDay()];

  const availableDays = vet.available_days.split(',');
  if (!availableDays.includes(dayName)) {
    return res.json({ available: false, slots: [] });
  }

  // Generate slots from 9:00 AM to 7:00 PM
  const slots = [];
  const start = 9 * 60; // 9:00 AM in minutes
  const end = 19 * 60;  // 7:00 PM in minutes
  const duration = vet.slot_duration;

  for (let t = start; t + duration <= end; t += duration) {
    const hours = Math.floor(t / 60);
    const mins = t % 60;
    const label = `${hours > 12 ? hours - 12 : hours}:${mins.toString().padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`;
    const value = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    slots.push({ label, value });
  }

  // Check booked slots for that date
  const booked = db.prepare(
    'SELECT appointment_time FROM appointments WHERE vet_id = ? AND appointment_date = ? AND status != ?'
  ).all(req.params.id, date, 'cancelled');

  const bookedTimes = new Set(booked.map(b => b.appointment_time));
  const available = slots.filter(s => !bookedTimes.has(s.value));

  res.json({ available: true, slots: available });
});

module.exports = router;
