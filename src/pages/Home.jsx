import React from 'react';

const LandingPage = () => {
  return (
    <div className="font-sans text-gray-800">
      {/* Header bo'limi */}
      <header className="bg-gray-800 text-white py-20 px-4 text-center">
        <h1 className="text-4xl font-bold">Learning Center'ga Xush Kelibsiz</h1>
        <p className="mt-4 text-lg">O'rganishni yangi darajaga ko'taring</p>
        <a href="/categories" className="mt-6 inline-block bg-red-500 text-white py-2 px-6 rounded hover:bg-red-600 transition">
          Kurslarimizni Ko'rish
        </a>
      </header>

      {/* Xizmatlar bo'limi */}
      <section id="services" className="py-20 bg-gray-100">
        <div className="max-w-6xl mx-auto text-center px-4">
          <h2 className="text-3xl font-semibold mb-8">Xizmatlarimiz</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded shadow-lg">
              <h3 className="text-xl font-semibold">Onlayn Kurslar</h3>
              <p className="mt-4">Turli xil mavzular bo'yicha onlayn kurslarga qatnashing va yangi ko'nikmalarni o'rganing.</p>
            </div>
            <div className="bg-white p-6 rounded shadow-lg">
              <h3 className="text-xl font-semibold">Mentorlik</h3>
              <p className="mt-4">Shaxsiy mentor yordamida o'z bilimingizni rivojlantiring va mustahkamlang.</p>
            </div>
            <div className="bg-white p-6 rounded shadow-lg">
              <h3 className="text-xl font-semibold">Imtihon Tayyorlovlari</h3>
              <p className="mt-4">Imtihonlarga samarali tayyorgarlik ko'rish uchun yordam oling.</p>
            </div>
          </div>
        </div>
      </section>

      {/* O'qituvchilar bo'limi */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto text-center px-4">
          <h2 className="text-3xl font-semibold mb-8">Bizning O'qituvchilarimiz</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-100 p-6 rounded shadow-md">
              <h3 className="text-xl font-semibold">Aliyev Akbar</h3>
              <p className="mt-2">Matematika mutaxassisi</p>
            </div>
            <div className="bg-gray-100 p-6 rounded shadow-md">
              <h3 className="text-xl font-semibold">Karimova Laylo</h3>
              <p className="mt-2">Ingliz Tili o'qituvchisi</p>
            </div>
            <div className="bg-gray-100 p-6 rounded shadow-md">
              <h3 className="text-xl font-semibold">Mahmudov Jasur</h3>
              <p className="mt-2">Dasturlash muhandisi</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sharhlar bo'limi */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-6xl mx-auto text-center px-4">
          <h2 className="text-3xl font-semibold mb-8">Talabalarimizning Fikrlari</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded shadow-lg">
              <p>"Bu markaz menga o'z sohamda rivojlanishga yordam berdi!"</p>
              <span className="mt-4 block text-gray-500">- Ali</span>
            </div>
            <div className="bg-white p-6 rounded shadow-lg">
              <p>"Kurslar juda foydali va tushunarli tarzda o'tildi."</p>
              <span className="mt-4 block text-gray-500">- Laylo</span>
            </div>
          </div>
        </div>
      </section>

      {/* Bog'lanish bo'limi */}
      <section id="contact" className="py-20">
        <div className="max-w-6xl mx-auto text-center px-4">
          <h2 className="text-3xl font-semibold mb-8">Bog'lanish</h2>
          <p className="mb-4">Bog'lanish uchun quyidagi manzillar orqali murojaat qilishingiz mumkin:</p>
          <ul className="list-none">
            <li>Email: info@learningcenter.com</li>
            <li>Telefon: +998 90 123 45 67</li>
            <li>Manzil: Toshkent, O'zbekiston</li>
          </ul>
        </div>
      </section>

      {/* Footer bo'limi */}
      <footer className="bg-gray-800 text-white py-6 text-center">
        <p>&copy; 2024 Learning Center. Barcha huquqlar himoyalangan.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
