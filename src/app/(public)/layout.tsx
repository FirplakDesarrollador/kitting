export default function PublicLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-[#f8f7f4]">
            {children}
        </div>
    )
}
