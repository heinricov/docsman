export default function Banner() {
  return (
    <div className="flex min-h-10 flex-wrap items-center justify-center bg-primary px-3 py-2 text-center text-sm text-primary-foreground">
      <span>Your free trial ends in 3 days.</span>
      <div>
        <a className="mx-1 underline underline-offset-2" href="#/pricing">
          Upgrade
        </a>
        <span>to continue using the full features.</span>
      </div>
    </div>
  )
}
