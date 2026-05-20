const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { Schema } = mongoose;

const SALT_ROUNDS = 12;

const userSchema = new Schema(
  {
    nome: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    senha: {
      type: String,
      required: true,
      minlength: 6,
      select: false
    }
  },
  {
    timestamps: true
  }
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('senha')) {
    return next();
  }

  this.senha = await bcrypt.hash(this.senha, SALT_ROUNDS);
  return next();
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.senha);
};

userSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema);
