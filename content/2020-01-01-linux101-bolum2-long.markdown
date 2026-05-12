---
layout: post
title:  "2. Linux kabuk erişimi dizin yapısı ve dosya yapıları"
date:   2020-01-01
author: "@senolcolak"
tags: [linux101,turkce,operations]
categories: [linux101,beginner]
terms: 1
---

Labaratuar içersinde kabuk üzerinden erişim, dosya yapıları, dizinlere erişim, Temel komutlara giriş ve filtreleme komutlarından bahsedeceğiz. Ayrıca küçük bir test ile konular ile ilgili bilginizi sınayabileceksiniz.

### [Linux101 - Ana Sayfa](/linux101-landing)

---


> **Bölüm içersinde aşağıdaki konular işlenecektir:**
> * Table of contents
> {:toc}
  

-----
## Labaratuar Kullanım İpuçları

Eğitim içersinde, komut satırı bilgileri aşağıdaki üç farklı şekilde belirtilmiştir.

1. `buradaki` gibi görünen komut betimleri şeklinde gösterilmler daha çok örnekler ve yazılması gereken komutları tanımlamak için kullanılır.

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
  
-----

## 1. Shell arayüzüne bağlanma ve Linux dizin yapısı

Linux'ta ve tüm UNIX benzeri işletim sistemlerinde, genellikle **_"Her şey bir dosyadır"_** denir veya en azından bu şekilde değerlendirilir. Bu, ister normal veri dosyaları ve belgelerle, ister ses kartları ve yazıcılar gibi aygıtlarla uğraşıyor olun, onlarla aynı tür Giriş / Çıkış (Input/Output) işlemleriyle etkileşimde bulunduğunuz anlamına gelir.  
  
Bu yaklaşım işleri basitleştirir, bir “dosya” açarsınız ve dosyayı okumak ve üzerine yazmak gibi normal işlemleri gerçekleştirirsiniz (bu, ilerideki bir bölümde öğreneceğiniz metin editörlerinin bu kadar önemli olmasının bir nedenidir).
  
---
### Linux ilk Bağlantı ve Kabuk (Shell) üzerinde kullanım

Öncelikle berlirteyim, çoktan kabuk nasıl birşeye benziyor gördünüz bile. Ekranınızın sağ tarafında bulunan siyah ekran bir shell ekranı.  
Linux, çoğunlukla Unix üzerinden gelen altyapıları barındırır, Unix metin tabanlı bir işletim sistemi (OS) olarak başladı. Dolaysı ile Linux bu durumu devam ettiriyor ve içinde çokça metin tabanlı yazılım barındırıyor.  

Özellikle Linux'u yönetirken, komut satırı araçlarının en azından temellerini anlamalısınız. Bu nedenle, Linux-101 eğitimi içersinde temel olarak kabuk kullanımını anlatıyoruz. 

Linux kabuklarına (metin modu komutlarını kabul eden ve yorumlayan programlar) ve bir kabuktan kullanabileceğiniz birçok temel komut ve prosedüre girişle başlar.
  
---
### Komut Satırı Temellerini Anlamak  
<center><img src="{{site.baseurl}}/images/LinuxTerminal.PNG" width="80%"></center>  
<center>WSL2 üzerinden shell(Kabuk) erişimi</center>  
  
Linux ile henüz başka bir şey yapmadan önce, bir Linux kabuğunu nasıl kullanacağınızı anlamalısınız. Birkaç shell (kabuk) mevcuttur, ancak çoğu benzer yetenekler sağlar. Birkaç temel konuyu anlarsanız ilerde öğreneceğiniz diğer komutlar ile kolaylıkla ilişkilendirebilirsiniz.  
  
Ayrıca, birçok program için yararlı olabilecek veriler için yer tutucu olan _kabuk ortamı değişkenlerini_(Environment Variable) de anlamalısınız. Son olarak, komut satırı temelleri konusunda, kullanmaya çalıştığınız komutlarla ilgili nasıl yardım alacağınızı bilmelisiniz.  
  
---
### Linux Kabuk Seçeneklerinizi Keşfedin  
Linux, kabuklar için bir dizi seçenek sunar. Eğitim içersinde sadece `Bash` üzerinde durduk. Merak edenler için, "Linux different shell" ile google üzerinde aramaları yeterli olacaktır.  
  
**Bourne Again Shell** (bash), Unix için daha önceki Bourne kabuğunu temel alır, ancak onu birkaç şekilde genişletir. Linux'ta bash, kullanıcı hesapları için en yaygın varsayılan kabuktur.  

diğer yaygın kabuklar "Zsh", "Tcsh", "Fish", "Ksh" şeklindedir. Özellikle yazılım geliştiriciler için `Zsh` incelemelerini tavsiye ederim.  
  
---
### Kabuk Kullanma  
Linux kabuk kullanımı, daha önce metin modlu bir işletim sistemi kullanan herkes için oldukça basittir. Bir komut ve parametrelerini yazarsınız ve bilgisayar komutu çalıştırır. Çoğunlukla, Linux komutları haricidir(external), yani kabuktan ayrı programlardır. Yine de birkaç komut kabuğun içindedir ve ayrımın bilinmesi önemli olabilir.  
  
#### a. Kabuk Başlatma
Bir metin modu giriş ekranı kullanarak Linux'ta oturum açarsanız, büyük olasılıkla doğrudan varsayılan shell ile bilgisayar açılır. Tekrar söyleyelim, **kabuk**(shell), komut istemi sunan ve sonraki Komutları kabul eden yerdir.  
  
Linux'ta bir grafik kullanıcı arabirimi (GUI) oturum açma ekranı kullanarak oturum açarsanız, manuel olarak bir kabuk başlatmanız gerekir.  
  
Bazı GUI'ler, terminal, xterm, Konsole veya benzeri bir program adı verilen bir programı başlatmak için bir menü seçeneği sağlar. Bu programlar, Linux içinde metin modu programları çalıştırmanızı sağlar ve varsayılan olarak kabuğunuzu çalıştırır.  
  
Böyle bir menü seçeneği bulamazsanız, rastgele bir komutu çalıştırmanıza olanak tanıyan bir menü arayın. Bunu seçin ve komut adı olarak xterm veya konsole yazın; bu, bir kabuk çalıştıracak xterm tipi bir program başlatacaktır.  
  
#### b. İç ve Dış Komutları Kullanma 
İç komutlar, tahmin edebileceğiniz gibi, kabuğun içine yerleştirilmiştir. Çoğu kabuk, benzer bir dahili komut seti sunar, ancak kabuktan kabuğa farklılıklar vardır.  
Kullanacağınız dahili komutlar, genellikle sıklıkla kullandığınız görevler içindir.  
  
Bir komutun iç veya dış olduğunu anlamak için ``type komut_adı``, şeklinde sorgulayabilirsiniz.  
  
```.term1
type echo
```  
  
Bütün iç (built-in) komutların listesine ``help`` komutu ile ulaşabilirsiniz.  
```.term1
help
```
  

#### c. Programlar Nasıl Çalışır  
Kabuk tarafından dahili komutlarından biri olarak tanınmayan bir komutu yazdığınızda, kabuk, onu yürütmek için bu isimde bir program bulmak için yolunu(path) kontrol eder. Yol(path), komutların bulunabileceği dizinlerin bir listesidir. ``PATH`` ortam değişkeni ile tanımlanır. Tipik bir kullanıcı hesabının yolunda yaklaşık yarım düzine veya bir düzine dizin vardır.  
  
Yolu, bir kabuk yapılandırma dosyasında(~/.bashrc ve ~/.profile) PATH ortam değişkenini değiştirerek ayarlayabilirsiniz. Komut satırında tam bir yol sağlayarak yolda olmayan programları çalıştırabilirsiniz. Örneğin, ./calistirbeni yazıldığında mevcut dizinde calistirbeni programı çalıştırılır ve `/home/senol/calistirbeni` yazıldığında bu program `/home/senol` dizininde çalıştırılır.  
  
Burada neden `./` kullandığımızı merak ediyor olabilirsiniz, linux üzerinde path içersinde tanımlı olmayan dosyalar, bulunduğunuz dizinde dahi olsa onlara execution(çalışma) verebilmeniz için bunu doğru tanıtmalısınız. Örn. `.` -> bulunduğum dizinde `/calistirbeni` isimli dosyayı çalıştır gibi.  
   

#### d. Başlarken kabuk hakkında 1-2 kullanım kolaylığı
Bash ve tcsh gibi en popüler Linux kabukları, support command ve dosya adı tamamlama(autocomplete) özelliklerine sahiptirler. Ekranda komut satırı kullanan birisini görüyorsanız, bilin ki tüm komutları ekrana yazmıyordur, yazarken belli bir süre sonra alışkanlık haline gelen bu özelliklere beraber bakalım.  
  
Çoğu kullanıcı shell üzerinden komut yazmayı sıkıcı ve hataya açık bulmaktadır. Bu, özellikle yavaş veya baştan savma yazanlar için geçerlidir. Bu nedenle, Linux kabukları, işlemleri hızlandırmaya yardımcı olabilecek çeşitli araçlar içerir.  
  
Bunlardan ilki komut tamamlamadır: Bir komutun bir bölümünü veya (bir komuta seçenek olarak) bir dosya adı yazın ve ardından Sekme(Tab) tuşuna basın. Kabuk, komutun geri kalanını veya dosya adını doldurmaya çalışır.  
  
Şu ana kadar yazdığınız karakterlerle yalnızca bir komut veya dosya adı eşleşirse, kabuk onu doldurur ve ardından bir boşluk ekler. Yazdığınız karakterler bir komutu veya dosya adını benzersiz şekilde tanımlamıyorsa, kabuk yazabileceği son yere kadarki kısmı yazar ve sonra durur.  
  
Kabuğa ve yapılandırmasına bağlı olarak bip sesi gelebilir. Sekme tuşuna tekrar basarsanız, sistem olası tamamlamaları görüntüleyerek yanıt verir.  
  
Daha sonra başka bir veya iki karakter yazabilir ve komutu veya dosya adını tamamlamadıysanız, işlemin tekrarlanması için Sekme tuşuna tekrar basabilirsiniz. En temel Linux komutlarının oldukça kısa adları vardır `ls`, `cd`, `set` vb.  
  
Bazen birkaç komutu bir arada yazmanız ve dosya isimleri de eklemeniz gerekir, dosya adları  oldukça uzun olabilir. Bu nedenle, komut tamamlama, yazarken çok zaman kazandırabilir. Ayrıca yazım hatalarını önlemenize de yardımcı olur. Bir başka kullanışlı kabuk kısayolu da geçmiş(history)'dir. History, yazdığınız her komutun kaydını tutar.  
  
Yakın zamanda uzun bir komut yazdıysanız ve tekrar kullanmak veya küçük bir varyantını kullanmak istiyorsanız, komutu geçmişten çekebilirsiniz. Bunu yapmanın en basit yolu klavyenizdeki Yukarı ok tuşuna basmaktır; bu önceki komutu getirir. Yukarı ok tuşuna art arda basmak, istediğiniz komutu bulabilmeniz için birden çok komut arasında hareket eder.  
  
Aşarsanız, geçmişte aşağı gitmek için Aşağı ok tuşuna basın. Yukarı ve Aşağı ok tuşları için sırasıyla ``Ctrl+P`` ve ``Ctrl+N`` tuş kombinasyonları PgUp ve PgDown gibi daha uzak aralıklarda yukarı aşağı History getirirler.  
  
Komut geçmişini kullanmanın bir başka yolu, içinde arama yapmaktır. Geriye doğru (ters) aramaya başlamak için `Ctrl+R` tuşlarına basın, eğitim içersinde örnekler ile history kullanımını gösteriyoruz.  
  
---
### Metin(Text) çıktıların yönlendirilmesi  
  
Linux'un bağlı kaldığı Unix felsefesinin bir kısmı, mümkün olduğunca çok sayıda basit aracı birleştirerek karmaşık şeyler yapmaktır. Yeniden yönlendirme(redirection) ve streams, basit programların bağlar ile bir araya getirilmesini sağlayarak bu görevde yardımcı olur, her bir bağlantı bir önceki bağlantının çıktısını besler.  
  
cikti1 | cikti2 | cikti3 | cikti4  
  
Akışlar, yeniden yönlendirme ve kanallar, Linux'taki daha güçlü komut satırı araçlarından bazılarıdır. Linux, programların girdisini ve çıktısını, manipüle edilebilen bir veri varlığı olan bir akış olarak ele alır.  
Normalde, girdi klavyeden gelir ve çıktı ekrana gider 
  
> 
```"Burada söylemek istediğim tam ekran metin modunda oturum açma, bir xterm ekranı ya da uzaktaki bir bilgisayarın terminaline bağlanma oturumu olabilir"
```  
  
Bu giriş ve çıkış akışlarını, dosyalar gibi başka kaynaklardan gelen veya bunlara giden şeklinde yeniden yönlendirebilirsiniz. Benzer şekilde, bir programın çıktısını başka bir programa aktarabilirsiniz. Akışlar (stream)lar, birden çok programı birbirine bağlamak için harika araçlar olabilir  
  
  
---
### Akış Türlerini Keşfetme
Yönlendirme ve boruları anlamaya başlamak için, önce farklı girdi ve çıktı akış türlerini anlamalısınız. Bu konu için en önemli üç tanesi:  
  
**Standart Giriş**(Standart Input) Programları, standart giriş veya stdin yoluyla klavye girişini kabul eder. Çoğu durumda bu, bilgisayara klavyeden gelen verilerdir. _(stdin)_  

**Standart Çıktı**(Standart Out) Metin modu programları çoğu veriyi standart çıktı aracılığıyla kullanıcılarına gönderir _(stdout)_. Stdout, çıktı formatı "tam ekran metin modunda" olaraki ya ekranda görüntülenir veya xterm gibi bir GUI penceresinde. (GUI aslında xterm ile çıktıları Grafik arayüz üzerine metin olarak gönderir, sadece Grafik arayüzü vardır)  
  
**Standart Hata**(Standart Error) Linux, standart hata veya _(stderr)_ olarak bilinen ikinci bir tür çıktı akışı sağlar. Bu çıkış akışının, hata mesajları gibi yüksek öncelikli bilgileri taşıması amaçlanmıştır. Normalde, standart hata, standart çıktıyla aynı çıktı cihazına gönderilir, bu nedenle bunları birbirinden kolayca ayırt edemezsiniz.  
  
Fakat birini diğerinden bağımsız olarak yeniden yönlendirebilirsiniz. Bu sayede, standart çıktıyı ekrana yönlendirirken, standart hatayı bir dosyaya yeniden yönlendirebilirsiniz. İlerleyen bölümde, bu komutların kullanımlarını ve nasıl yönlendiklerini örneklerle anlatıyoruz.  
  
  
-----
## 2. Kabuk(shell) Giriş ve Çıkışlar ile yönlendirmeler (Redirections)
_(redirections, pipes, stdin, stdout, stderr, tee)_  
  
Linux işletim sisteminde komut satırı (Command Line Interface-CLI) üzerinden yapabilecekleriniz, her bir yönlendirme ile daha da çeşitli hale gelmektedir. Çıktılarınızı bir yazıcıya doğrudan yönlendirebilirsiniz, ekrana veya daha farklı bir yere aldığınız bir çıktıyı diğer bir komuta yönlendirip kendi çözümünüzü üretebilirsiniz.  
  
Yönlendirmeler linux işletim sistemine özgü ve çok kullanışlı özelliklerdir. Yönlendirmeleri dosyalara gönderirseniz filesystem üzerinde dosya oluşturabilirsiniz.  
  
Dilerseniz hata bilgilerinizi standart çıktıya yazabilir ve çalıştırdığınız bir program için error.log oluşturabilirsiniz.  
  
Kafanızın karıştığını düşünüyorum, bu konu linux kullananların hepsinin bildiği ve çok sıklıkla fayda sağladığı bir konu. Sizin de mantığını anladığınızda çok fazla kullanacağınız bir özellik.  
  
  
Öncelikle basit bir komut çalıştıralım  

```.term1
ls /
```

bu komut ile / (kök) dizin altındaki klasörler sıralandı.  
  

---
### **;** Birden fazla komutu tek bir komutta çalıştırma  
  
Diyelim ki, birkaç komutu birbiri ardına çalıştırmanız gerekiyor. İlk komutun çalışmayı bitirmesini ve ardından bir sonrakini çalıştırmasını mı bekliyorsunuz?  
  
Bunun için `;` ayırıcısını kullanabilirsiniz. Bu şekilde, bir satırda birkaç komut çalıştırabilirsiniz. Önceki komutların işlerini bitirmesini beklemeye gerek olmadan diğer komut çalışacaktır.  
  
komut_1; komut_2; komut_3  
  
---
### **&&** Birden fazla komutu yalnızca bir önceki komut başarılıysa tek bir komutta çalıştırma  
  
Önceki komutta, zamandan kazanmak için tek bir satır içinde birkaç komutun nasıl çalıştırılacağını gördünüz. Peki ya komutların başarısız olmadığından emin olmanız gerekiyorsa?  
  
Bir kod compile etmek istiyorsunuz mesela, başarılı bir şekilde çalıştırılan bir önceki komuttan sonra bir başka komutun çalışması gerek. bu durumda ``configure&&make&&make install` şeklinde komut çalıştırabiliriz.  
  
Bu durum için && ayırıcı kullanabilirsiniz. &&, sonraki komutun yalnızca önceki komut başarılı olduğunda çalışacağından emin olur.

$ komut_1 && komut_2  
  
Bu komutu sıklıkla tembellik yüzünden kullanırım. Örneğin, sisteminizi yükseltmek için "sudo apt update && sudo apt upgrade -y" yazarak tek satırda bilgisayarı güncellerim.  
  
bu sistem içinde aynı komutu kullanabilirsiniz.  
  
```.term1
apt-get update && apt-get upgrade
```
  
  
---
### `|` **pipe** - boru veya akışlar 

şimdi bu komutun çıktısını `|` (pipe) ile bir sonraki komut için (stdin) olarak yönlendirelim  

``` 
cikti1 | cikti2 | cikti3 | cikti4  
```
    
```.term1
ls / | cat
```

burada ilk komut `ls /`çalışıyor ve çıktısını ekran yerine `cat` komutuna yönlendiriyor, cat komutu ise kendi çıktısını üretiyor.  
  
  
---
### **stdout** (komut değildir) işlemin komut satırından dışarı bilgi vermek için kullandırdığı yönlendirme

`ls`komutunun çıktısını(stdout) başka bir programa yönlendirebileceğimiz gibi işletim sistemindeki bir dosyaya da yönlendirebiliriz.  

```.term1
ls / >/tmp/kokdizinlistesi.txt
```

yukarıdaki komutu çalıştırdığımızda çıktımız (stdout)ekran yerine bir dosya oluşturacaktır `/tmp/kokdizinlistesi.txt`  

dosyanın içini görüntülerseniz `ls /`komutu çıktısını olduğunu görebilirsiniz.  

```.term1
cat /tmp/kokdizinlistesi.txt
```


**Stdout ve stderr yeniden yönlendirmek**

Hata mesajlarının özel bir akış tarafından teslim edilmesinin bir avantajı vardır. Bu, bir komutun çıktısını (stdout) bir dosyaya yeniden yönlendirebileceğimiz ve yine de terminal penceresinde herhangi bir hata mesajını (stderr) görebileceğimiz anlamına gelir.  
İhtiyaç duyduğunuzda hatalara tepki verebilirsiniz. Ayrıca, hata mesajlarının stdout'un yönlendirildiği dosyayı kirletmesini de durdurur.

Aşağıdaki metni bir düzenleyiciye yazın ve error.sh adlı bir dosyaya kaydedin. (çalıştırmanız durumunda dosya oluşacaktır)

```.term1
cat >> /tmp/hataver.sh <<EOL
#!/bin/bash
echo "Var olmayan bir dosyaya erişmeye çalışıyor!"
cat yanlis-dosya.txt
EOL
```
Komut dosyasını şu komutla çalıştırılabilir hale getirin:

```.term1
chmod +x /tmp/hataver.sh
```

Komut dosyasının ilk satırı, stdout akışı aracılığıyla metni terminal penceresine yansıtır. İkinci satır, var olmayan bir dosyaya erişmeye çalışır. Bu, **stderr** aracılığıyla gönderilen bir hata mesajı oluşturacaktır.

Komut dosyasını şu komutla çalıştırın:

```.term1
/tmp/hataver.sh
```

gördüğünüz gibi önce varolmayan bir dosyaya erişmeye çalıştığı mesajı, sonrasında bir hata mesajı geliyor. Her iki çıktı akışının, stdout ve stderr'in terminal pencerelerinde görüntülendiğini görebiliriz.

Çıkışı bir dosyaya yönlendirmeyi deneyelim:

```.term1
/tmp/hataver.sh > /tmp/hataversonuc.txt
```

oluşacak dosyada 2 satır olduğunu düşünüyorsunuz, fakat sadece 1 satır var. Çünkü verilen hata stdout içersinde görünmez biz aslında yukarıdaki komutu yazarken sadece stdout çıktılarını `/tmp/hataversonuc.txt` dosyası içine aktarıyoruz, **stderr** sonuçları bu dosya içersinde oluşmazlar.

dosyayı görüntülediğimizde sadece 1 satır bilgi olduğunu görürüz.

```.term1
cat /tmp/hataversonuc.txt
```

`>` veya `1>` **stdout** çıktıları için kullanılır, herhangi bir sayı vermezseniz bunu 1 kabul eder.

`2>` **stderr** hata çıktıları için kullanılır

komutu `1`ile çalıştıralım

```.term1
/tmp/hataver.sh 1> /tmp/hataversonuc.txt
```

şimdide hata **stderr** sonucunu başka bir dosyaya yönlendirelim, `2>`

```.term1
/tmp/hataver.sh 2> /tmp/hataversonuc.err
```

dosyaları incelediğimizde `hataversonuc.txt` dosyasında **stdout** çıktısının olduğunu.  `hataversonuc.txt` dosyası içersinde ise **stderr** sonucunun olduğunu görürüz.

```.term1
cat /tmp/hataversonuc.txt
```



```.term1
cat /tmp/hataversonuc.err
```
  
---
### Hem **stdout** hem de **stderr** yeniden yönlendiriliyor  

Şüphesiz, stdout veya stderr'i birbirinden bağımsız olarak bir dosyaya yönlendirebiliyorsak, ikisini de aynı anda iki farklı dosyaya yönlendirebilmeliyiz?  

Evet yapabiliriz. Bu komut **stdout**'u `/tmp/hataversonuc.txt` adlı bir dosyaya ve **stderr**'i `/tmp/hataversonuc.err` adlı bir dosyaya yönlendirecektir.  


```.term1
/tmp/hataver.sh 1> /tmp/hataversonuc.txt 2> /tmp/hataversonuc.err
```
  
---
### **stdout** ve **stderr**'i Aynı Dosyaya yönlendirme

Her bir standart çıktı akışının kendi özel dosyasına gitmesini sağladık. Yapabileceğimiz son kombinasyon, hem stdout hem de stderr'i aynı dosyaya göndermek olacaktır..  

Bunu şu komutla başarabiliriz:  

```.term1
/tmp/hataver.sh > /tmp/hataversonuc.txt 2>&1
```

parametreleri analiz edelim,  

**/tmp/hataver.sh** çalışan script/program kendisi  

**/tmp/hataversonuc.txt** stdout akışını hataversonuc.txt dosyasına yeniden yönlendirir. `>` ve `1>` aynı şeydir  

**2>&1** Burada, `&>` yönlendirme talimatını kullanır. Bu talimat, kabuğa bir akışın başka bir akışla aynı hedefe gitmesini söylemenizi sağlar. Bu durumda, ```akış 2'yi, stderr'i, akış 1'in, stdout'un yönlendirildiği aynı hedefe yönlendir``` diyoruz.  
  
---
### **tee** stdin üzerinden aldıklarını stdout ve dosyalara yönlendirir


`tee` stdin okur, çıktı olarak stdout ve dosya/dosyalar'a veri yazar.  
  
Kullanım şekli:  
````
stdin --> tee --> stdout , dosya1, dosya2...  
````

```.term1
ls -la
```
bu komut ekrana(stdout) ls çıktısı dönecektir. Buradan tee komutu ile çıktıyı hem ekrana, hemde 2 ayrı dosyaya yazdırabiliriz.  

```.term1
ls -la |tee /tmp/dosya1.txt /tmp/dosya2.txt
```
oluşan her iki dosyayı da control ettiğimizde aynı çıktıların olduğunu görürüz.  

dosya1.txt içeriği  

```.term1
cat /tmp/dosya1.txt
```


dosya2.txt içeriği  

```.term1
cat /tmp/dosya2.txt
```  
  
-----
## 3. Ortam komutları
_(history, alias, env, set, export)_

---  
### **history** geçmiş - komut satırındaki geçmişte yazılı komutları sıralar
  
Bir diğer çok kullanışlı linux komutu history 'dir. önceden yazdığınız komutlar kullandığınız shell'e bağlı olarak home dizininizde bir dosya içersine yazılır, yani son çalıştırdığınız komutlar sürekli olarak kaydedilir, böylece eskiden yazdığınız komutları da tekrar görebilirsiniz. Eski komutları tekrar görebilmek için `history` komutu kullanılır

```.term1
history
```
  
History komutu ile shell içindeki bazı keyler birleştirilerek önceden yazdığınız komutları history komutunu kullanmadan tekrar shell içinde yazabilirsiniz.  
  
komut satırında doğrudan Ctrl+R tuşuna basarsanız aşağıdaki gibi bir soru gelecektir  
```
(reverse-i-search)`':
```
  
ve sizden arayacağınız şeyi yazmanızı isteyecektir, buradaki arama history içersinde olacaktır, örnek olarak sizden önce sunucuya bağlanan kişi `touch` komutunu kullanmışmı diye bakmak isterseniz tou(harflerini yazdığığınızda aşağıdaki çıktı gelecektir)  
```
(reverse-i-search)`touch': touch ilkdosyam
```
  
`history` komutu /home/~/.bash_history dosyası içini günceller. Sunuculara yapılan shell erişimli hacker saldırılarında ilk kopyalanıp sıfırlanan dosyadır. Ayrıca shell üzerinden yazılmış parolalar burada durabildiği için ciddi tehlike arzeder.  
  
---  
### **alias** mahlas / Takma ad - bir komut veya komut dizisine verilen takma ad  


Bazen komutları yazmak gerçekten tekrarlayıcı olabilir veya birçok kez uzun bir komut yazmanız gerekirse, bunun için kullanabileceğiniz bir takma ada sahip olmak işleri kolaylaştırabiliyor. Bir komut için bir takma ad oluşturmak için, bir takma ad belirtmeniz ve bunu komuta atamanız yeterlidir.  
  
`$ alias getir = 'ls -la'`  
  
Şimdi ls -la yazmak yerine, getir yazabilirsiniz ve bu komutu çalıştıracak. Kullanıdığınız shell ortamından çıktığınızda bu tanımların silineceğini unutmayın. Komutların kalıcı `alias` sahibi olabilmesi için .bashrc dosyası içersine veya kullandığınız shell içersine bu satırı eklemeniz yeterli olacaktır.  
  
~ /.bashrc  

Verdiğiniz takma adları `unalias` komutuyla kaldırabilirsiniz:  

`$ unalias getir`  
  
---
### **env** ortam

Ortam değişkenlerinin bir listesini yazdırmak ya da mevcut ortamı değiştirmek zorunda kalmadan değiştirilmiş bir ortamda başka bir yardımcı programı çalıştırmak için kullanılır. Env kullanılarak değişkenler eklenebilir veya kaldırılabilir ve mevcut değişkenler bunlara yeni değerler atanarak değiştirilebilir.  

Yazdığımız shell programları içersindeki değişkenler sadece shell programı içersinde geçerli olurlar, bu değişkenlerin shell içersinde etkin olarak çalışabilmesi için tanımlanmaları gerekir.  
  
**Belirtilen değişkenin değerninin gösterilmesi**  
  
echo $SHELL  
  
veya çok popüler olan  
  
echo $PATH  
  
**Yeni değişken değerinin dışarı aktarılması**  
  
export VARIABLE=deger (veya VARIABLE=deger; export VARIABLE)   
  
**Bir değişkeni kalıcı olarak eklemek için**  
  
  1. ~/.bashrc dosyası içinde `export VARIABLE=deger` eklenir.  
  2. 'source ~/.bashrc' yazıp enter yapabilirsiniz veya sadece ~/.bashrc çalıştırabilirsiniz. yeni bir shell ekranı açarsanız yine değerler tanımlı gelecektir.  
  
Ortam değişkenleri özellikle sistem yöneten kişiler için bazen ciddi sorunlar yaratabilir (Windows işletim sistemlerindeki "`,`" ve "`.`" sorunu gibi). Wikipedia içersinde hazırlanmış çok güzel bir Env sayfası var, [burayı kesinlikle incelemenizi tavsiye ederim](https://en.wikipedia.org/wiki/Environment_variable)  
  
export komutu içersinde en sık kullanılan ortam değişkenlerine değineceğiz (HOME,PATH,SHELL,PS1)  
  
---
### **set** shell kullanımı için tanımlar  
  
Set komutu, komut dosyalarınızın davranışını belirlemek için Bash'deki belirli bayrakları ve özellikleri kontrol etmenizi sağlar. Bu kontroller, komut dosyalarınızın istenen yolu izlemesini ve Bash'te istediğiniz gibi bir ortam yaratmanızı sağlar.  
  
Basit bir şeyle başlayın. Bash'in dosyaların üzerine yazma şeklindeki varsayılan davranışını devre dışı bırakmak istediğinizi varsayalım, '-C' parametresi bunu engelleyecektir.  

```.term1
set -C
```

şimdi bir dosya oluşturmaya çalıştığınızda artık hata verecektir  
  
```.term1
ls -la / >/tmp/list.root
```

gördüğünüz gibi artık redirect işlemi yapamıyorsunuz.  

başka bir parametre olan '-f' ise, shell üzerindeki Globbing özelliğini kapatacaktır. Globbing `*` dediğimizde tüm dosyalar anlamına gelen özellik.  

set ile bash üzerinde çoğunlukla yazmış olduğunuz script'leri sınırlarsınız.  
  
---
### **export** dışa aktar  

ortam değişkenini değiştirmek için kullanılır, yukarıda env komutunu işlerken görmüştük.  

**HOME**

HOME, kullanıcının ev (veya oturum açma) dizinini temsil eden bir ortam değişkenidir. argümansız cd, geçerli çalışma dizinini HOME değerine değiştirir. Yaklaşık karakterinin (~) genellikle $ HOME için bir kısaltma olarak kullanıldığını unutmayın. Bu nedenle, `cd $HOME` ve `cd ~` tamamen eşdeğer ifadelerdir.
  
$ echo $HOME  

bize ev dizinimizin adını verir, her kullanıcının sistem üzerinde biz ev dizini vardır, ev dizini tanımlı olmayan kullanıcılar `/` kök dizinine düşerler ve kök üzerinde erişim hakları olmadığı için prompt olarak `$` ile çalışmak zorunda kalırlar.

**SHELL**

Ortam değişkeni SHELL, kullanıcının varsayılan komut kabuğunu işaret eder (bir komut penceresinde yazdıklarınızı işleyen program, genellikle bash) ve kabuğun tam yol adını içerir:

$ echo $SHELL  
/bin/bash

**PATH**

PATH, yani **YOL** çalıştırılacak uygun programı veya betiği bulmak için bir komut verildiğinde taranan sıralı bir dizin listesidir (path). Yoldaki her dizin iki nokta üst üste (:) ile ayrılır. null (boş) bir dizin adı (veya ./) herhangi bir zamanda geçerli dizini gösterir.

 yol1: yol2
yol1 :: yol2
Örnekte: `yol1:yol2`, ilk iki nokta üst üste işaretinden (:) önce boş bir dizin vardır. Benzer şekilde, `yol1::yol2` için yol1 ve yol2 arasında boş bir dizin vardır.

Yolunuza özel bir bin dizininin önüne eklemek için:  
```.term1
export PATH=$HOME/bin:$PATH  
```
şimdi yeni path bilgisini tekrar ekrana getirelim,  
```.term1
echo $PATH  
```

**PS1**  
Örnek olarak (PS), Komut istemcisi (shell ekranında yanda yazan kısım) değiştrimeyi deneyelim.  

PS1, komut satırı isteminizin neye benzediğini kontrol eden birincil istem değişkenidir. Aşağıdaki özel karakterler PS1'e dahil edilebilir:  

````
 \u   -  Kullanıcı adı  
 \h   -  Ana bilgisayar adı 
 \w   -  Geçerli çalışma dizini 
 \!   -  Bu komutun geçmiş numarası 
 \d   -  Tarih 
````
Aşağıdaki örnekte olduğu gibi, kullanıldıklarında tek tırnak içine alınmaları gerekir:  

```.term1
echo $PS1  
```

```.term1
export PS1='\u@\h:\w$'  
```

Değişiklikleri geri almak için:

```.term1
export PS1='$'
```

Daha da iyi bir uygulama, önce eski istemi kaydetmek ve ardından aşağıdaki gibi geri yüklemek olacaktır:  
```.term1
OLD_PS1=$PS1  
```

istemi değiştirin ve sonunda şununla tekrar değiştirin:  
```.term1
PS1=$OLD_PS1  
```
  
---
### **exit** - çıkış  

exit komutu shell bağlantınızı sonlanrımak için kullanılır.

kullanım şekli.  

$ exit [geri-dönüş-değeri]

0 başarılı
1 başarısız

genellikle 

$ exit

şeklinde kullanılır. scriptler içersinde kullanırken geri dönüş değerleri önem arz eder, ve istediğiniz sayıyı verebilirsiniz.  

örn.

$ exit 999 
  
  
-----
  
## 4. info ve man komutları - bilgi ve el kitabı
  
Linux içersinde yazacağımız tüm konutlar için hangi parametrenin nasıl kullanıldığı bilgisini bulabileceğimiz bir dökümantasyon var. Manual Pages / El Kitabı Sayfaları diyebileceğimiz bu sayfalar sıklıkla her sistem yöneticisinin başvurduğu bilgi kaynaklarıdır. Tabiki google ile arama yapabilir ve farklı kullanımları bulabilirsiniz, fakat komut satırından hiç ayrılmadan da aynı bilgiye ulaşabilirsiniz.  
  
info  
man  
help  
  
---
### **man**  

**man** programı, man page sisteminde bulunan bilgileri arar, biçimlendirir ve görüntüler. Pek çok konu bol miktarda ilgili bilgiye sahip olduğundan, çıktı her seferinde bir sayfa görüntülenmek üzere bir çağrı cihazı programı (daha azı gibi) aracılığıyla taşınır. Aynı zamanda bilgi, iyi bir görsel gösterim için formatlanmıştır.  

Belirli bir konu, kendisiyle ilişkili birden çok sayfaya sahip olabilir ve herhangi bir seçenek veya bölüm numarası belirtilmediğinde hangisinin görüntüleneceğini belirleyen varsayılan bir sıra vardır.  
Konuyla ilgili tüm sayfaları listelemek için -f seçeneğini kullanın. Belirli bir konuyu tartışan tüm sayfaları listelemek için (belirtilen konu adda yer almasa bile), –k seçeneğini kullanın.  

Önce man bilgisayarımıza kuralım.(apt kullanımı Bölüm.3 içinde gösterilecek)  
```.term1
apt-get update;apt-get install man -y
```


`man –f`, whatis'i yazmakla aynı sonucu üretir.  

`man –k`, apropos yazmakla aynı sonucu üretir.  

Varsayılan sıra /etc/man_db.conf dosyasında belirtilir ve kabaca (ancak tam olarak değil) bölümlere göre artan sayısal sıradadır.  

**tipik bir man kullanımı şu şekildedir**  

user@node1:/tmp> man man  

ÖRNEKLER(examples) bölümü için Page Down tuşunu kullanın veya '/' tuşuyla daha az arama yapın.  

user@node1:/tmp> man -k compress  
  

user@node1:/tmp> man 3 printf  

(man printf, aynı ada sahip komut satırı yardımcı programını (bölüm 1) getirecektir.)  
  
---
### **info**  

Bir sonraki popüler Linux dokümantasyon kaynağı GNU Bilgi Sistemidir `info`.  

Bilgiler, bir komut satırı arabirimi(CLI), bir grafik yardım programı aracılığıyla görüntülenebilir, yazdırılabilir veya çevrimiçi olarak görüntülenebilir.  

Linux konusu ile ilk ilgilenmeye başladığımda `info` sayfalarını daha kullanışlı bulmuştum. Sonraları `man` sayfaları çok daha kullanışlı oluyorlar, 

Kullanımı oldukça kolaydır  

user@node1:/tmp> info cpio  
  
---
### **--help** opsiyonu, neredeyse her komut için bulunur  

Linux komutlarını komut satırında anlamanın bir diğer önemli kaynağı, ``--help`` seçeneğinin kullanılmasıdır.  
  
Çoğu komutun, komut veya uygulama ile birlikte --help veya -h seçeneği kullanılarak görüntülenebilen kısa bir açıklaması vardır. Örneğin, man komutu hakkında daha fazla bilgi edinmek için şunları yazabilirsiniz:  
  
Sunucumuz üzerinde man kurulu değil önce onu kuralım(apt ve kullanımı daha sonra gösterilecektir)  
```.term1  
apt-get update&&apt-get -y install man
```

şimdi man programının help çıktısına bakalım.  
```.term1
man --help  
```
  
--help seçeneği hızlı bir referans olarak kullanışlıdır ve bilgileri man veya bilgi sayfalarından daha hızlı görüntüler.  
    
Ben kendim bir script veya program geliştirdiğimde kesinlikle --help için birşeyler yazmayı ihmal etmem, emin olun komut satırında yaptıklarınızı dökümante etmezseniz 1 yıl sonra kendi yazdığınız programı kullanamazssınız.  
  
---
### **Clear** Ekranı temizler
**clear** komutu ekranı temizler, MS-DOS için kullanılan CLS komutu gibidir.  

Kullanımı:

```.term1
clear
```
  
  
-----
## 5. Linux Dizin yapısı ve komutları

Birçok işletim sisteminde (Linux dahil), dosya sistemi bir ağaç gibi yapılandırılmıştır. Ağaç genellikle ters çevrilmiş olarak tasvir edilir ve genellikle hiyerarşik dosya sisteminin başlangıcını işaret eden ve bazen ana hat olarak da anılan veya basitçe / ile gösterilen kök(ing. root) dizinde başlar. Kök dizin, root(tr. kök) kullanıcısı ile aynı şey değildir. Hiyerarşik dosya sistemi, aynı zamanda, son öğenin gerçek dosya adı olduğu `/usr/bin/vim` gibi, eğik çizgilerle (/) ayrılmış yoldaki diğer öğeleri de (dizin adları) içerir.  
  
Windows üzerinde klasörleri `\` ile ayırırken Linux/Unix için bu `/` şeklindedir.  
  
Bu bölümde, dosya sistemi hiyerarşisi dahil bazı temel kavramların yanı sıra disk bölümleri hakkında bilgi edineceksiniz.  
  
>
 ```30 yıla yaklaşan Sistem Yönetimi tecrübemde edindiğim en temel bilgi, dosya sistemlerini iyi bilen ve kendi istekleri için kolaylıkla değişiklikler yapabilen kişilerin çok iyi sistem yönettikleridir. MS-DOS, Microsoft - "Disk Operating System" ve işletim sistemini içersindeki konumu hakkında size bir izlenim verebilir. İşletim sistemi bilge bir ağaç ise, ağacın omurgası dosya sistemidir diyebiliriz.  
 ```  
  
Bazı işletim sistemleri Linux/FreeBSD gibi sizlere bu sistem dosyaları üzerinde değişiklik yapma ve erişme hakkı verirken, Windows gibi bağzıları bunu MFC gibi arayüzler ve programlar ile erişilebilir yapmışlardır.  
  
  
Linux dizin yapısı / (kök) dizin ile başlar demiştik, aşağıda kök dizin üzerindeki diğer dizinlerin bir şemasını görüyorsunuz.  
  
<img src="https://www.tecmint.com/wp-content/uploads/2013/09/Linux-Directory-Structure.jpeg" width="50%">
  
---
### işletim sistemi kök dizin(root directory) altındaki dizinler ve görevleri

**/bin**: Önyükleme, onarım, tek kullanıcı modunda çalışması için gereken dosyaları barındırır. Diğer önemli, temel komutlar, yani cat, du, df, tar, rpm, wc, history vs programlar bu dizindedir, varsayılan PATH içersinde vardır.  
**/boot**: Linux Çekirdeği dahil, önyükleme işlemi sırasında önemli dosyaları tutar.  
**/dev**: Makinedeki tüm donanım aygıtları için aygıt dosyalarını içerir, ör. cdrom, cpu, vb.  
**/etc**: Her bir program için uygulamanın yapılandırma dosyalarını, başlatma, kapatma, başlangıç, durdurma komut dosyasını içerir.  
__Configürasyon dizinidir, herzman kurulum sonrası bir kopyasını yapınız__  
**/home**: Kullanıcıların ev dizini. Her yeni kullanıcı oluşturulduğunda, ana dizinde Masaüstü, İndirilenler, Belgeler vb. diğer dizinleri içeren, kullanıcı isminde bir dizin oluşturulur.  
**/lib**: Lib dizini, sistemi başlatmak ve kök dosya sisteminde komutları çalıştırmak için gereken çekirdek modüllerini ve paylaşılan kitaplıkları içerir.  
**/lost+found**: Bu Dizin, Linux kurulumu sırasında yüklenir ve beklenmedik kapanma nedeniyle bozulabilecek dosyaları kurtarmak için kullanışlıdır. Her yeni dosya sistemi yarattığınızda bu dizin dosya sisteminin kökünde oluşturulur.  
**/media**: Çıkarılabilir aygıtlar, yani media/cdrom için geçici bağlama dizini oluşturulur.  
**/mnt**: Dosya sistemini bağlamak için geçici bağlama dizini. production için kullanacağınız dizinleri buraya kalıcı olarak mount etmeyin.  
**/opt**: İsteğe bağlı olarak kullanılır. Üçüncü taraf uygulama yazılımı içerir. Viz., Java vb.  
**/proc**: Belirli bir Process-id yani pid ile işlemlerin çalıştırması hakkında bilgi içeren sanal ve gerçek olmayan bir dosya sistemi. çalışan bir sistemin beyni diyebiliriz, tüm processler burada sanal bir dosya sistemi üzerinde birbirleri ile etkileşir, çok popüler "top,sar,iostat,lsof.." sistem komutları bilgisini buradan alır.  
**/root**: Bu, root(kök, yönetici) kullanıcının ana dizinidir ve asla '/' (kök dizin) ile karıştırılmamalıdır.  
**/run**: İşletim sistemi açılırken ihtiyaç olan işler için yaratılmış geçici dizin, /var/run yerine gelmiştir.  
**/sbin**: Sistem Yöneticisi tarafından sistem yönetimi için gerekli olan yürütülebilir programları içerir.  iptables, fdisk, ifconfig, swapon, reboot vb.  
**/srv**: "srv", Servis kısaltılmış halidir. Bu dizin, sunucuya özel ve hizmetle ilgili dosyaları içerir. işletim sistemine ekleyeceğiniz diskleri bu dizin altına ekleyebilirsiniz, yapacağınız kalıcı işlemler için bu dizini kullanın. DB kuracaksanız, yazılım deploy edecekseniz vb.  
**/sys**: Modern Linux dağıtımları, sisteme bağlı aygıtları depolayan ve değiştirmeye izin veren bir sanal dosya sistemi olarak bir /sys dizinini kullanırlar. proc gibi read only bir dosya sistemidir, sistem üzerinde bağlı donanımların verilerini okuyabilirsiniz.  
**/tmp**: Sistemin Geçici Dizini, kullanıcılar ve kök tarafından erişilebilir. Bir sonraki önyüklemeye kadar kullanıcı ve sistem için geçici dosyaları saklar.  
```tmp dosya dizini özellikle hacker lar tarafından çok kullanılır, kurulum sonrası mutlaka execution(çalıştırma) özelliğine kapatılmalıdır. Config aşağıdaki gibi olmalıdır```
```.term1
sudo  grep tmp /etc/fstab
```
```Çıktı olarak "/dev/sda5 /tmp ext3 loop,nosuid,noexec,rw 0 0" olmalıdır.```

**/usr**: İkinci seviye için çalıştırılabilir uygulamalar, belgeler, kaynak kodu, kitaplıklar içerir. işletim sisteminde çalışan ana uygulamalar(executable) ve kütüphaneleri(library) buradadır.  
**/var**: Değişken anlamına gelir. Bu dosyanın içeriğinin artması beklenir. Bu dizin, günlük, kilit, biriktirme, posta ve geçici dosyaları içerir. log dosyaları ana klasörü diyebiliriz.  
  
  
---
### Dizinler içersindeki önemli dosyalar  
  
**/boot/vmlinuz**: Linux Kernel dosyası.  
**/dev/sda**: İlk HDD (Sabit Disk Sürücüsü) için aygıt dosyası  
**/dev/cdrom**:  Cdrom için aygıt dosyası, genellikle  
**/dev/null**: Var olmayan sözde bir cihaz. Bazen çöp çıktısı /dev/null'a yönlendirilir, böylece sonsuza kadar kaybolur. 1TB büyüklüğünde bir dosyayı yok etkem istediğinizde, dosya halen çalışıyorsa buraya yönlendirerek dosyayı sıfırlayabilirsiniz.  
**/etc/bashrc**: bash kabuğu tarafından kullanılan sistem varsayılanlarını(PATH,ENV) ve takma adları(alias) içerir.  
**/etc/crontab**: Önceden tanımlanmış bir zaman aralığında belirtilen komutları çalıştırmak için bir kabuk betiği. windows üzerindeki zamanlanmış görev yöneticisi gibi.  
**/etc/export**: Ağda bulunan dosya sistemi bilgileri.  
**/etc/fstab**: Disk Sürücüleri ile bunların hangi alt dizinlere bağlandığı bilgisi  
**/etc/group**: Kullanıcıların Güvenlik Grubu Bilgileri.  
**/etc/grub.conf**: grub bootloader yapılandırma dosyası.  
**/etc/init.d**: ​​Hizmetleri başlatma Betiği.  
**/etc/lilo.conf**: lilo bootloader yapılandırma dosyası.  
**/etc/hosts**: IP adresleri ve ilgili bilgisayar adları eşleşmeleri. Windows altındaki `c:\windows\system32\drivers\etc\hosts` dosyası ile aynı.  
**/etc/hosts.allow**: Yerel makinedeki hizmetlere erişmesine izin verilen bilgisayarların listesi.  
**/etc/host.deny**: Yerel makinedeki hizmetlere erişimi reddedilen bilgisayarların listesi.  
**/etc/inittab**: INIT süreci ve çeşitli çalışma seviyelerindeki etkileşimleri.  
**/etc/issue**: İşletim sisteminin girişinde bulunan isim. örn. Debian için "Debian GNU/Linux 10 \n \l" bilgisini içerir.  
**/etc/modules.conf**: Sistem modülleri için yapılandırma dosyaları.  
**/etc/motd**: motd, Günün Mesajı anlamına gelir, Mesaj kullanıcıları sistem üzerine oturum açtıklarında gelir.  
**/etc/mtab**: Şu anda baçlı blok cihazlarının bilgileri.  
**/etc/passwd**: sistem kullanıcıların bilgisini içeren dosyadır, `/etc/shadow` dosyada ise sistem kullanıcılarının şifrelenmiş parolaları vardır içerir.  
**/etc/printcap**: Yazıcı Bilgileri  
**/etc/profile**: Bash kabuğu varsayılanları  
**/etc/profile.d**: Oturum açtıktan sonra çalıştırılan uygulama betiği.  
**/etc/rc.d**: Çalıştırma düzeyine özgü komut dosyasyaları içerir.  
**/etc/rc.d/init.d**: ​​Sistemin çalışacağı seviye Başlatma Komut Dosyasını Çalıştır.  
**/etc/resolv.conf**: Sistem tarafından kullanılan Alan Adı Sunucuları (DNS) tanımlıdır.  
**/etc/securetty**: Kök oturumunun mümkün olduğu Terminal Listesi.  
**/etc/skel**: Yeni kullanıcı ev dizinini oluşturan komut dosyası.  
**/etc/termcap**: Terminal, konsol ve yazıcıların işlevlerini tanımlayan bir ASCII dosyası.  
**/etc/X11**: X-windows Sisteminin yapılandırma dosyaları. Linux Grafik arayüzü için.  
**/usr/bin**: Normal kullanıcı çalıştırılabilir komutları.  
**/usr/bin/X11**: X Windows Sisteminin uygulamaları.  
**/usr/include**: "c" derleyicisi tarafından kullanılan dosyaları içerir.  
**/usr/share**: Man dosyalarının, bilgi dosyalarının vb. paylaşılan dizinleri.  
**/usr/lib**: Program derlemesi sırasında gerekli olan kitaplık dosyaları.  
**/usr/sbin**: Sistem Yönetimi için Süper Kullanıcı Komutları.  
**/proc/cpuinfo**: CPU Bilgileri  
**/proc/filesystems**: Şu anda kullanılan dosya sistemi bilgileri.  
**/proc/interrupts**: Şu anda kullanılmakta olan mevcut kesintiler hakkında bilgi.  
**/proc/ioports**: Sunucudaki aygıtlar tarafından kullanılan tüm Giriş / Çıkış adreslerini içerir.  
**/proc/meminfo**: Bellek Kullanım Bilgileri.  
**/proc/module**: Şu anda çekirdek modülü kullanılıyor.  
**/proc/mount**: Takılı Dosya Sistemi Bilgileri.  
**/proc/stat**: Mevcut Sistemin Ayrıntılı İstatistikleri.  
**/proc/cmdline**: İşletim sisteminin hangi kernel parametreleri ile başlatıldığı bilgisi  
**/proc/sys/kernel/random/entropy_avail**: Sistem üzerindeki entropi seviyesi, en az 2000 bit olmalıdır  
**/proc/swaps**: swap(takas) dosyası Bilgilerini Değiştir. windows üzerindeki gizli `c:\pagefile` dosyası gibidir.  
**/var/log/lastlog**: Son önyükleme işleminin günlüğü.  
**/var/log/messages**: Önyükleme sırasında syslog daemon tarafından üretilen mesajların günlüğü.  
**/var/log/wtmp**: Şu anda sistemdeki her kullanıcının oturum açma zamanını ve süresini listeler.  
  
******
### Dizin ve dosya sistemi komutları
__(pwd, cd, ls)__

Linux ve Unix türevi işletim sistemleri için komut satırı insan ile işletim sisteminin birarada olduğu ve konuştuğu yerdir. İşletim sisteminin dertlerini dinler ona doğru soruları sorarak hastalığını anlamaya çalışırsınız.  
  
Yorgun olup olmadığını veya bir ihtiyacı olup olmadığını komutlar aracılığı ile sorar ve öğrenirsiniz. Burada işletim sistemi size sessiz bir bilge gibi davranır, susar ve size tüm kütüphanesini açar. Gelin hep beraber bu soruları sormaya başlayalım.  
  
---
### **pwd** print working directory - çalıştığım dizini yaz
<br />
`pwd` dizin yapısı içinde, bulunduğunuz yeri gösterir. Linux içindeki herşey dosyalardan oluşmuştur, aklınıza gelebilecek herşey bir dosya operasyonudur. Bu yüzden dizin yapısını anlarsanız linux içindeki işlemleri anlamanız daha kolay olur.  
`pwd` neredeyim, hangi klasördeyim bilgisini size çıktı olarak verir. herhangi bir parametre gerektirmez.  
  
```.term1
pwd
```
  
---
### **cd** change directory - klasör değiştir

yani klasör değiştir. Bulunduğunuz klasöre bağlı olarak (`pwd` çıktısı) gideceğiniz yeri tanımlayarak hedef klasöre gidebilirsiniz. Bazı kısayolları vardır.  

bulunduğunuz klasörden `tmp` klasörüne gitmek için  

```.term1
cd /tmp
```

şuan `pwd` dediğinizde `/tmp` klasöründe olduğunuz bilgisi geleceketir  

```.term1
pwd
```

bulunduğunuz dizinden `/usr/bin` dizinine gitmenin iki ayrı yolu vardır  
  
**1. yöntem**  
  
```.term1
cd ../usr/bin
```
  
**2. yöntem**  
  
```.term1
cd /usr/bin
```
  
ilk yöntemde shell üzerinden kendinizi önce bir üst klasöre taşıyorsunuz `../` ile ve sonrasında gideceğiniz klasörü yazıyorsunuz, özellikle çok derin klasörlerde bu yöntem oldukça işe yaramaktadır.  
  
```
.    (şuan bulunduğunuz klasör)
..   (üst klasör)
~    (Home -ev dizini)
-    (önce bulunduğunuz klasör)
```
  
-----
### **ls** - bulunduğum dizini listele  
  
bulunduğunuz klasör içinde veya verdiğiniz hedef klasör içindeki dosya ve dizinleri listeler, çok ilginç ve kullanışlı parametreleri vardır, Linux içinde en çok kullanılan komuttur.  
  
Bulunduğunuz dizinin klasör ve dosyalarını listeler, gizli dosyalar var ise onlar bu varsayılan listelemede yoklardır  
  
linux içinde `.abc` şeklinde olan dosyalar yani ilk harfi nokta `.` olan dosyalar gizli dosyalardır.  
  
Önce hangi klasörde olduğumuza bakalım sonra listeleyelim.  
  
```.term1
pwd
ls
```
  
Bir klasörü listeleyelim (iki tane gizli dosya yaratalım bakalım görebilecekmiyiz)

```.term1
touch /tmp/.gizli1
touch /tmp/.gizli2
ls /tmp
```
yoksa dosyalar oluşmadımı?, bunu anlayabilmek için aynı dizini farklı bir parametre ile listelememiz gerekir.
Tüm dosyaları (gizli olanlar dahil) listelemek için `-a` ile ls komutunu kullanmamız gerekir.

```.term1
ls -a /tmp
```

popüler bir diğer flag ise `-l` flag idir, long anlamına gelmektedir ve dosyaları uzun şekilde ayrıntılı şekilde (izinleri, dosya sahibini, dosya büyüklüğünü, vs çıktıda gösterir)

```.term1
ls -la /tmp
```

Son olarak benim çok fazlaca kullandığım iki flag daha var, bunlardan biri `-t` flagi dir ve tarih bilgisini gösterir. Diğer flag ise `-r` flagidir, çıktıyı tersten sıralamak için kullanılır. yani tüm flagleri birleştirdiğinizde `-ltr` çıkar, uzun şekilde dosyaları tarihe göre sıralar, listenin sonundaki en son güncellenen dosyadır.

```.term1
ls -latr /tmp
```

Bu komutu MS-DOS kullanırken `DIR /OD` şeklinde öğrenmiştim, yıllar içinde çok işime yaradı, özellikle değişen son dosya size bazen dizin içindeki yapılan işlemler hakkında fikir verecektir. Son güncellenen LOG dosyası veya sisteme erişim sağlamış birisinin yarattığı gizli dosya gibi.


son olarak başka bir trick ise dizindeki en büyük dosyaya göre sıralamak, bunun için kullanacağınız flag ise `-S` tir.

```.term1
ls -laSr /tmp
```

MS-DOS içindeyken bu bilgiye `DIR /OS` şeklinde ulaşırdık.

-----
## 6. Dosya görüntüleme ve oluşturma komutları
__(touch, file, cat, tac, less, tail, head)__
  
---
### **touch** - dokun,temas

bir önceki komut gösterimimizde gizli dosya yaratmak için kullandık bu komutu. `touch` komutu dosya yaratmak için kullanılır, basit olarak bir dosya yaratır ve yüksek olasılıkla 644 hakları verir.(Dosyaların izinlerine daha sonra değineceğiz)
Shell üzerinde tanımlı umask hakları ile dosya oluşturacaktır. Varolan bir dosyanın içeriğini değiştirmez sadece oluşturulma zamanını günceller.  

```.term1
touch /tmp/ilkdosyam
```

`touch` komutunun çok fazla bilinmeyen üç parametresi
```
-t Dosya oluşturma zamanı ile dosya oluşur (örn: touch -t 202201011315 /tmp/ilkdosyam [2022 ocak 1 13:15] )
-c dosya yok ise oluşturmayı denemez. scripler içinde çokça kullanılan bir komuttur. sonuç olarak hata üretmez çünkü
-f dosyayı güncellemeye zorlar
```

Linux ta dosya yaratmak için birçok farklı yöntem vardır, `touch` en bilinen ve basit yoludur. yaratılan dosyada 644 hakları vardır

altta alternatif bir dosya yaratma yöntemi görüyorsunuz

```.term1
echo "ilk dosya ici text"> /tmp/ilkdosya
```

Yukarıdaki komut sonrası bir dosya oluşur `/tmp/ilkdosya` ve içeriğinde "ilk dosya ici text" vardır. Oluşan dosya yine tanımlı olan umask hakları ile oluşturulmuştur.
  
---
### **file** - dosya veya klasör tanımla

**Touch** ile dosya yaratmayı gördük, şimdi dosyaların tiplerini nasıl anlayacağımız kısmıma geldik. Windows makinelerde extension dediğimiz nokta sonrası dosya isminde dosyanın türünü gösteriyordu, sanırım hala öyledir. Linux ta durum farklı, isterseniz tabi extension olarak nokta sonrasında birşeyler kullanabilirsiniz veya kullanmaya bilirsiniz, çünkü linux extension tanımaz. Tabii bu durumda dosyaların ne dosyası olduğu (video, resim, data, uygulama) nasıl bileceğiz ? bunun için `file` komutu kullanılır.

**file** bir dosyanın (dizin, pipe, FIFO, socket, özel dosya) olduğunu anlar önce, sonra dosya ise basitçe dosyanın başındaki 512 byte üzerinden bir tanım yapar.

```.term1
file /tmp/ilkdosya
```
  
---
### **cat** concatenate - sıralamak

Dosyaları standart output üzerinden ekrana çıkartan komut. bir veya birkaç dosyayı beraber şekilde çıktı olarak ekranda gösterir, kullanımı oldukça kolaydır fakat Linux içindeki en kullanışlı komutlardan biridir,

Dosyaların içini önce veri ile dolduralım `Burada > redirection işlemini göstermektedir`

```.term1
echo "ilk dosya icerikleri"> /tmp/ilkdosya
echo "ikinci dosya icerikleri"> /tmp/ikincidosya
```

basit kullanımı dosya içeriği görmek için

```.term1
cat /tmp/ilkdosya
```
Örnek olarak iki tane dosyanız olsun ve bunları birleştirmek isteyin

```.term1
cat /tmp/ilkdosya /tmp/ikincidosya >/tmp/ucuncudosya
```
  
---
### **tac** concatenate-reverse - tersten sırala

`cat` komutu ile aynı fakat çıktıları tersten üretmenizi sağlayan bir komut.  **cat** dosyayı baştan sona doğru tararken **tac** dosyayı sondan başa doğru tarar.  

```.term1
cat /tmp/ucuncudosya
```

ve ters çıktı  

```.term1
tac /tmp/ucuncudosya
```

---
### **less** - more komutuna alternatif olarak çıkmıştır, "more or less"

Text (metin) dosyalarını görüntülemek için kullanılır. Çok büyük bir metin dosyası açtığınızı düşünün, mesela `/var/log/apache2/access.log` dosyası zaman içinde büyüyen bir metin dosyasıdır, bu dosyayı cat ile görüntülediğinizde tüm çıktı ekrana gelir ve sizin verinin içersinde gezmenize engel olur. `less` ile istediğiniz gibi text dosyaların içinde gezinebilirsiniz.  

arama yapmak için `/` yazmanız yeterlidir. ayrıca çıkmak için `q` ve dosya başı için `g` dosya sonu için `G` kullanmanız yeterli olacaktır. yukarı aşağı tuşları ve PgUp/PgDown tuşlları navigasyon için yeterli olacaktır.  

Aktif olarak değişen bir dosyayı görüntülüyorsanız  `G` harfine basarak sürekli dosyanın sonuna gidebilirsiniz.  

büyük bir text dosya oluşturmak için

```.term1
tree / > /tmp/ilkdosyam
```

Şimdi oluşmuş dosya içersinde `less` ile gezinelim.

```.term1
less /tmp/ilkdosyam
```
---
### **tail** - kuyruk kısmını oku, peşine takıl

dosyanın sonunu okur ve varsayılan olarak son 10 satır görüntülenir daha fazla satır göstermek için `-n` ile satır sayısı vermelisiniz. tail komutu daha çok dosyalardan canlı olarak çıktıları kontrol etmek için kullanılır. Sürekli olarak dosyanın sonuna eklenen verileri okumak için `-f` parametresini kullanmalısınız(en çok bu parametre kullanılır)  
  
Aklınıza şu soru gelebilir "`Less` varken veya `cat` varken neden bu tip bir komuta ihtiyacımız olsun. tail komutu özellikle çok büyük dosyalarda ve birden fazla dosyanın bir klasör içerinde anlık olarak okunması gerekliğinde çok kullanışlıdır. Ayrıca `multitail` komutu ile kendinize önemli dosyaların dinlediğiniz bir dashboard yapabilirsiniz.  
  
Dosya içindeki son 10 satır görüntülenir  
  
```.term1
tail /tmp/ilkdosyam
``` 
  
Dosya içindeki son 200 satır görüntülenir  
  
```.term1
less -200 /tmp/ilkdosyam
```
veya  

```.term1
tail -n200 /tmp/ilkdosyam
```
aynı sonucu üretecektir.  
  
tail -f kullanımı için sizlere shell içersinde iki komuyu aynı anda nasıl çalıştıracağımızı göstermemiz gerekiyor. Önce dizinler isminde bir dosya oluşturuyoruz, sonra dizinler dosyasına tree çıktısını üretirken tail -f komutu ile dosyayı okumaya çalışıyoruz.. çok hızlı bir çıktı üretecektir  
  
```.term1
touch /tmp/dizinler
tree / > /tmp/dizinler & tail -f /tmp/dizinler
```  

``tail -f`` kombinasyonu inanılmaz derecede işinize yarayacak bir komuttur. birden fazla dosya dinleyebileceğinizi unutmayın. `tail  -f /var/log/nginx/*` size nginx dizini içindeki tüm dosyalara canlı şekilde izleme sağlar.  
  
  
---
### **head** - başlangıç kısmını oku

tail komutu gibi head komutu isminden anlaşılacağı gibi dosyanın başına gider ve parametre kullanmazsanız(varsayılan) ilk 10 satırını ekrana getirir. Genellikle bu komut çok büyük dosyaların ilk satırlarını okumak için kullanılır. örnek olarak log dosyalarının başlarında yazan bilgileri okumak hangi dosyada ilk kaydın nasıl atılmış olduğuna bakmak için kullanılır.


```.term1
head /tmp/ilkdosyam
```
yine istediğiniz gibi görüntülenecek satır sayısını değiştirebilirsiniz

```.term1
head -n200 /tmp/ilkdosyam
```



-----

## 7. Dosya (metin dosyası - txt) işleme komutları
__(cut, paste, expand, unexpand, join, split, sort, tr, uniq, wc, nl, grep)__
  
---
### **cut** - Kes  
Kesme(cut) komutu özellikle script yazarken çok kullanışlıdır, çıktılardan istediğiniz ayıraçlara göre verileri bölebilirsiniz.

Kesme komutu, giriş satırlarının bölümlerini çıkarır ve bunları standart çıktıda görüntüler.
Giriş satırlarından nelerin kesileceğini birkaç yolla belirtebilirsiniz:  
  
**Byte vererek**: `-b` veya `--bytes=` seçeneği ile girdiden belirtilen bayt listesini dosyadan keserler.  
  
**Karaktere Göre**: `-c` veya `--characters=` seçeneği ile belirtilen listeyi keser.
giriş dosyasındaki karakterler. Uygulamada, bu yöntem ve bayt yöntemi genellikle
aynı sonuçları üretir.  

**Alana Göre** `-f` veya `--fields=` seçeneği ile belirtilen alan girdi dosyasından kesilir. Varsayılan değer olarak alanlar satır içersinde sekmeyle ayrılmış olarak kabul edilir. Ancak sınırlayıcı karakteri `-d`, `--delim=` veya `--delimiter=` seçeneğiyle değiştirebilirsiniz.  

burada char, istediğiniz karakterdir alanları sınırlandırmak için kullanılır. CSV dosyasında `,` veya `;` kullanılması gibi.  

Örnek olarak dosyamızda boşluk karakterine göre ayrım yapalım ve ilk sütunu sıralayalım   
```.term1
cut -d ' ' -f 1 sirasiz.txt
```  
şimdide aynı dosyadaki sadece isimleri sıralayalım  

```.term1
cut -d ' ' -f 1 sirasiz.txt
```  

Gördüğünüz gibi buradaki `-d ' '` boşluk delimeter tanımı ile boşluğa göre böl diyoruz sonrasında `-f1` veya `-f 2` ile istediğimiz yerden dosyayı ayırıyoruz.

  
---
### **expand** ve **unexpand**
**expand** Sekmeleri Boşluklara Dönüştürme (tab to space)  
  
Bazen metin dosyaları sekmeler içerir, ancak dosyaları işlemesi gereken programlar sekmelerle iyi başa çıkmaz; veya belki de bir düzenleyicide, sekme için dosyayı oluşturan düzenleyiciden farklı miktarda yatay alan kullanan bir metin dosyasını düzenlemek istersiniz. Bu gibi durumlarda, sekmeleri boşluklara dönüştürmek isteyebilirsiniz. Genişletme komutu bunu yapar. Varsayılan olarak, genişletme, her sekiz karakterde bir sekme durağı olduğunu varsayar.  
  
**unexpand** boşlukları sekmelere dönüştürme (space to tab)  
  
Genişletilmemiş Boşlukları Sekmelere Dönüştürme Genişletme komutu, genişletmenin mantıksal tersidir; birden çok boşluğu sekmelere dönüştürür. Bu, birçok boşluk içeren dosyaların boyutunu sıkıştırmaya yardımcı olabilir ve bir dosya, belirli konumlarda sekmeler bekleyen bir yardımcı program tarafından işlenecekse yardımcı olabilir.  
Expand gibi, unexpand, sekme aralığını her num karakterde bir olacak şekilde ayarlayan -t num veya --tabs = num seçeneğini kabul eder. Bu seçeneği atlarsanız, genişletme, her sekiz karakterde bir sekme durağı olduğunu varsayar.  
  
---
### **join** birleştir  
Birleştirme komutu, dosyalar içindeki belirli alanların içeriklerini eşleştirerek iki dosyayı birleştirir. Alanlar tipik olarak bir satırdaki boşlukla ayrılmış girişlerdir, ancak -t karakter seçeneğiyle alan ayırıcı olarak başka bir karakter belirtebilirsiniz, burada char kullanmak istediğiniz karakterdir. -İ seçeneğini kullanarak karşılaştırma gerçekleştirirken join işleminin durumu yok saymasına neden olabilirsiniz.  
  
Aşağıdaki isimlerin olduğu `1.txt` isimli bir dosyamız olsun  
```
1 Remzi
2 remzi
3 guray
4 necmi
5 tuncay
6 tumay
7 remzi
8 necati
9 guray
10 tuncay 
```  
  
Aşağıdaki verilerin olduğu `2.txt` isimli bir başka dosyamız olsun

```
1 99
2 77
3 66
4 35
5 72
6 46
7 92
8 29
9 19
10 48
```

Aşağıdaki komut ile /tmp klasöründe bu dosyaları oluşturabilirsiniz   

```.term1
cat >> /tmp/1.txt <<EOL
1 Remzi
2 remzi
3 guray
4 necmi
5 tuncay
6 tumay
7 remzi
8 necati
9 guray
10 tuncay 
EOL
cat >> /tmp/2.txt <<EOL
1 99
2 77
3 66
4 35
5 72
6 46
7 92
8 29
9 19
10 48
EOL
```

SQL bilen arkadaşlarımız için buradaki birleştirme işlemi çok anlamlı olacaktır, önce her iki dosyayı görelim ve sonrasında birleşimlerini yeni bir dosyaya yazalım, yeni dosyamızın adı 3.txt olsun.  
  
1.txt dosya çıktısı aşağıdaki gibi    
```.term1
cat /tmp/1.txt
```
2.txt dosya çıktısı aşağıdaki gibi  
```.term1
cat /tmp/2.txt
```
3.Her iki dosyanın birleşimi aşağıdaki gibi 3.txt yazılır 
```.term1
join /tmp/1.txt /tmp/2.txt > /tmp/3.txt
```
4.Her iki dosyanın birleşimini stdout üzerinden ekrana yazmak icin  
```.term1
join /tmp/1.txt /tmp/2.txt
```
  
  
Burada dosyaların her satırdaki sayıları index olarak aldıklarını unutmayalım, en soldaki sayı sütunu farklı olursa o satırlar birleşmeyecektir.  
  
---
### **paste** - Yapıştır 
ismindende anlaşılacağı gibi, satır satır ilk dosyanın üzerine ekleme yapılır. 

önceki örnekten gidecek olursak,
```.term1
paste /tmp/1.txt /tmp/2.txt
```

Gördüğünüz gibi birinci dosyanın her satırına ikinci dosyanın aynı satırı eklenir. Bu çıktıyı dosyaya yazarak yeni bir dosya oluşturabilirsiniz.


### **split** - metin dosyasını parçalara böl  
Bölme(split) komutu bir dosyayı iki veya daha fazla dosyaya bölebilir. Bu bölümde açıklanan metin işleme komutlarının çoğundan farklı olarak, bu komut bir çıktı dosya adı - veya daha doğrusu, alfabetik bir kod eklenmiş bir çıktı dosya adı öneki girmenizi gerektirir. Normalde, tek tek dosyaların ne kadar büyük olmasını istediğinizi de belirtmelisiniz:  
  
**Baytlarla Böl**: `-b`  veya `--bytes=boyut` parametresi ile kullanılır, girdi dosyasını verilen bayt parçalarına böler. Bu seçenek, dikkat edilmezsse dosyayı Orta Satır'a bölme sonucuna neden olabilir.   
**Satır Boyutlu Parçalarda Baytlara Göre Böl**: Bir dosyayı, `-C` veya `--line-bytes=size` seçeneğini kullanarak bölebilirsiniz. dosyalar arasında satırları bölmeden belirtilen boyuttan büyük olmayan dosyalara bölebilirsiniz. (Satır uzunluğu boyuttan büyükse, satırlar yine de dosyalar arasında bölünecektir.)  
**Satır Sayısına Göre Böl**: `-l` veya `--lines=` satır sayısına göre bölme. Dosyayı belirtilen satır sayısından fazla olmayan parçalara böler.  

her iki satır için ayrı bir dosya yaratması için aşağıdaki komutu verebiliriz.

```.term1
cd /tmp
split -l 2 sirasiz.txt ikili-
```
bu sayede ikili-aa ... şeklinde 5 tane dosya oluşacaktır. her bir dosyanın içinde sadece iki satır bulunur. 

Çok büyük dosyalar ile uğralırken onları bazen parçalara bölmek istersiniz, bu durumlar için vazgeçilmez bir komuttur.  
  
Herhangi bir varsayılan belirtmezseniz (`ikili-` yazmazssanız), sonuç, x (xaa, xab vb.) İle başlayan adlarla bölünür. Ayırıcı bir bilgi vermezsseniz (`-l 2` yazmassanız) 1000 satırlık parçalara bölünmüş çıktı dosyaları oluşur. Bir giriş dosya adı belirtmezseniz, bölme (stdin) standart girişi kullanır.  
  
---
### **sort** - sırala  
Bazen sıralamak istediğiniz bir çıktı dosyası oluşturursunuz. Dosyanızı sıralayabilmek için, sort (sıralama) isimli bir komutu kullanabilirsiniz.  
Bu komut, aşağıdakiler de dahil olmak üzere çeşitli şekillerde sıralama yapabilir: 
  
**Büyük/Küçük Harf Yoksay**: Normalde, sıralamayı ASCII değerine göre sıralayın, bu da büyük ve küçük harfleri birbirinden ayırır. -F veya --ignore-case seçeneği sıralamanın büyük / küçük harf kullanımını göz ardı etmesine neden olur.  
**Ay Sıralama -M veya --month-sort seçeneği**: programın üç harfli ay kısaltmasına göre (JAN'dan DEC'e) sıralama yapmasına neden olur.  
**Sayısal Sıralama**: -n veya --numeric-sort seçeneğini kullanarak sayıya göre sıralayabilirsiniz.  
**Ters Sıralama Düzeni**: -r veya --reverse seçeneği ters sırada sıralar.  
**Sırala Alanı vererek sıralama**: Varsayılan, sıralama alanı olarak ilk alanı kullanmaktır. `-k`  veya `--key=alan` seçeneği ile başka bir alan belirtebilirsiniz. (Alan, birden çok alana göre sıralamak için virgülle ayrılmış iki numaralı alan olabilir.)   
  

```.term1
cat >> /tmp/sirasiz.txt <<EOL
1 Remzi
8 remzi
3 guray
2 necmi
10 tuncay
4 tumay
7 remzi
6 necati
9 guray
5 tuncay 
EOL
```
  
`/tmp/sirasiz.txt` dosyasını sıralayalım

```.term1
sort /tmp/sirasiz.txt
```

gözümüze bir terslik çarptı değilmi, varsayılan olarak metin bilgisine göre sıraladığı için 10 değerini ilk olarak yukarıda getirdi, sayısal değerlere göre sıralayabilmek için sort komutunu `-n` parametresi ile çalıştırmalıyız.

```.term1
sort /tmp/sirasiz.txt -n
```
aynı sıralamayı isimlere göre yapmak için ise `-k` alanı vermeliyiz, bu durumda aşağıdaki komut geçerli olur.  

```.term1
sort /tmp/sirasiz.txt -k2
```
gördüğünüz gibi, çıktımız isimlere göre sıralandı.

>``sort komutu Linux üzerinde birçok farklı yerde işinize yarayacaktır, mutlaka anlamanızı tavsiye ederim, ls komutu veya find komutu ile birleştirip yapabileceklerinizi düşünün lütfen.!!``
  
---
### **tr** transform - dönüştür  
Tr komutu, tek tek karakterleri standart girdiden değiştirir.
Kullanım şekli:

tr [seçenekler] KUME1 [KUME2]

Bir grupta (KUME1) değiştirilmesini istediğiniz karakterleri ve ikinci grup (KUME2) olarak değiştirilmesini istediğiniz karakterleri belirtirsiniz. KUME1'deki her karakter, KUME2'deki eşdeğer konumdaki bir karakterle değiştirilir. 

İşte Listeleme kullanan bir örnek
```.term1
cd /tmp
cat sirasiz.txt
tr gizn 912 <sirasiz.txt
```

Gördüğünüz gibi `g`, `i` ve `z` harfleri için sırasıyla 9,1 ve 2 karakterlerine dönüştü. Burada `n` için yine 2 karakteri ile değişiklik olduğunu gözlemleyebiliriz.

Tr komutu, bu örnekteki giriş yeniden yönlendirmesinin (<) nedeni olan standart girişe(stdin) dayanır. Metin dosyasını komut tarafından okutmanın tek yolu budur.   

  
---
### **uniq**  unique - benzersiz olan satırları gösterir
isminden de anlaşılacağı gibi unique (benzersiz) demektir. Yenilenen satırları kaldırır. Benzer olan satırları eler ve sadece 1 defa gösterir. SQL biliyorsanız, "Select distinct" şeklinde yazmış olduğunuz query ler ile aynı anlamdadır. Sort ile beraber kullanmanız gerekir, böylece önce dosya içeriğini sıralamış olursunuz.

Örnekler için kullandığımız dosyamız ile devam edelim.

```.term1
cut -d ' ' -f2 sirasiz.txt |sort|uniq
```
Gördüğünüz gibi `sirasiz.txt` dosyası içindeki önce cut ile boşluktan sonraki isimleri aldık, sonrasında isim bilgilerini sort ile küçükten büyüğe doğru sıraladık. uniq komutu ile tekrarlanan satırları sildik, böylece dısyamızdaki tekrarlı isimler kalktı ve sadece 7 satır isim geldi.
  
---
### **wc** kelime say
wc (word count) yani kelime sayımı anlamına gelir, genelde bir dosyadaki satır sayısı veya stdout içinde üretilmiş bir satır sayısını bulmanıza yarar. buluncuğunuz klasörde kaç dosya olduğunu bulmak için kullanabilirsiniz  
  
```.term1
ls -1 |wc -l
```
  
YENISATIRSAYISI | KELİME SAYISI | BYTE SAYISI şeklinde 3 rakam çıktı olarak gelir.  

biraz önce yazdığımız komuttaki satır sayılarını kıyaslayabiliriz.

önce sirasiz.txt dosyasındaki toplam satır sayısını görelim  
```.term1
wc sirasiz.txt
```

şimdide tekrarlanan satırların çıkarıldığında kaç satır olduğunu görelim `-l` çıktıları sadece yeni satır sayısı ile sınırlandırır  

```.term1
cut -d ' ' -f2 sirasiz.txt |sort|uniq |wc -l
```

---
### **nl** number lines - satırlara sayı ver
Bu komutla bir dosyanın satırlarını numaralandırabilirsiniz. Kedi satırı numaralandırma seçenekleri sınırlıdır, bu nedenle karmaşık satır numaralandırma yapmanız gerekiyorsa, nl kullanabileceğiniz en kolay araçtır.  
En basit haliyle, cat -b'nin ulaştığı aynı hedefi gerçekleştirmek için tek başına nl'yi kullanabilirsiniz.  
  
```.term1
nl sirasiz.txt
```
gördüğünüz gibi en sol sütunda sıralı bir şekilde satırlara sayı eklendi. Özellikle çıktınıza index oluşturmak isterseniz çok kullanışlıdır.  
  
---
### **grep** - genel filtreleme

Linux işletim sisteminde en fazla kullanılan ilk 3 komuttan biridir (ls,grep,cd). istediğiniz bir karakteri veya kelimeyi aramanıza yarar. Arama yapacağınız veri kaynağı bir dosya olabilir veya Stdout alınan bir veri olabilir.

Grep komutu son derece kullanışlıdır. Belirli bir dizeyi içeren dosyaları arar
ve dosyanın adını ve (bir metin dosyasıysa) bu dizge için bir bağlam satırı döndürür.
temel grep sözdizimi aşağıdaki gibidir:

grep [seçenekler] regexp [dosyalar]

Regexp, az önce açıklandığı gibi normal bir ifadedir. Grep komutu çok sayıda seçeneği destekler. Yaygın seçeneklerden bazıları, programın dosyaları arama şeklini değiştirmenize olanak tanır:

**Eşleşen Satırları Sayma** Bağlam çizgilerini görüntülemek yerine, `-c` veya `--count` seçeneğini kullanırsanız grep, belirtilen desenle eşleşen satır sayısını görüntüler.  

**Bir Kalıp Girdi Dosyası Belirtin** `-f` veya `--file=` seçeneği ile, bu sayede aranan kalıp girdisini komut satırı yerine belirtilen dosyadan alır.  

**Büyük / Küçük Harf Yoksay** -i veya --ignore-case seçeneğini kullanarak, varsayılan büyük/küçük harfe duyarlı arama yerine büyük/küçük harfe duyarlı olmayan bir arama yapar.  

**Recursive Arama** -r veya --recursive seçeneği ile belirtilen dizinde ve tüm alt dizinler içersinde bu aramayı yapar. Yerine `rgrep` kullanabilirsiniz.  

**Genişletilmiş  Grep komutu** varsayılan olarak aranan ifadeyi normal ifade olarak yorumlar ve arar. Genişletilmiş ifade kullanmak için `-E` veya `--extended-regexp` seçeneğini kullanmanız gerekir. Alternatif olarak, grep yerine egrep'i kullanabilirsiniz.  

Örnek olarak /etc dizini altında içersinde `user` geçen dosyaları görmek istersek aşağıdaki komut ile bunu sağlayabiliriz. `-r` recursive, yani alt dizinlerde de ara demektir.  

```.term1
grep user /etc -R
```

regexp anlamak için örnek dosyamızı kullanarak bir arama yapalım. 

necmi veya tumay isimlerini arayalım önce
```.term1
grep -E -i -w 'necmi|tumay' /tmp/sirasiz.txt
```

ilk harfi küçük veya büyük Remzi ismindeki herkesi arayalım

```.term1
grep '[rR]emzi' /tmp/sirasiz.txt
```
  
etc klasöründeki tüm IP'leri aramak için ağağıdaki komutu yazabilirsiniz.  
  
```.term1
egrep '[[:digit:]]{1,3}\.[[:digit:]]{1,3}\.[[:digit:]]{1,3}\.[[:digit:]]{1,3}' /etc -r
```

Dosyalar içinde arama yapmak gibi kurulu programlar arasında bir program örn." lib" aramak için  
  
debian/Ubuntu:  
```.term1
dpkg -l | grep lib
```  
Centos/Redhat:  
````
rpm -qa | grep lib
````

Yazdığınız yazılım içindeki `#` ile yazılmış olan commentlerden arındırmak için
````
grep –v “#”  /srv/data01/live/app01/myapp.php
````

Klasörler içinde arama yapıp dosyalar rafine edilebilir, örnek olarak 'docx' dosyalar içersinde 'notlar' isminde bir dosya arıyor olalım fakat dosya adı içinde 'okul' kelimesi bulunmasın.

find . –name “*.docx” | grep –i notlar | grep –vi "okul"  
  
sistemde bir hata oldu ve aldığınız hatadan önceki satırlarla birlikte çıktıyı görmek istiyorsunuz  

`-B` Before anlamına gelir ve önceki 4 satırla birlikte çıktıyı gösterir  
````
grep -B 4 /var/log/messages
````  
  
`-A` Aefore anlamına gelir ve sonraki 2 satırlarla birlikte çıktıyı gösterir  
````
grep -A 2 /var/log/messages
````  
  
`-C` Before&After anlamına gelir ve önceki ve sonraki satırlarla birlikte çıktıyı gösterir  
````
grep -C 2 /var/log/messages
````

Sıkıştırılmış dosyalar içersinde grep komutu çalışmaktadır örnek olarak  
````
zgrep –i error /var/log/syslog.2.gz
````

> 
``` Eğitim içersinde grep komutunu oldukça kısa işledik, Sistem Yönetimi konusunda uzmanlaşmak isteyen arkadaşlara tavsiyem bu konuda internette kısa bir arama yapmaları. Grep Linux kullanacak kişiler için çok önemlidir, bildiğiniz gibi Linux metin tabanlı bir işletim sistemi ve metin tabanlı işlemler yaparken grep gibi bir araç sizin için işleri inanılmaz kolaylaştıracaktır.
```

-----

### **sed** Stream Edit - Akış değiştir  
Sed komutu, değiştirilen dosyayı standart çıktıya göndererek doğrudan dosyaların içeriğini değiştirir.  

iki şekilde kullanımı olabilir:  
  
sed [seçenekler] -f komut dosyası [giriş-dosyası]  
sed [seçenekler] script-text [input-file]  
  
Her iki durumda da, giriş-dosyası, değiştirmek istediğiniz dosyanın adıdır. Değişiklikler
kısaca gösterildiği gibi, bir şekilde kaydetmedikçe sadece ekrana (stdout) yansır.

Önceki örnekten dosyadan devam edecek olursak `/tmp/sirasiz.txt` , bu durumda çıktıyı necati ismi yerine Fecati ismi ile değiştirirsiniz. Dosya kaydedilmez, `-i` parametresi ile çalıştırırsanız dosya içersinde değişiklik olur.  

!! Çok önemli, -i parametresinin geri dönüşü yoktur, -i kullanımı öncesi mutlaka iyi kontrol yapmanızı öneririm, yada daha doğru bir yöntem çıktı ile yani bir doya oluşturmaktır.  
  

```.term1
sed 's/necati/Fecati/g' sirasiz.txt
```

 >
 ````Sed komutu sıklıkla kullandığım bir komuttur ve genellikle yazdığım scriptler içersinde faydalanırım. Çok güçlü bir komuttur ve TB büyüklüğünde dosyalarda bile inanılmaz hızlı sonuç almanızı sağlar. Özellikle script kullanımı için ve Metin dosyalarının güncellenmesi için değişik varyasyonlarını nasıl kullanabileceğinizi kontrol etmenizi öneririm.
````
  
---
## 8. Dosya işlemleri için komutlar
_(cp, mv, mkdir, rm, rmdir, ln)_  
  
---
### **cp** copy - kopyala işlemi
Linux altında kopyalama işlemi için `cp` komutu kullanılır. Özellikle dosyaları kopyalarken hangi hak ve yetkiler ile kopyalayacağınız, bunları korumak isteyip istememeniz çok önemlidir. Ben kopyalama diye herzaman hak ve yetkiler ile kopyalamayı anladığım için `-rp` parametresini sıklıkla kullanırım.  


Kullanım şekli:  
cp (parametreler) kaynak hedef  
  
kullanım örnekleri:  

Basit bir kopyalama  
```.term1
cp /tmp/sirasiz.txt /tmp/kopyala1.txt
```  
  
a klasörünü b klasörüne kopyalayacaksak, önce klasör a oluşturulup içine abc.txt dosyası oluşturuluyor. Sonrasında dosya b klasörüne dosyalar ile birlikte kopyalanıyor.  

```.term1
mkdir -p /tmp/a
touch /tmp/abc.txt
cp -r /tmp/a /tmp/b
```
  
---
### **mv** move - taşı veya rename - isim değiştir

Belirtilen klasör ve dosyanın adını değiştirmeye veya taşımaya yarar. Tahmin edemeyeceğiniz kadar güçlü ve problemli bir komut olabilir. MV işlemi sırasında permissionlar ve dosyaların sahiplikleri ortam parametreleri `environment` ile tanımlı parametrelere göre değişebilmektedir.  

kullanımı:
mv kaynak hedef

veya

mv eskiAd yeniAd 

Önce bir dosya yaratalım `tasibeni`

```.term1
touch /tmp/tasibeni
```

Şimdi de dosyayı taşıyalım

```.term1
mv /tmp/tasibeni /tmp/tasinandosya
```

aynı klasör içinde dosyanin ismi `tasibeni`den `tasinandosya` şeklinde yeniden adlandırılmış oldu. Hedef klasör olarak farklı klasör ve yol verdiğinizde dosya taşınmış olacaktır.

  
---
### **mkdir** make directory - klasör yap

Belirtilen dizin içinde klasör yaratmak için kullanılır, klasörü yaratırken üst klasörlerin olduğu varsayılır, üst klasörlerle beraber tek komutta birçok altklasör yaratmak için -p flag'i ile kullanılmalıdır

Tek klasör yaratmak için

```.term1
mkdir /tmp/ilkklasor
```

tek seferde birçok altklasor yaratmak icin
```.term1
mkdir -p /tmp/cokluklasor1/cokluklasor2/alt1/alt2/alt3
tree /tmp
```
burada bir seferde tüm klasörler yaratılmıştır, en sonda bulunan alt3 klasoru olana kadar diğer klasörler de yaratılmıştır. Tree komutu ile dizin yapısını görebiliyoruz.
  
---
### **rm** remove - sil
dosya silmek için kullanılır, dosyalar geri dönüşümü olmaksızın silinirler. ayrıca klasörelerin içi boş değilse klasör silmek için de kullanılır.

kullanımı için klasörde olmanız gerekir veya relative path vererek bunu yapabilirsiniz.

Önce yarattığımız alt dizine `dosya1.silbeni` ve `dosya2.silbeni` isimli iki dosya yaratalım ve oluşturma tarihi olarak 1 ocak 2020 saat 19:00 verelim.  

```.term1
touch -t 202001011900 /tmp/cokluklasor1/cokluklasor2/alt1/alt2/alt3/dosya1.silbeni
touch -t 202001011900 /tmp/cokluklasor1/cokluklasor2/alt1/alt2/alt3/dosya2.silbeni
```
  
```.term1
cd /tmp/cokluklasor1/cokluklasor2/alt1/alt2/alt3/
rm dosya1.silbeni
```
veya klasöre gitmeden reletive path vererek bu silme işlemini yapabilirsiniz.  

```.term1
cd
rm /tmp/cokluklasor1/cokluklasor2/alt1/alt2/alt3/dosya2.silbeni
```

rm en çok komutunda kullanılan parametreler
```

rm -f   zorla sil komutudur, dosyayı silme yetkiniz var ise uyarı flag'i açık olsa bile "-i" uyarı vermeden siler
rm -i   silme işlemi yapmadan önce uyarı verir, bazı işletim sistemlerinde (Centos) default alias olarak tanımlı geldiği için her silme işleminde uyarı alabilirsiniz
rm -rf  zorla ve uyarı vermeden tüm alt klasörler ile birlikte sil komutu. En güçlü silme komutudur

```
  
---
### **rmdir** remove directory - klasör sil

Belirtilen klasörü silme komutudur. Çok daha az kullanılan bir komuttur, çünkü klasör boş değilse klasörü silmez.
kullanımı oldukça basittir

```.term1
rmdir /tmp/ilkklasor
```

klasör boş değil ise ve tüm alt klasörlerle birlikte silmek istiyorsanız, aşağıdaki rm komutunu aşağıdaki gibi kullanabilirsiniz.
Burada -r (veya -R, Root-Kök ile birlikte demektir) parametresi tüm alt klasörleri silmesini ister, f parametresi ise her simle öncesi soru sormaması içindir.

```.term1
rmdir /tmp/cokluklasor1
```
alt klasörleri olduğu için rmdir komutu ile `cokluklasor1` dizinini silemezssiniz. `rm -rf` komutunu kullanmanız gerekir

```.term1
rm -rf /tmp/cokluklasor1
```
  
---
### ln link - bağlantı, kısayol  
Linux, makinenizdeki başka bir dosya veya klasöre işaret eden bağlantılar(link) veya sembolik bağlantılar(symbolic link) oluşturmanıza olanak tanır. Bu bağlantıyı kurmak için `ln`  komutunu kullanmanız gerekir. Bu yöntemin dışında, sembolik bağlantılar oluşturabilen bazı grafik dosya yöneticileri de vardır.
  
#### Sembolik Bağlantılar(symbolic link) Nelerdir?
Sembolik bağlantılar temelde gelişmiş kısayollardır. Oluşturduğunuz sembolik bir bağ, yalnızca bir bağlantı olsa bile, işaret ettiği orijinal dosya veya klasörle aynı görünecektir. Windows üzerinde bir programa kısayol oluşturmanız ile aynı şeydir.  
  
Örneğin,  Mysql programı için varsayılan klasör /var/lib/mysql klasörüdür, fakat siz bu klasörde işlem yapmak istemiyorsunuzdur. Verilerinizi /srv/data01/mysql klasörü altında tutmak istiyorsunuz. İki seçeneğiniz var, mysql varsayılan ayarlarından `/etc/mysql/mysql.conf` içersinde data dizini olarak yeni klasörü tanımlayabilirsiniz. Yada verilerinizi /srv/data01/mysql altına kopyalar ve /var/lib/mysql dizini altına bir sembolik link yaratırsınız.  
  
örnek kurulum debian içinse,  

  
```
"Senaryomuzda SSD bir diskiniz var ve mysql datalarınızı onun üzerinde çalıştırmak istiyorsunuz"  
"1. disk bağlayacağımız klasörü oluşturuyoruz"  
mkdir /srv/data01  
  
"2. Bağlı bulunan SSD disk /dev/sdc olduğunu varsayıyoruz"  
mkfs.ext4 /dev/sdc  
  
"3. yeni disk fstab içersinde tanımlanıyor"  
echo "/dev/sdc  /srv/data01 ext4 defaults,discard 0 0"  
  
"4. yeni disk mount ediliyor"  
mount /dev/sdc  
  
"5. mysql kapatılıp veriler yeni disk üzerinde kopyalanır"  
systemctl stop mysql/mariadb  
cp -rp /var/lib/mysql /srv/data01/  
  
"6. eski mysql klasörü yedeklenir ve eski lokasyona sembolik link yaratılır"  
mv /var/lib/mysql /var/lib/mysql-old  
ln -s  /srv/data01/mysql /var/lib/mysql  
  
"7. yeni klasördeki mysql çalıştırılır"  
systemctl start mysql veya systemctl start mariadb
```  

Dosyalara ve dizinlere bağlantılar oluşturabilir ve farklı bölümlerde ve orijinalinden farklı bir inode numarasıyla bağlantılar (kısayollar) oluşturabilirsiniz.

Gerçek kopya silinirse, bağlantı çalışmayacaktır.
  

#### "kalıcı bağlantı"(Hard Link)   
  
"sembolik bağlantılara" ek olarak, bunun yerine bir "kalıcı bağlantı"(Hard Link) oluşturabilirsiniz. HardLink dosya sistemindeki bir inode işaret eder, SoftLink ise alias tanımı gibidir, ben ABCDE yazdığımda beni /ab/cd/e ye götür demek gibidir. Sabit bağlantılar yalnızca dosyalar içindir; farklı bir inode numarasına sahip farklı bir disk bölümündeki bir dosyaya bağlanamazsınız.  
  
Gerçek kopya silinirse, bağlantı çalışacaktır çünkü gerçek kopyanın erişmekte olduğu temel verilere erişmektedir.  
  
Hangisini kullanacağınızdan emin değilseniz, genellikle "yumuşak bağlantılar" olarak da bilinen standart sembolik bağlantıları kullanmalısınız.  
  
Hard link yaratmak için `-s` parametresini kullanmayız, böylece hard link oluşur.  
  
  
---
## 9. Dosya dizin bulma ve erişim yönetimi 
__(tree, find, chown, chmod, chgroup, whatis, which, exit)__

**Dosyalar, yapıları ve erişim yetkilerini anlatıyoruz burada**
  
---
### **Tree**

Bulunduğunuz klasörü ve dizin yapısını gösterir, Tree ingilizce ağaç demektir. dizinler ve altdizinler hakkında fikir edinmenizi sağlar.

kullanım şekli

tree [hangi dizin] [parametre]

sıklıkla kullanılan parametre -L (Level, Seviye) parametresidir, çünkü bilgisayardaki dizinlerin listesi çok uzun olabilir. L ile kaç seviye ilerlemeniz gerektiğini belirtebilirsiniz.

Örnek olarak

```.term1
cd /
tree /usr -L 1
```

aynı komutu parametre olmadan çalıştırırsanız çıktıyı almanız çok daha uzun sürecektir.

```.term1
cd /
tree /usr
```
---
### **find** - bul

ismindende anlaşılacağı gibi bulmak istediğiniz dosyaları/dizinleri bulmanıza yarar. Linux üzerinde kullanımını mutlaka öğrenmeniz gereken komutlardan biridir.

Unix benzeri işletim sistemlerinde en önemli ve en sık kullanılan komut satırı yardımcı programlarından biridir. Bul komutu, bağımsız değişkenlerle eşleşen dosyalar için belirttiğiniz koşullara göre dosya ve dizinlerin listesini aramak ve bulmak için kullanılır.

Bul, dosyaları izinlere, kullanıcılara, gruplara, dosya türüne, tarihe, boyuta ve diğer olası kriterlere göre bulabileceğiniz gibi çeşitli koşullarda kullanılabilir.

Kullanım şekli:  
  
find [nereden başlayayım] [nasıl birşey bulacam] [-opsiyonlar] [ne bulacağım]  

Örnekler  
  
**/usr klasörü altında `share` isminde dosya veya klasör aramak için**

```.term1
cd /usr
find . -name share
```

veya  

```.term1
find /usr -name share
```

**/usr klasörü altında `share` diye başlayan herşey, bulun**

```.term1
find /usr -name share*
```
burada wildcard `*` kullanarak "share ile başlasın sonu nasıl biterse bitsin" demiş oluyoruz.

**/usr klasörü altındaki share ile başlayan dosyaları bulun**

```.term1
find /usr -type f -name share*
```

klasör için `type d` parametresini kullanmamız gerekir

```.term1
find /usr -type d -name share*
```

**root kullanıcısına ait .txt uzantılı tüm dosyaları bulun**

```.term1
find / -user root -iname "*.txt"  
```

burada kullandığımız `iname` büyük/küçük harf ayrımı yapmayacak (case insensitive) şekilde arama yapar

**son 2 saatte değişikliğe uğramış tüm dosyaları bulun**

```.term1
find / -mmin -120
```

**son 90 günde erişilmiş dosyaları listele**

find / -atime 90

**Disk üzerindeki 1000MB 'tan büyük dosyaları bulun ve silin**
>  Dikkat! bu tür silme işlemleri geri dönüşü olmayan işlemlerdir, find komutunu exec parametresi ile kullanmadan önce mutlaka excec olmadan çalıştırın ve nasıl bir çıktıya işlem yapacağını görün.

```.term1
find / -type f -size +1000M -exec rm -f {} \;
```

**Bilgisayarınızdaki tüm 10 MB'tan büyük olan xlsx dosyaları bulun ve silin.**


```.term1
find / -type f -name *.xlsx -size +10M -exec rm {} \;
```

**İpucu** bazen çıktıları bir dosyaya alıp incelemek daha kolay olabilir, ben zaman zaman ne arayacağımdan emin olmadığımda bunu yaparım.
```.term1
find . >/tmp/findout.txt
```

sonra less ile görüntüleyebilirsiniz
```.term1
less /tmp/findout.txt
```
---
### Dosyalara erişim ve kullanıcı hakları.
_(chown, chmod, chgroup)_

Öncelikle bir dizin içine gidip dosyaları listeleyelim (long opsiyonu ile)

```.term1
cd /etc
ls -l
```

gördüğünüz liste içersindeki dağılım ve anlamları aşağıdaki gibidir.  

<center><img src="{{site.baseurl}}/images/permission-explain.png"></center>  
  
---
### **chown ve chgrp** Change Owner/Change Group - Kullanıcı Gurup Değiştir

Kullanıcı sahipliğini değiştirir,

Kullanım şekli,


chown kullanıcı-adı dosya
chown kullanıcı-adı:sahip-olan-gurup dosya
chown kullanıcı-adı:sahip-olan-gurup klasör
chown [parametreler] kullanıcı-adı:sahip-olan-gurup dosya

Örnek kullanım

önce bir dosya yaratalım

```.term1
cd /tmp
touch hakdeneme.txt
```

dosyanın haklarına bakalım

```.term1
ls -l hakdeneme.txt
```

dosyanın kullanıcısını değiştirelim, sistem de  `sys` isimli bir sistem kullanıcısı vardır, dosyamızın sahipliğini ona çevirelim

```.term1
chown sys hakdeneme.txt
``` 

aynı şekilde gurup değişikliği de `chgrp` komutu ile yapılır.

```.term1
chgrp sys hakdeneme.txt
```

dosyayı tekrar listelediğimizde yetkilerinin değiştiğini görürüz.

```.term1
ls -l hakdeneme.txt
```

tek bir seferde gurup ve kullanıcı değişikliğini yapabiliriz araya `:` koyduğumuzda `kullanıcı:gurup` şeklinde yetki verecektir
```.term1
touch hakdenemetek.txt
ls -l hakdenemetek.txt
chown sys:sys hakdenemetek.txt
ls -l hakdenemetek.txt
```
  
---
### **chmod** Change Mode - Erişim Yetkisini Değiştir
<center><img src="{{site.baseurl}}/images/permission-change.png"></center>


testimiz için dosyamızı oluşturalım ve yetki verelim  
```.term1
echo "test file" > /tmp/ornek.txt
chmod 777 /tmp/ornek.txt
```
Chmod komutu, bir dosya veya klasördeki dosya izinleri bayraklarını ayarlar. Bayraklar dosyayı kimin okuyabileceğini, yazabileceğini veya çalıştırabileceğini tanımlar. Dosyaları -l (``ls -l``) seçeneğiyle listelediğinizde, şuna benzeyen bir karakter dizisi görürsünüz.  
  
-rwxrwxrwx  

```.term1
ls -l /tmp
```

İlk karakter a ise - öğe bir dosyadır, eğer bir d ise öğe bir dizindir. Dizenin geri kalanı üç karakterlik üç settir. Soldan ilk üçü, sahibin dosya izinlerini, ortadaki üçü grubun dosya izinlerini ve en sağdaki üç karakter diğerlerinin izinlerini temsil eder. Her kümede, bir r okuma, bir w yazma ve bir x yürütme anlamına gelir.

R, w veya x karakteri varsa, bu dosya izni var demektir. Harf yoksa ve onun yerine bir - görünürse, bu dosya izni yok demektir.

``Chmod``'u kullanmanın bir yolu, sahibine, gruba ve diğerlerine vermek istediğiniz izinleri 3 basamaklı bir sayı olarak sağlamaktır. En soldaki rakam, sahibi temsil eder. Ortadaki rakam grubu temsil eder. En sağdaki rakam diğerlerini temsil eder. Kullanabileceğiniz rakamlar ve neyi temsil ettikleri burada listelenmiştir:
  
0: İzin yok  
1: İzni uygula  
2: Yazma izni  
3: Yazma ve yürütme izinleri  
4: Okuma izni  
5: İzinleri okuyun ve çalıştırın  
6: Okuma ve yazma izinleri  
7: Okuma, yazma ve yürütme izinleri  

ornek.txt dosyamıza baktığımızda, üç karakter setinin de rwx olduğunu görebiliriz. Bu, herkesin dosya üzerinde okuma, yazma ve yürütme haklarına sahip olduğu anlamına gelir.

Sahip için okuma, yazma ve çalıştırma (listemizden 7) iznini ayarlamak için; grup için okuyun ve yazın (listemizden 6); ve chmod komutuyla 765 rakamlarını kullanmamız gereken diğerleri için okuyun ve çalıştırın (listemizden 5):

```.term1
chmod -R 765 /tmp/ornek.txt
```

Burada kullandığımız -R parametresi dosya/dizin ve alt dizinlere de aynı erişim yetkilerini tanımlamamızı sağlar.  

#### Sticky Bit nedir
Dosyalar veya dizinler üzerinde "yapışkan bit" tanımladığınızda diğer tüm yetkiler yok sayılır. Normalde dizinler için, kullanıcının dizinin, dosyanın sahibi olmadığı veya kök olmadığı sürece, kullanıcıların içerdiği dosyaları silmelerini ve hatta yeniden adlandırmalarına izin vermez fakat sticky bit tanımlarsanız, her türlü değişiklik yapılabilir. 
  
$ chmod o+t [dizin_adı]

veya  

$ chmod 1755 [dizin_adı]

 /tmp dizini sticky bit kullanımı için tipik bir örnektir. Herkes buradaki dosyaları siler ve yazabilir.  
  
-----
## 10. Dosya Arşivleme komutları
__dd, tar, cpio, gzip, gunzip, bzip2, xz__
  
---
### dd data dublicator - Veri Çoklayıcı
**dd** komutu, "veri çoğaltıcı" anlamına gelir ve verileri kopyalamak ve dönüştürmek için kullanılır. Linux'un çok güçlü, düşük seviyeli bir yardımcı programıdır ve çok daha fazlasını yapar, her Linux Sistem Yöneticisi için vazgeçilmez bir araçtır.  
Peki neler yapabilirsiniz?   
  * Tüm sabit diski veya bölümü yedekleyebilir veya geri yükleyebilirsiniz.
  * MBR Yedeklemesi (Disk bölümleme ve Önyükleme Bilgisi) - 512 Byte
  * Manyetik bant formatını kopyalayabilir ve dönüştürebilir, ASCII ve EBCDIC formatları arasında dönüştürme yapabilir, baytları değiştirebilir ve ayrıca küçük harfleri büyük harfe dönüştürebilirsiniz.
  * Önyükleme imajları oluşturmak için, Linux çekirdeği oluşturma dosyaları tarafından kullanılır.
  * güvenlik için bir disk içeriğini şifreleyebilir, şifreli kaydedebilirsiniz.
  * Uzak bir donanıma şifrelenmiş şekilde imaj verisi kopyalayabilirsiniz
  * ...

Kullanım şekli:  

dd if=``KAYNAK_DOSYA`` of=``HEDEF_DOSYA`` [Parametreler]

**Tüm sabit diski yedeklemek için**  
```.term1
dd if=/dev/sda1 of=/tmp/yedek-sda1.img 
```

**Tüm sabit diski sıkıştırarak yedeklemek için**  
```.term1
dd if=/dev/sda1 |gzip -c > /tmp/yedek-sda1.img.gz
```
**yedeklenmiş bir diski geri yüklemek**
```.term1
dd if=/tmp/yedek-sda1.img of=/dev/sda1
```

**sıkıştırılmış yedeği geri yüklemek**
```.term1
gzip -dc /tmp/yedek-sda1.img.gz | dd of=/dev/sda1
```


**A bilgisayarındaki /dev/sda1 diskini, uzaktaki B bilgisayarına /dev/sdc2 yazmak**  
``A:/dev/sda1 -->> B:/dev/sdc2``  

```.term1
dd if=/dev/sda1 | gzip -1 - | ssh root@uzak-bilgisayar dd of=/dev/sdc2
```

**Bu işlemi yaparken `pv` isimli program ile kopyalanmayı monitor edebilirsiniz**

```.term1
dd if=/dev/sda1 | gzip -1 - | pv | ssh root@uzak-bilgisayar dd of=/dev/sdc2
```

Yukarıdaki işlem ssh üzerinden şifreli gidecektir, daha hızlı bir şekilde bilgisayardan bilgisayara disk kopyalamayı ``netcat`` komutu üzerinden de yapabilirsiniz. Burada unutmamanız gereken en önemli konu disklere dd işlemi sırasında erişim olmaması gereklidir. Diskler erişime kapatılabilir veya snapshot alarak bu işlemi yapabilirsiniz.
  
---
### **tar** tape archiver - teyp arşivi  
**tar** programının adı "teyp arşivleyicisi" anlamına gelir. Buna rağmen, verileri başka bir ortama arşivlemek için tar kullanabilirsiniz. Aslında, tarball'lar genellikle kaynak kodu dağıtırken olduğu gibi, birden çok dosyayı bilgisayarlar arasında tek adımda aktarmak için kullanılır. Tarball, tar ile oluşturulan ve genellikle gzip, xz veya bzip2 ile sıkıştırılan bir arşiv dosyasıdır.  
Tar programı, birçok seçeneğe sahip sofistike bir yazılımdır. ``tar``'ı her çalıştırdığınızda, bir veya daha fazla parametre ile kullanırsınız.  

Kullanım şekli:  

tar [parametreler]  ``hedefyol/tar_dosya_adı``   ``arşivlenecek_dosyalar``  

**Parametreleri**  
````
c   Arşiv oluştur
x   Arşivi aç(çıkart)
t   Arşiv listesi
f   Arşiv dosyası adını belirtir
g   Artımlı şekilde yedekle
p   İzinleri koru
z   gzip sıkıştırması kullan
j   bzip2 sıkıştırması kullan
J   xz sıkıştırması kullan
v   Ayrıntı ver
````

**/usr/include dizini altındaki dosyaları sıkıştıralım ve arşivleyelim**  

```.term1
tar cvfz /tmp/usr-include.tgz /usr/include
```
  
  
**/tmp klasörü içinde usr-include.tgz isimli bir dosya olduğunu görebilirsiniz**  
```.term1
ls -la /tmp/usr-include.tgz
file /tmp/usr-include.tgz
```

**şimdi dosyayı tmp klasörü altında açalım**  
```.term1
cd /tmp
tar xvfz usr-include.tgz 
```

**dosyanın aynı klasör altında /tmp/usr/include olarak açıldığını görebilirsiniz**  
```.term1
tree /tmp/usr/
ls -la /tmp/usr/include
```

**tar içeriğini listelemek ve arama yapmak**
```.term1
tar -ztvf usr-include.tgz
tar -tvf usr-include.tgz
tar -tvf usr-include.tgz 'aranacak-değer'
```

>
```tar Komutu linux yöneten herkes için vazgeçilmezdir, çünkü klasörlerin altında dizinlerdeki haklar ve tam bir hiyerarşi ile yedekleme yapabilirsiniz. Aldığınız yedeği başka yerlere aynı şekilde açabilirsiniz. Zaman içinde, Linux ile daha fazla tecrübe kazandığınızda, dosyalar ve yetkileri ile ilgili kopyalamanın ne kadar önemli olduğunu anlayacaksınız. tar komutu MUTLAKA öğrenmeniz ve anlamanız gereken bir Linux komutudur. 
```
  
---
### **cpio** copy in, copy out - içeri kopyala, dışarı kopyala

**Cpio** programı ``tar`` programı gibi çalışır, fakat işleyişinde bazı farklar vardır. cpio, genel bir dosya arşivleme aracı ve bununla beraber bir dosya formatıdır. Adından da anlaşılacağı gibi, programın işleminde standart girdi ve standart çıktı "içeri ve dışarı kopyala" ifadesinden türetilmiştir.  Basitçe, arşiv oluşturmak ve çıkarmak veya dosyaları bir yerden diğerine kopyalamak için bir araçtır.  

Bir arşiv oluştururken, cpio işlenecek dosyaların listesini standart girdiden alır ve ardından arşivi standart çıktıya gönderir. Bu listeyi standart girdiye sağlamak için genellikle find veya ls kullanılır.  

kullanım şekli:  

cpio [-i veya -o veya -p] [parametreler]

Örnek kullanımlar:  

**/usr/include klasörü altındaki dosyaları(klasörler hariç) CPIO ile yedekleyelim**
```.term1
cd /usr/include
ls | cpio -oHnv > /tmp/usr-include-ls.cpio
```
``-o`` seçeneği arşivi oluşturur ve ``-v`` seçeneği eklendikçe arşivlenen dosyaların adlarını yazdırır.(opsiyonel)``-H`` arşiv formatı için (newc) parametrelerinden birini alır,  ">" Cpio çıktısını "/tmp/usr-include-ls.cpio" dosyasına yönlendirir.  

**/usr/include klasörü altındaki tüm dosyaları tar arşivler(yedekler)**
```.term1
find /usr/include -depth -print | cpio -oHn > /tmp/usr-include-find.cpio
```
bu tür `|` pipe(yönlendirmeli) kullanım cpio komutu için oldukça sık tercih edilir.

**/usr/include klasörünü sıkıştıralım**
```.term1
find /usr/include -depth -print | cpio -oHn | gzip > /tmp/usr-include-find.cpio.gz
```
**Arşivlenmiş cpio dosyalarının açılması**
```.term1
cd /tmp
gunzip usr-include-find.cpio.gz
cpio -i < usr-include-find.cpio.gz
```

yada yukarıda belirttiğimiz işlemi bir seferde yapabiliriz.  

```.term1
cd /tmp
gunzip -c usr-include-find.cpio.gz|cpio -i
```

---
### Sıkıştırma yazılımları **gzip**, **gunzip**, **bzip2** ve **xz**

  
**gzip** .gz  
Kullanımı:  

gzip [DosyaAdi]  
sonuç: ``DosyaAdi.gz``  
gzip, tek bir dosyayı sıkıştırmak için unix standardıdır. gzip genellikle tar ile birlikte kullanılır.

**gunzip**   
Kullanımı:  
gunzip [DosyaAdi.gz]  

Dosya açma:  
``gzip -d DosyaAdi.gz`` veya ``gunzip DosyaAdi.gz``


**bzip2**  .bz2  
Kullanımı:  

bzip2 [DosyaAdi]  

Dosya açma:  
``bzip2 -d DosyaAdi.bz2``
Tek bir dosyayı sıkıştırmak için gzip'e alternatif. Gzip'ten daha küçük dosya boyutu.  

**xz**  .xz  
Kullanımı:  

xz [DosyaAdi]  

Dosya açma:  
``xz -d DosyaAdi.xz`` veya ``unxz DosyaAdi.xz``
Tek bir dosyayı sıkıştırmak için gzip'e alternatif. Dosya boyutu bzip2'den daha küçük. xz, 7-zip'ten türetilmiştir.  


**[Linux101 - Ana Sayfa](/linux101-landing)**  
**[Linux101 - Bolum3](/linux101-bolum3)**  

-----

<!-- Quiz bölümünü diğer quizlerde aynen kopyalayıp değiştirmemiz gerek.-->


-----
## Konu tekrarı, kısa sınav
>seçeneklerden doğru olanları seçtikten sonra **Gönder** butonuna basınız. Sonuçları <span style="color:green">**doğru**</span> ve <span style="color:red">**yanlış**</span> görebilirsiniz.



{:.quiz}
Dosyaları tarihe göre ayrıntıları ile birlikte nasıl sıralayabiliriz?
(listenin sonunda en eski tarih olacak)

- ( ) ls -la
- ( ) ls -latr
- (x) ls -lt
- ( ) ls -lSr

{:.quiz}
Hangi komut dosya içeriklerini gösterir?

- (x) cat dosya.txt
- ( ) touch dosya.txt
- ( ) file dosya.txt
- ( ) pwd dosya.txt

{:.quiz}
Bulunduğunuz dizini ağaç şeklinde 2 kademe derinlikte nasıl gösterebiliriz?

- ( ) tree /usr -L 2
- (x) tree . -L 2
- ( ) tree . -2

{:.quiz}
Bilgisayarınızdaki tüm mp3 dosyalarını bulun ve 10M büyük olanları silin?

- ( ) find . -name *.mp3 -size +10M -exec rm 
- (x) find / -name *.mp3 -size +10M -exec rm {} \;
- ( ) find / -name *.mp3 -size +10M | rm

{:.quiz}
test.sh akf senol gurubunu akf yaparak dosya erişimini sadece sahibi için çalıştırma izni verebilirmisiniz ?

- ( ) chown akf:akf test.sh ve chmod 755 test.sh
- (x) chown akf test.sh ve chgrp akf test.sh ve chmod 700 test.sh
- ( ) chmod akf.akf test.sh ve chmod 007 test.sh