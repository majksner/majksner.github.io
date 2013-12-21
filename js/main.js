var NightSkySingleton = (function() {

    // options: an object containing configuration options for the singleton
    // e.g var options = { name: "test", pointX: 5};  
    // our instance holder  
    var instance;

    function Singleton(options) {

      // set options to the options supplied 
      // or an empty object if none are provided
      options = options || {};

      // set some properties for our singleton
      this.name = "NightSkySingleton";

      var SCREEN_WIDTH = window.innerWidth; //900;
      var SCREEN_HEIGHT = window.innerHeight; //600;
      var RADIUS = window.innerWidth + 500;
      var RADIUS_SCALE = 1;
      var RADIUS_SCALE_MIN = 1;
      var RADIUS_SCALE_MAX = 1.5;
      // The number of particles that are used to generate the trail
      var QUANTITY = 500;
      var canvas;
      var context;
      var particles;
      var mouseX = (window.innerWidth * .6);
      var mouseY = (window.innerHeight * .7);
      var mouseIsDown = false;
      var colors = ["#525297", "#bcd7ed", "#b4b4bd", "#454c85", "#c967a8"];
      var _interval;

      this.init = function() {

        // console.log("sleepMoreSky init");
        $("body").append('<canvas id="nightSky"></canvas>');

        canvas = document.getElementById('nightSky');

        // console.log("sleepMoreSky init !_skyisAnimating");
        if(canvas && canvas.getContext) {
          context = canvas.getContext('2d');

          // Register event listeners
          // window.addEventListener('resize', windowResizeHandler, false);
          $(window).bind("resize", windowResizeHandler);
          $(window).trigger("resize");



          // createParticles();
          // _interval = setInterval(loop, 50);
          // setTimeout(loop, 1000);
        }

      }

      function createParticles() {
        particles = [];

        for(var i = 0; i < QUANTITY; i++) {

          // var randX = Math.random()*2;
          // var randY = Math.random()*2;
          // var randX = Math.random() * window.innerWidth,
          //   randY = Math.random() * window.innerHeight;
          var particle = {

            // shift: { x: randX, y: randY },
            size: 1,
            angle: 0,
            speed: 0.001 + Math.random() * 0.004,
            targetSize: 1,
            fillColor: colors[Math.floor(Math.random() * colors.length)],
            orbit: (RADIUS * Math.random()),

            position: {
              x: Math.cos(i + this.angle) * (this.orbit * RADIUS_SCALE),
              y: Math.sin(i + this.angle) * (this.orbit * RADIUS_SCALE)
            },
          };

          particles.push(particle);
        }
      }

      function windowResizeHandler() {

        RADIUS = window.innerWidth + 500;
        SCREEN_WIDTH = window.innerWidth;
        SCREEN_HEIGHT = window.innerHeight;

        canvas.width = SCREEN_WIDTH;
        canvas.height = SCREEN_HEIGHT;

        canvas.style.position = 'absolute';
        canvas.style.left = (window.innerWidth - SCREEN_WIDTH) * .5 + 'px';
        canvas.style.top = (window.innerHeight - SCREEN_HEIGHT) * .5 + 'px';

        createParticles();
      }

      function loop() {

        // console.log("loop");
        // Scale downward to the min scale
        RADIUS_SCALE -= (RADIUS_SCALE - RADIUS_SCALE_MIN) * (0.02);

        RADIUS_SCALE = Math.min(RADIUS_SCALE, RADIUS_SCALE_MAX);

        // Fade out the lines slowly by drawing a rectangle over the entire canvas
        context.fillStyle = 'rgba(10, 19, 43, 0.02)';
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);

        for(i = 0, len = particles.length; i < len; i++) {
          var particle = particles[i];

          var lp = {
            x: particle.position.x,
            y: particle.position.y
          };

          // Offset the angle to keep the spin going
          particle.angle += particle.speed;

          // Apply position
          particle.position.x = Math.cos(i - particle.angle) * (particle.orbit * RADIUS_SCALE);
          particle.position.y = Math.sin(i - particle.angle) * (particle.orbit * RADIUS_SCALE);

          particle.size = 1;

          context.beginPath();
          context.fillStyle = particle.fillColor;
          context.strokeStyle = particle.fillColor;
          context.lineWidth = particle.size;
          context.moveTo(lp.x, lp.y);
          context.lineTo(particle.position.x, particle.position.y);
          context.stroke();
          context.arc(particle.position.x, particle.position.y, particle.size / 2, 0, Math.PI * 2, true);
          context.fill();

          // console.log(i + "looop check");
        }
      }

      this.clearSetInterval = function() {
        // console.log("clearInt");
        _skyisAnimating = false;
        clearInterval(_interval);
      }

      this.startSetInterval = function() {
        // console.log("startSetInterval");
        _skyisAnimating = true;
        _interval = setInterval(loop, 50);
      }

    }
    // an emulation of static variables and methods
    var _static = {

      name: "NightSkySingleton",

      // Method for getting an instance. It returns 
      // a singleton instance of a singleton object
      getInstance: function(options) {
        if(instance === undefined) {
          instance = new Singleton(options);
          instance.init();
        }
        return instance;
      }
    };

    return _static;

  })();

  var nightsky = NightSkySingleton.getInstance();
  nightsky.startSetInterval();
