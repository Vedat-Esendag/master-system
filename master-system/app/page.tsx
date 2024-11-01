import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="bg-slate-800 text-white p-4 shadow-lg">
        <nav className="max-w-5xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">FlexiSpace</h1>
          <div className="space-x-4">
            <Link 
              href="/MainDashboard" 
              className="px-4 py-2 bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
            >
              Main Dashboard
            </Link>
            <Link 
              href="/CustomizeTable" 
              className="px-4 py-2 bg-green-500 rounded-md hover:bg-green-600 transition-colors"
            >
              Customize Table
            </Link>
          </div>
        </nav>
      </header>
      
      <main className="max-w-5xl mx-auto p-8">
        <h2 className="text-2xl font-bold">Welcome to the Dashboard</h2>
      </main>
    </div>
  )
}
