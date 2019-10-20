const mongoose = require('mongoose');

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
    unique: true,
    trim: true
  },
  tech: {
    type: String,
    required: [true, 'Please add what was used to build this project'],
    unique: false,
    trim: true,
    maxlength: [100, `This can't exceed 100 characters`]
  },
  deploy:{
      type: Boolean,
      default: false
  },
  picture:{
      type: String,
      default: 'no-photo.jpg'
  }

});

module.exports= mongoose.model('Project',ProjectSchema)