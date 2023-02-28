~function main() {
  const xhrGet = new XMLHttpRequest()

  xhrGet.open('get', `/getConfig`);

  xhrGet.onload = () => {
      if (xhrGet.status == 200) {               
        let config = JSON.parse(xhrGet.response)
        config.enableDelete ? deleteFunc(config) : ''
        config.enableDownload ? downloadFunc() : disableDownload()
        config.enableUpload ? enableUpload(config) : disableUpload()
        sortList()
      } else {                                
          console.log("Server response: ", xhrGet.status);
      }
  }
  xhrGet.send();
}()

function _(el) {
  return document.getElementById(el);
}

const enableUpload = (config) => {
  let formUpload = _("uploadFiles")
  formUpload.hidden = false
  uploadReq(config)
}

const disableUpload = () => {
  let formUpload = _("uploadFiles")
  formUpload.remove()
}

const deleteFunc = (config) => {
  const xhr = new XMLHttpRequest();

  document.querySelectorAll("#files li").forEach((el)=> {
    let checkFiles = el.querySelector("#files a")
    if (!checkFiles.classList.contains('icon-directory')){
      let btnDelete = document.createElement('button')
      el.appendChild(btnDelete)
      btnDelete.className = 'btnDelete'
      btnDelete.textContent = 'Delete'
      let data = el.querySelector('a').href

      btnDelete.onclick = () => {
        let isDelete = confirm("Delete file: " + el.querySelector('a').title)

        if (isDelete) {
          xhr.open("POST", `/delete`);
          xhr.onload = () => {
            if (xhr.status == 200) {               
              el.querySelector('a').remove()
              btnDelete.remove()  
            } else {                                
              console.log("Server response status: ", xhr.status);
              alert('An error occurred while deleting the file')
            }
          };
          xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
          xhr.send(data);
          window.location.reload();
      }
    }
  }
  });
}

const disableDownload = () => {
  document.querySelectorAll("#files a").forEach( (el) => { 
    if (!el.classList.contains('icon-directory')) { 
      el.removeAttribute('href');
      el.style.cursor = "default"
    } 
  });
}

const downloadFunc = () => {
  document.querySelectorAll("#files a").forEach( (el) => { 
    if (!el.classList.contains('icon-directory')) { 
      el.setAttribute("download", "") 
    } 
  });
}

let file_selected = false;

const checkFile = () => {
  if (!file_selected){ 
    alert('No file selected!')
    window.location.reload();
  } else {
    let buttonUpdate = _("fileSubmit")
    buttonUpdate.title = "File is uploading"
  }
}

const uploadReq = async () => {
  let formData = new FormData()
  formData.append("filename", _("file1").files[0], encodeURI(_("file1").files[0].name))
  let ajax = new XMLHttpRequest();
  ajax.upload.addEventListener("progress", progressHandler, false);
  ajax.addEventListener("load", completeHandler, false);
  ajax.addEventListener("error", errorHandler, false);
  ajax.addEventListener("abort", abortHandler, false);
  ajax.open("POST", "/upload");
        
  ajax.onload = () => {
    let text = ajax.response
    if (ajax.status != 200) {
      alert(text)
       window.location.reload()
    }
    else {
      window.location.reload()
    }
  }
  ajax.send(formData);
}

const sortList = () => {
  let list, i, switching, b, shouldSwitch;
  list = _("files");
  switching = true;

  while (switching) {
    switching = false;
    b = list.getElementsByTagName("LI");
    date = list.getElementsByClassName("date")
    for (i = 0; i < (b.length - 1); i++) {
      shouldSwitch = false;
      if (new Date(date[i].innerHTML) > new Date(date[i + 1].innerHTML)) {
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      b[i].parentNode.insertBefore(b[i + 1], b[i]);
      switching = true;
    }
  }
}

function progressHandler(event) {
  _("loaded_n_total").innerHTML = "Uploaded " + event.loaded + " bytes of " + event.total;
  let percent = (event.loaded / event.total) * 100;
  _("progressBar").value = Math.round(percent);
  _("status").innerHTML = Math.round(percent) + "% Uploaded... Please wait";
}

function completeHandler(event) {
  _("status").innerHTML = event.target.responseText;
  _("progressBar").value = 0; 
}

function errorHandler(event) {
  _("status").innerHTML = "Upload Failed";
}

function abortHandler(event) {
  _("status").innerHTML = "Upload Aborted";
}