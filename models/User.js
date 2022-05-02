const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, 'Please provide a email'],
      match: [
        // eslint-disable-next-line no-useless-escape
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
    },
    refreshToken: {
      type: String,
      required: false,
    },
    role: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.pre('save', async function () {
  this.refreshToken = jwt.sign({ userId: this._id, name: this.name }, process.env.REFRESH_JWT, {
    expiresIn: process.env.REFRESH_JWT_LIFETIME,
  });
});

UserSchema.methods.getRefreshAuthToken = function () {
  return jwt.sign({ userId: this._id, name: this.name }, process.env.REFRESH_JWT, {
    expiresIn: process.env.REFRESH_JWT_LIFETIME,
  });
};

UserSchema.methods.getAccessAuthToken = function () {
  const roleCode = Object.values(this.role)[0];
  return jwt.sign(
    { UserInfo: { userId: this._id, name: this.name, role: roleCode } },
    process.env.ACCESS_JWT,
    {
      expiresIn: process.env.ACCESS_JWT_LIFETIME,
    }
  );
};

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
