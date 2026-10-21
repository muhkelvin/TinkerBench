export const siteConfig = {
  name: 'Tinkerbench Labs',
  tagline: 'A place for things in progress.',
  description:
    'Ruang kerja independen untuk membangun, menguji, dan mendokumentasikan produk digital.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  links: {
    github: 'https://github.com/muhkelvin',
    whatsapp: 'https://wa.me/6289526323412',
    email: 'muhkelvin36@gmail.com',
  },
  author: {
    name: 'Kelvin',
    role: 'Software Craftsman & Independent Builder',
    bio: 'Membangun prototipe, menguji hipotesis teknis, dan mendokumentasikan proses di balik layar.',
  },
  nav: [
    { label: 'Labs', href: '/labs' },
    { label: 'Notes', href: '/notes' },
    { label: 'About', href: '/about' },
  ],
};
