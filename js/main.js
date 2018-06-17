/*jshint esversion:6*/
(function() {
  'use strict';

  // Code example syntax highlighting
  hljs.initHighlightingOnLoad();

  var codeElem = document.getElementById('code');
  var consoleElem = document.getElementById('console');
  var noteElem = document.getElementById('notes');

  var runButton = document.getElementById('run');
  var nextButton = document.getElementById('next');

  var regSrc1 = document.getElementById('template-register-1').innerHTML;
  var regSrc2 = document.getElementById('template-register-2').innerHTML;
  var regSrc3 = document.getElementById('template-register-3').innerHTML;
  var registerTemplate1 = Handlebars.compile(regSrc1);
  var registerTemplate2 = Handlebars.compile(regSrc2);
  var registerTemplate3 = Handlebars.compile(regSrc3);

  var noteSrcTryNew = document.getElementById('template-try-new').innerHTML;
  var noteSrcNew = document.getElementById('template-new').innerHTML;
  var noteSrcTryExisting = document.getElementById('template-try-existing').innerHTML;
  var noteSrcExisting = document.getElementById('template-existing').innerHTML;
  var noteSrcTryUpdated = document.getElementById('template-try-updated').innerHTML;
  var noteSrcUpdated = document.getElementById('template-updated').innerHTML;
  var noteSrcTrySkip = document.getElementById('template-try-skip').innerHTML;
  var noteSrcSkip = document.getElementById('template-skip').innerHTML;

  var noteTemplateTryNew = Handlebars.compile(noteSrcTryNew);
  var noteTemplateNew = Handlebars.compile(noteSrcNew);
  var noteTemplateTryExisting = Handlebars.compile(noteSrcTryExisting);
  var noteTemplateExisting = Handlebars.compile(noteSrcExisting);
  var noteTemplateTryUpdated = Handlebars.compile(noteSrcTryUpdated);
  var noteTemplateUpdated = Handlebars.compile(noteSrcUpdated);
  var noteTemplateTrySkip = Handlebars.compile(noteSrcTrySkip);
  var noteTemplateSkip = Handlebars.compile(noteSrcSkip);

  function updateCode(template) {
    codeElem.innerHTML = template();
  }

  function updateConsole(message) {
    if (message) {
      consoleElem.innerHTML += message + '<br>';
    } else {
      consoleElem.innerHTML = '';
    }
  }

  function updateNote(template) {
    if (template) {
      noteElem.innerHTML = template();
    } else {
      noteElem.innerHTML = '';
    }
  }

  function show(message) {
    console.log(message);
    updateConsole(message);
  }

  function register(serviceWorkerFile) {
    if (!('serviceWorker' in navigator)) {
      show('Service worker not supported :(');
      return;
    }
    navigator.serviceWorker.register(serviceWorkerFile)
    .then(() => {
      show(serviceWorkerFile + ' registered!');
    })
    .catch((error) => {
      show('Registration failed: ' + error);
    });
  }

  function unregister() {
    if (!('serviceWorker' in navigator)) {
      show('Service worker not supported :(');
      return;
    }
    navigator.serviceWorker.getRegistration()
    .then((registration) => {
      registration.unregister()
      .then(() => {
        document.location.reload();
        /* This will cause a unregister() to run again, but on the second run,
           it will catch(). Without this, the unregistered SW is still in
           control until the user reloads the page or navigates away. */
        show('Unregistering existing service worker...');
      });
    })
    .catch((error) => {
      if (~error.message.indexOf('Cannot read property \'unregister\' of' +
      ' undefined')) {
        show('No service worker currently registered');
      } else {
        show('Unregistration failed');
        console.log(error);
      }
    });
  }

  function runOrNext(mode) {
    if (mode === 'run') {
      nextButton.disabled = true;
      runButton.disabled = false;
    } else if (mode === 'next') {
      nextButton.disabled = false;
      runButton.disabled = true;
    }
  }

  var state = parseInt(localStorage.getItem('state'), 10) || 0;

  navigator.serviceWorker.addEventListener('message', function(event) {
    show(event.data);
  });

  nextButton.onclick = function() {
    document.location.reload();
    changeState(state + 1);
  };
  changeState(state);

  function changeState(stateCase) {
    switch (stateCase) {
      case 0:
        state = 0;
        localStorage.setItem('state', 0);
        runOrNext('run');
        unregister();
        updateCode(registerTemplate1);
        updateNote(noteTemplateTryNew);
        runButton.onclick = function() {
          runOrNext('next');
          register('service-worker-v1.js');
          updateNote(noteTemplateNew);
        };
        break;

      case 1:
        state = 1;
        localStorage.setItem('state', 1);
        runOrNext('run');
        console.log(state);
        updateCode(registerTemplate1);
        updateNote(noteTemplateTryExisting);
        runButton.onclick = function() {
          runOrNext('next');
          register('service-worker-v1.js');
          updateNote(noteTemplateExisting);
        };
        break;

      case 2:
        state = 2;
        localStorage.setItem('state', 2);
        runOrNext('run');
        updateCode(registerTemplate2);
        updateNote(noteTemplateTryUpdated);
        runButton.onclick = function() {
          runOrNext('next');
          register('service-worker-v2.js');
          updateNote(noteTemplateUpdated);
        };
        break;

      case 3:
        state = 3;
        localStorage.setItem('state', 3);
        runOrNext('run');
        updateCode(registerTemplate3);
        updateNote(noteTemplateTrySkip);
        runButton.onclick = function() {
          runOrNext('next');
          register('service-worker-v3.js');
          updateNote(noteTemplateSkip);
        };
        nextButton.textContent = 'Start over';
        break;

      default:
        console.log('Invalid state, starting over');
        localStorage.clear();
        document.location.reload();
        break;
    }
  }

})();
