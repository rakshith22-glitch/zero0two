import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import {Schema} from 'mongoose';
const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },// 'admin' for admin users
  // Add the teams field
  teams: [{
    type: Schema.Types.ObjectId,
    ref: 'Team' // Ensure this matches your Team model name
  }],
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

const User = mongoose.model('User', userSchema);

export default User;
