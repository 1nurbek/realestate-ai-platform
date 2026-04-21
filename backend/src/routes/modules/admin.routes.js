const router = require('express').Router();

router.get('/dashboard', (_req, res) => res.status(501).json({ message: 'Not implemented' }));
router.get('/users', (_req, res) => res.status(501).json({ message: 'Not implemented' }));
router.get('/properties', (_req, res) => res.status(501).json({ message: 'Not implemented' }));
router.patch('/properties/:id/status', (_req, res) => res.status(501).json({ message: 'Not implemented' }));

module.exports = router;