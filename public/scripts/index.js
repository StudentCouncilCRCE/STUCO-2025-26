// ===== PROFILE CARDS PARALLAX EFFECT =====

// Add subtle parallax effect on mouse move for profile cards only
document.addEventListener("mousemove", (e) => {
  const cards = document.querySelectorAll(".profile-card");
  const x = e.clientX / window.innerWidth;
  const y = e.clientY / window.innerHeight;
  
  // Profile cards parallax (keeping original functionality)
  cards.forEach((card, index) => {
    const multiplier = index % 2 === 0 ? 1 : -1;
    const rotateX = (y - 0.5) * 5 * multiplier;
    const rotateY = (x - 0.5) * 5 * multiplier;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });
});

// Reset profile card transforms on mouse leave
document.addEventListener("mouseleave", () => {
  const cards = document.querySelectorAll(".profile-card");
  cards.forEach((card) => {
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
  });
});
