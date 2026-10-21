export const siteConfig = {
  name: 'Tinkerbench Labs',
  tagline: 'A place for things in progress.',
  description:
    'Ruang kerja independen untuk membangun, menguji, dan mendokumentasikan produk digital.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  links: {
    github: 'https://github.com/tinkerbench',
    whatsapp: 'https://wa.me/6281234567890',
    email: 'hello@tinkerbench.dev',
  },
  author: {
    name: 'Tinkerbench Lab Lead',
    role: 'Software Craftsman & Independent Builder',
    bio: 'Membangun prototipe, menguji hipotesis teknis, dan mendokumentasikan proses di balik layar.',
  },
  nav: [
    { label: 'Labs', href: '/labs' },
    { label: 'Notes', href: '/notes' },
    { label: 'About', href: '/about' },
  ],
};
