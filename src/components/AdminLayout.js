import AdminSidebar from './AdminSidebar';

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-cream-50 flex">
      <AdminSidebar />
      <section className="flex-1 max-w-screen-2xl mx-auto px-4 py-8">{children}</section>
    </div>
  );
}
