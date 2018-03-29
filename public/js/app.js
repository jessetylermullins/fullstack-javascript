function getFiles() {
  return $.ajax('/api/file')
    .then(res => {
      return res;
    })
    .fail(err => {
      throw err;
    });
}

function refreshFileList() {
  const template = $('#list-template').html();
  const compiledTemplate = Handlebars.compile(template);

  getFiles()
    .then(files => {

      window.fileList = files;

      const data = {files: files};
      const html = compiledTemplate(data);
      $('#list-container').html(html);
    })
}

function handleAddFileClick() {
  setFormData({});
  toggleAddFileFormVisibility();
}

function toggleAddFileFormVisibility() {
  $('#form-container').toggleClass('hidden');
}

function submitFileForm() {

  const fileData = {
    entryTitle: $('#entry-title').val(),
    entryDate: $('#entry-date').val(),
    entryContent: $('#entry-content').val(),
    _id: $('#entry-id').val(),
  };

  let method, url;
  if (fileData._id) {
    method = 'PUT';
    url = '/api/file/' + fileData._id;
  } else {
    method = 'POST';
    url = '/api/file';
  }

  $.ajax({
    type: method,
    url: url,
    data: JSON.stringify(fileData),
    dataType: 'json',
    contentType : 'application/json',
  })
    .done(function(response) {;
      refreshFileList();
      toggleAddFileFormVisibility();
    })
    .fail(function(error) {
      console.log(error);
    })

  console.log(fileData);
}

function cancelFileForm() {
  toggleAddFileFormVisibility();
}

function deleteFile(id) {
  $.ajax({
    type: 'DELETE',
    url: '/api/file/' + id,
    dataType: 'json',
    contentType : 'application/json',
  })
    .done(function(response) {
      refreshFileList();
    })
    .fail(function(error) {
      console.log(error);
    })
}

function handleEditFileClick(id) {
  const file = window.fileList.find(file => file._id === id);
  if (file) {
    setFormData(file);
    toggleAddFileFormVisibility();
  }
}

function handleDeleteFileClick(id) {
  if (confirm("Are you sure?")) {
    deleteFile(id);
  }
}

function setFormData(data) {
  data = data || {};

  const file = {
    entryTitle: data.entryTitle || '',
    entryDate: data.entryDate || '',
    entryContent: data.entryContent || '',
    _id: data._id || '',
  };

  $('#entry-title').val(file.entryTitle);
  $('#entry-date').val(file.entryDate);
  $('#entry-content').val(file.entryContent);
  $('#entry-id').val(file._id);
}




refreshFileList();
