const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String , required: true, unique: true },
  password: { type: String , required: true },  
  photo:    { type: Buffer , required: false},
  name:     { type: String , required: true},
  surname:  { type: String , required: true},
  email:    { type: String , required: true},

});
      //type: String, //veri tipi
      //required: true,// verinin zorunlu olması
     // unique: true,// verinin benzersiz olması


// Modelin adı 'User', MongoDB'deki koleksiyon ismi otomatik olarak 'users' olur
const Personel = mongoose.model('personel', userSchema);

module.exports = Personel; 