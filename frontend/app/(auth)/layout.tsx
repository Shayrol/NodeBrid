// app/(auth)/layout.tsx

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col justify-start items-center h-screen w-full">
      {children}
    </div>
  );
}
