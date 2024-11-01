import { Router } from 'express';
import passport from '../config/passportConfig';
import { successfulLogin, checkAuthStatus, logout } from '../controllers/authController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

router.get('/discord', passport.authenticate('discord'));
router.get('/discord/callback', passport.authenticate('discord', { failureRedirect: '/' }), successfulLogin);
router.get('/status', authenticateJWT, checkAuthStatus);
router.get('/logout', logout);

export default router;