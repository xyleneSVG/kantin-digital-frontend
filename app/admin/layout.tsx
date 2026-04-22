import { Sidebar } from "@/src/components/ui/sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Sidebar />
      <div className="lg:ml-64">
        {children}
      </div>
    </>
  )
}
