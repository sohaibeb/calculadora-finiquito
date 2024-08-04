function toggleNav() {
  const sidebar = document.getElementById('menuLateral');
  const mainContent = document.getElementById('main');
  if (sidebar.classList.contains('open')) {
    sidebar.classList.remove('open');
    mainContent.style.marginLeft = '0';
  } else {
    sidebar.classList.add('open');
    mainContent.style.marginLeft = '250px'; // Debe coincidir con el ancho del sidebar
  }
}
