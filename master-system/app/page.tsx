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
        <h2 className="text-2xl font-bold mb-4">Welcome to the Dashboard</h2>
        <p className="text-gray-600 text-lg mb-6">
          FlexiSpace is your all-in-one solution for managing and customizing your workspace. 
          Navigate to the Main Dashboard to view your data or use the Customize Table feature 
          to tailor your tables according to your needs.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Main Dashboard</h3>
            <p className="text-gray-600">
              Access your comprehensive dashboard to view and manage your data in real-time.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Table Customization</h3>
            <p className="text-gray-600">
              Personalize your tables with our intuitive customization tools.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
