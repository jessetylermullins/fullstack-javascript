const router = require('express').Router();
const mongoose = require('mongoose');

router.use('/doc', function(req, res, next) {
  res.end(`Documentation http://expressjs.com/`);
});

/**
 * Get a list of all files in the DB
 */
router.get('/file', function(req, res, next) {
  const File = mongoose.model('File');
  
  File.find({deleted: {$ne: true}}, function(err, files) {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }

    res.json(files);
  });
});

router.get('/file/:fileId', function(req, res, next) {
  const {fileId} = req.params;

  const file = FILES.find(entry => entry.id === fileId);
  if (!file) {
    return res.status(404).end(`Could not find file '${fileId}'`);
  }

  res.json(file);
});

router.post('/file', function(req, res, next) {
  const File = mongoose.model('File');
  const fileData = {
    entryTitle: req.body.entryTitle,
    entryDate: req.body.entryDate,
    entryContent: req.body.entryContent,
  };

  File.create(fileData, function(err, newFile) {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }

    res.json(newFile);
  });
});

/**
 * Update an existing file
 */
router.put('/file/:fileId', function(req, res, next) {
  const File = mongoose.model('File');
  const fileId = req.params.fileId;

  File.findById(fileId, function(err, file) {
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }
    if (!file) {
      return res.status(404).json({message: "File not found"});
    }

    file.entryTitle = req.body.entryTitle;
    file.entryDate = req.body.entryDate;
    file.entryContent = req.body.entryContent;
    file._id = req.body._id;

    file.save(function(err, savedFile) {
      if (err) {
        console.error(err);
        return res.status(500).json(err);
      }
      res.json(savedFile);
    })

  })

});

/**
 * Delete a file
 */
router.delete('/file/:fileId', function(req, res, next) {
  const File = mongoose.model('File');
  const fileId = req.params.fileId;

  File.findById(fileId, function(err, file) {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }
    if (!file) {
      return res.status(404).json({message: "File not found"});
    }

    file.deleted = true;

    file.save(function(err, doomedFile) {
      res.json(doomedFile);
    })

  })
});


module.exports = router;

