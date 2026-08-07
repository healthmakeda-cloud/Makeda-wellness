export default function RootDivider() {
  return (
    <div className="w-full flex justify-center py-2" aria-hidden="true">
      <svg width="220" height="24" viewBox="0 0 220 24">
        <path
          d="M0,12 C40,2 60,22 100,12 C140,2 160,22 220,12"
          fill="none"
          stroke="#4F754C"
          strokeWidth="2"
        />
        <circle cx="100" cy="12" r="3.5" fill="#CC5500" />
      </svg>
    </div>
  )
}
