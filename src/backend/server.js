const path = require('path');
const { token, mongourl } = require('../confiig');
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const ejs = require('ejs');
const session = require('express-session');
const MemoryStore = require("memorystore")(session);


async function startServer() {


// website config backend
const app = express();

const PORT = process.env.PORT || 4000; 


async function connectToDatabase() {
  try {
    await mongoose.connect(mongourl, {
      // En güncel mongoose sürümleri için bu seçenekler varsayılan olarak ayarlandığı için burada belirlemenize gerek yok
    });
    console.log('MongoDB bağlantısı başarılı!');
  } catch (error) {
    console.error('MongoDB bağlantı hatası:', error);
  }
}
connectToDatabase();

// Express-session ayarları
app.use(session({
  secret: 'key', // Sifreleme anahtarı
  resave: false,
  saveUninitialized: false,
  store: new MemoryStore({
    checkPeriod: 86400000 // oturum sürsi 24 saat
  })
}));


// Middlewares
app.use(express.urlencoded({ extended: true }));//body okuyucu formlar için
app.use(express.json());


// EJS'yi şablon motoru olarak ayarla
app.set('view engine', 'ejs');

// EJS dosyalarının konumunu belirt
app.set('views', path.join(__dirname, '../frontend/html'));

// Statik dosyalar için
app.use(express.static(path.join(__dirname, '../frontend')));

// Rotalar
app.use('/auth', authRoutes);


// Ana sayfa (Login)
app.get('/', async (req, res) => {
  try {
    // Oturum kontrolü
    if (req.session.user) {
      // Kullanıcı giriş yapmışsa, panel sayfasına yönlendirilir
      return res.redirect('/panel');
    } else if (req.session.ogrenci) {
      // Öğrenci giriş yapmışsa, öğrenci paneline yönlendir
      return res.redirect('/ogrenci-panel');
    }
    const isAuthenticated = false; // Oturum açılmadıysa isAuthenticated false olarak ayarlanır
    const html = await ejs.renderFile(path.join(__dirname, '../frontend/html/login.ejs'), {
      req: req,
      error: req.query.error || null,
      isAuthenticated: isAuthenticated
    });
    res.send(html);
  } catch (error) {
    console.error('Render error:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Panel sayfası
app.get('/panel', async (req, res) => {
  // Kullanıcı oturum açmamışsa, giriş sayfasına yönlendir
  if (!req.session.user) {
    return res.redirect('/');
  }
  try {

    const Ogrenci = require('./models/ogrenci'); // Öğrenci modelini doğru path ile içe aktarın
    const sessionUser = require('./models/personel'); // Öğrenci modelini doğru path ile içe aktarın
  
    //(varsayılan olarak _id'ye göre sıralanır)
    const students = await Ogrenci.find();
    const userSessionName = await req.session.user.username;
    const personelSession = await sessionUser.findOne({ username :  userSessionName  });

    const isAuthenticated = true; // Kullanıcı giriş yapmışsa isAuthenticated true olarak ayarlanır
    const html = await ejs.renderFile(path.join(__dirname, '../frontend/html/panel.ejs'), {
      req: req,
      error: req.query.error || null,
      user: req.session.user || null,
      user2: personelSession || null,
      isAuthenticated: isAuthenticated,
      students: students,
    });
    res.send(html);
  } catch (error) {
    console.error('Render error:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Öğrenci Paneli
app.get('/ogrenci-panel', async (req, res) => {
  // Öğrenci oturum açmamışsa, giriş sayfasına yönlendir
  if (!req.session.ogrenci) {
    return res.redirect('/');
  }
  try {
    const isAuthenticated = true; // Öğrenci giriş yapmışsa isAuthenticated true olarak ayarlanır
    const html = await ejs.renderFile(path.join(__dirname, '../frontend/html/ogrenciPanel.ejs'), {
      req: req,
      error: req.query.error || null,
      ogrenci: req.session.ogrenci || null,
      isAuthenticated: isAuthenticated
    });
    res.send(html);
  } catch (error) {
    console.error('Render error:', error);
    res.status(500).send('Internal Server Error');
  }
});

/*
  // test
  app.get('/test', (req, res) => {
    res.json({ message: 'Express sunucusu çalışıyor' });
  });
*/

app.listen(PORT, function (err) {
    if (err) {
      console.error('Sunucu başlatılamadı:', err);
    } else {
      console.log(`Server çalışmaya başladı http://localhost:${PORT}`);
    }
  });


}

module.exports = startServer;







