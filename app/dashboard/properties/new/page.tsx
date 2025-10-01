import PropertyForm from '@/components/PropertyForm';

export default function NewProperty() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Add New Property</h1>
        <p className="text-gray-600">Add a property to your portfolio</p>
      </div>
      
      <PropertyForm />
    </div>
  );
}