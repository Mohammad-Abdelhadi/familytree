const mongoose = require('mongoose');

const familyMemberSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  middleName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true
  },
  birthday: {
    type: Date,
    required: true
  },
  deathDate: {
    type: Date
  },
  isDeceased: {
    type: Boolean,
    default: false
  },
  university: {
    type: String,
    trim: true
  },
  profession: {
    type: String,
    trim: true
  },
  // العلاقات العائلية
  parents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FamilyMember'
  }],
  spouses: [{
    person: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FamilyMember'
    },
    marriageDate: Date,
    divorceDate: Date,
    isCurrent: {
      type: Boolean,
      default: true
    }
  }],
  children: [{
    child: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FamilyMember'
    },
    otherParent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FamilyMember'
    }
  }],
  // معلومات إضافية
  address: {
    street: String,
    city: String,
    country: String
  },
  contactInfo: {
    email: String,
    phone: String
  }
}, {
  timestamps: true // يضيف createdAt و updatedAt
});

// إضافة طرق مساعدة للمودل
familyMemberSchema.methods.getFullName = function() {
  return `${this.firstName} ${this.middleName} ${this.lastName}`.trim();
};

familyMemberSchema.methods.getAge = function() {
  if (this.isDeceased && this.deathDate) {
    return Math.floor((this.deathDate - this.birthday) / (1000 * 60 * 60 * 24 * 365));
  }
  return Math.floor((new Date() - this.birthday) / (1000 * 60 * 60 * 24 * 365));
};

const FamilyMember = mongoose.model('FamilyMember', familyMemberSchema);

module.exports = FamilyMember;