var background = {

  wvetro: "",
  config: {},
  wvetrosignnative: null,
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

    // verifica dominio quando esta instaldo 
    chrome.runtime.onInstalled.addListener(function (request, sender, sendResponse) {
      
      if (request.fn in background) {
        background[request.fn](request, sender, sendResponse);
      }

      // Delimita a permssão por dominio
      chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        chrome.declarativeContent.onPageChanged.addRules([{
          conditions: [new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostEquals: 'dev.wvetro.com.br', schemes: ['https'] },
          })],
          actions: [new chrome.declarativeContent.ShowPageAction()]
        },
        {
          conditions: [new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostEquals: 'beta.wvetro.com.br', schemes: ['https'] },
          })],
          actions: [new chrome.declarativeContent.ShowPageAction()]
        },
        {
          conditions: [new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostEquals: 'sistema.wvetro.com.br', schemes: ['https'] },
          })],
          actions: [new chrome.declarativeContent.ShowPageAction()]
        }
      ]);
      });

    });

    // Troca de menssagem
    chrome.runtime.onMessageExternal.addListener(function(request, sender, sendResponse) {
    
      switch (request.Action) {
        case 'Transmitir':
            var json = JSON.stringify(request);
            background.transmitir(json);
            break;
        case 'Cancelar':
            var json = JSON.stringify(request);
            console.log("cancelar nota fiscal  : " + json);
            background.cancelar(json);
            break;
        case 'CartaCorrecao':
            var json = JSON.stringify(request);
            background.cartacorrecao(json);
            break;
        case 'Consultar':
            var json = JSON.stringify(request);
            background.consultar(json);
            break;
        case 'Protocolar':
              var json = JSON.stringify(request);
              background.protocolar(json);
              break;
        case 'Inutilizar':
            var json = JSON.stringify(request);
            background.inutilizar(json);
            break;
        case 'Manifestar':
            var json = JSON.stringify(request);
            background.manifestar(json);
            break;
        case 'Validar':
            var json = JSON.stringify(request);
            background.validar(json);
            break;
        case 'Validarnf':
            var json = JSON.stringify(request);
            console.log(json);
            background.validarnf(json);
            break;
        case 'Upgrade':
            var json = JSON.stringify(request);
            background.upgrade(json);
            break;
        case 'Manifestar':
          var json = JSON.stringify(request);
          background.manifestar(json);
          break;
        default:
            alert('Metodo não encontrado');
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
                    '<transmitir xmlns="http://service.knetapp.com/">'+
                        '<arg0 xmlns="">'+ parm +'</arg0>'+
                    '</transmitir>'+
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
            var json = xmlDoc.getElementsByTagName("return")[0].childNodes[0].nodeValue;
            var resposta = JSON.parse(json);
              if (resposta.respNotafiscal.status == 100) {
                alert(resposta.respNotafiscal.message);
              }
          }

        }
      }

    }

    // Send the POST request
    xmlhttp.setRequestHeader('Content-Type', 'text/xml');
    xmlhttp.send(sr);

  },
  cancelar: function(parm){

    var text = "";
    var parser, xmlDoc;

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', background.wsdl, true);

    var sr = '<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">'+
                '<Body>'+
                    '<cancelar xmlns="http://service.knetapp.com/">'+
                        '<arg0 xmlns="">'+ parm +'</arg0>'+
                    '</cancelar>'+
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
            var json = xmlDoc.getElementsByTagName("return")[0].childNodes[0].nodeValue;
            var resposta = JSON.parse(json);
              if (resposta.respNotafiscal.status == 100) {
                alert(resposta.respNotafiscal.message);
              }
          }

        }
      }

    }

    // Send the POST request
    xmlhttp.setRequestHeader('Content-Type', 'text/xml');
    xmlhttp.send(sr);


  },
  cartacorrecao: function(parm) {

    var text = "";
    var parser, xmlDoc;

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', background.wsdl, true);

    var sr = '<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">'+
                '<Body>'+
                    '<cartacorrecao xmlns="http://service.knetapp.com/">'+
                        '<arg0 xmlns="">'+ parm +'</arg0>'+
                    '</cartacorrecao>'+
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
            var json = xmlDoc.getElementsByTagName("return")[0].childNodes[0].nodeValue;
            var resposta = JSON.parse(json);
              if (resposta.respNotafiscal.status == 100) {
                alert(resposta.respNotafiscal.message);
              }
          }

        }
      }

    }

    // Send the POST request
    xmlhttp.setRequestHeader('Content-Type', 'text/xml');
    xmlhttp.send(sr);

  },
  consultar: function(parm) {

    var text = "";
    var parser, xmlDoc;

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', background.wsdl, true);

    var sr = '<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">'+
                '<Body>'+
                    '<consultar xmlns="http://service.knetapp.com/">'+
                        '<arg0 xmlns="">'+ parm +'</arg0>'+
                    '</consultar>'+
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
            var json = xmlDoc.getElementsByTagName("return")[0].childNodes[0].nodeValue;
            var resposta = JSON.parse(json);
              if (resposta.respNotafiscal.status == 100) {
                alert(resposta.respNotafiscal.message);
              }
          }

        }
      }

    }

    // Send the POST request
    xmlhttp.setRequestHeader('Content-Type', 'text/xml');
    xmlhttp.send(sr);

  },
  inutilizar: function(parm) {

    var text = "";
    var parser, xmlDoc;

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', background.wsdl, true);

    var sr = '<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">'+
                '<Body>'+
                    '<inutilizar xmlns="http://service.knetapp.com/">'+
                        '<arg0 xmlns="">'+ parm +'</arg0>'+
                    '</inutilizar>'+
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
            var json = xmlDoc.getElementsByTagName("return")[0].childNodes[0].nodeValue;
            var resposta = JSON.parse(json);
              if (resposta.respNotafiscal.status == 100) {
                alert(resposta.respNotafiscal.message);
              }
          }

        }
      }

    }

    // Send the POST request
    xmlhttp.setRequestHeader('Content-Type', 'text/xml');
    xmlhttp.send(sr);

  },
  manifestar: function(parm) {

    var text = "";
    var parser, xmlDoc;

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', background.wsdl, true);

    var sr = '<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">'+
                '<Body>'+
                    '<manifestar xmlns="http://service.knetapp.com/">'+
                        '<arg0 xmlns="">'+ parm +'</arg0>'+
                    '</manifestar>'+
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
            var json = xmlDoc.getElementsByTagName("return")[0].childNodes[0].nodeValue;
            var resposta = JSON.parse(json);
              if (resposta.respNotafiscal.status == 100) {
                alert(resposta.respNotafiscal.message);
              }
          }

        }
      }

    }

    // Send the POST request
    xmlhttp.setRequestHeader('Content-Type', 'text/xml');
    xmlhttp.send(sr);

  },
  validar: function(parm) {

    var text = "";
    var parser, xmlDoc;

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', background.wsdl, true);

    var sr = '<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">'+
                '<Body>'+
                    '<validar xmlns="http://service.knetapp.com/">'+
                        '<arg0 xmlns="">'+ parm +'</arg0>'+
                    '</validar>'+
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
            var json = xmlDoc.getElementsByTagName("return")[0].childNodes[0].nodeValue;
            var resposta = JSON.parse(json);
              if (resposta.respNotafiscal.status == 100) {
                alert(resposta.respNotafiscal.message);
              }
          }

        }
      }

    }

    // Send the POST request
    xmlhttp.setRequestHeader('Content-Type', 'text/xml');
    xmlhttp.send(sr);


  },
  validarnf: function(parm){

    var text = "";
    var parser, xmlDoc;

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', background.wsdl, true);

    var sr = '<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">'+
                '<Body>'+
                    '<validarnf xmlns="http://service.knetapp.com/">'+
                        '<arg0 xmlns="">'+ parm +'</arg0>'+
                    '</validarnf>'+
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
            var json = xmlDoc.getElementsByTagName("return")[0].childNodes[0].nodeValue;
            var resposta = JSON.parse(json);
              if (resposta.respNotafiscal.status == 100) {
                alert(resposta.respNotafiscal.message);
              }
          }

        }
      }

    }

    // Send the POST request
    xmlhttp.setRequestHeader('Content-Type', 'text/xml');
    xmlhttp.send(sr);


  },
  upgrade: function(parm) {

    var text = "";
    var parser, xmlDoc;

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', background.wsdl, true);

    var sr = '<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">'+
                '<Body>'+
                    '<upgrade xmlns="http://service.knetapp.com/">'+
                        '<arg0 xmlns="">'+ parm +'</arg0>'+
                    '</upgrade>'+
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
            var json = xmlDoc.getElementsByTagName("return")[0].childNodes[0].nodeValue;
            var resposta = JSON.parse(json);
              if (resposta.respNotafiscal.status == 100) {
                alert(resposta.respNotafiscal.message);
              }
          }

        }
      }

    }

    // Send the POST request
    xmlhttp.setRequestHeader('Content-Type', 'text/xml');
    xmlhttp.send(sr);

  },
  protocolar: function(parm){

    var text = "";
    var parser, xmlDoc;

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', background.wsdl, true);

    var sr = '<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">'+
                '<Body>'+
                    '<protocolar xmlns="http://service.knetapp.com/">'+
                        '<arg0 xmlns="">'+ parm +'</arg0>'+
                    '</protocolar>'+
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
            var json = xmlDoc.getElementsByTagName("return")[0].childNodes[0].nodeValue;
            var resposta = JSON.parse(json);
              if (resposta.respNotafiscal.status == 100) {
                alert(resposta.respNotafiscal.message);
              }
          } 

        }
      }

    }

    // Send the POST request
    xmlhttp.setRequestHeader('Content-Type', 'text/xml');
    xmlhttp.send(sr);



  },
  connect: function(){
    this.wvetrosignnative = this.current_navigator.runtime.connectNative(this.hostName);
    this.wvetrosignnative.onDisconnect.addListener(this.onDisconnected);
	  this.wvetrosignnative.onMessage.addListener(this.receiveMessage);
  },
  onDisconnected: function() {

    console.log("Native messaging host disconnected.");
	
    var error = '';
    
    if (navigator.userAgent.indexOf("Chrome") != -1) {
      
      this.wvetrosignnative = null;

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
      error = this.wvetrosignnative.error;
      this.wvetrosignnative = null;
  
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
  receiveMessage: function(msg) {

  },
  sendMessage: function(text) {

    if (this.wvetrosignnative == null) {
      this.connect();
    } else {
      if (this.testConnection) {
        this.wvetrosignnative.disconnect();
        this.connect();
      }
    }
    
    var message = {"message" : btoa(JSON.stringify(text))}
    this.wvetrosignnative.postMessage(message);
  },
  setwvetro: function (request) {
    this.wvetro = request.wvetro;
  },
  getwvetro: function (sendResponse) {
    sendResponse(this.wvetro);
  },
  loadConfig: function () {
    /*
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        background.config =  JSON.parse(xhr.response);
      }
    };

    xhr.open("GET", chrome.extension.getURL("/config.json"), true);
    xhr.send();
*/
    await fetch('config.json')
      .then(response => response.json())
      .then(json => background.config = JSON.stringify(json));

  },
  getConfig: function(rsendResponse) {
    sendResponse(background.config);
  }
};

background.init();    // Inicia background e seus recursos.
background.connect(); // Conecta a aplicação nativa.


/*
chrome.runtime.onMessage.addListener(function(response, sender, sendResponse) {

});

chrome.runtime.onConnect.addListener(function(port) {
  port.onMessage.addListener(function(msg) {
    port.postMessage({counter: msg.counter+1});
  });
});




// For long-lived connections:
chrome.runtime.onConnectExternal.addListener(function(port) {
  port.onMessage.addListener(function(msg) {
    // See other examples for sample onMessage handlers.
  });
});
*/