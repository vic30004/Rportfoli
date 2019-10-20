const mongoose = require('mongoose');
const slugify = require('slugify');

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    unique: true,
    trim: true,
    maxlength: [50, "Tile can't be more than 50 characters"]
  },
  slug: String,
  githubRepo: {
    type: String,
    match: [
      /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/
    ],
    required: [true, 'Please add a valid repo'],
    unique: true,
    trim: true
  },
  deployedUrl: {
    type: String,
    match: [
      /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/
    ],
    required: false,
    unique: false,
    trim: true
  },
  tech: {
    
    type: [String],
    required: [true, 'Please add what was used to build this project'],
    
  },
  deploy: {
    type: Boolean,
    default: false
  },
  picture: {
    type: String,
    default: 'no-photo.jpg'
  }
});

// Create Project Slug from Title

ProjectSchema.pre('save', function(next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

module.exports = mongoose.model('Project', ProjectSchema);
