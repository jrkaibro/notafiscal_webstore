var background = {

  knetapp: "",
  config: {},
  signnative: null,
  current_navigator: null,
  testConnection: false,
  pageUrl: null,
  hostName: "com.knetapp.native",
  wsdl: "http://127.0.0.1:9876/com.knetapp.service.ServiceServer?wsdl", 

  init: function () {

    this.loadConfig();

    if ((navigator.userAgent.indexOf("Chrome") != -1) && (!(navigator.userAgent.indexOf("Edge") != -1))) {
      this.current_navigator = chrome;
    } else {
      this.current_navigator = browser;
    }

    console.log(this.current_navigator);

    // verifica dominio quando esta instalado.
    chrome.runtime.onInstalled.addListener(function (request, sender, sendResponse) {
      
      if (request.fn in background) {
        background[request.fn](request, sender, sendResponse);
        console.log(request.fn);
      }

      // Delimita a permissão por dominio.
      chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        chrome.declarativeContent.onPageChanged.addRules([{
          conditions: [new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostEquals: 'localhost', schemes: ['https','http'] },
          })],
          actions: [new chrome.declarativeContent.ShowPageAction()]
        },
        {
          conditions: [new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostEquals: '127.0.0.1', schemes: ['https','http'] },
          })],
          actions: [new chrome.declarativeContent.ShowPageAction()]
        },
        {
          conditions: [new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostEquals: 'knetapp.com.br', schemes: ['https','http'] },
          })],
          actions: [new chrome.declarativeContent.ShowPageAction()]
        }
      ]);
      });

    });

    // Troca de menssagem
    chrome.runtime.onMessageExternal.addListener(function(request, sender, sendResponse) {
    
      switch(request.Action) {
        case 'printer':
          var json = JSON.stringify(request);
          background.transmitir(json);
          break;
        case '':
          // code block
          break;
        default:
            console.log('Error');
      }
      
    });

    this.current_navigator.runtime.onUpdateAvailable.addListener(function(details) {
      this.current_navigator.runtime.reload();
    });

  },
  transmitir: function(parm) {

    var text = "";
    var parser, xmlDoc;

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', background.wsdl, true);

    var sr = '<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">'+
                '<Body>'+
                    '<imprimir xmlns="http://service.knetapp.com/">'+
                        '<arg0 xmlns="">'+ parm +'</arg0>'+
                    '</imprimir>'+
                '</Body>'+
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
           console.log(text);
           app.servicestatus = true;
          }

        }
      }
    }

    // Send the POST request
    xmlhttp.setRequestHeader('Content-Type', 'text/xml');
    xmlhttp.send(sr);

  },
  connect: function(){

  },
  onDisconnected: function() {
  
  },

  loadConfig: function () {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        background.config =  JSON.parse(xhr.response);
      }
    };

    xhr.open("GET", chrome.extension.getURL("/config.json"), true);
    xhr.send();

  },
  getConfig: function(request, sender, sendResponse) {
    sendResponse(background.config)
  }
};

background.init();    // Inicia background e seus recursos.
background.connect(); // Conecta a aplicação nativa.