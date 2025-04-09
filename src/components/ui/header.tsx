import Image from "next/image";
import Link from "next/link";

type HeaderProps = {
  buttonText?: string;
  buttonLink?: string;
  showButton?: boolean;
};

export function Header({
  buttonText = "Registre-se Agora",
  buttonLink = "/register",
  showButton = true,
}: HeaderProps) {
  return (
    <header className="w-full px-6 py-4 flex justify-between items-center">
      <div className="flex items-center">
        <Link href="/">
          <Image
            src="/logos/Logo-text-dark.svg"
            alt="Readify Logo"
            width={145}
            height={70}
          />
        </Link>
      </div>

      {showButton && (
        <Link href={buttonLink}>
          <button className="bg-slate-800 text-white px-4 py-2 rounded-md hover:bg-slate-700 transition-colors">
            {buttonText}
          </button>
        </Link>
      )}
    </header>
  );
}
