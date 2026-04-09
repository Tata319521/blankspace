(function () {
  function initParticles() {
    const canvas = document.getElementById("particle-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let particles = [];
    let stars = [];
    let w = 0;
    let h = 0;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;

      particles = Array.from({ length: Math.max(40, Math.floor(w / 28)) }, () => createParticle());
      stars = Array.from({ length: 70 }, () => createStar());
    }

    function createParticle() {
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 2.2 + 0.6,
        speedY: Math.random() * 1.5 + 0.3,
        alpha: Math.random() * 0.5 + 0.12
      };
    }

    function createStar() {
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.2 + 0.4,
        alpha: Math.random() * 0.6 + 0.15,
        twinkle: Math.random() * 0.02 + 0.003
      };
    }

    function drawBackgroundGlow() {
      const g1 = ctx.createRadialGradient(w * 0.2, h * 0.1, 10, w * 0.2, h * 0.1, w * 0.45);
      g1.addColorStop(0, "rgba(255,255,255,0.045)");
      g1.addColorStop(1, "rgba(255,255,255,0)");

      const g2 = ctx.createRadialGradient(w * 0.85, h * 0.15, 10, w * 0.85, h * 0.15, w * 0.25);
      g2.addColorStop(0, "rgba(255,255,255,0.025)");
      g2.addColorStop(1, "rgba(255,255,255,0)");

      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, w, h);
    }

    function drawStars() {
      for (const s of stars) {
        s.alpha += (Math.random() - 0.5) * s.twinkle;
        s.alpha = Math.max(0.1, Math.min(0.8, s.alpha));

        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function drawParticles() {
      for (const p of particles) {
        p.y += p.speedY;
        if (p.y > h + 10) {
          p.y = -10;
          p.x = Math.random() * w;
        }

        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function render() {
      ctx.clearRect(0, 0, w, h);
      drawBackgroundGlow();
      drawStars();
      drawParticles();
      requestAnimationFrame(render);
    }

    resize();
    render();
    window.addEventListener("resize", resize);
  }

  window.addEventListener("DOMContentLoaded", initParticles);
})();