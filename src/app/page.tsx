import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Create Legal Documents
            <span className="text-blue-600"> Made Simple</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Generate professional legal documents like rent agreements and affidavits in minutes.
            No legal expertise required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {documentTypes.map((doc) => (
            <Link
              key={doc.id}
              href={`/documents/${doc.id}`}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="text-blue-600 mb-4">{doc.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{doc.title}</h3>
              <p className="text-gray-600">{doc.description}</p>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/documents/new"
            className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
          >
            Create New Document
          </Link>
        </div>
      </div>
    </main>
  )
}

const documentTypes = [
  {
    id: 'rent-agreement',
    title: 'Rent Agreement',
    description: 'Create a legally binding rent agreement for your property.',
    icon: '🏠',
  },
  {
    id: 'affidavit',
    title: 'Affidavit',
    description: 'Generate affidavits for various legal purposes.',
    icon: '📜',
  },
  {
    id: 'power-of-attorney',
    title: 'Power of Attorney',
    description: 'Create a power of attorney document to authorize someone.',
    icon: '✍️',
  },
]
