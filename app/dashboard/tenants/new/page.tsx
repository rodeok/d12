import TenantForm from '@/components/TenantForm';

export default function NewTenant() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Add New Tenant</h1>
        <p className="text-gray-600">Add a tenant to one of your properties</p>
      </div>
      
      <TenantForm />
    </div>
  );
}