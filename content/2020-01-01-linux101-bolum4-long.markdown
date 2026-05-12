---
layout: post
title:  "4. Sistem Yönetimi ve temel ağ yapılandırması"
date:   2020-01-01
author: "@senolcolak"
tags: [linux101,turkce,operations]
categories: [linux101,beginner]
terms: 1
---

Bölüm içersinde sistem yönetimi temel araçlarını kullanıcı yönetimi ve ağ yapılandırması konusunda temel bilgiler edineceğiz.  

---


> **Bölüm içersinde aşağıdaki konular işlenecektir:**
> * Table of contents
> {:toc}

---

Kullanım İpuçları:

Eğitim içersinde, komut satırı bilgileri aşağıdaki üç farklı şekilde belirtilmiştir.

1. `şunun` gibi görünen komut betimleri şeklinde gösterilmler daha çok örnekler ve yazılması gereken komutları tanımlamak için kullanılır.

2. Aşağıdaki gibi kutu içersinde gördüğünüz kodlar üzerine tıkladığınızda, kopyala yapıştır yapmanıza gerek kalmadan terminal içersinde çalıştırılacaktır:
```.term1
uname -a 
```
3. Aşağıda gördüğünüz gibi bir pencere içersinde yazılmış olan kod betimleri sizin klavyeden yazmanız gereken kod betimleridir.
Genellikle benzersiz bir ID veya başka bir değişken girmeniz gerekiyordur. Buradaki benzersiz veri eğitim sırasında kullandığınız ortam içersinden bulunabilir.
<> içersinde bulunan maddeler sizin değiştirmeniz gereken verinin yerini göstermektedir.
```
hostnamectl set <sunucu adı>
```


---

## 1. Kullanıcı ve Gurupların yönetimi

Linux işletim sistemi kullanıcıların yönetildiği hesapların olduğu, bunların belli ilişkiler ile farklı gurup ve yetkilerle birbirine bir veri bütünlüğü ile bağlı olduğu bir işletim sistemidir.  
  
Hesapları yönetmek, sistem yöneticilerinin en temel işlevlerinden biridir. Öncelikle kullanıcı ve grup yönetimi hakkında birkaç temel kavramı anlamanız gerekir. Ayrıca, kullanıcıları ve grupları yönetmek için ihtiyaç duyduğunuz araçlar ve yapılandırma dosyalarını da bilmeliyiz. Temelde yapılan işlem basit bir ilişkisel veri tabanıdır ve yine bunlar dosya sistemi üzerindeki yetkiler ile kısıtlıdırlar.  
  
  
#### Kullanıcıları ve Gruplar nasıl çalışır?
Banka hesabı veya kullanıcı adı/şifre konusunu günümüzde herkes bilmekte. Aynı şekilde, Linux hesapları da  Windows, Mac OS ve diğer işletim sistemlerinde bulunan hesaplar gibidir. Linux içersindeki hesaplar, içersinde kullanıcı adı, kullanıcı parolası, bağlı bulunduğu guruplar, ev dizini, tercih ettiği kabuk(shell) gibi bilgiler vardır.  
  
Linux kullanacak kişiler dışında, linux işletim sistemi için farklı fonksiyonları olan hesaplar vardır. Linux özel hesapları içersinde arka planda çalışan hizmetler, kullanıcısı olmayan fakat sürekli var olması gereken yazıcı(cups) gibi hesaplar vardır. Bu hesaplar, linux geçmişinden gelmektedirler ve değişik fonksiyonların yüklendiği işleri yaparlar. Mesela cups hesabı, sunucunuz üzerindeki yazıcı çıktıları için gereklidir, bilgisayarınızda yazıcı işlemlerinin donanım yetkilendirmesi için böyle bir kullanıcıya ihtiyaç vardır.  

Linux çok kullanıcılı bir işletim sistemi olduğundan (farklı bilgisayarlardaki veya terminallerdeki birden fazla kullanıcının tek bir sisteme erişmesine izin verdiği için), kullanıcı yönetimini mutlaka bilmeniz gerekecektir. Kullanıcı yönetimi içinde eklemek, düzenlemek, askıya almak, ve silmek işlemlerini mutlaka bilmelisiniz. Bunların dışında kullanıcı hesaplarının, kendilerine atanmış görevleri yapmaları için gerekli izinleri nasıl verebileceğimizi bilmemiz gerekir.  
  
#### Kullanıcı Hesabı Ekleme
  
Yeni bir kullanıcı hesabı eklemek için, aşağıdaki iki komuttan birini root olarak çalıştırabilirsiniz.  
  
$ adduser [yeni_hesap]  
$ useradd [yeni_hesap]  
  
(siz kendi adınıza bir kullanıcı açın)  
```.term1
adduser senol
```
  
Sisteme yeni bir kullanıcı hesabı eklendiğinde aşağıdaki işlemler yapılır.  

* Ev dizini oluşturulur (varsayılan olarak /home/kullanıcı_adi)  
* Aşağıdaki gizli dosyalar kullanıcının ana dizinine kopyalanır ve kullanıcının oturumu için ortam değişkenleri sağlamak için kullanılır  
````
.bash_logout  
.bash_profile  
.bashrc  
````
* Kullanıcı için /var/spool/mail/username konumunda bir posta klasörü oluşturulur  
* Yeni bir grup oluşturulur ve yeni kullanıcı hesabının adı verilir  
    
Kullanıcı eklemek için farklı komutlar kullanabilirsiniz. aşağıda buna bir örnek verdik.

```.term1
useradd -m -d /var/www/html -k /etc/other.skel -s /bin/zsh -c "AcikKaynakFikirler Web" -u 1999 akf-web
```
  
**parametreler**  
``-m`` home dizini olsun  
``-d`` home dizininin yolu /var/www/html olsun  
``-k`` iskelet dizini tercihi(şablon)  
``-c`` açıklama
``-u`` userid(sistem yerine biz belirtebiliriz, sistem varsayılan olarak 1000 sonrasındaki ilk boş id verir)
``-s`` varsayılan shell /bin/zsh  
  
  

#### Kullanıcı yönetiminde **/etc/passwd** dosyası 
Tüm hesap bilgileri ``/etc/passwd`` dosyası içersinde saklanır. Bu dosya, sistem kullanıcı hesabı başına bir kayıt içerir ve aşağıdaki şekilde bir yapıya sahiptir. Parolaların saklandığı ``/etc/shadow`` isimli başka bir dosya vardır, bu dosyada manuel işlem yapmanızı ve yetkileri ile oynamamanızı öneririm.(600 hakları ve root kullanıcısı)  
(alanlar iki nokta üst üste ile sınırlandırılmıştır)  
  
````
[kullanıcı_adı]:[x]:[UID]:[GID]:[Yorum]:[Ana_dizin]:[Varsayılan_kabuk]
````

**passwd dosyasındaki alanların açıklaması:**      
[Kullanıcı_adı] ve [Yorum] ne için kullanıldıkları anlaşılabilir  
İkinci alandaki **x**, hesabın [kullanıcı_adı] oturum açmak için gerekli olan gölgeli bir parola (``/etc/shadow`` içinde) ile korunduğunu gösterir  
[UID] ve [GID] alanları, sırasıyla Kullanıcı Kimliği tanımlamasını ve [kullanıcı adı] 'nın ait olduğu birincil Grup Kimliği tanımlamasını temsil eden sayılardır  
[Ana_dizin], [kullanıcı_adı] ’nın ana dizininin mutlak yolunu gösterir  
[Varsayılan_kabuk], kullanıcı sistemde oturum açtığında bu kullanıcıya sunulacak olan kabuktur  
  
```.term1
cat /etc/passwd
```
Gördüğünüz gibi yeni eklediğimiz kullanıcı şuanda listenin souna eklenmiş durumda.  
  
#### Gurup Yönetiminde **/etc/group** dosyası
Grup bilgileri ``/etc/group`` dosyasında saklanır. Her kayıt aşağıdaki düzene göre oluşur.  
````
[Grup_adı]:[Grup şifresi]:[GID]:[Grup_üyeleri]
````
  
**group dosyasındaki alanların açıklaması**  
[Grup_adı], grubun adıdır  
[Grup_parolası] içinde x var ise, grup parolalarının kullanılmadığını gösterir  
[GID]: /etc/passwd ile aynıdır  
[Grup_üyeleri]: [Grup_adı] üyesi olan kullanıcıların virgülle ayrılmış listesi  
  
```.term1
cat /etc/group
```
Kullanıcı eklenirken aynı zamanda aynı isimdeki gurup dosyaya eklenmiş  
  
  
#### **usermod** ile kullanıcılarda değişiklik yapmak  
Bir hesap ekledikten sonra, usermod komutunu kullanarak kullanıcı hesabı üzerinde istediğiniz değişiklikleri yapabilirsiniz.  
  
Kullanımı: 

$ usermod [seçenekler] [kullanıcı adı]


Bir hesap için son kullanma tarihini ayarlama  
  
``–-expiredate`` parametresini bir tarih ile YYYY-AA-GG şeklinde verelim  
   
```.term1
usermod --expiredate 2021-1-1 senol
```
  
Kullanıcıyı ek gruplara ekleme
  
Gurup eklemek için  ``-aG`` veya ``–append –groups`` seçeneklerini ve ardından virgülle ayrılmış bir grup listesi kullanmanız gerekir
  
```.term1
usermod --append --groups root,users senol
```
  
Kullanıcının ev dizini değerini değiştirmek
    
``-D`` veya ``–home`` seçeneklerini ve ardından yeni ana dizinin mutlak yolu belirtilir  
Yeni home dizini tanımlamadan önce yetkilerini ayarlamayı unutmayın  
```.term1
mkdir /a
chown senol:senol -R /a
```
şimdi home dizinini kullanıcıya tanımlıyoruz  
```.term1  
usermod --home /a senol
```
  
Kullanıcının varsayılan olarak kullanacağı kabuğu değiştirme  
  
``–-shell`` tanımlamak istediğiniz kabuk yolunu verin.

```.term1
usermod --shell /bin/sh senol
```
  
#### Kullanıcının guruplarını listelemek 

```.term1
groups senol
```

```.term1
id senol
```
  
$ id teknoloji

Yukarıda usermod ile yazdığımız komutları tek satırda yapabiliriz   

```.term1
usermod --expiredate 2021-01-01 --append --groups root,users --home /a --shell /bin/sh senol
```

**usermod** ile **useradd** komutlarının parametresleri 


#### Kullanıcı Kilitleme v Kilit açma
Bir kullanıcı hesabının Linux üzerinde erişimine engel olmak istediğinizde kapatırsınız. Bu işlem için lock/unlock yaparsınız.  
  
Kullanıcının erişimini kilitlemek için. 
```.term1
usermod --lock senol
```
  
Kullanıcının erişimini açmak için. 
```.term1
usermod --unlock senol
```
  
#### Kullanıcı hesaplarını silme
  
Normal userdel işlemi kullanıcı hesabına ait ev dizini ve yaratılmış dosyaları silmeden sadece kullanıcıyı siler.  
  
userdel komutunu ``--remove`` seçeneğiyle kullanarak bir hesabı tamamen silebilirsiniz. Kullanıcıya ait ana dizin ve burada bulunan tüm dosyalar silinir, ayrıca posta (spool) klasörü altındaki dosylarda silinir.  
  
$ userdel --remove [kullanıcı adı]

oluşturduğumuz kullanıcıyı şimdi silelim.  
```.term1
userdel --remove senol
```
  

#### Gurup eklemek/silmek
Yeni gurup eklemek için groupadd komutu kullanılır.  
  
groupadd [gurup_adi]  
  
Aynı şekilde aşağıdaki komutla bir grubu silebilirsiniz.  
  
groupdel [grup_adı]  
  
Group_name'ye ait dosyalar varsa bunlar silinmeyecek, ancak grup sahibi silinen grubun GID'sine ayarlanacaktır.
  
*****
## 2. **vim** Linux Metin Düzenleyicisi, linux komutsatırı için notepad
  
**vim** ile ilgili birşeyler söylemeden önce linux üzerinde çok daha sıklıkla karşılaşabileceğiniz başka bir editörden bahsetmeliyim. **nano**(eski ismi ``pico``), nano oldukça basit, görüntü odaklı bir metin düzenleyicidir. Komutlar ve bunların Kontrol tuşu kısayolları ekranın alt kısmında görüntülenir. Karakterler yazılırken hemen metne eklenirler.  
  
Düzenleme komutları, Kontrol tuşu kısayolları kullanılarak girilir. Belirli kontrol karakterlerini yutan iletişim programları için bir geçici çözüm olarak, iki kez Escape tuşuna ve ardından istenen kontrol karakterine basarak bir kontrol tuşuna atayabilirsiniz. Örneğin, "Esc Esc c" ctrl-c girmekle eşdeğerdir. Düzenleyicinin beş temel özelliği vardır: paragraf yaslama, arama, blok kesme / yapıştırma, yazım denetimi ve dosya tarayıcısı.  
  
```.term1
apt-get update&&apt install nano -y
```
  
```.term1
nano /tmp/ilknanotest.txt
```
ilk dosyanızın içersinde gezinirken, aşağıda sizin için sağlanmış kısayol bilgileri ile kolaylıkla istediğiniz işlemleri yapabilirsiniz. Ben size nano kullanmanızı tavsiye etmem, mutlaka vim kullanmalısınız. Çünkü nano gibi bir editör ile yapabilecekleriniz oldukça sınırlıdır. Gündelik hayatınızda vim kullanımını alışkanlık haline getirirseniz size inanılmaz kolaylıklar sağlayacağını görürsünüz. Ne zaman nano kullanırız?, vim kuramayacağınız ortamlarda veya internet bağlantısı olmayan eski sunucularda dosya edit etmek için nano oldukça işe yere bir araçtır.  
  
Vi, Unix için oluşturulan ilk ekran yönelimli metin düzenleyiciydi, metin işleme için basit ama güçlü olacak şekilde tasarlanmıştır. **Vim** ismi ise VI improved şeklinde iki kelimenin bir araya gelmesi ile oluşmuştur. Vi'nin bir klonudur ve Vi'den daha fazla özellik sunar. Hem komut satırı arayüzünden hem de grafik kullanıcı arayüzünde (GUI) bağımsız bir uygulama olarak kullanılmak üzere tasarlanmıştır, ücretsiz ve açık kaynaklıdır. Ayrıca tüm "Sonu X ile biten işletim sistemleri" vim editörünü barındırır.  
  
Oldukça fazla özelleştirme seçenekleri vardır, sözdizimi vurgulama(syntax highlight), fare desteği, grafik sürümler, görsel mod, birçok yeni düzenleme komutu vardır. Bunun yanında oldukça fazla dosya uzantısını tanır ve çok daha fazla ileri seviye özellikler sunar. Hayatımın bir döneminde Vim ile development yapmış biri olarak söyleyebilirim, alışırsanız, diğer editörlere geçmekte zorlanırsınız. Müthiş ve çok güçlü bir editör.

Linux ekosistemi içinde en bilinen editör olan Vi/Vim'i öğrenmek, Nano veya Emacs öğrenmek kadar kolay değildir. Linux ile iş yapacaksanız mutlaka vim öğrenmeniz gerekir, bunu kolaylaştırmak ve keyifli hale getirmek için aşağıda temel bazı komutlarını gösteriyoruz.  
  
Debian bir sunucu kullanıyorsanız, vim-light gibi bir sürüm kurulu gelecektir. Normal Vim ile güncellemenizi öneririm.  

```.term1
apt update&&apt install -y vim
```

şimdi basit bir dosya açalım ve dosya içersinde birşeyler yazarak dosyayı kaydedelim.  
```.term1
vim /tmp/ilkvimdosyasi.txt
```

veya 
```.term1
vi /tmp/ilkvimdosyasi.txt
```
  
Açılan dosya sürekli view modundadır, yani herhangi bir değişiklik yapmayacağımız, sadece görüntüleme yapacağımız varsayılıyor. Burada boş bir dosya açıldığı için dosya içersine önce birşeyler yazalım. Önce `i` harfine basmalıyız, böylece insert moduna geçebiliriz. i harfine bastığınızda ekranın sol alt köşesinde --INSERT-- yazısı belirir, böylece insert yaptığımızı anlarız.   
  
Şuan istediğiniz birşeyi yazabilir veya kopyaladığınız birşeyi buraya yapıştırabilirsiniz. Yazma işleminiz bittiğinde "ESC" (escape) tuşuna basarak yazmamızı sonlandırlalım. Şimdi dosyamızı kaydedip çıkmamız gerekiyor, bunun için command mode a geçmemiz gerek. **command** (komut) modu için `:` basmamız gerekiyor, bu bizi ekranın sol alt köşesine atar. şimdi istediğimiz komutu yazabiliriz. 

Dosyayı kaydedip çıkmak için ``wq`` yazıp enter yapabiliriz,  
veya  
`w` enter yaparız bu sayede dosyaya veriyi kaydederiz, sonra tekrar komut moduna geçip(yani`:` enter) `q` yapabiliriz.  
  
komut satırına geldiğimizde böyle bir dosya olup olmadığını kontrol edelim,  
```.term1
ls -la /tmp/
```

Genellikle yukarıdaki gördüğünüz dosya açma editleme(değiştirme) ve sonrasında kaydetme işlemi yaparız. `i` insert için kullandığımız bir mode, buna benzer şekilde `a` append ve `R` replace mode'ları çok kullanışlıdır. Ayrıca edit ettiğiniz dosya içersinde arama yapmak için `/` bastığınızda sizi direkt olarak search mode ile arama yaptırır.  
  
  
Sizin için işleri kolaylaştırabilecek iki tane cheatsheet örneği 
<center><img src="{{site.baseurl}}/images/vim-ch-b.jpg" width="80%"></center>  
  
<center><img src="{{site.baseurl}}/images/vim-ch-a.jpg" width="80%"></center> 

Size tavsiyem yukarıdaki resmi yazıcıdan çıktı almanız ve görebileceğiniz biryerde tutmanız. Çıktı aldıktan hemen sonra, bir kere sayfayı baştan sona okuyun, sonrasında ihtiyacınız olduğunda kolaylıkla nereye bakacağınızı bilirsiniz.  

### iki dosya aynı anda açma
komut:  
  
Altlı üstlü  
```.term1
vim -o /tmp/ilkvimdosyasi.txt ikincivimdosyasi.txt
```
  
dosyalar arasında geçiş için kullanacağınız kısayollar:  
````
Ctrl+w k – üst
Ctrl+w j – alt
````    
  
yan yana  
```.term1
vim -O /tmp/ilkvimdosyasi.txt ikincivimdosyasi.txt
```
  
dosyalar arasında geçiş için kullanacağınız kısayollar:  
````
Ctrl+w l – sol
Ctrl+w h – sağ
````
  
yukarıdaki dosyaları kapatmak için iki kere `:q` yapmanız gerekir.  
  
###  kelimeyi bulmak ve değiştirmek

Önce bir dosya oluşturalım ve içine bir yazı yazalım.
```.term1
cat >> /tmp/degistirornek.txt <<EOL
Ay dogmuyorsa yuzune Gunes vurmuyorsa pencerene kabahati ne Guneste ne de Ay da ara! Gozlerindeki perdeyi arala!
kimimben
EOL
```



```.term1
vim /tmp/degistirornek.txt
```
  
Dosyanızın içine biryere `kimimben` yazın, sonrasinda aşağıdaki komut ile onu değiştirin. Yerine `Mevlana` yazın.
Şimdi aşağıdaki şekilde bir arayıp bulma ve değiştirme işlemi yapalım.
```.term1
:%s/kimimben/Mevlana/g
```

Dosyayı şimdi kaydedip kapatabiliriz. `wq!`  
  
Dosya içersinde aradığınız bir satır var ise onu direkt komut satırından dosyayı açarken veya vim içinde komut modunda belirtebilirsiniz. Sizi belirtilen satıra götürecektir.  

```.term1
vim /tmp/degistirornek.txt +2
```


### Vim ayarları
Yapılandırma dosyalarını düzenlemek veya kod yazmak için vim kullanırsanız, programı ilk açtığınızda satır numaralarını görüntüleyebilmeyi ve otomatik girintiyi ayarlamayı isteyeceksiniz, böylece Enter tuşuna bastığınızda imleç otomatik olarak uygun konuma yerleştirilir.  
  
Ek olarak, bir sekmenin kapladığı beyaz alanların sayısını özelleştirmek isteyebilirsiniz. Bunu vim'i her başlattığınızda yapabilseniz de, bu seçenekleri ``~/.vimrc`` içinde ayarlamak daha kolaydır, böylece otomatik olarak uygulanacaklar:  
  
````
set number
set autoindent
set shiftwidth=4
set softtabstop=4
set expandtab
````

Komut modu içindeyken `:` aynı komutları yazabilirsiniz. Özellikle kopyala yapıştır yapamadığınız vim mouse ayarı için. ``:set mouse=""`` yapabilirsiniz.  

### **vimtutor** ile kendi kendinize vim bilginizi geliştirin
  
**vimtutor** programı size interaktif bir şekilde vim anlatan bir eğitimdir, eğitimi baştan sonra bir kere yapmanızı öneririm. Bu sayede vim kullanımı ile ilgili temel konuların neler olduğunu anlarsınız. Sonrasında cheatsheet daha kullanışlı olacaktır.  
  

>
````Vim konusu çok uzun işlenebilecek bir konu fakat biz burada sadece basit şekliyle neleri nasıl yapabileceğinizi anlatmaya çalıştık, bu konuda pratik yapmanız gerektiğini lütfen unutmayın. Başlangıç için vimtutor ve yukarıdaki cheatsheet sizin için oldukça faydalı olacaktır.
````  
  
## 3. Temel ağ yönetimi  
  
TCP/IP bağlantı noktalarında önemli bir ayrım, ayrıcalıklı bağlantı noktaları ile ayrıcalıksız bağlantı noktaları arasındaki farktır. İlki 1024'ten az sayıya sahiptir.  
  
Unix ve Linux sistemleri, ayrıcalıklı bağlantı noktalarına erişimi kök ile sınırlar. Buradaki fikir, bir istemcinin ayrıcalıklı bir bağlantı noktasına bağlanabilmesi ve bu bağlantı noktasında çalışan sunucunun sistem yöneticisi tarafından yapılandırıldığından emin olmasıdır. 
  
ve bu nedenle güvenilir olabilir. Maalesef günümüz İnternet'inde bu güven, yalnızca bağlantı noktası numarasına dayalı olarak gerekçesiz olacaktır, bu nedenle bu ayrım pek kullanışlı değildir. Bağlantı noktası numaraları
Sıradan kullanıcılar 1024'ten daha fazlasına erişebilir.
  
---
### İstemci ve Sunucu ne demektir (İstemci & Sunucu)  
  
İstemciler ve sunucular arasındaki fark önemlidir. İstemci, veri alışverişi yapmak için bir ağ bağlantısı başlatan bir programdır. Bir sunucu bu tür bağlantıları dinler ve bunlara yanıt verir.  
  
Örneğin, Firefox veya Opera gibi bir web tarayıcısı bir istemci programıdırlar. Programı başlatır ve bir web sayfasına yönlendirirsiniz, yani web tarayıcısı web (HTTP) sunucusuna belirtilen adrese bir istek gönderir. Web sunucusu, isteğe yanıt olarak verileri geri gönderir. İstemciler ayrıca, bir web formuna bilgi girdiğinizde ve bir **Gönder** düğmesini tıkladığınızda sunucuya veri gönderebilir.  

İstemci ve sunucu terimleri, çoğunlukla bir veya diğer rolde çalışan tüm bilgisayarlara uygulanabilir. Bu nedenle, web sunucusu gibi bir ifade biraz belirsizdir, web sunucusu üzerinde çalışan servis (program) bir veya birden fazla sunucu tarafından oluşturulabilir.  
  
Linux işletim sistemindeki bağlantı noktalarını yapılandırmak için hiçbir şey yapmanıza gerek yoktur. Olağandışı sunucular çalıştırıyorsanız bu sorunu çözmeniz gerekebilir, çünkü sunucuları doğru bağlantı noktalarına bağlamak için sistemi yapılandırmanız gerekebilir.  
  
Bazen bağlantı noktası numaralarını adlarla eşleyen ``/etc/services`` değiştirmeniz gerekebilir, böyle durumlarda standart dışına çıkacağınızı unutmayın, en son çare değiştirebilirsiniz. Mümkün olduğunca standart portları ve hep belirttiğim gibi single purpose sunucu kurarsanız, port çakışması yaşamazssınız.  
  
Dosya içersinde sunucu üzerindeki protokollerin uzun bir listesi vardır, ilk 1023 tanesi ve birkaç tane çok bilinen port numarası vardır. Port numaralarını zaman içersinde istemeseniz de ezberleyeceksiniz zaten, 22 ssh portudur 80 web portudur ve 443 ssl portudur diye bilmeniz şuan için yeterlidir. Windows dünyasına aşina arkadaşlarımız 3389 portunun RDP portu olduğunu bilirler, 3306(mysql) ve 1521(oracle listener) portları daha çok DBA olan arkadaşlarımızın bildiği portlardır.  
  

**portların uzun bir listesine aşağıdaki komut ile erişebilirsiniz**  

```.term1
less /etc/services
```
işiniz bitince `q` ile komut satırına dönebilirsiniz.  

Linux bilgisayarınızı bir ağa bağlamak oldukça basittir. Linux, birden çok ağ arabirim bağdaştırıcısını kolayca yönetir. Dizüstü bir bilgisayarlar  hem kablolu hem de kablosuz arayüzler içerebilir ve hücresel ağlar için ``WiMax`` arayüzlerini de destekleyebilir. Linux masaüstü bilgisayarları ayrıca birden çok ağ arabirimini destekler ve Linux bilgisayarınızı çok ağlı bir istemci(client) veya dahili ağlar için bir yönlendirici(router) olarak kullanabilirsiniz.  

Aşağıda size Centos/Redhat/Fedora için kullanabileceğiniz ağ yapılandırma dosyalarından bahsedeceğim. Debian tabanlı işletim sistemleri için dosya lokasyonları ve aygıt isimleri farklı olacaktır. Temelde yapılan işlem aynı olsa da, farklı dosyalar içersinde farklı formatlar tercih edilmiştir.  


### DNS Komutları - isim çözümleme komutları
  
DNS (Domain name system) Etki Alanı Adı Sistemi , IP adresleri ve ana bilgisayar adları arasında dönüşüm sağlayan dağıtık bir veritabanıdır. Her etki alanı, etki alanındaki her bilgisayarın adını sağlayabilen veya bir DNS sorgusunu isteği daha iyi işleyebilecek başka bir DNS sunucusuna yeniden yönlendirebilen en az iki DNS sunucusu bulundurmalıdır.  
  
Bu nedenle, bir ana makine adı aramak, ana bilgisayar adından sorumlu sunucu bulunana kadar her bir aramayı yeniden yönlendiren bir dizi DNS sunucusunu sorgulamasını içerir. Uygulamada, bu süreç sizden bağımsız gizli gerçekleşir, çünkü çoğu kuruluş, diğer DNS sunucuları ile iletiğim kuran DNS sunucularına sahiptir.  
  
Yalnızca bilgisayarınızı kuruluşunuzun DNS sunucularına yönlendirmeniz yeterli olacaktır.  
  
Kullanacağımız DNS komutlarını kuralım.  
```.term1
apt update&&apt install -y dnsutils
```
  
Linux üzerinde dns ismi için öncelik sıralaması mevcuttur ve bu bilgi ``/etc/nsswitch.conf`` dosyası içinde tanımlıdır.  
  
```.term1
cat /etc/nsswitch.conf | grep hosts
```
  
çıktı olarak gelen `hosts: files dns` burada files ile söylenmek istenen, önce ``/etc/hosts`` dosyasına bak sonrasında ``/etc/resolv.conf`` dosyasındaki dns sunucularına bak demektedir.  

Yukarıda DNS aramasının /etc/hosts ve /etc/resolv.conf'a başvurduğunu görebilirsiniz. İlk DNS araması, adı yeniden taşımak için / etc / hosts dosyasına bakın ve ardından ana bilgisayar adını çözümlemek için /etc/resolv.conf dosyasına bakacaktır.

**Ömemli!!**  
nslookup ve dig gibi DNS arama araçları /etc/nsswitch.conf dosyasını yok sayacak ve her zaman /etc/resolv.conf kullanarak DNS sunucusuna başvuracaktır.  

#### **/etc/hosts** dosyası  
  
``/etc/hosts`` dosyası Linux işletim sistemindeki en önemli tanım dosyalarından biridir. İsim çözümlemesi için **IP Adresi** -->> **domain-adı** bir metin dosyasıdır.   

```.term1
cat /etc/hosts
```
````
127.0.0.1   localhost localhost.localdomain localhost4 localhost4.localdomain4
::1         localhost localhost.localdomain localhost6 localhost6.localdomain6

192.168.0.2 www.neresiburasi.com neresiburasi neresi nb.com nb
192.168.0.3 web1.localhost web1
````

Her iki alan da boşlukla veya sekmeyle ayrılır, ardından satır başına IP ve Ana bilgisayar adı gelir. sunucu adı yalnızca alfanümerik karakterler, eksi işareti (-) ve nokta (.) İçerir.  

Alan Açıklamaları:  
192.168.0.3: IP adresi  

www.neresiburasi.com: Hostname  

nb.com: IP adresinin takma adı  
neresiburasi: IP adresi takma adı  

Ayrıca /etc/hosts dosyasındaki 127.0.0.1 geri döngü adresleri gibi tanımları görürüz. "localhost" bulunduğunuz sunucunun kendi adı için tanımladığı isimdir varsayılan isimdir.  
  
>
```Kendi sunucularınıza mutlaka bir ip karşılığı isim vermenizi tavsiye ederim(hostname). Bu sayede birden fazla sunucunuz olduğunda, sunucuların isimlerini hatırlamanız çok kolay olacaktır. Sunucu ismi verirken çok farklı kombinasyonlar olabilir, benim tavsiyem genel bir convention belirlemenizdir. DB, WEB, LDB, gibi kısaltmaları olabildiğince kullanın. Ayrıca bölge ve yer bilgilerini kullanmaya çalışın, local, pub, dmz1 ,ndmz1 gibi.
```
  
````  
Sunucu isim örnekleri:  
web1.dmz1.delivery.com  
ldb5.pub3.aws1.delivery.com  
db3.ndmz5.gcp1.delivery.com  

Şunu unutmayın, aynı sunucu için birden fazla dns tanımı yapabilirsiniz, yönetilebilir olması adına olabildiğince amaç/bölge/güvenlikseviyesi bilgilerini içermeye çalışın.  

Güvenlik seviyesi sizin belirlediğiniz birşeydir, buradaki maksat izolasyon seviyesinin belirlenmesidir.
````


#### **/etc/resolv.conf** dosyası  
  
Linux işletim sistemindeki bir diğer önemli dosyadır. Bilgisayarın etki alanı adını IP adresine dönüştürmesine yardımcı olacak DNS sunucularının ismini barındırır. Tüm süreç çözümleme olarak adlandırılır.

```.term1
cat /etc/resolv.conf
```
Örnek bir çıktı aşağıdaki gibi olacaktır:  
```` 
search acikkaynakfikirler.com
nameserver 10.0.20.1
nameserver 8.8.8.8
````

Yukarıda İsim Sunucusunun IP adresini gösteren ``nameserver`` tanımını görebilirsiniz.

Örneğimde 10.0.20.1 bizim birincil yerel DNS Sunucumuz. Sonrasında kullandığımız 8.8.8.8 ise google tarafından kullanılan public DNS adresidir.  

``search`` olarak verilmiş olan acikkaynakfikirler.com sizin komut satırındayken varsayılan domain adınız olarak kullanılır.  
  
Yani komut satırında `ping web2` dediğinizde önce yerel `/etc/hosts` içersinde böyle bir tanım varmı ona bakar, sonrasında ``/etc/resolv.conf` dosyası içindeki tanımlı dns sunucuları üzerinden `search` içersindeki tanıma da bakacak şekilde arama yapar. Yani "web1.acikkaynakfikirler.com" ile arama yapar, böyle bir kayıt yok ise sadece "web1" ile yine dns sorgulaması yapar. Ve sonuç üretir veya üretmez.

#### **nslookup** name server lookup - isim sunucusu sorgulama  
  
Nslookup ayrıca DNS sunucularını hem etkileşimli hem de etkileşimli olmayan bir şekilde sorgulamak için kullanılabilen popüler bir komut satırı programıdır. Farklı işletim sistemlerinde vardır. DNS kaynak kayıtlarını (RR) sorgulamak için kullanılır. Bir alan adının "A" kaydını (IP adresi) gösterildiği gibi farklı parametreler ile değişik kayıt bilgilerini alabilirsiniz.  

**interaktif**  
```.term1
nslookup
www.google.com
```
İnteraktif mode dan çıkmak için exit yazmanız gerekir.  
  
**Direkt sorgulama**  
```.term1
nslookup -query=mx www.yahoo.com
```
  
Ben halen nslookup ile interaktif ekrana girerek dns sunucsu değiştirerek sorgulama yaptırırım. Örn. google için "server 8.8.8.8" dedikten sonra domain araması yaparım.  
  
#### **hostnamectl** hostname control  
  
``hostnamectl`` komutu, Linux sistem adını kontrol etmek ve ilgili ayarlarını değiştirmek için kullanılabilen bir arayüz sağlar. Komut, belirli bir sistemde ``/etc/hostname`` dosyasını değiştirip  düzenlemeden de ana bilgisayar adını değiştirmeye yardımcı olur.

Kullanım şekli:  

hostnamectl [Parametre] komut 
  
Örnek kullanım:  
```.term1
hostnamectl set-hostname web1.acikkaynakfikirler.com
```

#### **dig** Domain Information Groper - Alan adı bilgi toplayıcısı  
  
``dig`` kısaltması (Etki Alanı Bilgileri Groper), Etki Alanı Adı Sistemi (DNS) ad sunucularını sorgulamak için bir ağ yönetimi komut satırı aracıdır. DNS ile ilgili sorun yaşadığınızda ilk başvuracağınız araçlardandır.  
  
Sorgulanan ad sunucusundan döndürülen yanıtları görüntüler. dig, BIND alan adı sunucusu yazılım paketinin bir parçasıdır. ``dig`` komutu, ``nslookup`` ve ana bilgisayar gibi eski araçların yerini alır. kazma aracı büyük Linux dağıtımlarında mevcuttur.  

Kullanım şekli:  
  
dig alan-adi [parametreler]  

örn.
```.term1
dig acikkaynakfikirler.com
```

Yukarıdaki komut, dig'in acikkaynakfikirler.com alan adı için "A" kaydını aramasına neden olur. Dig komutu /etc/resolv.conf dosyasını okur ve burada listelenen DNS sunucularını sorgular. DNS sunucusundan gelen yanıt, dig'in görüntülediği yanıttır.  

#### **host** - istemci  
  
``host`` komutu DNS aramalarını gerçekleştirmek için en basit sorgulamadır. Bilgisayar adlarını IP adreslerine çevirir veya bunun tam tersini yapar.  
  
Örnek:  
```.term1
host acikkaynakfikirler.com
host 127.0.0.1
```

#### **whois** - sahibi kim?  
  
``whois`` Bu komut ile bir alan adının tamamına ilişkin bilgilere bakabilirsiniz. Örneğin, whois acikkaynakfikirler.com yazıldığında, Alan adının kime ait olduğu, sorun çıkması durumunda kiminle iletişime geçileceği vb. bilgileri öğrenebilirsiniz.  
  
```.term1
whois acikkaynakfikirler.com
```

### Centos için ağ yapılandırma dosyaları  
  
Her ağ arayüzünün(interface) ``/etc/sysconfig/network-scripts`` dizininde kendi yapılandırma dosyası vardır. Her arabirim, ifcfg-``arabirim-adı-X`` adlı bir yapılandırma dosyasına sahiptir. Burada ``X``, kullanılan adlandırma kuralına bağlı olarak '0' veya '1' ile başlayan arabirimin numarasıdır;  
  
örnek bir dosya şu şekildedir   
``/etc/sysconfig/network-scripts/ifcfg-eth0``, buradaki `ifcfg-eth0`ilk Ethernet arayüzü içinkullanılan dosyayı içermektedir.  
  
``/etc/sysconfig/network-scripts`` dizinindeki diğer dosyaların çoğu, çeşitli ağ yapılandırma etkinliklerini başlatmak, durdurmak ve gerçekleştirmek için kullanılan scriptler dir.  
  
Her arayüz yapılandırma dosyası, arayüzün MAC adresi ile belirli bir fiziksel ağ arayüzüne bağlıdır.  
  
### Debian/Ubuntu için ağ yapılandırmaso
  


### Ağ arabirimi adlandırma kuralları
  
Ağ arayüzleri için adlandırma kuralları eskiden çok daha basitti. EthX kullanmak bana mantıklı geldi ve yazması kolaydı. Hangi uzun ve belirsiz ismin bir arayüze ait olduğunu anlamak için ekstra adımlar gerektirmiyordu. Ne yazık ki ağ konusunda çıkan yeni donanımlar ve gereksinimler bu konudaki eski standartları oldukça değiştirdi.  

Bazı uzun ve anlaşılmaz ağ arabirim adlarıyla kısa bir süre sonra, artık yalnızca marjinal olarak daha iyi görünen üçüncü bir adlandırma kuralımız var. EthX gibi daha basit isimler kullanmak isterseniz, kernel boot parametreleri içine ``biosdevname=0 net.ifnames=0`` yazmanız yeterli olacaktır. **Ben yine de size eth0,eth1.. isimlendirmesini kullanmanızı tavsiye etmem, (bonding vs için)**.  

Günümüzde, **eno1** ve **enp0s3** gibi adlara sahip en yeni adlandırma kuralları RHEL 7/8, CentOS 7/8 ve Fedora'nın daha yeni sürümleri tarafından kullanılmaktadır.  

### Ağ Yapılandırma dosyası ayrıntıları (Centos/Redhat)

**Sanal sunucu üzerindeki ens18 isimli ağ bağdaştırıcısının ayarları**  
Aşağıda Centos8 bir sunucunun network ayarlarını görebilirsiniz,  

````
nucleuss@ops.nucleuss ~ $ cat /etc/sysconfig/network-scripts/ifcfg-ens18
NAME=ens18
DEVICE=ens18
TYPE=Ethernet
PROXY_METHOD=none
BROWSER_ONLY=no
BOOTPROTO=none
DEFROUTE=yes
IPV4_FAILURE_FATAL=no
IPV6INIT=yes
IPV6_AUTOCONF=yes
IPV6_DEFROUTE=yes
IPV6_FAILURE_FATAL=no
IPV6_ADDR_GEN_MODE=stable-privacy
ONBOOT=yes
IPADDR=10.34.45.65
NETMASK=255.255.255.0
GATEWAY=10.34.45.1
DNS1=10.34.45.254
USERCTL=no
ZONE=public
````
Bu dosya önyükleme sırasında arabirimi başlatır, ona statik bir IP adresi atar, bir etki alanı ve ağ geçidi tanımlar, bir DNS sunucusu belirtir ve root olmayan kullanıcıların arabirimi başlatıp durdurmasına izin vermez.  

**Aşağıdaki abaşka bir örnekte ise ifcfg-eno1, bir DHCP yapılandırması örneğini görüyoruz**  
  
````
TYPE=Ethernet
BOOTPROTO=dhcp
DEFROUTE=yes
IPV4_FAILURE_FATAL=no
IPV6INIT=no
IPV6_AUTOCONF=no
IPV6_DEFROUTE=no
IPV6_FAILURE_FATAL=no
NAME=eno1
UUID=a67804ff-177a-4efb-959d-5feed15cf296
ONBOOT=yes
IPV6_PEERDNS=no
IPV6_PEERROUTES=no
````
  
Bu ikinci yapılandırma dosyası örneğinde, DHCP girişleri, IP adresi, arama etki alanı ve diğer tüm ağ bilgileri, DHCP sunucusu tarafından sağlandıkları için tanımlanmamıştır. DNS sunucuları gibi yapılandırma öğeleri, önceki statik yapılandırma örneğinde olduğu gibi, DNS1 ve DNS2 satırları eklenerek arabirim yapılandırma dosyasında geçersiz kılınabilir.  
  
Bu ikinci örneğin bir UUID satırı içerdiğine dikkat edin. Belirleyebildiğim kadarıyla, bu satırın yapılandırma dosyasının işlevselliği üzerinde bir etkisi yok. Genelde bu satırı bırakırım, ama bazen silmek te iyi olabilir.  
  
Her iki arayüz yapılandırma dosyasında, **HWADDR** satırı bulunmuyor, **HWADDR** fiziksel ağ arayüzünün MAC adresini belirtir. Bu, fiziksel arayüzü arayüz yapılandırma dosyasına bağlar. Arayüzü değiştirirseniz, dosyadaki MAC adresini değiştirmeniz gerekir. Tek arayüzü olan sunucularda ve sanal sunucularda bu satırı kullanmamaya özen gösteriyorum.  
  
Bir NIC'nin MAC adresini bulmanın birkaç yolu vardır. Genelde kurulu tüm NIC'leri, MAC adreslerini ve çeşitli istatistikleri gösteren ifconfig komutu ile bulabilirsiniz. Pek çok yeni NIC’in MAC adresi kutu üzerinde mevcuttur veya NIC’nin üzerinde etiketlenmiştir.  

Çoğu arabirim yapılandırma dosyası kurulum sırasında veya NIC yeni kurulduktan sonra ilk algılandığında otomatik olarak oluşturulur ve MAC adresi yeni arabirim yapılandırma dosyasının bir parçası olarak eklenir. Sanal sunucularda bu satırı kesinlikle silmenizi tavsiye ederim, clone ve backup işleri sırasında sorunlara sebep olacaktır.  
  
**ONBOOT** satırı, arayüzün başlatma sırasında etkinleştirileceğini belirtir. Bu satır 'no' (hayır) olarak değiştirilirse, arabirimin manuel olarak veya bir kullanıcı oturum açtıktan sonra NetworkManager tarafından etkinleştirilmesi gerekecektir.  
  
**USERCTL** satırı, ayrıcalıklı olmayan kullanıcıların arayüzü yönetemeyeceğini belirtir; yani ağ birimini açıp kapatamazlar. Bu parametrenin "evet" olarak ayarlanması, normal kullanıcıların arayüzü etkinleştirmesine ve devre dışı bırakmasına izin verir.  
  
Arayüz konfigürasyon dosyalarındaki satırların sıraya duyarlı olmadığına ve herhangi bir sırada gayet iyi çalıştığına unutmayın lütfen. Geleneksel olarak, seçenek adları büyük harflidir ve değerler küçük harflidir. Seçenek değerleri tırnak içine alınabilir, ancak değer tek bir sözcük veya sayıdan fazla olmadığı sürece bu gerekli değildir.  

### Yapılandırma seçenekleri
Arayüz yapılandırma dosyaları için birçok yapılandırma seçeneği vardır. Bunlar daha yaygın seçeneklerden bazılarıdır:
````
DEVICE: Cihazın eth0 veya enp0s2 gibi mantıksal adı.
HWADDR: 00:22:55:AB:BA:DB gibi dosyaya bağlı ağ bağdaştırıcısının MAC adresi
ONBOOT: Ana bilgisayar önyüklendiğinde bu cihazda ağı başlatın. Seçenekler 'yes' veya 'no' olabilir.
IPADDR: 192.168.0.10 gibi bu NIC'ye atanan IP Adresi
BROADCAST:  192.168.0.255 gibi bu ağ için yayın adresi
NETMASK:    Bu alt ağ için, C sınıfı maske 255.255.255.0 gibi ağ maskesi
NETWORK:    Bu alt ağ için C sınıfı ID 192.168.0.0 gibi ağ kimliği
SEARCH: "example.com" gibi niteliksiz ana bilgisayar adlarında arama yaparken aranacak DNS etki alanı adı
BOOTPROTO:  Bu arayüz için önyükleme protokolü. Seçenekler statik, DHCP, bootp, hiçbiri'dir. "Hiçbiri" seçeneği varsayılan olarak statiktir.
GATEWAY:    Bu alt ağ için ağ yönlendiricisi veya varsayılan ağ geçidi, örneğin 192.168.0.254
ETHTOOL_OPTS:   Bu seçenek, hız, çift yönlü durum ve otomatik anlaşma durumu gibi ağ arayüzü için belirli arayüz yapılandırma öğelerini ayarlamak için kullanılır. Bu seçenek birkaç bağımsız değere sahip olduğu için, değerler tek bir tırnak kümesi içine alınmalıdır, örneğin: "otomatik başlatma hızı 100 çift yönlü tam".
DNS1:   Yerel ağdaki bir sunucu olan 192.168.0.254 gibi birincil DNS sunucusu. Burada belirtilen DNS sunucuları, NetworkManager kullanılırken veya peerdns yönergesi evet olarak ayarlandığında /etc/resolv.conf dosyasına eklenir, aksi takdirde DNS sunucuları /etc/resolv.conf'a manuel olarak eklenmelidir ve burada yok sayılır.
DNS2:   İkincil DNS sunucusu, örneğin ücretsiz Google DNS sunucularından biri olan 8.8.8.8. Arayüz yapılandırma dosyalarında üçüncül bir DNS sunucusunun desteklenmediğini, ancak uçucu olmayan bir resolv.conf dosyasında üçüncüsü yapılandırılabileceğini unutmayın.
TYPE:   Ağ türü, genellikle Ethernet. Burada gördüğüm diğer tek değer Token Ring'di ama bu artık çoğunlukla alakasız.
PEERDNS:    yes seçeneği, /etc/resolv.conf'un bu dosyaya DNS1 ve DNS2 seçenekleriyle belirtilen DNS sunucu girişleri eklenerek değiştirileceğini belirtir. "Hayır", resolv.conf dosyasını değiştirmeyin anlamına gelir. BOOTPROTO satırında DHCP belirtildiğinde "Evet" varsayılandır.
USERCTL:    Ayrıcalıklı olmayan kullanıcıların bu arayüzü başlatıp durdurmayacağını belirtir. Seçenekler 'yes' veya 'no' dur.
IPV6INIT:   Bu arayüze IPV6 protokollerinin uygulanıp uygulanmayacağını belirtir. Seçenekler evet / hayır'dır.  

DHCP seçeneği belirtilirse, diğer seçeneklerin çoğu yok sayılır. Gereken tek seçenekler BOOTPROTO, ONBOOT ve HWADDR'dir. DHCP sunucusu tarafından sağlanan DNS girişlerini geçersiz kılmak istiyorsanız, faydalı bulabileceğiniz, göz ardı edilmeyen diğer seçenekler, DNS ve PEERDNS seçenekleridir.
````


Udev arka plan programı, ağ aygıtları ve çıkarılabilir yığın depolama aygıtları dahil tüm aygıtlar için tutarlı ve kalıcı aygıt adlandırması sağlaması beklenen bir çekirdek aygıt yöneticisidir. Ayrıca m için kullanılır

Dosyalar üzerinde değişiklik yaptıktan sonra network ``systemctl restart networking`` yaparak network servislerini restart edebilirsiniz. Böylece yeni vermiş olduğunuz ayarlar geçerli olacaktır.

>
````
Eğitimimiz içeriğinde network ile ilgili bilgilendirme yapmıyoruz, TCP/IP bilginizin olduğunu ve Ağ için verdiğimiz değerlerin ne anlama geldiğini anladığınızı varsayıyoruz.
````

## 4. Ağ Komutları
  
---
### **ping** ip ile icmp protokolü paketleri gönderir

kullanım şekli:  
ping [ip/dns name]

örnek kullanımlar:
`ip adresi veya dns üzerinden ping`  
  
ping kullanabilmek için paketini kuralım  
```.term1 
apt-get update&&apt-get install iputils-ping -y
```

Şimdi bir ip veya domain ismine ping atalım.  

```.term1
ping www.google.com
```
 veya  

```.term1
ping 172.217.19.68
```
Durdurmak için ctrl+c yapmanız gerekir.    
  

---
### **ifconfig**
ifconfig, ağ arabirimi yapılandırması için bir komut satırı arabirim aracıdır ve ayrıca sistem önyüklemesi sırasında arabirimleri başlatmak için kullanılır. Bir sunucu kurulup çalışmaya başladığında, bir arayüze bir/veya birdençok) IP Adresi atamak ve isteğe bağlı olarak arayüzü etkinleştirmek veya devre dışı bırakmak için kullanılabilir.  
  
Ayrıca, halihazırda aktif olan arayüzlerin durum IP Adresini, Donanım(MAC) adresini ve MTU (Maksimum Transfer Birimi) boyutunu görüntülemek için de kullanılır. ifconfig bu ayrıca hata ayıklama veya sistem ayarlaması yapmak için kullanışlıdır.  
    
Öncelikle ifconfig kurulumunu yapalım:  
```.term1
apt-get update&&apt-get install net-tools -y
```
Şu anda mevcut olan tüm arabirimleri, yukarı veya aşağı, listelemek için -a bayrağını kullanın.

$ ifconfig -a
Bir arayüze bir IP adresi atamak için aşağıdaki komutu kullanın.

$ sudo ifconfig eth0 192.168.56.5 netmask 255.255.255.0
Bir ağ arayüzünü etkinleştirmek için yazın.

$ sudo ifconfig up eth0
Bir ağ arayüzünü devre dışı bırakmak veya kapatmak için yazın.

$ sudo ifconfig aşağı eth0  
Not: ifconfig harika bir araç olmasına rağmen artık kullanılmamaktadır (kullanımdan kaldırılmıştır), onun yerini aşağıda açıklanan ip komutudur.  
  

---
### **ip**
**ip** komutu yönlendirme yapmanıza, ağ aygıtlarını ayarlamanıza, ağ arabirimlerini görüntülemenize yarayan çok kullanışlı bir programdır.**ifconfig** ve diğer birçok ağ komutunun yerine kullanabilirsiniz. Yani tek bir komut ile tüm network işlerinizi rahatlıkla yapabilirsiniz.  
  
Aşağıdaki komut IP adresini ve bir ağ arayüzü hakkındaki diğer bilgileri gösterecektir.  
```.term1
ip addr show
```
  
Burada gelen bir ağ arayüzüne yeni bir ip verelim,  
IP Adresini geçici olarak belirli bir ağ arayüzüne (eth0@if1907) atamak için yazın.  
```.term1
sudo ip addr add 192.168.0.101 dev eth0@if1907
````
  
Atanmış bir IP adresini bir ağ arayüzünden (eth0@if1907) kaldırmak için yazın.  
```.term1
sudo ip addr del 192.168.0.101/24 dev eth0@if1907
```
  
Çekirdekte mevcut komşu tabloyu göstermek için yazın.  
  
$ ip neigh  
  
route tablosunu görmek için  
  
$ ip r  
    
varsayılan ağ geçidini tanımlama  

$ ip route add default via 10.0.0.1
  
network için route tanımlama  
  
$ ip route add 192.168.0.0/24 via 10.0.0.1 dev eth0
  

>
```ip komutunu öğrenmenizi özellikle tavsiye ederim, çok kullanışlı bir komuttur, geçici olarak ip tanımlaması yapmanızı ve ağ bağdaştırıcınız ile farklı çözümler üretmenizi sağlar. Script içinde kullanımı en kolay ve fonskiyonel network komutudur.
```
  
  
---
### **arp**
**arp** komutu, Sistemin ARP önbelleğini yönetir. ARP (address resolution protocol) yani Network kartlarının MAC (donanım) adresleri için çözümleme protokolütür. arp komutu ARP önbelleğinin tam bir dökümünü verir. Bu protokolün birincil işlevi, bir sistemin IP adresini mac adresine çözümlemektir ve bu nedenle OSI seviye 2 (Veri bağlantı katmanı) ve seviye 3 (Ağ katmanı) arasında çalışır.  
  
$ arp -a  
  
size ağ üzerindeki bulunduğunuz sunucu tarafından tutulan MAC tablosunu ve ip adreslerini verir.  
  
$ arp -v  
  
Detaylı bir şekilde DNS adres karşılıkları ile MAC adresleri bilgisini verir.  

  
---
### **traceroute**
Traceroute, yerel sisteminizden başka bir ağ sistemine tam yolu izlemek için bir komut satırı yardımcı programıdır. Son sunucuya ulaşmak için seyahat ettiğiniz yolda atlamaların sayısını (yönlendirici IP'leri) yazdırır. Ping komutundan sonra kullanımı kolay bir ağ sorun giderme aracıdır.

$ traceroute www.google.com

  
---
### **mtr**
MTR, ping ve traceroute işlevlerini tek bir program üzerinde birleştiren analiz programıdır. Çıktısı, siz q tuşuna basarak programdan çıkana kadar varsayılan olarak gerçek zamanlı olarak güncellenir.  
  
$ mtr google.com  

Çok kullanışlı bir komuttur, traceroute yerine kullanabiliyorsanız bu programı kullanmanızı tavsiye ederim.  
  
  
---
### **route** yönlendir
**route**, bir Linux sisteminin IP yönlendirme tablosunu görüntülemek veya değiştirmek için kullanabileceğiniz bir programıdır. Esas olarak, bir arayüz aracılığıyla belirli bilgisayarlara veya ağlara statik yollar yapılandırmak için kullanılır. Yani A B C 3 tane bilgisayarını olsun, B bilgisayarı A ile C arasında olsun, A bilgisayarının C ye gidebilmesi için onun ağ bilgisinin B bilgisayarında olması gerekir.  
  


IP yönlendirme tablosunu aşağıdaki şekilde görüntüleyebilirsiniz  
$ route  
  
Varsayılan ağ geçidi tanımlama  
$ route add default gw 10.40.23.1  
  

**A** 10.0.0.0/24--- **B** 10.0.0.1/24 ve 192.168.0.1/24 --- **C** 192.168.0.0/24  
buradaki A networkünü C networküne eriştirmek için aşağıdaki işlem yapılır(B bilgisayarında 2 network kartı olduğunu düşünüyoruz)  
  
A bilgisayarı'na C ye gidebilmesi için B bilgisayarına yönlenmesi gerektiği bilgisi verilir.
  
$ route add -net 192.168.0.0/24 gw 10.0.0.1 eth0


  
---
### **netstat**
**netstat**, Linux ağ alt sistemi ile ilgili hemen hemen her türlü bilgiyi alabilirsiniz. Ağ bağlantıları, yönlendirme tabloları, arayüz istatistikleri gibi bilgileri sağlayan bir komut satırı aracıdır. Ağ sorun giderme ve performans analizi için çok kullanışlıdır.  
  
Ben çoğunlukla, hangi program hangi servisi çalıştırıyor onu bulmak için kullanırım.  
  
Aşağıdaki komut dinleme modunda tüm TCP bağlantı noktalarını ve hangi programların onları dinlediğini göstermektedir  
  
$ netstat -tulpen  
  
Route tablosu bilgisi için  
$ netstat -r  


---
### **nmap**
Network ve güvenlik konuları ile ilgilenenlerin en sıklıkla kullandığı programdır. Çok kullanışlı ve güçlü bir araçtır. Ağ üzerindeki bir bilgisayar hakkında bilgi toplamak veya tüm bir ağdaki bilgisayarları keşfetmek için kullanılır. Nmap ayrıca güvenlik taramaları, ağ denetimi ve uzak ana bilgisayarlarda açık bağlantı noktaları bulma ve çok daha fazlasını gerçekleştirmek için kullanılır.  
  
Özellikle scriptler içersinde farklı yazılımlarla kombine edilip kullanımı çok yaygındır,  
  
**Genel bir tarama**  
$ nmap -A www.google.com  
  
**Ağ üzerindeki sunucuları bulma**  
$ nmap -sP 10.40.24.0/24  
  
**icmp paketlerini bloklayan(ping kapalı) sunucuları diğer portlar ile varlığını bulma**  
$ nmap -sP www.google.com  
  
**Varolan tüm portları tarama**  
$ nmap -sV www.google.com -p 1-1023  
  
**İşletim sistemini anlama**  
$ nmap -O www.google.com  
  
---
### **nc** Netcat
'NetCat' veya "Network için isviçre çakısı" isimleriyle anılır, çok kullanışlı, güçlü bir araçtır. TCP, UDP veya UNIX alan soketleri bağlantıları için kullanılır, rastgele TCP ve UDP bağlantı noktalarında dinleme, bağlantı noktası taraması ve yönlendirmesi yapabilir.  
  
Uzak bağlantı noktalarının erişilebilir olup olmadığını kontrol etmek ve çok daha fazlasını yapmak için ağ arka plan programı testi için basit bir TCP proxy'si olarak da kullanabilirsiniz. Ayrıca, dosyaları iki bilgisayar arasında aktarmak için pv komutuyla birlikte kullanabilirsiniz. (pv progress bar içindir.)  

Port taraması  
$ nc -zv www.google.com 22 80 443 8080 8443  
  
Port aralığı taramak
$ nc -zv www.google.com 100-500  
  
www.google.com sunucusu 2000 portu'na 5000 portu üzerinden bağlantı yaratır ve 20 saniyelik bekleme süresi vardır  
$ nc -p 5000 -w 20 www.google.com 2000  
  
>  
```Güvenliğiniz için sunucularınızda bu paketin kullanımını sınırlandırmalısınız, Özellikle mikroservislerin popüler olmasından sonra, bu paket daha da tehlikeli hale gelmiştir. Çok kullanışlıdır, fakat sunucularınıza kurulmasına izin vermeyin(mecbur değilseniz).
```
    
  
---
### **tcpdump**
**tcpdump** çok güçlü ve yaygın olarak kullanılan bir komut satırı ağ dinleme aracıdır. Belirli bir ağ arabirimi (eth0, enp4s0..)üzerinden iletilen veya alınan TCP/IP paketlerini yakalamak ve analiz etmek için kullanılır.  
  
kullanımı  
tcpdump -i eth0
  
---
### wireshark
**wireshark**, network konusu ile derinlemesine ilgilenmek isterseniz mutlaka bu yazılımı öğrenmeniz gerekir. Paket anahtarlamalı bir ağdaki paketleri gerçek zamanlı olarak yakalamak ve analiz etmek için kullanılabilecek güçlü, çok yönlü ve kullanımı kolay bir araçtır.  
  
Ayrıca yakaladığı verileri daha sonra incelenmek üzere bir dosyaya da kaydedebilirsiniz. Sistem yöneticileri ve ağ mühendisleri tarafından paketleri güvenlik ve sorun giderme amacıyla izlemek ve incelemek için kullanılır.  
  
---  
### **bmon**
**bmon**, Linux ve Unix sistemler için komut satırı tabanlı bir ağ izleme ve hata ayıklama aracıdır, ağ ile ilgili istatistikleri yakalar ve bunları görsel olarak insanların anlayabileceği bir foramata çevirir.
  
---
### **iftop**
**iftp**, sunucu üzerindeki ağ arabirimlerindeki trafik miktarını görüntüler. Her bir soket bağlantısının bağlantı hızını gösterir.  

kullanımı  
iftop -i eth0


---
### **iptables**
Linux İşletim sisteminde güvenlik duvarı dediğimizde aklımıza hemen iptables gelir. Güvenlik Duvarı(Firewall), sisteme gelen ve giden paketlere ne yapılacağını belirler. IPTables kural tabanlı bir güvenlik duvarıdır ve çoğunlukla Linux işletim sisteminde önceden yüklenmiştir. Varsayılan olarak herhangi bir kural olmadan çalışır. IPTables Linux kernel içersinde 2.4 sürümünden beri vardır. IPTables, çekirdekle konuşmak için bir arayüz sağlar ve filtrelenecek paketlere karar verir.  
  
Farklı protokoller için farklı hizmetler kullanılır:  
  
iptables ``IPv4`` için geçerlidir  
ip6tables ``IPv6`` için geçerlidir  
arptables ``ARP`` için geçerlidir  
    
IPTables ana dosyaları şunlardır:  
/etc/init.d/iptables - (eski) başlama/durdurma/yeniden başlama dosyası  
/etc/sysconfig/iptables kuralların olduğu yer  
/sbin/iptables uygulama dosyası  
  
  
#### **Tablolar**  
  
**FILTER** – Varsayılan tablodur, 3 tane zinciri vardır
INPUT  – yerel soketlere yönelik paketler  
FORWARD – sistem üzerinden yönlendirilen paketler  
OUTPUT – yerel olarak oluşturulan paketler  
  
**NAT** – Paket yeni bir bağlantı oluşturmak istediğinde gerçekleşir. (Network Address Translation)  
PREROUTING – bir paketi alır almaz değiştirmek için kullanılır  
OUTPUT – yerel olarak oluşturulan paketleri değiştirmek için kullanılır  
POSTROUTING – dışarı çıkmak üzereyken paketleri değiştirmek için kullanılır  
  
**MANGLE** – bu tablo, paket değiştirme için kullanılır.  
PREROUTING – gelen bağlantıları değiştirmek için  
OUTPUT – yerel olarak oluşturulan paketleri değiştirmek için  
INPUT – gelen paketler için  
POSTROUTING – paketleri dışarı çıkmak üzereyken değiştirmek için  
FORWARD – dışarı yönlendirilen paketler için  
  
**Zincirler**  
INPUT: Sistemden kaynaklanan varsayılan zincir.  
OUTPUT: Sistemden üretilen varsayılan zincir.  
FORWARD: Varsayılan zincir paketleri başka bir arabirim aracılığıyla gönderilir.  
RH-Firewall-1-INPUT: Kullanıcı tanımlı özel zincir.  


Iptables servislerini çalıştırmak/durdurmak/yeniden başlatmak için  
$ systemctl start iptables  
$ systemctl stop iptables  
$ systemctl restart iptables  
  
#### Komutlar  
  
$ iptables -L -n -v  
  
şuanki aktif iptables listesinin gösterimi. (-L liste, -v ayrıntılı, -n port numarası bildirimi)  
  
sadece bir tablonun çıktısı için(örn. filter)  
  
$ iptables -t filter -L -v -n  
  
veya nat tablosu için  
  
$ iptables -t nat -L -v -n  
  
**Bloklama ekle/kaldır**  
$ iptables -A INPUT -p tcp -s xxx.xxx.xxx.xxx -j DROP  
  
yukarıdaki şekilde belirtilen `-A` (add) ekleme demektir, `-s` kaynak ip adresini, `-p` protokol bilgisini,  `-j` ise alınacak aksiyonu belirler.  
  
$ iptables -D INPUT -p tcp -s xxx.xxx.xxx.xxx -j DROP  
  
aynı komutu ``-D`` (delete) şeklinde yazdığınızda silmek için kullanılır.  
  
**Port kapatmak/Açmak Gelen/Giden paketler için**   
  
Giden paketler için port bloklama  
$ iptables -A OUTPUT -p tcp --dport xxx -j DROP  
  
Gelen Paketler için port bloklama  
$ iptables -A INPUT -p tcp --dport xxx -j ACCEPT  
  
  
**Port yönlendirme(NAT)**  
  
Bilgisayarınızı internete çıkarmak veya dışarıdan gelen bir port istediğini kendi sunucunuzda veya başka bir sunucudaki başka bir port'a yönlendirmek isterseniz Iptables üzerinden NAT tanımlamanız gerekir, burada firewall olarak kullanılan bir linux sunucunun 3389 (RDP) protokolünü internete nasıl açtığını görebilirsiniz.  
  
Bu sunucu üzerinde 33389 portuna erişmeye çalışan bir bilgisayar 10.40.20.144 ip'sinde başka bir bilgisayara yönlenir.  
$ iptables -t nat -A PREROUTING -p tcp --dport 33389 -j DNAT --to-destination 10.40.20.144:3389  
$ iptables -A FORWARD -p tcp -d 10.40.20.144 --dport 3389 -j ACCEPT  
  
**Ping isteklerini kapatmak**
  
Sunucularınızı ping isteklerine kapatmak.
$ iptables -A INPUT -p icmp -i eth0 -j DROP  
  
**iptables-save ile değişiklikleri kalıcı yapmak**  
Debian/Ubuntu için  
  
$ sudo /sbin/iptables-save > /etc/iptables/rules.v4  
  
``IPv6``  
  
$ sudo /sbin/ip6tables-save > /etc/iptables/rules.v6  
  
CentOS/RHEL için  
  
$ sudo /sbin/iptables-save > /etc/sysconfig/iptables  
  
``IPv6``  
$ sudo /sbin/ip6tables-save > /etc/sysconfig/ip6tables  
  
**Tüm komutları silmek/sayaçları sıfırlamak**  
  
$ iptables -L -n -v (çıktısının boş Chain'ler getirmeli)

Öncelikle erişiminizi kaybetmemeniz için tüm erişimleri açın  
  
$ iptables -P INPUT ACCEPT  
$ iptables -P FORWARD ACCEPT  
$ iptables -P OUTPUT ACCEPT  
  
Flush All Iptables Chains/Firewall rules  
  
$ iptables -F  
  
Delete all Iptables Chains  
$ iptables -X  
  
Tüm sayaçları sıfırlamak  
$ iptables -Z  
  
Tüm mangle ve Nat kurallarının sıfırlanması  
  
$ iptables -t nat -F  
$ iptables -t nat -X  
$ iptables -t mangle -F  
$ iptables -t mangle -X  
$ iptables iptables -t raw -F  
$ iptables -t raw -X  


#### firewalld
  
RHEL/CentOS 7 ve CentOS 8 bu güvenlik duvarını kullanıyor. Yeni güvenlik duvarı sistemi yapılmasının en büyük nedenlerinden biri, eski güvenlik duvarının her değişikliği yaptıktan sonra yeniden başlatmaya ihtiyaç duyması ve böylece tüm aktif bağlantıları kesmesiydi. firewalld oldukça kullanışlı ve kullanımı kolay bir güvenlik duvarı arabirimidir.  
  
firewalld mutlaka pratik yaparak öğrenebileceğiniz bir güvenlik duvarıdır. Kullanım öncesi buradaki komutlar ve internette arama yapmanızı tavsiye ederim.  
  
çalışan servisin durumunu öğrenmek için  
$ systemctl status firewalld  
veya  
$ firewall-cmd --state  
  
Aktif zonelar üzerindeki çalışan servisleri listeler  
$ firewall-cmd --get-active-zones  
$ firewall-cmd --get-services  
  
yeni bir port eklemek için  
$ firewall-cmd --permanent --zone=public --add-port=8080/tcp  
  
yazdıklarınızı aktive etmek için  
$ firewall-cmd --reload  

#### ufw
**ufw**, Debian ve Ubuntu Linux dağıtımları için en bilinen ve varsayılan güvenlik duvarı yapılandırma aracıdır. Sistem güvenlik duvarını etkinleştirme/devre dışı bırakma, paket filtreleme kurallarını ekleme/silme/değiştirme/sıfırlama ve bunun gibi birçok işlem için kullanılır.  
  
UFW güvenlik duvarı durumunu kontrol etmek için yazın.  

```.term1
ufw status
```
  
UFW güvenlik duvarı etkin değilse, aşağıdaki komutu kullanarak etkinleştirebilir(enable) veya devre dışı bırakabilirsiniz(disable).
```.term1
ufw enable
```

port ekleme/kaldırma oldukça basittir  
```.term1
ufw allow ssh
```

Herşeyi resetlemek(sıfırlamak)  
```.term1
ufw reset
```


## 5. telnet, ssh, whoami, w, uname
  

---
### **telnet**
Telnet, bir TCP/IP ağı üzerinden uzak sistemlere bağlanmak için kullanılan eski bir ağ protokolüdür. 23 port numarasını kullanır, bu bağlantı noktası üzerinden sunuculara ve ağ ekipmanına bağlanır. Telnet komut kullanımı bazen çok işinize yarayabilir, sistemlere bağlanmak ve operasyon yapmak için kesinlikle kullanılmamalıdır. Güvenli olmadığı için gelen/giden paketler tamamen görüntülenebilir.  

Telnet komutu bir sistemin açık portunu anlamak veya acil olarak bir ağ ekipmanının erişimini test etmek için kullanılabilir.

Kullanımı:

$ telnet sunucu_ismi/ip_si  
  
veya 23 dışında farklı bir port denemek için

$ telnet sunucu_ismi/ip_si port_numarası  
  
    
---
### **ssh**  
SSH (SSH istemcisi), bir makineye uzaktan erişim için bir programdır, kullanıcının uzaktaki bir ana bilgisayarda komutları çalıştırmasını sağlar. Güvenli olmayan bir ağ üzerinden iki güvenilmeyen bilgisayar arasında güvenli ve şifreli iletişim sağlamak üzere tasarlanmıştır. Uzaktaki bir bilgisayarda oturum açmak için en çok önerilen yöntemlerden biridir. Linux üzerinde sunuculara bağlanmak için en etkin yöntemdir.  
  
SSH için bir Sunucu, birde istemciye ihtiyaç vardır. Sunucu **OpenSSH server**, istemci ise **ssh client** 'tır.  
  
Bir windows bilgisayarınız var ise [putty](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html) kullanarak başka bilgisayarlara bağlanabilirsiniz. Mac bilgisayarlar için [iterm2](https://iterm2.com/) yazılımı oldukça kullanışlıdır.  Linux bir bilgisayardan bağlanıyorsanız ``openssh-client`` paketini kurmanız yeterlidir. komut satırından `ssh` yazarak programa ulaşabilirsiniz.  
  
SSH, hem sistem genelinde hem de kullanıcıya özgü (özel) bir yapılandırma dosyası kullanır.  
  
Kullanım şekli:  
$ ssh kullanıcı_adı@sunucu_dns_veya_ip  
  
Sunucunuz üzerine OpenSSH kurulumu oldukça basit bir işlemdir.  
```.term1
apt-get update&&apt-get install openssh-server -y
```
  
  
#### SSH anahtarları ile sunuculara bağlanmak
  
Anahtar ile işlem yapmak için önce bir anahtar oluşturmalısınız, bu işlem için değişik platformlarda farklı araçlar vardır. Linux veya Mac bir istemci bilgisayarınız var ise `ssh-keygen`, windows bir bilgisayar ve putty kullanacaksanız puttygen.exe programını kullanmanız gerekir. Anahtar kullanımın sayısız faydası vardır, güvenlik ve kullanım kolaylığı ilk akla gelenlerdir. Bunların yanı sıra, günümüzde sistem yöneten ve SRE/DevOps prensipleri uyguluyorsanız, binlerce bilgisayara erişmeniz gerekecektir, parola yönetimi bu anlamda imkansız olacaktır.  

Linux ve Mac için, komut satırından aşağıdaki programı çalıştırın.    
```.term1
ssh-keygen
```

home dizininiz altında ``/home/senol/.ssh/`` ".ssh" dizini içersinde 2 tane anahtar dosyası oluşur, biri (private) **size özel anahtar dosyası** diğeri ise (public) **herkese açık anahtar dosyası** dır.  
  
````
/home/senol.ssh/.id_rsa       <-- Private key  
/home/senol.ssh/.id_rsa.pub   <-- Public key  
````
  
buradaki public key dosyasını erişmek istediğiniz bilgisayardaki authorized_keys dosyasına elle ekleyebilirsiniz. Veya ``ssh-copy-id`` isimli program ile karşı bilgisayara yüklersiniz.  
  
bu işlem aşağıdaki şeklide yapılır.  

$ cat ~/.ssh/id_rsa.pub  
```
ekrana çıkan çıktıyı kopyalayıp karşı bilgisayarda yine aynı .ssh dizini içersindeki authorized_keys dosyasına yazmanız gerekir.  
  
```
$ echo "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC2WMDCcUWFtpsdT.... senol@windows-home" >> ~/.ssh/authorized_keys  
  
veya  
  
$ ssh-copy-id kullanıcı@karşı_bilgisayar  
  
Şifre ile bağlandıktan sonra sunucuya anahtarınızı kopyalayabilirsiniz.  
  
>
``` ÇOK ÖNEMLİ! Private Key hiç kimseyle paylaşmamalısınız, fakat public key herhangi biryerde paylaşmanızda bir zarar yoktur.  
```
  
  
#### Tünel Kurmak ve mysql localhost bağlanmak
  
SSH üzerinden karşıda bağlandığınız sunucuya direkt erişim için bir tünel ile yerel bağlantınız üzerine karşıdaki bir portu getirebilirsiniz.  Örnek bir senaryo ile anlatalım, mysql-server çalışan bir sunucunuz olsun ve erişim ayarlarında sadece ``localhost`` için erişim vermiş olsun.  
  
Bu sunucuya uzak bir bilgisayardan bağlandığınızda 3306 portuna erişmeniz hiç kolay olmaz. Karşıdaki bilgisayara bir tünel yaratıp, karşı bilgisayardaki ``localhost:3306`` portunu kendi bağlandığınız bilgisayardaki başka bir porta yönlendirebilirsiniz.

```.term1
ssh -L 13306:localhost:3306 user1@abc.home.server
```

Benzer şekilde karşı network içersindeki sadece bir bilgisayara erişiminiz var, siz ise karşı network içindeki bir bilgisayara RDP(3389) ile bağlanmak istiyorsunuz.  
```.term1
ssh -L 23389:10.44.212.16:3389 user1@abc.home.server
```
  
Karşı network içersindeki abc.home.server bilgisayarı üzerinden kendi local 23389 portunuzu, karşı network üzerindeki 10.44.231.16 ip'li 3389 portuna bağlıyorsunuz.  
  
Kendi bilgisayarınızdan (windows kullanıyorsanız) komut satırınızdan "mstsc /v:localhost:23389" yazıp enter'a bastığınızda RDP protokolü üzerinden diğer ağ üzerindeki bilgisayara bağlanırsınız.  
  
  
  
putty kullanımı ile ilgili çok güzel bir sayfa var, [buradan](https://www.tecmint.com/putty-configuration-tips-and-tricks/) erişebilirsiniz.
  

---
### **whoami** who am i - ben kim olarak sisteme bağlıyım

userid bilgisini ekrana çıktı olarak getirir.  

```.term1
whoami
```
  
  



### **w** who is logged on - bağlı olanları ve ne yaptıklarını göster

sistemde şuanki bağlı kullanıcıları ve ne çalıştırdıklarını listeler.

```.term1
w
```

### **uname** -işletim sistemi bilgisini gösterir.
  
Uname komutu ile üzerinde çalıştığınız Linux bilgisayar ile ilgili bazı sistem bilgilerini edinebilirsiniz.

Her şeyi görmek için -a (tümü) seçeneğini kullanın.  

```.term1
uname -a
```  
Çekirdeğin türünü görmek için -s (çekirdek adı) seçeneğini kullanın.  

```.term1
uname -s
```

Çekirdek yayınını görmek için -r (kernel release) seçeneğini kullanın.
```.term1
uname -r
```

Çekirdek sürümünü görmek için -v (çekirdek sürümü) seçeneğini kullanın.  
```.term1
uname -v
```
  
   
------
<!-- Quiz bölümünü diğer quizlerde aynen kopyalayıp değiştirmemiz gerek.-->

**[Linux101-Ana Sayfa](/linux101-landing)**

-----
## Konu tekrarı, kısa sınav
>seçeneklerden doğru olanları seçtikten sonra **Gönder** butonuna basınız. Sonuçları <span style="color:green">**doğru**</span> ve <span style="color:red">**yanlış**</span> görebilirsiniz.




{:.quiz}
Linux sisteminizi yeni kurdunuz ve kullanıcılar yaratmak istiyorsunuz?
kendi adınıza bir kullancı yaratın home dizini olarak /src/data01 verin uid olarak 1200 verin

- ( ) useradd --home /srv/data01 -uid 1200 ISMIM
- (x) useradd -m -d /srv/data01 -u 1200 ISMIM
- ( ) useradd -d /srv/data01 -u 1200 ISMIM
- ( ) useradd -h /srv/data01 -uid 1200 ISMIM

{:.quiz}
senol isimli kullanıcının sisteme erişimini kısıtlayın

- ( ) usermod --disable senol
- ( ) userdel senol
- ( ) userdel --remove senol
- (x) usermod --lock senol

{:.quiz}
/tmp/deneme1.txt dosyasını açın ve içideki tüm 'benisil' yazılı yerleri 'beniekle' ile değiştirin

- (x) vim /tmp/deneme1.txt -c %s/benisil/beniekle/g -c wq
- ( ) vim /tmp/deneme1.txt sonra komut modunda :/benisil/beniekle/g
- ( ) vim /tmp/deneme1.txt |grep benisil|paste beniekle
- ( ) cat /tmp/deneme1.txt|grep benisil|cat beniekle

{:.quiz}
/etc/nsswitch dosyası içinde "hosts: files dns" sıralamasını "hosts: dns files" yaparsak ne olur?

- ( ) Resolv.conf dosyası içindeki bilgilerin sıralaması değişir
- ( ) Dosyalarda kaydedilmiş DNS kayıtları silinir
- (x) DNS sorgulamaları önce resolv.conf içindeki DNS sunucularına, sonra /etc/hosts yapılır
- ( ) "ip --> domain" isimlendirmesi "domain --> ip" şeklinde değişir
