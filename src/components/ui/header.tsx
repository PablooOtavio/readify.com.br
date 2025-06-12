import Image from "next/image";
import Link from "next/link";
import PreRegisterModal from "../modals/preRegisterModal";

type HeaderProps = {
  buttonText?: string;
  buttonLink?: string;
  showButton?: boolean;
};

export function Header({}: HeaderProps) {
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

      <PreRegisterModal
        text="Registre-se Agora"
        colors="bg-slate-800 text-white hover:bg-slate-700"
      />
    </header>
  );
}
