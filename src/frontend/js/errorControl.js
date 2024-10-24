  // İnternet bağlantısını kontrol etme fonksiyonu
  function checkInternetConnection() {
    return window.navigator.onLine;
  }

  // Hata sayfasını yükleme fonksiyonu
  function loadErrorPage(errorType) {
    const errorTitle = {
      'internet': "İnternet Bağlantısı Hatası",
      'electron': "Electron Hatası",
      'database': "Veritabanı Hatası",
      'default': "Bilinmeyen Hata"
    };

    const errorDetails = {
      'internet': "İnternet bağlantınızı kontrol edin ve tekrar deneyin.",
      'electron': "Electron.js ile ilgili bir hata oluştu. Lütfen geliştiriciye ulaşın",
      'database': "Veritabanına bağlanırken bir hata oluştu.",
      'default': "Bir hata oluştu, lütfen tekrar deneyin."
    };

    // Hata başlığı ve detaylarını belirle
    const title = errorTitle[errorType] || errorTitle['default'];
    const details = errorDetails[errorType] || errorDetails['default'];

    // Html'i güncelle
    document.getElementById('main-content').innerHTML = `
      <div class="py-8 px-6 mx-auto max-w-screen-xl text-center lg:py-16 relative z-10">
        <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div class="mx-auto max-w-screen-sm text-center">
            <h1  class="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-cyan-300">HATA</h1>
            <p id="error-title" class="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">${title}</p>
            <p id="error-description" class="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">${details}</p>
          </div>
        </div>
      </div>
      <div class="bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-900 w-full h-full absolute top-0 left-0 z-0"></div>
      <footer class="bg-white shadow dark:bg-gray-900 w-full py-4 text-center">
        <div class="text-center mx-auto p-4 md:py-8">
          <hr class="my-4 border-gray-800 sm:mx-auto dark:border-gray-800" />
          <span class="block text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2024
            <a href="https://botcuk.com.tr/dev" class="hover:underline">Power By Herzane</a>
          </span>
        </div>
      </footer>
    `;
  }

  // Sayfa yükleme ve hata kontrolü fonksiyonu
  async function loadPageWithErrorHandling(page) {
    try {
      // İnternet bağlantısı kontrolü
      if (!checkInternetConnection()) {
        throw new Error('internet');
      }

      // Sayfa yükleme
      const response = await fetch(page);
      if (!response.ok) {
        throw new Error('fetch');
      }
      const content = await response.text();
      document.getElementById('main-content').innerHTML = content;
    } catch (error) {
      // Hata varsa, error sayfasına yönlendir
      loadErrorPage(error.message);
    }
  }

  // sayfa yönlendirme
  function handleErrorsAndLoadPage() {
    if (!checkInternetConnection()) {
      loadErrorPage('internet');
    } else {
      // Sayfayı yükle
      loadPageWithErrorHandling('login.html');
    }
  }

  //  hata kontrolü
  window.addEventListener('load', () => {
    handleErrorsAndLoadPage();
    
    setInterval(() => {
      if (!checkInternetConnection()) {
        loadErrorPage('internet');
      }
    }, 3 * 1000); // 3 saniye
  });
  


  