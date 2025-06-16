import Image from "next/image";
import Link from "next/link";
import PreRegisterModal from "src/components/modals/preRegisterModal";

export function Topbar() {
  return (
    <header className="w-full flex justify-between items-center px-14 py-1 max-w-screen-xl mx-auto">
      <div className="flex items-center">
        <Link href="/">
          <Image
            src="/logos/logo-text-dark.svg"
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
