const express = require('express');
const Event = require('../models/Event');

const router = express.Router();

router.get('/:id.ics', async (req, res) => {
  try {
    const ev = await Event.findById(req.params.id).populate('church','name');
    if (!ev) return res.status(404).send('Evento não encontrado');
    const dt = new Date(ev.date);
    const [h, m] = (ev.time || '00:00').split(':').map(Number);
    dt.setHours(h||0, m||0, 0, 0);
    const uid = `${ev._id}@${req.get('host')}`;
    const dtstamp = dt.toISOString().replace(/[-:]/g,'').split('.')[0]+'Z';
    const dtend = new Date(dt.getTime()+60*60*1000).toISOString().replace(/[-:]/g,'').split('.')[0]+'Z';
    const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//ConnectFe//EN\nBEGIN:VEVENT\nUID:${uid}\nDTSTAMP:${dtstamp}\nDTSTART:${dtstamp}\nDTEND:${dtend}\nSUMMARY:${ev.title}\nDESCRIPTION:${(ev.description||'').replace(/\n/g,' ')}\nLOCATION:${(ev.location||'').replace(/\n/g,' ')}\nEND:VEVENT\nEND:VCALENDAR`;
    res.setHeader('Content-Type','text/calendar; charset=utf-8');
    res.setHeader('Content-Disposition',`attachment; filename="event-${ev._id}.ics"`);
    res.send(ics);
  } catch (error) {
    console.error('ICS error:', error);
    res.status(500).send('Erro ao gerar ICS');
  }
});

module.exports = router;

