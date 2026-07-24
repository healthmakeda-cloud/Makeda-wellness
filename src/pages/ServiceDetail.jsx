import { useParams, Link } from 'react-router-dom'
import { getServiceBySlug } from '../data/services.js'
import ImagePlaceholder from '../components/ImagePlaceholder.jsx'
import RootDivider from '../components/RootDivider.jsx'
import NotFound from './NotFound.jsx'

export default function ServiceDetail() {
  const { slug } = useParams()
  const service = getServiceBySlug(slug)

  if (!service) return <NotFound />

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <Link to="/services" className="font-mono text-xs tracking-widest text-ochre">← ALL SERVICES</Link>

      {service.image ? (
        <img
          src={service.image}
          alt={service.title}
          className="w-full aspect-[16/9] object-cover rounded-xl mt-6 mb-8"
        />
      ) : (
        <div className="mt-6 mb-8">
          <ImagePlaceholder className="aspect-[16/9]" label="Photography coming soon" variant="herb" />
        </div>
      )}

      <h1 className="font-display text-3xl md:text-4xl text-moss mb-6">{service.title}</h1>

      <div className="space-y-4 text-ink/80 leading-relaxed">
        {service.fullDescription.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      <RootDivider />

      <Link
        to={service.cta.to}
        className="inline-block bg-moss text-linen px-6 py-3 rounded font-body text-sm hover:bg-ink transition-colors"
      >
        {service.cta.label}
      </Link>
    </div>
  )
}
