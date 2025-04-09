import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-slate-800 text-white py-8 px-6 md:px-12 ">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-6">
          <Image
            src="/logos/logo-text-white.svg"
            alt="Readify Logo"
            width={145}
            height={70}
          />
        </div>
        <p className="text-slate-300 text-sm mb-8">
          Entre em contato para saber mais sobre experiências digitais para
          alcançar e engajar efetivamente alunos e professores.
        </p>
        <hr className="border-slate-600 mb-6" />
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-slate-400">
          <p>© 2025 Readify - Todos os direitos reservados</p>
          <div className="mt-4 md:mt-0">
            <a href="#" className="hover:text-teal-400 mr-4">
              Política de Privacidade
            </a>
            <a href="#" className="hover:text-teal-400">
              Termos de Serviço
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
