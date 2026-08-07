// Single source of truth for clinic locations — used by Contact and Footer.

export const locations = [
  {
    name: "Baldwin's & Co",
    area: 'Camberwell',
    services: 'Herbal medicine & dispensary',
    hours: '9am – 6pm',
    booking: 'In-store bookings only, first come first served. Includes free 15-minute 1-1 consultations.',
    onlineNote: 'Online bookings Fridays only, 10am – 2pm.',
    variant: 'berry'
  },
  {
    name: 'Brackenbury Health Clinic',
    area: 'Hammersmith',
    services: 'Colon hydrotherapy and/or herbal medicine consultation',
    hours: 'Thursdays & Saturdays, 1pm – 5pm',
    booking: 'Book online.',
    image: '/images/brackenbury.jpg',
    bookingUrl: 'https://brackenburyclinic.janeapp.co.uk/#/staff_member/0177f8a8-067e-722c-a0a2-01269a16bfd6',
    variant: 'water'
  },
  {
    name: 'Cuerpos Beauty',
    area: 'Vauxhall',
    services: 'Colon hydrotherapy and herbal medicine consultation',
    hours: '1:15pm – 5pm',
    booking: 'Contact the clinic to book.',
    variant: 'herb'
  }
]

export const generalAvailabilityNote = 'No appointments on Sundays.'
