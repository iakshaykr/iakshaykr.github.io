(function () {
  function startNeuralBackground() {
    var canvas = document.getElementById("neural-bg");
    if (!canvas) return;

    var ctx = canvas.getContext("2d");
    var dpr = window.devicePixelRatio || 1;
    var nodes = [];
    var mouse = { x: -9999, y: -9999, active: false };
    var count = 70;
    var radius = 130;

    function size() {
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function seed() {
      nodes = [];
      for (var i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          r: Math.random() * 1.6 + 1.1
        });
      }
    }

    function step() {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (var i = 0; i < nodes.length; i++) {
        var a = nodes[i];
        a.x += a.vx;
        a.y += a.vy;
        if (a.x <= 0 || a.x >= window.innerWidth) a.vx *= -1;
        if (a.y <= 0 || a.y >= window.innerHeight) a.vy *= -1;

        ctx.beginPath();
        ctx.fillStyle = "rgba(140, 220, 255, 0.9)";
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fill();

        for (var j = i + 1; j < nodes.length; j++) {
          var b = nodes[j];
          var dx = a.x - b.x;
          var dy = a.y - b.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < radius) {
            var alpha = (1 - dist / radius) * 0.4;
            ctx.beginPath();
            ctx.strokeStyle = "rgba(98, 185, 255," + alpha.toFixed(3) + ")";
            ctx.lineWidth = 1;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }

        if (mouse.active) {
          var mx = a.x - mouse.x;
          var my = a.y - mouse.y;
          var md = Math.sqrt(mx * mx + my * my);
          if (md < 170) {
            var ma = (1 - md / 170) * 0.58;
            ctx.beginPath();
            ctx.strokeStyle = "rgba(127,255,212," + ma.toFixed(3) + ")";
            ctx.lineWidth = 1.2;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(step);
    }

    window.addEventListener("mousemove", function (e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    });

    window.addEventListener("mouseleave", function () {
      mouse.active = false;
    });

    window.addEventListener("resize", function () {
      size();
      seed();
    });

    size();
    seed();
    step();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startNeuralBackground);
  } else {
    startNeuralBackground();
  }
})();
