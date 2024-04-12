//function for toggling themes 
function toggleTheme(): void {
  document.getElementById("toggle")?.addEventListener("click", () => {
      document.getElementsByTagName('body')[0].classList.toggle("dark-theme");
  });
}

function themeOnLoad(): void {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.getElementsByTagName('body')[0].classList.toggle("dark-theme");
  } 
}

