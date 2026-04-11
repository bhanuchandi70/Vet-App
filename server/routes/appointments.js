const express = require('express');
const { getDb } = require('../db/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// POST /api/appointments — book an appointment
router.post('/', authenticateToken, (req, res) => {
  const { vet_id, pet_name, pet_type, pet_age, appointment_date, appointment_time, reason } = req.body;

  if (!vet_id || !pet_name || !pet_type || !appointment_date || !appointment_time) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Validate date is not in the past
  const apptDate = new Date(appointment_date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (apptDate < today) {
    return res.status(400).json({ error: 'Appointment date cannot be in the past' });
  }

  const db = getDb();

  // Check vet exists
  const vet = db.prepare('SELECT id, name FROM vets WHERE id = ?').get(vet_id);
  if (!vet) return res.status(404).json({ error: 'Vet not found' });

  // Check slot is not already booked
  const conflict = db.prepare(
    'SELECT id FROM appointments WHERE vet_id = ? AND appointment_date = ? AND appointment_time = ? AND status != ?'
  ).get(vet_id, appointment_date, appointment_time, 'cancelled');

  if (conflict) {
    return res.status(409).json({ error: 'This time slot is already booked. Please choose another.' });
  }

  const result = db.prepare(`
    INSERT INTO appointments (user_id, vet_id, pet_name, pet_type, pet_age, appointment_date, appointment_time, reason)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(req.user.id, vet_id, pet_name, pet_type, pet_age || null, appointment_date, appointment_time, reason || null);

  const appointment = db.prepare(`
    SELECT a.*, v.name as vet_name, v.clinic_name, v.area, v.phone as vet_phone, v.consultation_fee
    FROM appointments a
    JOIN vets v ON a.vet_id = v.id
    WHERE a.id = ?
  `).get(result.lastInsertRowid);

  res.status(201).json(appointment);
});

// GET /api/appointments — get current user's appointments
router.get('/', authenticateToken, (req, res) => {
  const db = getDb();
  const appointments = db.prepare(`
    SELECT a.*, v.name as vet_name, v.clinic_name, v.area, v.phone as vet_phone,
           v.consultation_fee, v.specialization
    FROM appointments a
    JOIN vets v ON a.vet_id = v.id
    WHERE a.user_id = ?
    ORDER BY a.appointment_date DESC, a.appointment_time DESC
  `).all(req.user.id);

  res.json(appointments);
});

// PATCH /api/appointments/:id/cancel — cancel an appointment
router.patch('/:id/cancel', authenticateToken, (req, res) => {
  const db = getDb();
  const appointment = db.prepare(
    'SELECT * FROM appointments WHERE id = ? AND user_id = ?'
  ).get(req.params.id, req.user.id);

  if (!appointment) {
    return res.status(404).json({ error: 'Appointment not found' });
  }

  if (appointment.status === 'cancelled') {
    return res.status(400).json({ error: 'Appointment is already cancelled' });
  }

  // Check if appointment is in the future
  const apptDateTime = new Date(`${appointment.appointment_date}T${appointment.appointment_time}`);
  if (apptDateTime < new Date()) {
    return res.status(400).json({ error: 'Cannot cancel a past appointment' });
  }

  db.prepare('UPDATE appointments SET status = ? WHERE id = ?').run('cancelled', appointment.id);

  res.json({ message: 'Appointment cancelled successfully' });
});

module.exports = router;
