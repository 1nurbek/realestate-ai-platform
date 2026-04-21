const router = require('express').Router();

router.post('/register', (_req, res) => res.status(501).json({ message: 'Not implemented' }));
router.post('/login', (_req, res) => res.status(501).json({ message: 'Not implemented' }));
router.post('/refresh', (_req, res) => res.status(501).json({ message: 'Not implemented' }));
router.get('/me', (_req, res) => res.status(501).json({ message: 'Not implemented' }));

module.exports = router;