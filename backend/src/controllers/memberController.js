import * as MemberModel from '../models/memberModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'member-secret-key-123';

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if member already exists
    const existing = await MemberModel.getMemberByEmail(email);
    if (existing) {
      return res.status(400).json({ message: 'Member already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newMember = await MemberModel.createMember({
      name,
      email,
      password: hashedPassword
    });

    // Create JWT
    const token = jwt.sign({ id: newMember.id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ 
      token, 
      member: { id: newMember.id, name: newMember.name, email: newMember.email } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering member', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find member
    const member = await MemberModel.getMemberByEmail(email);
    if (!member) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, member.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create JWT
    const token = jwt.sign({ id: member.id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ 
      token, 
      member: { id: member.id, name: member.name, email: member.email } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const member = await MemberModel.getMemberById(req.memberId);
    if (!member) return res.status(404).json({ message: 'Member not found' });
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};

export const getMembers = async (req, res) => {
  try {
    const members = await MemberModel.getAllMembers();
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching members', error: error.message });
  }
};

export const deleteMember = async (req, res) => {
  try {
    const deleted = await MemberModel.deleteMember(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Member not found' });
    res.json({ message: 'Member deleted', deleted });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting member', error: error.message });
  }
};
