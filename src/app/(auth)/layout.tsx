import { ClearPageCache } from "@/components/ClearPageCache";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="scroll-area h-full">
      <ClearPageCache />
      <div className="flex min-h-full items-center justify-center px-4 py-[2rem]">{children}</div>
    </div>
  );
}
