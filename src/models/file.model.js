// Load mongoose package
const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  entryTitle: String,
  entryDate: Date,
  entryContent: String,
  created_at: { type: Date, default: Date.now },

  // Soft delete status
  deleted: {type: Boolean, default: false}
});

const File = mongoose.model('File', FileSchema);

File.count({}, function(err, count) {
  if (err) {
    throw err;
  }
  
  if (count > 0) return ;

  const files = require('./file.seed.json');
  File.create(files, function(err, newFiles) {
    if (err) {
      throw err;
    }
  });

});

module.exports = File;
