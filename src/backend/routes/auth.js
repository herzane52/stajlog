const express = require('express');
const router = express.Router();
const Personel = require('../models/personel'); // Personel modelinizi buradan içe aktarın
const Ogrenci = require('../models/ogrenci'); // Öğrenci modelini içe aktarın
const multer = require('multer')


// Multer konfigürasyonu
const storage = multer.memoryStorage(); // Fotoğrafları bellekte tutar
const upload = multer({ storage: storage });
// Route to handle form submission



// Giriş
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Kullanıcıyı bul
        const user = await Personel.findOne({ username });

        if (!user) {
            // Kullanıcı bulunamazsa 
            return res.render('login', { error: 'Bu Kullanıcı Sistemde kayıtlı değil.' });
        }

        // Şifreyi karşılaştır
        if (password !== user.password) {
            return res.render('login', { error: 'Girilen Şifre Yanlış' });
        }

        // Giriş başarılıysa
        req.session.user = user;
        // panele yönlendir
        res.redirect('/panel');

    } catch (error) {
        console.error('Giriş Hatası:', error);
        res.render('login', { error: 'Giriş sırasında bir hata oluştu. Lütfen tekrar deneyin.' });
    }
});

// Çıkış 
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Çıkış yapılırken hata oluştu');
        }
        res.clearCookie('connect.sid'); // Çerezi temizleyin
        //login sayfasına yönlendir 
        res.redirect('/');
    });
});

/*

// Öğrenci Giriş
router.post('/ogrenci-login', async (req, res) => {
    const { tc, password } = req.body;

    try {
        // Öğrenciyi bul
        const ogrenci = await Ogrenci.findOne({ tc });

        if (!ogrenci) {
            // Öğrenci bulunamazsa hata mesajı
            return res.render('ogrenci-login', { error: 'Bu öğrenci sistemde kayıtlı değil.' });
        }

        // Şifreyi karşılaştır
        if (password !== ogrenci.password) {
            return res.render('ogrenci-login', { error: 'Girilen şifre yanlış.' });
        }

        // Giriş başarılıysa
        req.session.ogrenci = ogrenci;
        // Öğrenci paneline yönlendir
        res.redirect('/ogrenciPanel');

    } catch (error) {
        console.error('Öğrenci Giriş Hatası:', error);
        res.render('ogrenci-login', { error: 'Giriş sırasında bir hata oluştu. Lütfen tekrar deneyin.' });
    }
});

// Öğrenci Çıkış
router.get('/ogrenci-logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Çıkış yapılırken hata oluştu');
        }
        // Öğrenci giriş sayfasına yönlendir
        res.redirect('/ogrenci-login');
    });
});*/



// Route to handle form submission
router.post('/profile-update', upload.single('profile-photo'), async (req, res) => {

    //console.log('Gelen veriler:', req.body);// Formdan gelen verileri konsola yazdırma 
    try {

        // Form verilerini al

        const { 'profile-user-name': username, 'profile-name': name, 'profile-surname': surname, 'profile-email': email,  'profile-password': password } = req.body;

        // Kullanıcının var olup olmadığını kontrol et
        const existingPerson = await Personel.findOne({ username });
    
        // Fotoğrafı al ve byte dizisine dönüştür
        const photo = req.file ? req.file.buffer : existingPerson.photo;

      
        if (existingPerson) {
            // Kullanıcı varsa, güncelleme işlemi yap
            await Personel.updateOne(
                { username:username },
                {
                    $set: {
                        name:name,
                        surname:surname,
                        email:email,
                        password:password,
                        photo:photo,
                    }
                }
            );
            res.status(200).json({ status: 'success', message: 'Kullanıcı güncellendi!' });
        } else {
            // Kullanıcı yoksa, güncelleme yapılmıyor ve hata mesajı 
            res.status(400).json({ status: 'error', message: 'Uyarı sistem Kullanıcı Adı Değiştrilemez' });
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({ status: 'error', message: 'Bilinmeyen bir hata oluştu' });
    }
});






// Route to handle form submission
router.post('/student-register', upload.single('photo'), async (req, res) => {
        try {
            // Form verilerini al
            const { tc, name, surname, email, tel, startDate, endDate, status, days,password } = req.body;
    
        // Kullanıcının var olup olmadığını kontrol et
        const existingPerson = await Ogrenci.findOne({ tc: tc });
    
        // Fotoğrafı al ve byte dizisine dönüştür
        const photo = req.file ? req.file.buffer : existingPerson.photo;


        
            if (existingPerson) {
                // Kullanıcı varsa hata döner
                res.status(400).json({ status: 'error', message: 'Bu kullanıcı zaten kayıtlı!' });
            } else {
            // Yeni öğrenci belgesini oluştur
            const ogrenci = new Ogrenci({
                tc:tc,
                password: password, // Şifreyi al
                firstName: name,
                lastName: surname,
                email:email,
                tel:tel,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                status:status,
                days: parseInt(days, 10),
                photo: photo,
            });
    
            // Veriyi kaydet
            await ogrenci.save();

            // Başarı mesajı ve yönlendirme
            res.status(200).json({ status: 'success', message: 'Kullanıcı başarıyla oluşturuldu!' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: 'error', message: 'Bir hata oluştu!' });
        }
        

});

router.get('/students/:id', async (req, res) => {
    try {
        const studentId = req.params.id;

        // Öğrenci verisini veritabanından çek
        const student = await Ogrenci.findById(studentId);

        if (!student) {
            return res.status(404).json({ message: 'Öğrenci bulunamadı.' });
        }

        res.json(student);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Sunucu hatası.' });
    }
});




// Route to get students data
router.get('/get-students', async (req, res) => {
    try {
        // Tüm öğrencileri al
        const students = await Ogrenci.find();

        // Öğrencilerle birlikte başarı yanıtı döndür
        res.status(200).json({ students });
    } catch (error) {
        console.error('Hata:', error);
        res.status(500).json({ status: 'error', message: 'Bir hata oluştu!' });
    }
});


module.exports = router;
