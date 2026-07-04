import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const employeSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    required: true,
    enum: ['sale', 'manager'],
    default: 'sale'
  },
  joinedAt: {
    type: String,
    default: ''
  }
}, { timestamps: true });

employeSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
});

const Employe = mongoose.model('Employe', employeSchema);

export default Employe;