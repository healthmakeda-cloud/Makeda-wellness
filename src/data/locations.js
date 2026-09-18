// Single source of truth for clinic locations — used by Contact and Footer.

export const locations = [
  {
    name: "Baldwin's & Co",
    area: 'Camberwell',
    services: 'Herbal medicine & dispensary',
    hours: 'Tuesdays & Wednesdays, 10am – 2pm',
    booking: 'In-store bookings only, first come first served. Includes free 15-minute 1-1 consultations.',
    logo: '/images/baldwins-logo.png',
    variant: 'berry'
  },
  {
    name: 'Brackenbury Health Clinic',
    area: 'Hammersmith',
    services: 'Colon hydrotherapy and/or herbal medicine consultation',
    hours: 'Thursdays 10am – 7pm, Saturdays 10am – 4pm',
    booking: 'Book online.',
    image: '/images/brackenbury.jpg',
    bookingUrl: 'https://brackenburyclinic.janeapp.co.uk/#/staff_member/0177f8a8-067e-722c-a0a2-01269a16bfd6',
    variant: 'water'
  },
  {
    name: 'Cuerpos Beauty',
    area: 'Vauxhall',
    services: 'Colon hydrotherapy and herbal medicine consultation',
    hours: 'Mondays, 1:15pm – 5pm',
    booking: 'Book online via Calendly.',
    bookingUrl: 'https://calendly.com/makedah14/30min',
    logo: '/images/cuerpos-logo.png',
    variant: 'herb'
  }
]

export const generalAvailabilityNote = 'No appointments on Sundays.'
