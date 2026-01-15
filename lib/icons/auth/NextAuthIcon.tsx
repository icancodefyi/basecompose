import Image from "next/image";
export default function NextAuthIcon({ className }: { className?: string }) {
  return (
    <Image
      src="/icons/auth/nextAuth.svg"
      alt="NextAuth Icon"
      width={48}
      height={48}
      className={className}
    />
  );
}
