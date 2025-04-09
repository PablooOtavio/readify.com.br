import Head from "next/head";
import React, { useState } from "react";
export default function Home() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Registering email:", email);
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>Readify - Uma nova forma de Compartilhar Conhecimento</title>
        <meta
          name="description"
          content="Plataforma inovadora que conecta alunos e professores em um espaço colaborativo"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        {/* Hero Section */}
        <section className="bg-slate-800 text-white py-16 px-6 md:px-12 lg:px-20 rounded-3xl">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Uma nova forma de Compartilhar Conhecimento
              </h1>
              <p className="mb-8 text-slate-200 text-lg">
                O Readify é uma plataforma inovadora que conecta alunos e
                professores em um espaço colaborativo para troca de
                conhecimento. Em breve, você terá acesso a um ecossistema
                completo de aprendizado, permitindo a criação, revisão e
                compartilhamento de materiais de estudo de forma totalmente
                gratuita.
              </p>
              <div className="inline-flex rounded-md overflow-hidden">
                <input
                  type="email"
                  className="bg-slate-700 text-white px-4 py-3 outline-none min-w-[200px]"
                  placeholder="Seu email"
                />
                <button className="bg-teal-400 text-slate-800 px-4 py-3 font-medium hover:bg-teal-300 transition-colors">
                  <span className="mr-2">Registre-se para mais novidades</span>
                  <span>→</span>
                </button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative h-64 w-64 md:h-80 md:w-80">
                {/* Abstract 3D elements would go here - using divs with styling for now */}
                <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-gradient-to-br from-slate-600 to-slate-900 opacity-80"></div>
                <div className="absolute left-8 bottom-8 h-32 w-32 bg-gradient-to-br from-slate-600 to-slate-900 rotate-45 opacity-80"></div>
                <div className="absolute right-16 bottom-16 h-40 w-40 rounded-full bg-gradient-to-br from-slate-600 to-slate-900 opacity-80"></div>
              </div>
            </div>
          </div>
        </section>

        {/* What to Expect Section */}
        <section className="py-16 px-6 md:px-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-800 mb-12">
            O Que Você Pode Esperar?
          </h2>
          <p className="text-center text-slate-600 max-w-2xl mx-auto mb-16">
            Estamos empenhados em tornar a experiência de ensino e aprendizado
            mais robusta, incorporando funcionalidades para tornar esse processo
            ainda mais produtivo.
          </p>

          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-slate-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                Notas Compartilhadas com Versionamento Inteligente
              </h3>
              <p className="text-slate-600">
                Crie, organize e compartilhe suas notas com um sistema de
                versionamento intuitivo. Você poderá acompanhar alterações,
                reverter versões e permitir colaborações.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-slate-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                Digitalização Inteligente com OCR
              </h3>
              <p className="text-slate-600">
                Transforme anotações escritas à mão em textos digitais e
                facilite o compartilhamento de soluções matemáticas e resumos.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-slate-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                Espaço para Artigos Acadêmicos
              </h3>
              <p className="text-slate-600">
                Compartilhe e descubra artigos acadêmicos para expandir seus
                conhecimentos.
              </p>
            </div>
          </div>
        </section>

        {/* Coming Soon / Registration Section */}
        <section className="py-16 px-6 md:px-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
            Lançamento em Breve!
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto mb-8">
            Estamos trabalhando para trazer a melhor experiência de aprendizado
            online. Se registre para mais novidades!
          </p>

          <form onSubmit={handleSubmit} className="max-w-lg mx-auto flex">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@email.com"
              className="flex-1 px-4 py-3 rounded-l-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
              required
            />
            <button
              type="submit"
              className="bg-slate-800 text-white px-6 py-3 rounded-r-md hover:bg-slate-700 transition-colors"
            >
              Registrar-se
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
