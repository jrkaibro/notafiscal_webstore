var app = {

  servicestatus: false,

  console: chrome.extension.getBackgroundPage().console,
  config : chrome.extension.getBackgroundPage().config,

  _infodata: {},

  get infodata() {
    return this._infodata;
  },
  set infodata(value) {
    this._infodata = value;
  },

  init: function () {

    var $content  = document.getElementById('content');
    var $display  = document.getElementById('display');
    var $upgrade  = document.getElementById('upgrade');
    var $terminal = document.getElementById('terminal');
    var $info     = document.getElementById('info');

    /* Initial Service */
    app.info();
    app.serviceA3();

      $display.addEventListener("click", function () {

        let a = ''
        $content.innerHTML = a;
      }),

      $terminal.addEventListener("click", function () {

        let b = '<textarea id="terminal" type="text"placeholder="Console..." cols="40" rows="30" style="height: 194px; width: 349px;" readonly>';
        $content.innerHTML = b;

      }),

      $upgrade.addEventListener("click", function () {

        let a = '<div id="information">';

        a += '<p><span> ----- Software de integracao -----</span></p>';
        a += '<p><span> Versao atual: 1.0.0</span></p>';
        a += '<p><span> Proxima atualizacao: sem previsao</span></p>';
        a += '<p><span> Tamanho : 658 kb </span></p>';
        a += '<p><span> Dinsponibilizamos atualizacao apenas por esse canal! </span></p>';

        a += '<div id="download">';
            a += '<button id="buttondownload" class="buttondonload" enabled></button>';
        a += '</div>';

        a += '<div id="download-ui-container">';
        a += '  <div id="start-download">Starting Download..</div>';
        a += '  <div id="download-progress-container"><div id="download-progress"></div></div>';
        a += '  <a id="save-file">Clique aqui para efetivar o download!</a>';
        a += '</div>';


        a += '</div>';

        $content.innerHTML = a;

        var $el = document.getElementById('buttondownload');
        $el.addEventListener("click", function () {
          
          var _OBJECT_URL;

          document.querySelector('#download').addEventListener('click', function () {
            
            var request = new XMLHttpRequest();

            request.addEventListener('readystatechange', function (e) {
              if (request.readyState == 2 && request.status == 200) {
                document.querySelector('#start-download').style.display = 'block';
                document.querySelector('#download').style.display = 'none';
              }
              else if (request.readyState == 3) {

                document.querySelector('#download-progress-container').style.display = 'block';
                document.querySelector('#start-download').style.display = 'none';
              }

              else if (request.readyState == 4) {

                _OBJECT_URL = URL.createObjectURL(request.response);

                document.querySelector('#save-file').setAttribute('href', _OBJECT_URL);
                document.querySelector('#save-file').setAttribute('download', 'wvetro_install.exe');

                document.querySelector('#save-file').style.display = 'block';
                document.querySelector('#download-progress-container').style.display = 'none';

                setTimeout(function () {
                  window.URL.revokeObjectURL(_OBJECT_URL);

                  document.querySelector('#download').style.display = 'block';
                  document.querySelector('#save-file').style.display = 'none';
                }, 60 * 1000);
              }
            });
            request.addEventListener('progress', function (e) {
              var percent_complete = (e.loaded / e.total) * 100;
              document.querySelector('#download-progress').style.width = percent_complete + '%';
            });

            request.responseType = 'blob';
            request.open('get', 'https://sistema.wvetro.com.br/wvetro/extension/wvetro_install.exe');
            request.send();
          });
        });

      }),

      $info.addEventListener("click", function () {

        app.info();
        app.serviceA3();

        var buffer = '<div id="information">';
        buffer += '<span> STATUS SERVICE BACKEND </span>';
        buffer += '<ul style="list-style-type:none;margin:5px">';
        buffer += '  <li>Token       : ' + app.infodata.token + '</li>';
        buffer += '  <li>Version     : ' + app.infodata.version + '</li>';
        buffer += '  <li>Last Update : ' + app.infodata.lastupdate + '</li>';

        if (app.infodata.status) {
          buffer += '<li>Status : ONLINE <div id="circle_green"></div></li>'
        } else {
          buffer += '<li>Status : OFFLINE <div id="circle_red"></div></li>';
        }
        buffer += '</ul>';

        buffer += '<span> STATUS SERVICE A3 </span>';
        buffer += '<ul style="list-style-type:none;margin:5px">';
        buffer += '  <li>Version     : ' + app.infodata.version + '.0</li>';
        buffer += '  <li>Last Update : ' + app.infodata.lastupdate + '</li>';

        if (app.servicestatus) {
          buffer += '<li>Status : ONLINE <div id="circle_green"></div></li>'
        } else {
          buffer += '<li>Status : OFFLINE <div id="circle_red"></div></li>';
        }
        buffer += '</ul>';

        $content.innerHTML = buffer;

      });

  },

  upgrade: function () {
    alert('realizando download');

  },

  info: async function () {

    const data = {}; 

    await fetch('https://' + app.config.production + app.config.baseurl + app.config.info, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        app.infodata = JSON.parse(data.retorno);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  },

  serviceA3: function () {

    var text = "";
    var parser, xmlDoc;

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', app.config.servicelocal, true);

    var sr = '<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">' +
      '<Body>' +
      '<validar xmlns="http://service.knetapp.com/"/>' +
      '</Body>' +
      '</Envelope>';

    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState == 4) {
        if (xmlhttp.status == 200) {
          text = xmlhttp.responseText;

          if (window.DOMParser) {
            parser = new DOMParser();
            xmlDoc = parser.parseFromString(text, "text/xml");
          } else {
            xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = false;
            xmlDoc.loadXML(text);
          }

          if (xmlDoc.getElementsByTagName("return")[0].childNodes[0].nodeValue != "") {
            //var ret  = xmlDoc.getElementsByTagName("return")[0].childNodes[0].nodeValue;
            //console.log(JSON.parse(ret));
            app.servicestatus = true;
          }

        }
      }
    }

    // Send the POST request
    xmlhttp.setRequestHeader('Content-Type', 'text/xml');
    xmlhttp.send(sr);


  },
};


app.init();