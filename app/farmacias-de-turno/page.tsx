import  {pharmacies} from '@/components/FarmaciasDeTurno'

export default function FarmaciasDeTurnoPage() {
  return (
    <section className="container mx-auto px-4 py-6">
      <div className="mb-6 border-b border-light-gray pb-2 flex items-center">
        <div className="h-5 w-1 bg-primary-red mr-3"></div>
        <h2 className="text-xl font-bold uppercase">Farmacias de turno</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pharmacies.map((pharmacy) => (
          <div
            key={pharmacy.day}
            className="border border-gray-200 shadow-md bg-white rounded-lg overflow-hidden"
          >
            <img
              src={pharmacy.image}
              alt={`Farmacia ${pharmacy.name}`}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-primary-red mb-2">
                {pharmacy.name}
              </h3>
              <p className="text-sm text-gray-700 mb-1">
                <strong>Dirección:</strong> {pharmacy.address}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Teléfono:</strong> {pharmacy.phone}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
