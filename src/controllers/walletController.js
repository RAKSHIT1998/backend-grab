// src/controllers/walletController.js

import Wallet from '../models/walletModel.js';
import User from '../models/userModel.js';
import Driver from '../models/driverModel.js';

// Initialize wallet for new users or drivers
export const initializeWallet = async (req, res) => {
  try {
    const { userId, role } = req.body;
    const existing = await Wallet.findOne({ user: userId });
    if (existing) return res.status(200).json(existing);

    const wallet = await Wallet.create({
      user: userId,
      balance: 0,
      role,
    });
    res.status(201).json(wallet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get wallet balance
export const getWalletBalance = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ user: req.params.userId });
    if (!wallet) return res.status(404).json({ error: 'Wallet not found' });
    res.status(200).json(wallet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Credit wallet for logged in user
export const topUpWallet = async (req, res) => {
  try {
    const { amount, description } = req.body;
    const wallet = await Wallet.findOne({ user: req.user.id });
    if (!wallet) return res.status(404).json({ error: 'Wallet not found' });
    wallet.balance += amount;
    wallet.transactions.push({ type: 'credit', amount, description: description || 'Top Up' });
    await wallet.save();
    res.status(200).json(wallet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Debit wallet for logged in user
export const withdrawFromWallet = async (req, res) => {
  try {
    const { amount, description } = req.body;
    const wallet = await Wallet.findOne({ user: req.user.id });
    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }
    wallet.balance -= amount;
    wallet.transactions.push({ type: 'debit', amount, description: description || 'Withdrawal' });
    await wallet.save();
    res.status(200).json(wallet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get logged in user's transaction history
export const getUserWalletHistory = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ user: req.user.id });
    if (!wallet) return res.status(404).json({ error: 'Wallet not found' });
    res.status(200).json(wallet.transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add funds (admin use only)
export const addFunds = async (req, res) => {
  try {
    const { userId, amount } = req.body;
    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) return res.status(404).json({ error: 'Wallet not found' });
    wallet.balance += amount;
    await wallet.save();
    res.status(200).json(wallet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Deduct funds
export const deductFunds = async (req, res) => {
  try {
    const { userId, amount } = req.body;
    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }
    wallet.balance -= amount;
    await wallet.save();
    res.status(200).json(wallet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// List all wallets (admin only)
export const getAllWallets = async (req, res) => {
  try {
    const wallets = await Wallet.find().populate('user', 'name email phone');
    res.status(200).json(wallets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
