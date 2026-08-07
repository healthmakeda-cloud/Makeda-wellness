import { Link } from 'react-router-dom'
import MakedaMethodModule from '../components/MakedaMethodModule.jsx'
import RootDivider from '../components/RootDivider.jsx'

export default function Method() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <p className="font-mono text-xs tracking-widest text-ochre mb-4">THE MAKÉDA METHOD™</p>
      <h1 className="font-display text-3xl md:text-4xl text-moss mb-4">
        Most clinics begin with symptoms.
        <br />We begin with your story.
      </h1>
      <p className="text-ink/80 mb-2">
        We help you tell your health story. We listen deeply. We look for root causes. We restore balance
        through personalised herbal medicine, colon hydrotherapy and lifestyle support.
      </p>
      <p className="text-ochre italic mb-10">Your story. Your healing. Your way.</p>

      <MakedaMethodModule />

      <RootDivider />

      <div className="text-center">
        <Link to="/contact" className="bg-moss text-linen px-6 py-3 rounded font-body text-sm inline-block hover:bg-ink transition-colors">
          Start your health journey
        </Link>
      </div>
    </div>
  )
}
