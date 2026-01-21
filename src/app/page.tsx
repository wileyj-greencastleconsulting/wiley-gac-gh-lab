export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">Task Management & Performance Reporting</h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Professional task management with comprehensive activity tracking
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/login"
            className="rounded-lg bg-primary px-6 py-3 text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Get Started
          </a>
        </div>
      </div>
    </main>
  )
}
