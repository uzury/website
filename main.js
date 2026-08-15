const header = document.querySelector('#header')
const menuButton = document.querySelector('.menu-button')
const menu = document.querySelector('#main-nav')
const navLinks = [...document.querySelectorAll('.main-nav a[href^="#"]')]
const themeToggle = document.querySelector('.theme-toggle')
const themeColor = document.querySelector('meta[name="theme-color"]')

function applyTheme(theme) {
  const isDark = theme === 'dark'
  document.documentElement.dataset.theme = theme
  try {
    localStorage.setItem('uzury-theme', theme)
  } catch (_) {
    // O tema continua funcionando mesmo quando o armazenamento está bloqueado.
  }
  themeToggle.setAttribute('aria-label', isDark ? 'Ativar tema claro' : 'Ativar tema escuro')
  themeToggle.setAttribute('title', isDark ? 'Ativar tema claro' : 'Ativar tema escuro')
  themeColor.setAttribute('content', isDark ? '#0c0b0d' : '#faf8f2')
}

applyTheme(document.documentElement.dataset.theme || 'dark')
themeToggle.addEventListener('click', () => {
  applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark')
})

function closeMenu() {
  menu.classList.remove('open')
  menuButton.setAttribute('aria-expanded', 'false')
  menuButton.setAttribute('aria-label', 'Abrir menu')
  document.body.classList.remove('menu-open')
}

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true'
  menu.classList.toggle('open', !isOpen)
  menuButton.setAttribute('aria-expanded', String(!isOpen))
  menuButton.setAttribute('aria-label', isOpen ? 'Abrir menu' : 'Fechar menu')
  document.body.classList.toggle('menu-open', !isOpen)
})

navLinks.forEach((link) => link.addEventListener('click', closeMenu))
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu()
})

function updateHeader() {
  header.classList.toggle('scrolled', window.scrollY > 18)
}

updateHeader()
window.addEventListener('scroll', updateHeader, { passive: true })

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      entry.target.classList.add('revealed')
      observer.unobserve(entry.target)
    })
  },
  { threshold: 0.12 }
)

document.querySelectorAll('[data-reveal]').forEach((element) => revealObserver.observe(element))

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`)
      })
    })
  },
  { rootMargin: '-35% 0px -55%', threshold: 0 }
)

document.querySelectorAll('main section[id]').forEach((section) => sectionObserver.observe(section))
document.querySelector('#year').textContent = new Date().getFullYear()
