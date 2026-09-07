import { Router } from 'express';
import { supabase } from '../config/supabase';
import { requireAuth } from '../middlewares/authMiddleware';
import { sendContactNotificationEmail } from '../services/emailService';

const router = Router();

// GET all contact messages (for admin dashboard)
router.get('/', requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (error: any) {
    // If table doesn't exist yet, return empty array gracefully
    console.error('Error fetching contact messages:', error.message);
    res.json([]);
  }
});

// PATCH – mark a contact message as read
router.patch('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const { data, error } = await supabase
      .from('contact_messages')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST – submit contact form
router.post('/', async (req, res) => {
  const { firstName, lastName, company, email, phone, subject, message } = req.body;

  // 1. Save to contact_messages table in Supabase
  try {
    await supabase.from('contact_messages').insert([{
      first_name: firstName,
      last_name: lastName,
      company: company || null,
      email,
      phone: phone || null,
      subject,
      message,
      status: 'New'
    }]);
  } catch (dbError: any) {
    console.error('Failed to save contact message to DB:', dbError.message);
    // Don't fail the whole request if DB write fails — still try email
  }

  // 2. Also add/update customer CRM record
  try {
    await supabase.from('customers').insert([{
      full_name: `${firstName} ${lastName}`.trim(),
      company_name: company || null,
      email,
      phone: phone || null,
      status: 'Lead',
      notes: `Contact Form Inquiry\nSubject: ${subject}\nMessage: ${message}`
    }]);
  } catch (dbError: any) {
    // Ignore duplicate email errors silently
    if (!dbError.message?.includes('duplicate')) {
      console.error('Failed to add contact inquiry to customers CRM:', dbError.message);
    }
  }

  // 3. Send email notification to info@smartgrits.com via Hostinger Mail API
  try {
    await sendContactNotificationEmail({
      firstName,
      lastName,
      company,
      email,
      phone,
      subject,
      message,
    });
  } catch (emailError: any) {
    console.error('Failed to send contact notification email via Hostinger:', emailError.message);
  }

  // 4. Send to Google Sheets via Apps Script Webhook
  try {
    if (process.env.GOOGLE_SCRIPT_URL) {
      const response = await fetch(process.env.GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, company, email, phone, subject, message }),
      });
      const responseText = await response.text();
      console.log('Google Sheets Response:', response.status, responseText);
    } else {
      console.warn('GOOGLE_SCRIPT_URL not configured. Skipping Google Sheets integration.');
    }
  } catch (sheetsError: any) {
    console.error('Failed to send contact details to Google Sheets:', sheetsError.message);
  }

  res.status(200).json({ success: true, message: 'Your message has been received!' });
});

export default router;
