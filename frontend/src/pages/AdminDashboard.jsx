import IssueDashboard from "./IssueDashboard";

function AdminDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-red-600">
        Admin Dashboard
      </h1>
      <IssueDashboard />
    </div>
  );
}

export default AdminDashboard;
