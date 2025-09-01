const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware de validação
const validateRegistration = [
  body('name').trim().isLength({ min: 2 }).withMessage('Nome deve ter pelo menos 2 caracteres'),
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres'),
  body('userType').isIn(['church', 'user']).withMessage('Tipo de usuário inválido'),
  // Campos extras quando igreja
  body('churchData.address').optional().isString(),
  body('churchData.pixKey').optional().isString(),
  body('churchData.denomination').optional().isString(),
];

const validateLogin = [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').notEmpty().withMessage('Senha é obrigatória'),
  body('userType').isIn(['church', 'user']).withMessage('Tipo de usuário inválido'),
];

// Registro
router.post('/register', validateRegistration, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, userType, ...additionalData } = req.body;

    // Verificar se usuário já existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    // Criar usuário
    const userData = {
      name,
      email,
      password,
      userType,
      ...(userType === 'church' ? {
        churchData: {
          address: additionalData.churchData?.address || '',
          pixKey: additionalData.churchData?.pixKey || '',
          denomination: additionalData.churchData?.denomination || '',
          phone: additionalData.churchData?.phone || '',
          instagram: additionalData.churchData?.instagram || '',
          website: additionalData.churchData?.website || '',
        }
      } : {}),
      ...additionalData
    };

    const user = new User(userData);
    await user.save();

    // Gerar token
    const token = jwt.sign(
      { userId: user._id, userType: user.userType },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      success: true,
      token,
      user: user.getPublicData()
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Login
router.post('/login', validateLogin, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, userType } = req.body;

    // Buscar usuário
    const user = await User.findOne({ email, userType });
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Verificar senha
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Gerar token
    const token = jwt.sign(
      { userId: user._id, userType: user.userType },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      token,
      user: user.getPublicData()
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Login social
router.post('/social', async (req, res) => {
  try {
    const { provider, token, userType, userData } = req.body;

    // Verificar token com o provedor (implementar validação real)
    // Por enquanto, simular validação
    
    let user = await User.findOne({
      'socialLogin.provider': provider,
      'socialLogin.providerId': userData.id,
      userType
    });

    if (!user) {
      // Criar novo usuário
      user = new User({
        name: userData.name,
        email: userData.email,
        userType,
        profileImage: userData.picture,
        socialLogin: {
          provider,
          providerId: userData.id
        }
      });
      await user.save();
    }

    // Gerar token
    const jwtToken = jwt.sign(
      { userId: user._id, userType: user.userType },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      token: jwtToken,
      user: user.getPublicData()
    });
  } catch (error) {
    console.error('Erro no login social:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Verificar token
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    res.json({
      success: true,
      user: user.getPublicData()
    });
  } catch (error) {
    console.error('Erro na verificação do token:', error);
    res.status(401).json({ error: 'Token inválido' });
  }
});

// Atualizar token de push notification
router.put('/push-token', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const { expoPushToken } = req.body;
    
    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    await User.findByIdAndUpdate(decoded.userId, { expoPushToken });

    res.json({ success: true });
  } catch (error) {
    console.error('Erro ao atualizar push token:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar perfil do usuário
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, email, profileImage, city, denomination, ministry, churchData } = req.body;
    
    const updateData = {};
    
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (city) updateData.city = city;
    if (denomination) updateData.denomination = denomination;
    if (ministry) updateData.ministry = ministry;
    if (churchData) updateData.churchData = churchData;
    
    // Validar se a imagem de perfil é uma URL válida (deve começar com /uploads/)
    if (profileImage && typeof profileImage === 'string') {
      if (!profileImage.startsWith('/uploads/')) {
        return res.status(400).json({ error: 'Imagem de perfil deve ser uma URL válida de upload' });
      }
      updateData.profileImage = profileImage;
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      updateData,
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      user: updatedUser.getPublicData()
    });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;