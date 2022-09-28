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
            pageUrl: { hostEquals: 'colore.internal', schemes: ['https','http'] },
          })],
          actions: [new chrome.declarativeContent.ShowPageAction()]
        },
        {
          conditions: [new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostEquals: 'knetapp.internal', schemes: ['https','http'] },
          })],
          actions: [new chrome.declarativeContent.ShowPageAction()]
        },
        {
          conditions: [new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostEquals: 'localhost', schemes: ['https','http'] },
          })],
          actions: [new chrome.declarativeContent.ShowPageAction()]
        }
      ]);
      });

    });

    // Troca de menssagem
    chrome.runtime.onMessageExternal.addListener(function(request, sender, sendResponse) {

      var param = JSON.parse(request);

      switch(param.Action) {
        case 'printer':
          background.transmitir(param);
          break;
        case '':
          // code block
          break;
        default:
            console.log('Metodo não encontrado verifique o parametro da aplicação !');
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
                        '<arg0 xmlns="">'+ parm.Value +'</arg0>'+
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
          }

        }
      }
    }

    // Send the POST request
    xmlhttp.setRequestHeader('Content-Type', 'text/xml');
    xmlhttp.setRequestHeader('Access-Control-Allow-Origin','*');
    xmlhttp.setRequestHeader('Accept','*/*');
    xmlhttp.send(sr);

  },
  connect: function() {

    this.signnative = this.current_navigator.runtime.connectNative(this.hostName);
    this.signnative.onDisconnect.addListener(this.onDisconnected);
	  this.signnative.onMessage.addListener(this.receiveMessage);

  },
  onDisconnected: function() {
  
    console.log("Native messaging host disconnected.");
	
    var error = '';
    
    if (navigator.userAgent.indexOf("Chrome") != -1) {
      
      this.signnative = null;

      error = chrome.runtime.lastError.message;
  
      if (this.testConnection && error === "Error when communicating with the native messaging host.") {
        this.sendMessage({"text": "testConnection"});
      } else {
        if (this.testConnection && error === "Specified native messaging host not found.") {
          chrome.tabs.query({}, function(tabs) {
            for (tab in tabs) {
              var str = tabs[tab].url;
              if (str == pageUrl) {
                chrome.tabs.sendMessage(tabs[tab].id, {"type": "FROM_EXTENSION", "function" : "testConnection", "text" : "Specified native messaging host not found."});
              }
            }
          });
        }
      }
    } else {
      error = this.signnative.error;
      this.signnative = null;
  
      if (this.testConnection && (error == undefined || error == null)) {
        this.sendMessage({"text": "testConnection"});
      } else {
        if (this.testConnection && error.message === "No such native application com.gxc.digitalsign.native") {
          browser.tabs.query({}, function(tabs) {
            for (tab in tabs) {
              var str = tabs[tab].url;
              if (str == pageUrl) {
                browser.tabs.sendMessage(tabs[tab].id, {"type": "FROM_EXTENSION", "function" : "testConnection", "text" : "No such native application com.gxc.digitalsign.native"});
              }
            }
          });
        } else {
          if (this.testConnection) {
            this.sendMessage({"text": "testConnection"});
          }
        }
      }
    }



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