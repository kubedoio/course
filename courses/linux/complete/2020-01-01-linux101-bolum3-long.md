---
id: linux-source-2020-01-01-linux101-bolum3-long
course_id: linux
title: "Complete Source: Hardware, Disks, Packages, Processes"
vm_compatible: source-material
source: content/2020-01-01-linux101-bolum3-long.markdown
---

> Original Linux source material. Some commands may require adaptation for Alpine Linux or may be theory-only in the browser VM.

Labaratuar içersinde bilgisayar donanımlarına erişim, durumları ile ilgili bilgi almak, bölümleme, dosya sistemleri, kurulum sırasında dosya sistemlerinin tanımları.  
  

### [Linux101 - Ana Sayfa](/linux101-landing)
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

  
-----
## 1. Donanım ve Bilgisayarın başlaması  

tüm işletim sistemleri donanım üzerinde çalışır ve bu donanım işletim sistemlerinin nasıl çalıştığını etkiler. Donanım hızlı veya yavaş, güvenilir veya güvenilmez olabilir. Daha ayrıntılı bakacak olursak, işletim sistemleri donanımı yapılandırmak ve bunlara erişmek için çeşitli araçlar sağlar - örneğin, sabit diskleri bölümleme ve harici (USB) cihazlarından veri okuma. Etkili olabilmek için Linux'un donanım ortamıyla nasıl etkileşime girdiğinin en azından temellerini anlamalısınız.  

<center><img src="{{site.baseurl}}/images/MBR-Boot-Sequence.png" width="80%"></center>  
  
---
### Donanımların ayarlanması  

Tüm bilgisayarlar bir dizi temel donanımla birlikte gelirler bundan daha önce bahsetmiştik. Genellikle hesaplama işinin çoğunu yapan bir merkezi işlem birimi (CPU) ve verileri tutan rastgele erişim belleği (RAM) vardır. Birçok ek temel özellik, her şeyi birbirine yapıştırmaya yardımcı olur ve bunlardan bazıları Linux içinde ve dışında yapılandırılabilir. 
Bu donanımların çoğunun merkezinde, yapılandırma araçları sağlayan ve işletim sistemi önyükleme sürecini başlatan firmware vardır. Firmware erişimi donanım sağlayıcılar tarafından BIOS üzerinden veya kendilerine özgü geliştirilmiş arayüzler aracılığı ile olur.

<center><img src="{{site.baseurl}}/images/bios-sample.jpg" width="80%"></center>  
<center>BIOS (Basic Input Output System)ekranı</center>
  
---
### Donanım Yazılımını (Firmware) Anlamak  

Pek çok donanım aygıtında sabit yazılım bulunur, bu nedenle herhangi bir bilgisayarda pek çok ürün yazılımı yüklü olabilir - ana kart için, takılabilir disk denetleyicisi için, modemler için vb. Yine de en önemli Donanım yazılımı(firmware) bilgisayarın ana kartına yüklenir. 
Bu firmware, anakartın donanımını başlatır ve önyükleme sürecini kontrol eder. Geçmişte, x86 ve x86-64 tabanlı bilgisayarların büyük çoğunluğu Temel Giriş/Çıkış Sistemi (BIOS) olarak bilinen bir firmware türü kullanıyordu. 2011'den başlayarak, yeni bilgisayarlarda , Genişletilebilir Ürün Yazılımı Arabirimi (EFI) veya Birleşik EFI (UEFI) olarak bilinen yeni bir firmware yazılımı türü, neredeyse standart hale geldi. Bazı eski bilgisayarlar da EFI kullanır. EFI'nin teknik olarak bir BIOS olmadığı gerçeğine rağmen, çoğu üretici belgelerinde ona bu adla atıfta bulunur.
  
---
### Bilgisayarın donanımsal başlangıcı (Sınav/iş görüşmesi sorusu)  
  
BIOS, donanımın yazılımla ilk kez buluştuğu ve tüm önyükleme işleminin başladığı yerdir. BIOS kodu, genellikle EEPROM adı verilen ve büyük ölçüde donanıma özgü olan PC'nizin ana kartında yer alır. BIOS, bir bütün olarak donanımla arabirim oluşturan en düşük düzeydeki yazılımdır ve bu arabirim sayesinde, önyükleyici ve işletim sistemi çekirdeği donanımla iletişim kurabilir ve donanımı kontrol edebilir. BIOS'a standartlaştırılmış çağrılar (bilgisayar sözlüğünde "IRQ") yoluyla, işletim sistemi BIOS'u diski okuyup yazması ve diğer donanım bileşenleriyle arabirim oluşturması için kullanır.
  
Bilgisayarınız ilk açıldığında çok şey olur. PC'nin elektrik bileşenleri, başlangıçta bilgisayarınızı hayata döndürmekten sorumludur ve akımı PSU'dan anakarta yönlendiren bir anahtarı tetikleyerek PC'nizin tüm bileşenlerine elektrik verir.
  
#### POST Süreci  

Bilgisayarınız açıldıktan sonra, BIOS POST (Açılışta Kendi Kendine Test) işleminin bir parçası olarak çalışmaya başlar. BIOS PC'nizin tüm parçalarını birbirine bağlar ve bunlar arasında gerektiği şekilde arabirim oluşturur.  
  
Ekranınız için VGA'yı kabul edecek ve ekranda gösterecek şekilde ayarlar, bellek bankalarını başlatır ve CPU'nuzun tüm donanıma erişimini sağlar. IO veriyollarını bağlı donanım için tarar ve bilgisayarınıza bağladığınız sabit disklere erişimi tanımlar ve eşler. Yeni anakartlardaki BIOS, harici sürücüler ve USB fareler gibi USB aygıtlarını bile tanıyacak ve tanımlayacak kadar akıllıdır.
  
POST prosedürü sırasında, mümkün olan yerlerde hızlı testler gerçekleştirilir ve uyumsuz donanım, bağlantısı kesilmiş cihazlar veya arızalı bileşenlerin neden olduğu hatalar genellikle yakalanır. "Klavye hatası veya klavye yok" gibi çeşitli hata mesajlarından veya uyumsuz/tanınmayan bellekle ilgili uyarılardan sorumlu olan BIOS'tur.  
  
Bu noktada, BIOS’un çalışmasının çoğu tamamlandı ve önyükleme işleminin bir sonraki aşamasına geçmeye neredeyse hazır. Geriye kalan tek şey, "Eklenti ROM'lar" olarak adlandırılanları çalıştırmaktır: Anakarta bağlı video kartı veya RAID denetleyicileri gibi donanımlar, başlatılmasının tamamlanması için kullanıcı müdahalesi gerektirebilir.  
  
Bilgisayarın ve ekranının kontrolünü üstlenirler ve RAID dizilerini kurma veya bilgisayar gerçekten açılmadan önce ekran ayarlarını yapılandırma gibi şeyler yapmanıza izin verir. Yürütmeyi tamamladıklarında, bilgisayarın denetimini tekrar BIOS'a aktarırlar ve bilgisayar, kullanılabilir bir duruma girer ve başlamaya hazırdır.  
  
#### BIOS Önyükleme Aktarımı
Bilgisayarınızın temel giriş ve çıkış aygıtlarını yapılandırdıktan sonra, BIOS artık bilgisayarınızın kontrolünün hala elinde olduğu son aşamaya geçer.  
  
Bu noktada, normal olarak, donanım ayarlarını yapılandırabileceğiniz ve bilgisayarınızın nasıl önyükleneceğini kontrol edebileceğiniz BIOS kurulumuna girmek için bir tuşa hızlıca basma seçeneği sunulur. Hiçbir şey seçmezseniz, BIOS, varsayılan ayarları kullanarak PC'nizi gerçekten "önyükleme" nin ilk adımına başlayacaktır.   
  
---
### IRQ Interrupts Kesmeler  
  
Bir kesme isteği (IRQ) veya kesinti, CPU'ya gönderilen ve mevcut aktivitesini askıya alması ve klavye girişi gibi bazı harici olayları işlemesi talimatını veren bir sinyaldir. Açık
x86 platformunda, IRQ'lar 0 ile 15 arasında numaralandırılmıştır. x86-64 sistemleri dahil daha modern bilgisayarlar bu 16 kesintiden fazlasını sağlar.  
  
Bazı kesmeler, klavye ve gerçek zamanlı saat gibi belirli amaçlar için ayrılmıştır; diğerlerinin ortak kullanımları vardır (ve bazen aşırı kullanılır) ancak yeniden atanabilir; ve bazıları sisteme eklenebilecek ekstra cihazlar için kullanılabilir durumda bırakılır. Alttaki tabloda IRQ'ları ve x86 sistemindeki kullanım amaçlarını görebilirsiniz. 
  
````
IRQ 0 - sistem zamanlayıcı (değiştirilemez)  
IRQ 1 - klavye denetleyicisi (değiştirilemez)  
IRQ 2 - IRQ'lar 8–15'ten gelen basamaklı sinyaller (IRQ 2'yi kullanmak için yapılandırılmış tüm cihazlar aslında IRQ 9'u kullanacaktır)  
IRQ 3 - seri bağlantı noktası 2 için seri bağlantı noktası denetleyicisi (varsa, seri bağlantı noktası 4 ile paylaşılır)  
IRQ 4 - seri bağlantı noktası 1 için seri bağlantı noktası denetleyicisi (varsa seri bağlantı noktası 3 ile paylaşılır)  
IRQ 5 - paralel bağlantı noktası 2 ve 3 veya ses kartı  
IRQ 6 - disket denetleyicisi  
IRQ 7 - paralel bağlantı noktası 1. Yazıcılar için veya yazıcı yoksa herhangi bir paralel bağlantı noktası için kullanılır. Bağlantı noktasının dikkatli yönetimi ile potansiyel olarak ikincil bir ses kartı ile paylaşılabilir.  
IRQ 8 - gerçek zamanlı saat (RTC)  
IRQ 9 - Intel yonga setlerinde Gelişmiş Yapılandırma ve Güç Arabirimi (ACPI) sistem kontrol kesintisi. [2] Diğer yonga seti üreticileri bu amaç için başka bir kesme kullanabilir veya onu çevre birimlerinin kullanımına sunabilir (IRQ 2 kullanmak için yapılandırılmış herhangi bir cihaz aslında IRQ 9 kullanıyor olacaktır)  
IRQ 10 - Kesinti, çevre birimlerinin kullanımı için açık bırakılır (açık kesme / kullanılabilir, SCSI veya NIC)  
IRQ 11 - Kesinti, çevre birimlerinin kullanımı için açık bırakılır (açık kesme / kullanılabilir, SCSI veya NIC)  
IRQ 12 - PS / 2 konektöründe fare  
IRQ 13 - CPU ortak işlemcisi veya entegre kayan nokta birimi veya işlemciler arası kesinti (kullanım işletim sistemine bağlıdır)  
IRQ 14 - birincil ATA kanalı (ATA arabirimi genellikle sabit disk sürücülerine ve CD sürücülerine hizmet eder)  
IRQ 15 - ikincil ATA kanalı  
````

Linux işletim sisteminiz üzerinde bunları görüntülemek isterseniz /proc/interrupts dosyasına bakabilirsiniz.  
  
```.term1
cat /proc/interrupts
```
  
Donanım çakışması diye bahsedilen şey, donanım üreticilerinin aynı IRQ adresini kullanmaları yüzünden olmaktadır, bu durumda donanımın IRQ adresini veya bulunduğu PCI konumunu değişitrmeniz farklı bir IRQ kullanmasına sebep olacaktır ve çakışmayı çözebilirsiniz. Linux kernel bu konuda size olduça açıklayıcı bir bilgi verecektir.  
  
---
### I/O adresleri

Rezerve edilmiş bazı memory adresleri vardır, bunlar direkt olarak CPU ile iletişim sağlarlar. Bunları linux altında listelemek için aşağıdaki komutu yazabilirsiniz.

```.term1
cat /proc/ioports
```
  
---
### Donanıma Erişim komutları

Normal kullanım şartları altında donanımlar otomatik(auto-loader) olarak başlangıçta algılanıp gerekli Linux modülleri yüklenecektir. Firmware ile tanımlanmış olan donanım özellikleri, linux üzerinde yüklenen modüller ile konuşarak Grafik arabim /Network kartı gibi donanımlarla konuşurlar.  
Linux, çekirdek modüllerini iki programla yüklemenizi sağlar: `insmod` ve `modprobe`. insmod programı çekirdeğe tek bir modül ekler. Bu işlem, yüklediğiniz modülün dayandığı tüm modülleri önceden yüklemiş olmanızı gerektirir. Bunun aksine modprobe programı, bağlı modülleri otomatik olarak yükler ve bu nedenle genellikle modül yüklemek için modprobe tercih edilir.  

**lsmod** donanımlar için yüklenmiş kernel modüllerini gösterir.  
**insmod** dosya olarak verilen modülü yükler  
**modinfo** modül ile ilgili bilgi verir  
**rmmod** modül kaldırma  
**modprobe** standart lokasyondan modül yükler  

Örnek senaryo, wifi kartımızı sunucu çalışırken takmış olalım, ve kernel algılamamış olsun. Aşağıdaki şekilde driver yüklenebilir..  
  
```.term1
sudo lsmod|grep rtl8187
sudo modinfo /lib/modules/3.10.0-1127.19.1.el7.x86_64/kernel/drivers/net/wireless/realtek/rtl818x/rtl8187/rtl8187.ko.xz
sudo modins /lib/modules/3.10.0-1127.19.1.el7.x86_64/kernel/drivers/net/wireless/realtek/rtl818x/rtl8187/rtl8187.ko.xz
lsmod|grep rtl8187 
``` 
yukarıdaki senaryoda önce kernel modülü yüklenmişmi diye kontrol ediyoruz `rtl8187`, sonrasında `modinfo` ile modül içeriğine bakıyoruz ve `modins` ile yükleyip, `lsmod` ile yüklenmenin gerçekleşip gerçekleşmediğini kontrol ediyoruz.  
  
-----
## 2. Donanımlarımızı listelemek

Donanımlarımız listelemek için en çok tercih edilen komutlar dmidecode, hwlist komutlarıdır, aşağıda kullanımlarını görebilirsiniz.
  
---
### **dmidecode**

**dmidecode**, sisteminizin donanım bileşenlerinin yararlı bilgilerini insan tarafından okunabilir biçimde almak için kullanılan bir komuttur. Dmidecode, Linux benzeri tüm sistemler (RHEL, CentOS, Debian ve SUSE) için mevcuttur. Dmidecode, DMI (Masaüstü Yönetim Arayüzü) tablo kod çözücüsünün kısaltmasıdır, çünkü adından da anlaşılacağı gibi DMI tablosundaki verileri okur ve bize insan tarafından okunabilir formatta çıktı üretir. DMI tablosu, BIOS, Seri Numarası, RAM (DIMM'ler) ve CPU ayrıntıları vb. Gibi donanım ayrıntılarını verir. 

Kullanım örnekleri,

Öncesinde dmidecode yazılımını kuruyoruz  
```.term1
apt-get update && apt-get install dmidecode -y
```

dmidecode uzun bir liste getirecektir, o yüzden `more` veya `less` ile birlikte kullanmanızı tavsiye ederim  
```.term1
dmidecode | more
```  
vaya
```.term1
dmidecode | less
```
  
sadece belli bir donanım ile ilgili bilgi almak için `-t` parametresini kullanabilirsiniz

```.term1
dmidecode -t memory
dmidecode -t processor
dmidecode -t system
```  
  
---
### **lshw**

lshw komutu, donanım bilgilerini almanızı sağlar. aşağıda bazı örnekler var.  

Öncesinde yazılımı kuruyoruz  
```.term1
apt-get update && apt-get install lshw -y
```

kısa bir özet almak için  

```.term1
lshw -short
```

belli donanımlar için çıktı alabilmek için
```.term1
lshw -businfo
```

veya çıktınızı HTML formatında almak istiyorsanız.

```.term1
lshw -html
```

>
````
Sunuculara bağlandığınızda genellikle hangi donanımlara sahip oldukları ile ilgili sorular sorabilirsiniz, ne kadar RAM ve CPU olduğu ve ne hızda sonuç üretebildiği gibi. Yukarıdaki komutlar özellikle bu durumlar için çok kullanışlıdırlar. `TOP` komutu ile sunucunun performansını inceleyebilirsiniz fakat donanım kaynaklarına mutlaka bakarak bu bilgileri birlikte değerlendirmelisiniz.
````
  
-----
## 3. Disk kullanımı ve bölümleme (partitions)
  

### Sabit Disk kurgulamak
Sisteminiz ister SATA, ister SCSI diskler kullanıyor olsun, Linux için bir disk düzeni tasarlamalısınız. Önceden Linux yüklenmiş bir sistem kullanıyorsanız, bu görevle hemen ilgilenmeniz gerekmeyebilir; ancak er ya da geç Linux'u yeni bir bilgisayara veya mevcut bir işletim sistemine sahip bir bilgisayara yüklemeniz veya sabit diskinizi yükseltmeniz gerekecektir.  

Bu bölümde, x86 sunucularda bölümleme yöntemlerini, Linux bağlama noktalarını ve bir Linux bölümleme şeması için genel seçenekler işlenmiştir. Daha sonra "Bölümler ve Dosya Sistemleri Oluşturma" konusunu işleyeceğiz.  
  s
### Bölümleme neden gereklidir ? (partitioning)  
Bölümlemeyle ilgili ilk sorun, bunu neden yapmanız gerektiği sorusudur. Cevap, bölümlemenin aşağıdakiler gibi çeşitli avantajlar sağlamasıdır:  
  
**Çoklu İşletim Sistemi Desteği** Bölümleme, farklı işletim sistemleri için verileri ayrı tutmanıza olanak tanır. Aslında, birçok işletim sistemi, birbirlerinin birincil dosya sistemlerini desteklemedikleri için aynı bölümde bir arada var olamazlar. Bu özellik, özellikle bilgisayarın birden çok işletim sistemini başlatmasını istiyorsanız çok önemlidir. Ayrıca, bir acil durum sisteminin kurulması için bölümleme çok kullanışlı olabilir — sorun çıkması durumunda ilk kurulum için acil durum bakım aracı olarak ikinci kurulumu kullanarak tek bir işletim sistemini iki kez kurabilirsiniz. Windows/Mac bu tip bir bölümleme yapmaktalar.  
  
**Farklı Dosya Sistemi**  Diskinizi bölümlere ayırarak, her bölümdeki farklı dosya sistemlerini (bir bölümdeki tüm dosyaları tutmak için tasarlanmış veri yapıları) kullanabilirsiniz. Belki bir dosyasistemi diğerinden daha hızlıdır ve bu nedenle zaman açısından kritik veya sık erişilen dosyalar için önemlidir, ancak bir başkası, kullanıcıların veri dosyaları için kullanmak istediğiniz hesaplama veya yedekleme özelliklerini sağlayabilir. örn. Btrfs,xfs,ext4,glusterfs için ayrı bölümler yaratabilirsiniz.  
  
**Disk Alanı Yönetimi** Diskinizi bölümlere ayırarak, belirli dosya kümelerini sabit bir alanda kilitleyebilirsiniz. Örneğin, kullanıcıları bir veya iki bölümde dosya depolamakla sınırlarsanız, sistem bölümleri gibi diğer bölümlerde sorun yaratmadan bu bölümleri doldurabilirler. Bu özellik, alan biterse sisteminizin çökmesini önlemeye yardımcı olabilir. Fakat unutmayın, bölüm boyutlarını yanlış ayarlarsanız, yalnızca bir bölümdeki disk alanınız dolar ve bölüm çok hızlı bir şekilde dolar. istesenizde diğer bölümlere taşıyamazssınız.
  
**Disk Hatası**  Disklerde bazen sorunlar ortaya çıkar. Bu sorunlar, kötü donanımdan veya dosya sistemlerine sızan hatalardan kaynaklanabilir. Her iki durumda da, bir diski bölümlere ayırmak, bu tür sorunlara karşı bir miktar koruma sağlar. Bir bölümdeki veri yapıları bozulursa, bu hatalar yalnızca o bölümdeki dosyaları etkiler. Bu ayrım, bu nedenle diğer bölümlerdeki verileri koruyabilir ve verileri yedeklemeniz için size alternatif alan sunar.  
  
**Güvenlik** Farklı bölümlerde güvenlikle ilgili farklı montaj seçeneklerini kullanabilirsiniz. Örneğin, kritik sistem dosyalarını salt okunur tutan ve kullanıcıların o bölüme yazmasını engelleyen bir bölüm bağlayabilirsiniz. `tmp` için execution hakkı olmayan bir partition yaratabilirsiniz, hayat kurtarıcı olacaktır. Linux’un dosya güvenlik seçenekleri de benzer koruma sağlamaktadır, ancak Linux dosya sistemi bağlama seçeneklerini doğru ayarlamanız gerekir(/etc/fstab için).   
  
**Yedekleme** Bazı yedekleme araçları bölümleme ile çok iyi çalışırlar. Bölümleri küçük tutarak, bölümleriniz büyük olmasına kıyasla daha kolay yedekleme yapabilirsiniz.  

Uygulamada, çoğu Linux bilgisayar birkaç bölüm kullanır, ancak sistemin tam olarak nasıl bölümlendiği bir bilgisayardan diğerine değişir. Aşağıda daha ayrıntılı bir şekilde değişik kullanımlar için bölümlemeler konusundaki tercihlerimi görebilirsiniz.
  
---
### Disk Bölümleri nasıl yapılır?  
  
<center><img src="{{site.baseurl}}/images/Master-Boot-Record.png" width="50%"></center>  
  
Bölümler, sabit diskin belirli bölümlerine yazılan veri yapılarıyla tanımlanır. Bu bölümleri tanımlamak için birkaç rakip sistem mevcuttur. X86 ve x86-64 donanımında, 2010 yılına kadar en yaygın yöntem Ana Önyükleme Kaydı (MBR) bölümleme sistemiydi, bu sistem verilerini MBR olarak da bilinen diskin ilk sektöründe depoladığı için. Bununla birlikte, MBR sistemi, en azından neredeyse evrensel sektör boyutu olan 512 bayt kullanılırken, 2 tebibayt (TiB; 1TiB 240 bayttır) bölümler ve bölüm yerleşimi ile sınırlıdır. MBR'nin halefi, çok daha yüksek sınırlara ve bazı başka avantajlara sahip olan GUID Bölümleme Tablosu (GPT) bölümleme sistemidir. MBR ve GPT disklerini değiştirmeye yönelik araçlar ve yöntemler, önemli ölçüde örtüşme olsa da, birbirinden farklıdır.  
  
Burada çok güzel bir anlatım var, izleyebilirsiniz.  
  
<center><iframe width="560" height="315" src="https://www.youtube.com/embed/AeUM4kR67XQ" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></center>  
  
  
MBR ve GPT kıyaslamasını aşağıda bulabilirsiniz.  
  
````
                            MBR (Master Boot Record)	GPT (GUID Partition Table)
Specification               None                        UEFI
Max.No primary partitions   4                           Unlimited (dependent on OS; Windows: 128)
Maximum partition size	    2 terabytes                 18 exabytes 
Maximum hard drive size	    2 terabytes                 18 exabytes 
Security                    Data sector no checksum     Datasector CRC32 checksum GUID table backup
Partition name	            Stored in the partition     Unique GUID ID plus a 36-character name
Multiboot support           Poor                        Good (boot loader entries in separate partition)
````

Daha önce vermiş olduğum disk büyüklükleri ile ilgili tablo aşağıdaki gibidir.
  
#### Hipervizör Kurulumu KVM  
En az 64GB hafıza 
  
**disk yapısı**
> 
    swap partition 4GB   (bilgisayarın hafızasına göre karar vermenize gerek yok)
    500M /boot
    10GB / kök dizin
    5GB  /home
    1GB  /tmp
    500GB /srv/data01    (data dizini, sanal sunucu diskleri için, kaynaklarınıza göre karar verin)
  
#### Docker Sunucu kurulumu (CENTOS)  
en az 8 GB hafıza, mutlaka I/O yüksek disk  
**disk yapısı**  
>
    0   swap            (swap partition olmasın!!)
    500M /boot
    10GB / kök dizin
    5GB  /home
    1GB  /tmp
    20GB /src/data01    (data dizini, sonradan ihtiyacınıza göre arttırırsınız)
    
  
#### Web Sunucu Kurulumu (DEBIAN), php veya Java uygulamaları çalıştıracak sunucu

**backend** sunucusu(php,java,ruby)  
genelde 8,16 GB ve 4-6 vCPU yeterli olacaktır _(vCPU sanal CPU demektir)_

**frontend** sunucularda (nginx/apache/Haproxy)  
cache yapmayacaksanız 1GB ram 2 vCPU yeterli olacaktır. _(vCPU sanal CPU demektir)_

**disk yapısı**
>
    swap partition 1GB (bilgisayarın hafızasına göre karar vermenize gerek yok)
    500M /boot
    10GB / kök dizin
    5GB  /home
    1GB  /tmp
  
---
### Disk bölümleme nasıl yapılır?

Disk bölümleme için geleneksel Linux aracı fdisk olarak adlandırılır. Bu aracın adı sabit diskin kısaltmasıdır ve adı, aynı görevi gerçekleştiren bir DOS ve Windows aracıyla aynıdır.  Hem DOS’un FDISK’ı hem de Linux’un fdisk'i, benzer hedeflere ulaşmak için kullanılan metin tabanlı araçlarıdır, ancak ikisi operasyonel ayrıntılarda çok farklıdır. Fdisk geleneksel araç olmasına rağmen, başka birkaçı da mevcuttur. Bunlardan biri, yalnızca fdisk'in işleyebileceği MBR'yi değil, birkaç farklı bölümleme tablosu türünü işleyebilen GNU Parted'dir. Fdisk'i GNU Parted'e tercih ediyorsanız ancak GPT kullanmanız gerekiyorsa, GPT fdisk'i kullanabilirsiniz.

Bölümleme için kullanılan komutlardan başlıcaları:

**fdisk**  
**cfdisk**  
**cgdisk**  
**gpart**  

Burada sadece fdisk ile bölümleme konusunda birkaç örnek vereceğiz, diğer yazılımlar da benzer işleri farklı şekilde yapıyorlar.  Diğer programları mutlaka denemenizi tavsiye ederim.

```.term1
fdisk /dev/sdc
```

**Geçerli Bölüm Tablosunu Görüntüleyin** **p** Geçerli bölüm tablosunu görüntüleyerek başlamak isteyebilirsiniz. Bunu yapmak için `p` yazın. Yalnızca geçerli bölüm tablosunu görüntülemek istiyorsanız, fdisk'in etkileşimli moduna girmek yerine bir komut istemine `fdisk -l /dev/sdc` (veya başka bir donanım yolu /dev/sde gibi) yazabilirsiniz. Bu komut bölüm tablosunu görüntüler ve ardından çıkar.  

**Bölüm Oluşturma** **n** Bir bölüm oluşturmak için `n` yazın.  
        1. bölüm hakkında bilgi isteyen bir dizi bilgi istenecektir `primary` birincil, `extended` genişletilmiş veya `logical` mantıksal bölüm tercihi yapmanız gerekir.   
        2.bölümün başlangıç ​​silindiri  
        3.bölümün bitiş silindiri veya boyutu  
gibi sorular gelecektir, varsayılan değer olarak yeni bir disk için başlangıç ve bitiş silindirleri bilgisi gelir.  

**Bölümü Silme** Bir bölümü silmek için `d` yazın. Birden fazla bölüm varsa, program girmeniz gereken bölüm numarasını isteyecektir.  

**Bölümün Türünü Değiştirme** Bir bölüm oluşturduğunuzda, fdisk ona bir Linux dosya sistemine karşılık gelen 0x83 tür kodunu atar. Bir Linux takas bölümü veya başka bir işletim sistemi için bir bölüm oluşturmak istiyorsanız, bir bölüm türü kodunu değiştirmek için `t` yazabilirsiniz. Program daha sonra sizden bir bölüm numarası ve bir tür kodu girmenizi ister.  

**Bölüm Türlerini Listeleme** Birkaç düzine bölüm türü kodu mevcuttur, bu nedenle bunların ne olduğunu unutmak kolaydır. En yaygın olanların listesini görmek için ana fdisk komut istemine `l` (list, kısaltması küçük L harfi) yazın.  

**Bir Bölümü Önyüklenebilir Olarak işaretleme** DOS ve Windows gibi bazı işletim sistemleri, önyükleme yapmak için özel önyüklenebilir (flag)bayraklara sahip bölümler kullanır. Bu bayrağı `a` yazarak ayarlayabilirsiniz, bunun üzerine fdisk bölüm numarasını sorar.  

**Yardım Alma** `m` veya `?` ana fdisk komutlarının bir özetini görmek için.  
  
**Çıkış** Linux’un fdisk'i iki çıkış modunu destekler. Öncelikle programdan çıkmak için `q` yazabilirsiniz herhangi bir değişikliği kaydetmeden proram sonlanır. Programla yaptığınız her şey kaybolur. Bu seçenek, bir hata yaptıysanız özellikle yararlıdır. İkinci olarak, `w` yazmak, değişikliklerinizi diske yazar ve programdan çıkar.  
  
aşağıda örnek bir senaryo ile çalışan bir sunucuya bir disk içinde bölüm oluşturuyoruz. ilk listelememiz sırasında bize /dev/vda /dev/vdb ve /dev/vdc isimli 3 disk gösteriliyor, vda ve vdb diskleri üzerinde linux bölümleri(partition) mevcut /dev/vda1 ve /dev/vdb1. Biz yeni eklenen /dev/vdc diski ile işlem yapacağız.  

işlem sırasında yeni bir disk oluşturmak için fdisk programına sırasıyla `n` -> `p` -> enter(ilk silindir varsayılan) -> enter(ikinci silindir varsayılan) -> `w` tuşlarına basılarak yeni bir bölüm yaratılır.  
  
````
root@ops.nucleuss ~ # fdisk -l
Disk /dev/vda: 12 GiB, 12884901888 bytes, 25165824 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: dos
Disk identifier: 0xdff22e71

Device     Boot Start      End  Sectors Size Id Type
/dev/vda1  *     2048 25165823 25163776  12G 83 Linux


Disk /dev/vdb: 20 GiB, 21474836480 bytes, 41943040 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: dos
Disk identifier: 0xd70e979e

Device     Boot Start      End  Sectors Size Id Type
/dev/vdb1        2048 41943039 41940992  20G 83 Linux




Disk /dev/vdc: 20 GiB, 21474836480 bytes, 41943040 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
root@ops.nucleuss ~ # fdisk /dev/vdc

Welcome to fdisk (util-linux 2.32.1).
Changes will remain in memory only, until you decide to write them.
Be careful before using the write command.

Device does not contain a recognized partition table.
Created a new DOS disklabel with disk identifier 0xffc8c0e5.

Command (m for help): p
Disk /dev/vdc: 20 GiB, 21474836480 bytes, 41943040 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: dos
Disk identifier: 0xffc8c0e5

Command (m for help): n
Partition type
   p   primary (0 primary, 0 extended, 4 free)
   e   extended (container for logical partitions)
Select (default p): p
Partition number (1-4, default 1):
First sector (2048-41943039, default 2048):
Last sector, +sectors or +size{K,M,G,T,P} (2048-41943039, default 41943039):

Created a new partition 1 of type 'Linux' and of size 20 GiB.

Command (m for help): w
The partition table has been altered.
Calling ioctl() to re-read partition table.
Syncing disks.

root@ops.nucleuss ~ # fdisk /dev/vdc

Welcome to fdisk (util-linux 2.32.1).
Changes will remain in memory only, until you decide to write them.
Be careful before using the write command.


Command (m for help): p
Disk /dev/vdc: 20 GiB, 21474836480 bytes, 41943040 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: dos
Disk identifier: 0xffc8c0e5

Device     Boot Start      End  Sectors Size Id Type
/dev/vdc1        2048 41943039 41940992  20G 83 Linux

Command (m for help): q
````
  
Size sorulan şeyin ayrıntıları kısmen ekranda tanımlanmış olarak gelir. Örneğin fdisk, zaten varsa genişletilmiş bir bölüm oluşturmak isteyip istemediğinizi sormaz. Fdisk'in eski sürümleri, bölüm başlangıç ​​ve bitiş noktalarını megabayt olarak değil, silindirlerde ölçer.  
  
Bu x86 bölümleme tablosu tarafından kullanılan CHS ölçümlerinin bir parçasıdır. Fdisk'in son sürümleri, varsayılan ölçü birimi olarak sektörleri kullanır, ancak bir `20GiB` bölümü oluşturmak için `+20G`'de olduğu gibi bir bölümün boyutunu artı işareti, sayı ve birim kullanarak belirlemeniz gerekir.  
  
-----
## 4. Dosya sistemleri
  
---
### Bir Bölümü Kullanıma Hazırlama (formatlama)
Bir bölüm oluşturulduktan sonra, onu kullanıma hazırlamanız gerekir. Bu işleme genellikle "dosya sistemi oluşturma" veya "bölümü biçimlendirme" adı verilir. Düşük seviyeli veri yapılarının diske yazılmasını içerir. 

````
Tarla örneği verecek olursak, bölümleme işlemi tarlanın etrafını çitlerle çevirmek, biçimlendirme ise tarladaki ekilecek alanları sürmek işlemidir.   
````  

Linux daha sonra, bölümdeki dosyalara erişmek ve depolamak için bu veri yapılarını okuyabilir ve değiştirebilir. Yaygın Linux dosya sistemleri hakkında bir şeyler bilmeli ve bunları oluşturmak için dosya sistemi oluşturma araçlarını nasıl kullanacağınızı bilmelisiniz. Linux işletim sistemi dosyaların birbirleri ile sürekli iletişim halinde olduğu bir ortamdır.
  
---
### Yaygın Dosya Sistemi Türleri

Linux, hem Linux'ta yerel hem de diğer işletim sistemleri için tasarlanmış pek çok farklı dosya sistemini destekler. Bunlardan bazıları Linux altında neredeyse hiç çalışmaz ve güvenilir bir şekilde çalışsalar bile, genellikle Linux'un kendi yerel dosya sistemlerinde beklediği tüm özellikleri desteklemeler. Bu nedenle, bir Linux sistemi hazırlarken, çoğu veya tüm bölümler için bir veya daha fazla yerel dosya sistemini kullanılır.  

#### Bilinen en popüler dosya sistemleri aşağıdaki gibidir:  

**Ext2fs** İkinci Genişletilmiş Dosya Sistemi (ext2fs veya ext2), geleneksel Linux yerel dosya sistemidir. Linux için oluşturuldu ve 1990'ların sonlarında baskın Linux dosya sistemi olarak belirlendi. Ext2fs, güvenilir bir dosya sistemi olarak bilinir. O zamandan beri diğer dosya sistemleri tarafından gölgede bırakıldı, ancak yine de birçok yerde kullanılmaktadır. Ext2fs özellikle küçük /boot bölümleri olarak kullanılır, aynı zamanda küçük usb/sdcard ‘lar üzerinde dosya tutmak için tercih edilir. Bu kadar küçük bölümlerde, daha gelişmiş dosya sistemleri tarafından kullanılan günlük boyutu sorun yaratabilir, bu nedenle günlük tutmayan ext2fs daha iyi bir seçimdir. (Günlük tutma konusundan birazdan bahsediyoruz) Ext2 dosya sistemi türü kodu ext2'dir. IOT ve embedded cihazlarda çok sık kullanım alanı vardır.  

**Ext3fs** Üçüncü Genişletilmiş Dosya Sistemi (ext3fs veya ext3) temelde bir günlük eklenmiş ext2fs'dir. Sonuç, ext2fs kadar güvenilir, ancak elektrik kesintilerinden ve sistem ökmelerinden çok daha hızlı kurtulan bir dosya sistemidir. Ext3 dosya sistemi türü kodu ext3'tür.  

**Ext4fs** Dördüncü Genişletilmiş Dosya Sistemi (ext4fs veya ext4), bu dosya sistemi ailesi. Performansı artırmayı amaçlayan uzantıların yanı sıra çok büyük disklerle (16TiB'nin üzerindekiler, ext2fs ve ext3fs için sınır) veya çok büyük dosyalarla çalışma yeteneği ekler. Dosya sistemi türü kodu ext4'tür.  

**ReiserFS** Bu dosya sistemi, Linux için bir günlük kaydı dosya sistemi olarak sıfırdan tasarlanmıştır. ReiserFS, dosyaların uçlarını birbirlerinin kullanılmayan alanlarına sıkıştırmak için çeşitli hileler kullandığından, çok sayıda küçük dosyayı (örneğin, yaklaşık 32KB'den küçük) işlemede özellikle iyidir. Bu dosya sistemini kullanmanızı tavsiye etmem, popülaritesini ve kullanım alanını yitirmiştir.  

**XFS** Silicon Graphics (SGI), IRIX işletim sistemi için Extents File System (XFS) oluşturdu ve IBM gibi daha sonra kodu Linux'a bağışladı. JFS gibi, XFS de teknik olarak çok karmaşık bir dosya sistemidir. XFS, IRIX üzerinde sağlamlık, hız ve esneklikle ün kazanmıştır, ancak onu IRIX üzerinde bu kadar esnek kılan XFS özelliklerinden bazıları Linux altında pek desteklenmemektedir. Bu dosya sistemi için tür kodu olarak xfs kullanın.  

**Btrfs** Bu dosya sistemi ("butter eff ess" veya "bee tree eff ess" olarak telaffuz edilir), Sun’ın Zettabyte Dosya Sisteminden (ZFS) esinlenen özelliklere sahip gelişmiş bir dosya sistemidir. Ext4fs, JFS ve XFS gibi, Btrfs de hızlı bir performans sergiliyor ve çok büyük diskleri ve dosyaları idare edebiliyor. 3.6.0 çekirdek itibariyle, Btrfs deneysel olarak kabul edilir; ancak, gelişmiş özellikleri onu mevcut popüler dosya sistemlerinin olası bir halefi yapar.  


**JFS** IBM, AIX işletim sistemi için Günlüklü Dosya Sistemini (JFS) geliştirdi ve daha sonra OS/2'de(artık olmayan işletim sistemi) yeniden uyguladı. OS/2 sürümü daha sonra Linux'a bağışlandı. JFS, AIX veya OS/2'ye aşina iseniz veya bu bu dosya sistemini kullanabilirsiniz. Günlük tutma yöntemi özellikle ilgi çekici olabilecek teknik olarak gelişmiş bir dosya sistemidir. Bu dosya sisteminin tür kodu jfs'dir.  

Uygulamada, çoğu yönetici birincil dosya sistemleri olarak ext3fs, ext4fs veya XFS'i seçer; ancak son zamanlarda btrfs kullanımı da görmeye başladım. Birde işlemediğimiz ama ilginç dosya sistemleri vardır, en ilginç ve güzel olanı **ZFS** ‘tir. Dosya sistemine meraklı olanların ZFS incelemesini özellikle tavsiye ederim.
Her dosya sistemi ile ilgili değerler ve sorunlar hakkındaki somut verilere ulaşmak zordur ve var olsalar bile, dosya sistemi performansı pek çok başka faktörle etkileşime girdiğinde farklı sonuçlar üretir.  

#### Konumuz olmayan ama bilmemiz gereken dosya sistemleri  

Linux yerel dosya sistemlerine ek olarak, zaman zaman aşağıdakiler gibi başka dosya sistemleriyle de karşılaşabilirsiniz:  

**FAT File Allocation Table** Dosya Ayırma Tablosu (FAT) dosya sistemi çok eski ve ilkeldir ancak her yerde bulunur. DOS ve Windows 98 tarafından desteklenen tek sabit disk dosya sistemidir. Bu nedenle, her işletim sistemi FAT üzerinden veri okur/yazar. Bu FAT dosya sistemini çıkarılabilir disklerde veri alışverişi için mükemmel bir dosya sistemi yapar. FAT'ın iki ana ortogonal varyantı vardır: Dosya sistemi adlandırıldıktan sonra FAT veri yapısının boyutunda değişiklik gösterir (12, 16 veya 32 bit işaretçiler) ve uzun dosya adlarını destekleyen varyantlara sahiptir. Linux, FAT boyutunu otomatik olarak algılar. Kullanım alanı oldukça azalmıştır, mümkünse kullanmamanızı tavsiye ederim. exFat isminde bir dosya sistemi daha vardır, daha büyük dosya sistemi kapasitesine sahiptir, MAC-Linux-Windows ortamınız var ise ve harici disk kullanıyorsanız, bu dosya sistemi işinize yarayacaktır.  

**NTFS Yeni Teknoloji Dosya Sistemi (NTFS)** Windows NT/200x/XP/Vista/7/10 için tercih edilen dosya sistemidir. Ne yazık ki, Linux’un NTFS desteği halen istenen seviyede değildir. 2.6.x çekirdek serisinden itibaren Linux, NTFS'yi güvenilir bir şekilde okuyabilir ve mevcut dosyaların üzerine yazabilir, ancak Linux çekirdeği yeni dosyaları bir NTFS bölümüne yazamaz. NTFS-3G isimli yeni adaptör ile oldukça verimli okuma yazma yapabilirsiniz, fakat production bir ortam için sizlere NTFS kullanmanızı tavsiye etmem.  

**HFS ve HFS+**  Apple, MacOS ile Hiyerarşik Dosya Sistemini (HFS) uzun süredir kullanmaktadır ve Linux HFS+ üzerine okuma/yazma desteği yoktur. Bu nedenle Mac kullanıcılarıyla dosya alışverişi yaparken exFAT kullanmak daha mantıklıdır. Apple, HFS+ (Genişletilmiş HFS) ile büyük sabit diskleri ve birçok Unix benzeri özelliği daha iyi desteklemek için HFS'yi genişletmiştir.  

**ISO-9660** CD-ROM'lar için standart dosya sistemi uzun süredir ISO-9660'tır. Bu dosya sistemi çeşitli düzeylerde gelir. Seviye 1, yalnızca 8.3 dosya adını desteklemesi açısından orijinal FAT'a benzer. Benzer şekilde Joliet, Windows için uygulandığı şekliyle uzun dosya adları için destek sağlar. Bir disk Rock Ridge veya Joliet uzantıları içeriyorsa, Linux bunları otomatik olarak algılar.  
  
---
### Bir Dosya Sistemi Oluşturmak  
  
Linux içersinde oluşturmak istediğiniz Linux yerel dosya sistemleri dahil birçok farklı dosya sistemi araçlar(programlar) vardır. Tipik olarak, bu araçların `mkfs.[dosyasistemi-kısa-adı]` biçiminde program adları vardır, `burada dosya-sistemi-adı` ext4,ext3,xfs olabilir.  

Bu araçlar, mkfs adı verilen bir komut ile de kullanılabilir, dosya sistemi türü kodunu mkfs'ye '-t' seçeneğini vererek iletirsiniz, örn:  
  
``mkfs.ext4`` veya ``mkfs -t ext4`` /dev/vdc1  
``mkfs.xfs`` veya ``mkfs -t xfs`` /dev/vdc1  
``mkfs.btrfs`` veya ``mkfs -t btrfs`` /dev/vdc1  


Bu komut /dev/vdc1 üzerinde bir ext3 dosya sistemi yaratır. Dosya sistemine, diskin hızına ve bölümün boyutuna bağlı olarak, bu işlem bir saniyeden birkaç saniyeye kadar sürebilir. Çoğu dosya sistemi oluşturma aracı, bazıları bir dosya sistemi oluşturmak için gereken süreyi büyük ölçüde artırabilen ek seçenekleri destekler. Her bir blok kontrol edilerek atılan fisk formatı en uzun sürenidir, `-c` seçeneği birkaç dosya sistemi tarafından desteklenir. Bu seçeneği kullanırken dikkat etmeniz gerekir. blok kontrolü - bölümdeki her sektör, verileri güvenilir bir şekilde tutabileceğinden emin olmak için kontrol edilir. Eğer bir diskinizde kötü bloklar var ise lütfen o diskten biran önce kurtulun. Unutmayın kullanılmış diskler hassas veri içerebilir o yüzden kullanılmış disklerinizi çöpe kesinlikle atmayın. Ben eski disklerinizi silmenizi ve parçalamanızı tavsiye ederim.  

Aynı örnekten devam edecek olursak /dev/vdc1 isminde bir partition yaratmıştık, şimdi yeni diskimize ext4 format atalım.
````
root@ops.nucleuss ~ # fdisk -l /dev/vdc
Disk /dev/vdc: 20 GiB, 21474836480 bytes, 41943040 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: dos
Disk identifier: 0xffc8c0e5

Device     Boot Start      End  Sectors Size Id Type
/dev/vdc1        2048 41943039 41940992  20G 83 Linux
root@ops.nucleuss ~ # mkfs.ext4 /dev/vdc1
mke2fs 1.45.4 (23-Sep-2019)
Discarding device blocks: done
Creating filesystem with 5242624 4k blocks and 1310720 inodes
Filesystem UUID: 57d86323-1840-444f-9de8-1a0d901727e1
Superblock backups stored on blocks:
        32768, 98304, 163840, 229376, 294912, 819200, 884736, 1605632, 2654208,
        4096000

Allocating group tables: done
Writing inode tables: done
Creating journal (32768 blocks): done
Writing superblocks and filesystem accounting information: done

root@ops.nucleuss ~ # mkdir /srv/data02
root@ops.nucleuss ~ # mount /dev/vdc1 /srv/data02
root@ops.nucleuss ~ # mount
......
/dev/vdc1 on /srv/data02 type ext4 (rw,relatime)

````

/dev/vdc1 isimli diskinizin /srv/data02 altında ext4 dosya sistemi ile bağlantığını görebilirsiniz.  

Gelin bu işlemi laboratuvar altında tekrar edelim. 10 MB bir disk oluşturalım ve linux altında önce bir bölüm yaratalım, sonra dosya sistemi ve en sonunda mount edip üzerine veri yazalım.

bu işlem için bir program bilmemiz gerekiyor **dd**
  
---
### dd Programı
Bazen bir dosya sistemini çok düşük seviyede arşivlemek istersiniz. Örneğin, sabit diskinizde saklayabileceğiniz veya Linux'un anlayamayacağı bir dosya sistemini yedeklemek istersiniz. Veya yukarıdaki örnekte olduğu gibi boş bir dosya yaratmak ve bunun içerine bir dosya sistemi oluşturmak istersiniz. Bunu yapmak için dd programını kullanabilirsiniz. Bu program, düşük seviyeli bir kopyalama programıdır ve ona girdi `if` için aygıt dosyasını verdiğinizde, o bölümün içeriğini belirttiğiniz çıktı dosyasına/aygıtına kopyalar. Bu çıktı dosyası, bir disk bağlantısı(/dev/vdc1) tanımlayıcı, bir teyp aygıtı veya normal bir dosya olabilir. Girdi ve çıktı dosyaları `if=dosya` ve `of=dosya` seçenekleriyle belirtilir:

Backup için teyp ünitesine çıktı alırken
````
dd if=/dev/vdc1/ of=/dev/st5
````
Burada /dev/vdc1 disk bölümünü /dev/st0 'a (bir SCSI teyp sürücüsü) yedeklenir. Sonuçta yapılan yedekleme, `if=` ve `of=` seçeneklerinin yer değitirmesi ile geri yüklenebilir.  
````
dd if=/dev/st5/ of=/dev/vdc1
````
Dd yardımcı programı, tüm bölümlerin tam yedeklerini oluşturmak için iyi bir yol olabilir, ancak genel yedekleme aracı olarak kullanmanızı tavsiye etmem.

Bir dosya yaratmak için ise girdi kısmına /dev/zero vermemiz çıktı olarak ise bir dosya adı vermemiz gerekir, ayrıca her bir blok büyüklüğünü tanımlamamız gerekir.

```
dd if=/dev/zero of=/tmp/dosyasistemi.img bs=1024 count=10240
```
  
burada `bs` parametresi yani her seferine kaç byte yazacağı bilgisi , `count` ise  kaç tane bu blok veriden kopyalanacağı bilgisini verir. 1024 byte x 10 daha tanımladığımızda 10 MB'lık bir dosya oluşur.  
  
bundan sonraki süreçte /tmp/dosyasistemi.img dosyası oluşturalım ve üzerine bir dosya sistemi kurarak sunucumuza bağlayalım.  
  
bir klasöre ihtiyaç duyacağız /srv/disk1 , `dosyasistemi.img` isimli dosyayı oluşturup, ext4 dosya sistemi ile formatlayacağız ve `/srv/disk1` klasörüne bağlayacağız.  
  
```.term1
mkdir -p /srv/disk1
dd if=/dev/zero of=/tmp/dosyasistemi.img bs=1024 count=10240
mkfs.ext4 /tmp/dosyasistemi.img
mount /tmp/dosyasistemi.img /srv/disk1
```
>
```Yekiler yüzünden, Size verdiğimiz platform üzerinde yukarıdaki testi yapamazssınız!! 
```  
    
şuanda yeni bir dosya sistemi ile birlikte bir disk yarattık. bu disk içersine girip dosyalar yaratabilirsiniz, bu klasörü şifreler ve istediğiniz yere taşıyabilirsiniz.  

Bu yöntem genellikle takas alanı (SWAP) kapasitesini arttırmak için kullanılan bir yöntemdir. Fakat çok farklı kullanımlarını da gördüm. Cluster sistemleri için yaratılmış dosyalardan, sanallaştırma için yaratılan imajlara kadar bir çok kullanım alanı vardır.  
  
---
### Takas Alanı(SWAP) Oluşturma  

Bazı bölümler dosya barındırmaz. Linux, işletim sisteminin bellek uzantısı olarak değerlendirdiği bir bölüm olan bir takas bölümü kullanabilir. Windows üzerinde aynı şekilde PAGEFILE mevcuttur. Linux, takas alanını tanımlamak için 0x82 MBR bölüm türü kodunu kullanır, ancak diğer bölümlerde olduğu gibi, bu kod çoğunlukla diğer işletim sistemlerinin Linux takas bölümlerine erişmeye çalışmasını engellemek için belirlenmiştir.  
  
Linux üzerinde takas alanı olarak hangi bölümlerin kullanılacağını tanımlamak için /etc/fstab kullanır. işletim sisteminde `free -m` komutu ile MB birimiyle bağlanmış bulunan takas bilgisi size gelir, aşağıda 4GB takas alanı olan bir sunucu görüyorsunuz.  
  
````
~$ free -m
              total        used        free      shared  buff/cache   available
Mem:         257840      138794       39478          67       79567      116744
Swap:          4095           7        4088
````
  
Takas alanı kendi başına bir dosya sistemini barındırmasa ve bu şekilde monte edilmemiştir. Takas alanı aşağıdakine benzer bir hazırlık gerektirir.
Öncelikle `mkswap` ile bir dosya sisteminin oluşturulması, sonrasında `swapon` komutu ile bu bu alanın aktive edilmesi gerekir.  
  
mkswap /dev/vdd  
swapon /dev/vdd  
  
---
### Blümler ile ilgili farklı format seçenekleri

| Bölüm | Biçim türü | Örnek Komut | Notlar |
|---|---|---|-|
|/dev/sda6|ext4|`mkfs -t ext4 -L veriler`/dev/sda6| İsmini *veriler*. Veya `mkfs.ext4` komutu ile tanımlayın|
|/dev/sdb5|xfs|`mkfs -t xfs -i size=4096 /dev/sdb5`|daha büyük inode'lara sahip olmasını söyleyen (normal 256'dır)|
|/dev/sda8|ReiserFS|`mkfs -t reiserfs /dev/sda8`|Veya` mkreiserfs` komutunu kullanabilirsiniz|
|/dev/sdc|FAT32|`mkfs -t vfat /dev/sdc`|Veya` mkfs.vfat` komutunu kullanabilirsiniz|
|/dev/sda6|swap|`mkswap /dev/sda6`| takas alanı olarak kullanılacak |
  
---
### Dosya Sisteminin Sağlığını Koruma  

Dosya sistemleri çeşitli şekillerde "hasta" olabilir. Çok fazla veriyle aşırı yüklenebilirler, sisteminize uygun olmayan şekilde ayarlanabilirler veya buggy sürücüler, buggy yardımcı programlar veya donanım hataları nedeniyle bozulabilirler. Neyse ki Linux, dosya sistemlerinizin durumunu takip etmenize, performanslarını ayarlamanıza ve düzeltmenize yardımcı olabilecek çeşitli yardımcı programlar sağlar.  

ext2/ext3/ext4 dosya sistemleri için  
dumpe2fs  

Xfs dosya sistemi için  
xfs_info  
  
---
### Dosya Sistemlerini Kontrol Etme  

Bir dosya sistemini ayarlamak, büyük olasılıkla arada bir gerçekleştireceğiniz bir görevdir - 

örneğin, bir kurulumda büyük değişiklikler yaparken. Başka bir görev çok daha yaygındır: bir dosya sistemini hatalar için kontrol etmek. Hatalar, elektrik kesintileri ve mekanik sorunların tümü, bir dosya sistemindeki veri yapılarının bozulmasına neden olabilir.  
  
Sonuçlar bazen belirsizdir, ancak işaretlenmezlerse ciddi veri kaybına neden olabilirler. Bu nedenle Linux, bir dosya sisteminin bütünlüğünü doğrulamak ve mevcut olabilecek sorunları düzeltmek için araçlar içerir.  
  
Bu amaçla kullanacağınız ana araca fsck denir. Bu program aslında e2fsck (fsck.ext2, fsck.ext3 ve fsck.ext4 olarak da bilinir) veya XFS’nin xfs_check ve xfs_repair gibi diğer araçların ön uçudur. Fsck için sözdizimi aşağıdaki gibidir:

fsck [-sACVRTNP] [-t fstype] [-] [fsck-seçenekleri] dosya sistemleri

Tüm Dosyaları Kontrol Et -A seçeneği, fsck'nin / etc / fstab içinde işaretlenmek üzere işaretlenmiş tüm dosya sistemlerini kontrol etmesine neden olur. Bu seçenek normalde sistem başlatma komut dosyalarında kullanılır. İlerlemeyi Göster -C seçeneği, kontrol işleminin bir metin modu ilerleme göstergesini görüntüler.  
  
Çoğu dosya sistemi denetim programı bu özelliği desteklemez, ancak e2fsck destekler. Ayrıntılı Çıktı Göster -V seçeneği, kontrol sürecinin ayrıntılı çıktısını üretir. Eylem Yok -N seçeneği fsck'ye normalde ne yapacağını gerçekten yapmadan göstermesini söyler. Dosya Sistemi Türünü Ayarlayın Normalde, fsck dosya sistemi türünü otomatik olarak belirler.  
  
Yazıyı -t fstype fl ag ile zorlayabilirsiniz. -A ile birlikte kullanıldığında, bu, programın, diğerleri kontrol edilmek üzere işaretlenmiş olsa bile, yalnızca belirtilen dosya sistemi türlerini kontrol etmesine neden olur. Fstype'ın önüne hayır koyulursa, belirtilen tür dışındaki tüm dosya sistemleri kontrol edilir.  
  
---
### Disk Kullanımının İzlenmesi
Disklerle ilgili yaygın bir sorun, doldurabilmeleridir. Bu sorunu önlemek için, dosyalarınızın ne kadar alan kapladığını size söyleyecek araçlara ihtiyacınız var. Bu, disk kullanımını sırasıyla bölümlere ve dizine göre özetleyen df ve du programlarının görevidir.  
  
---
### Dosya sistemi kontrol ve yapılandırma komutları
_df, du, mount, umount, free, /etc/fstab_

---
### **du** Disk Usage - disk kullanımı

**du** dizinlerin ve dosyaların kullanılan alanı hakkında bilgi verir. Ortak anahtarlar şunlardır:  

|parametre| açıklaması|
|-h| baskı boyutları 1024'ün katları (ör. 100M)|
|-c | genel toplamı gösterir|
|--max-deep 2 | sadece 2 dizini gösterir|
|-s| Yalnızca özeti gösterir, tüm dizinleri tek tek göstermez|

```.term1
du /usr/ -s -h
```

Çıktı size /usr dizini altındaki toplam boyutu gösterir. Ben çoğunlukla * ile kullanırım, aşağıdaki gibi.  

```.term1
du -hs /usr/*
```
gördüğünüz gibi parametreleri birlikte de verebilirsiniz.  
  
---
### **df** Disk Free - Disk Boşluğu ne kadar?
**df** Disk Free komutu, dosya sistemlerinin boş ve kullanılan alanını bulmak için kullanılır.

inode dosyalar hakkındaki bilgileri içerir. Sahibi kimdir, en son ne zaman kullanıldığı veya düzenlendiğini, boyutu, bir dizin olup olmadığı ve eğer varsa erişim hakları gibi bilgiler. Inode numarası belirli bir dosya sistemi içinde benzersizdir ve ayrıca dosya seri numarası olarak da bilinir.

df kullanımı oldukça kolaydır, aşağıda kullanımını görebilirsiniz.

```.term1
df -Th
```
  
<center><img src="{{site.baseurl}}/images/df-h.png" width="80%"></center>  
  

buradaki komut `-i` parametresi size boş olan inode sayısını verir.
```.term1
df -i
```

Yukarıda `-T` anahtarı df'yi dosya sistemi türlerini gösterecek hale ve `-h` sayıları insan tarafından okunabilir hale getirir (1000'in katlarında). 

>
````
Inode çıktısı size boş ve kullanımda olan Inode sayılarını verir, yeni bir dosya oluşturmak için bir Inode ihtiyacınız olur. Yeni bir bölüm yarattığınızda size tam bir alan verir yani 1TB gibi bir alan, sonrasında bölüme format attığınızda size kullanılabilir alan olarak 980GB verir. Burada yok olan miktar disk üzerindeki dosya sistemi için kullanılacak inode'lar için ayrılmıştır.
````
  
---
### Dosya sistemi için Diğer araçlar


| dosya sistemi | komut | kullanım |
| --- | --- | --- |
| ext | tune2fs | Ext2 ve ext3 parametrelerini gösterin veya ayarlayın ya da günlük kaydı seçeneklerini ayarlayın |
| ext | dumpe2fs | Bir ext2 veya ext3 dosya sistemi için süper blok ve blok grubu tanımlayıcı bilgilerini yazdırır. |
| ext | debugfs | Etkileşimli bir dosya sistemi hata ayıklayıcısıdır. Bir ext2 veya ext3file sisteminin durumunu incelemek veya değiştirmek için kullanın. |
| reiserfs | reiserfstune | parametreleri gösterme ve ayarlama |
| reiserfs | hata ayıklayıcılar | Bir ext2 veya ext3 dosya sistemi için süper blok ve blok grubu tanımlayıcı bilgilerini yazdırır. |
| XFS | xfs\_info | bilgi görüntüleme |
| XFS | xfs\_growfs | dosya sistemini genişlet |
| XFS | xfs\_admin | XFS dosya sistemlerindeki parametreleri değiştirme |
| XFS | xfs\_repair | sorunları onarmak |
| XFS | xfs\_db | dosya sistemini denetler ve hatalarını ayıklar |
  
---
### Dosya sistemi bağlama ve disk yapılandırma tablosu  
  
---
### Dosya sistemi bağlama/ayırma (mount/umount)  

Linux'ta disk takma, aslında sistemdeki bölümlenmiş ve biçimlendirilmiş bir sabit diske erişme işlemidir. Bir sabit diskte depolanan veriler ne olursa olsun, yalnızca o sabit diski Linux İşletim Sistemine taktıktan sonra erişilebilir veya kullanılabilir.  
  
Windows sisteminin USB yuvasına bir harici disk takıldığında bildiğimiz gibi, harici disk otomatik olarak Windows ana klasörüne erişime açık olacaktır. Bunun nedeni Windows işletim sisteminde has PnP seçenekleridir.  
  
Ancak Linux'ta sisteme bir sabit disk yerleştirmek veya bağlamak bu diske erişmek için yeterli değildir. Erişmeden önce, sabit diskin bölümlere ayrılması, biçimlendirilmesi ve ardından sisteme takılması gerekir. Ancak sabit disk, Linux sisteminin tekli veya çoklu klasörlerinden herhangi birine bağlanabilir.  
  
Harici bir diskiniz olsun ve linux sunucunuz üzerine bağlamanız gereksin, sabit diskin montaj konumu konusunda herhangi bir kısıtlamanız yoktur. Yani kendi oluşturduğunuz `/srv/mountme` ismindeki dizine de bağlayabilirsiniz `/home/senol/disklerim` altına da. 

Bir Linux dosya sistemindeki tüm dosyalar '/' köklü büyük bir ağaç şeklinde düzenlenmiştir. Bu dosyalar, bölüm tablonuza göre çeşitli cihazlara yayılabilir, başlangıçta ana dizininiz bu ağaca bağlanır (yani eklenir) ' / ', diğerleri GUI arayüzü (varsa) veya mount komutu kullanılarak manuel olarak monte edilebilir.  
  
mount komutu, bir aygıtta bulunan dosya sistemini ‘/‘ köklü büyük ağaç yapısına (Linux dosya sistemi) bağlamak için kullanılır. Tersine, bu cihazları Ağaçtan ayırmak için başka bir umount komutu kullanılabilir.

örnek kullanım:  
  
$ mount -t dosya_sistemi Donanım BağlanılacakKlasör  

**Linux üzerinde CD-Rom bağlamak,**  

$ mount /dev/cdrom /mnt

`/mnt` klasörü temporary(geçici) mount işlemleri için kullanılabilir  

yukarıdaki komut ile cdrom donanımınızı /mnt klasörü altına bağlarsınız, ben yıllar içersinde `/srv` dizini altında klasör yaratmayı ve mount ettiğim harici donanımları ve operasyonel donanımları buraya bağlamayı tercih ediyorum. Operasyonel ve kullanım açısından bu tip bir standartlaşma size çok faydalı olacaktır.  

**iso dosyasını yerel bir klasöre bağlamak**  
  
$ mount -o loop ubuntu20-10.iso /srv/cdrom/ubuntu
  
  
**Bağlı bir diskin bağlantısını sonlandırmak**  
  
$ umount /srv/cdrom/ubuntu  
  
  
---
### **/etc/fstab** Filesystem table Dosya sistemleri tablosu  

``/etc/fstab`` içinde bulunan fstab dosyası, dosya sistemleri ve genellikle önyükleme sırasında kullanılan (ancak bunlarla sınırlı olmayan) bağlama noktaları arasındaki ilişkiyi içeren dosyadır. Şimdi bir örneğe bakalım:
  
````
#<DeviceName> <mountPoint>   <type>  <options>       <dump>  <pass>
UUID=f95103a7-93ac-47b1-bda0-feef8030c157       /                       xfs     defaults        0 0
UUID=2207935a-e1aa-48a1-961c-ec931f97be12       /srv/data01     xfs     defaults 0 0
````
  
```.term1
cat /etc/fstab
```  
  
#### **blkid** **lsblk** Benzersiz Blok isimleri, Device yerine  

Universally unique identifier veya UUID çok kullanışlı bir donanım mahlası sağlar. Bu mahlas, bölümü tanımlamak için birkaç farklı yerde kullanılır. En yaygın kullanımı /etc/fstab üzerindedir.  
  
Dosya Sistemlerinizin UUID'sini Nasıl Bulunur?  
Bölümlerinizin UUID'sini bulmak için blkid komutunu gösterildiği gibi kullanabilirsiniz.  
  
Önce sunucumuz üzerindeki diskleri listelememiz gerekiyor.  ``lsblk`` ile bağlı bulunan diskleri ve disk formatlarını listeliyoruz.  
  
```.term1
lsblk
```

Şimdi ise istediğimiz disk için UUID nedir, onu öğreniyoruz.  

```.term1
blkid | grep sda1
```  
  
**UUID değiştirme**  
`tune2fs` ile  `-U random` parametresiyle /dev/sda3 diski üzerine yeni bir UUID generate edip, çıktıyı /dev/sda3 yazıyoruz.  
```.term1
umount /dev/sda3
tune2fs /dev/sda3 -U random /dev/sda3 
blkid | grep sda3
```
>
```Yetkiler yüzünden, Size verdiğimiz platform üzerinde yukarıdaki test gibi testler çalışmayacaktır!! 
```  
  
**DeviceName-Blok cihazı**  
(veya UUID) ilk alanda belirtilir. Bir blok aygıt (/dev/sdXX), Evrensel Benzersiz Kimlik (bu durumda olduğu gibi), bir Etiket (önek: LABEL =) veya hatta remote: / shared gibi bir ağ yolu olabilir.  
**mountPoint-Bağlama noktası**  
aygıtın bağlanacağı yoldur(/mnt gibi). Bir aygıtın dizin içeriğini başka bir dizine eklemek gibi düşünün. Bu örnekte yol /home, ikinci önemli satırdan önce boştur, ancak ondan sonra doldurulur.  
**type-Dosya sistemi türü**  
üçüncü alanlardır ve birinci alanda belirtilen aygıt / yolda bulunan dosya sistemine bağlı olarak uyarlanması gerekir.  
**options-Seçenekler**  
mount komutuna geçirilen dördüncü alanda belirtilir. her bir dosya sistemi için farklı parametreler vardır.  
**dump-Dök**  
beşinci alandır. Dump, dosya sistemlerini yedeklemek için kullanılan eski bir programdır, günümüzde çoğu dağıtımda varsayılan olarak yüklenmemektedir. Bu alan 0 (döküm yapmayın) veya 1 (döküm çalıştırma) olabilir.  
**pass-gecis**  
altıncı alandır. Bu alan, önyükleme sırasında dosya sisteminin (mümkünse) kontrol edilip edilmeyeceğini belirtir. İzin verilen değerler 0, 1, 2'dir. 0, önyükleme sırasında fsck çalıştırılmayacağı, 1 ve 2'nin fsck gerçekleştireceği anlamına gelir. Değer 1, yalnızca kök dizine ayrılmalıdır.  
  
**Örnek parametre kullanımı,**  
Mount edilebilecek bir disk ortamınız var ise aşağıdaki gibi dosya sistemi `-t ext4` tanımlayarak bağlayabilirsiniz.  
```.term1
mount -t ext4 /dev/sda2 /srv/data01
```
  
Parametre vererek bağlı bulunan bir bölümü tekrar farklı parametreler ile bağlayabilirsiniz.  
```.term1
mount -o remount,ro /dev/sda2
```
  
>
```Yekiler yüzünden, Size verdiğimiz platform üzerinde yukarıdaki testi yapamazssınız!! 
```  
  
-----
## 5. Paket Yönetim Sistemleri (RPM ve deb)

Paket yöneticisi veya paket yönetim sistemi, bir bilgisayarın işletim sistemi için bilgisayar programlarını tutarlı bir şekilde yükleme, yükseltme, yapılandırma ve kaldırma sürecini otomatikleştiren bir yazılım araçları koleksiyonudur. Windows üzerindeki Program Ekle kaldır ve AppStore'lar bunların bilindik popüler örnekleridir.  

Bir paket yöneticisi, arşiv dosyalarındaki paketler, yazılım dağıtımları ve verilerle ilgilenir. Paketler, yazılımın adı, amacının açıklaması, sürüm numarası, satıcı, sağlama toplamı (tercihen bir kriptografik paketleme işlevi) ve yazılımın düzgün çalışması için gerekli olan bağımlılıkların listesi gibi meta verileri içerir.  
  
Kurulumun ardından, meta veriler yerel bir paket veritabanında saklanır. Paket yöneticileri, yazılım uyumsuzluklarını ve eksik önkoşulları önlemek için genellikle bir yazılım bağımlılıkları ve sürüm bilgileri veritabanı tutarlar. Yazılım havuzları, ikili depo yöneticileri ve uygulama depoları ile yakın çalışırlar.

Paket yöneticileri, manuel yükleme ve güncelleme ihtiyacını ortadan kaldırmak için tasarlanmıştır. Bu, işletim sistemleri tipik olarak yüzlerce hatta onbinlerce farklı yazılım paketinden oluşan büyük kuruluşlar için çok yararlıdır.

20-25 Sene öncesinde çok temel paketler dışında Dağıtımlar içersinde oldukça az yazılım paketi hazır gelirdi, bunları sizin derleyip(compile) kullanmanız gerekirdi.  
  
Bu yüzden eskiden make, gcc ve install gibi komutlar çok sıklıkla sizin bağımlılık sorunlarıyla karşılaşmanıza sebep olurdu. Son yıllarda neredeyse tüm açık kaynak kod yazılımlar mutlaka bir dağıtım tarafından sağlanıyor.

Aşağıda şuanki tüm linux paket yöneticileri ve karşılaştırmalı şekilde aynı komutları görebilirsiniz.


| **işletim sistemi** | paket formatı | paketleme programı | paket yöneticisi(ileri seviye)|
| Suse/opensuse | ``.rpm`` | rpm | zypper |  
| Centos/Redhat/Fedora |  ``.rpm`` | rpm | yum/dnf |  
| Debian Türevleri | ``.deb`` | dpkg | apt-get/aptitude/apt |  
  
Komutlar her bir paket yöneticisi için özel olsa da, çoğu paket yöneticisi benzer işlevler sunduğundan büyük ölçüde birbirine çevrilebilir.  


| **İşlem** | **zypper** | **apt** | **dnf(yum)** |
| Paket kur | ``zypper in Paket`` | ``apt install Paket`` | ``yum install Paket`` |
| Paket sil | ``zypper rm -RU Paket`` | ``apt remove Paket`` | ``dnf remove --nodeps Paket`` |
| Paket sil(alt paketlerle) |`` zypper rm -u --force-resolution Paket`` | ``apt autoremove Paket``| ``dnf remove Paket`` |
| Yazılım kütüğünü güncelle | ``zypper ref`` | ``apt update`` | ``yum check-update`` |
| Güncell. Paket. listele | ``zypper lu`` | ``apt list --upgradable`` | ``yum check-update`` |
| Sil(bağlı paketler ve konfigler) | ``zypper rm -u`` | ``apt autoremove`` | ``dnf erase Paket`` |
| Bağıl paketi olmayanları listele (orphan) | ``zypper pa --orphaned --unneeded`` | | ``package-cleanup --quiet --leaves --exclude-bin``|
| herşeyi güncelle | ``zypper up`` | ``apt upgrade`` | ``yum update`` |  
  
---
### Paket yönetim sistemleri nasıl çalışır?  
Belirli bir paket, paylaşılan bir kitaplık veya başka bir paket gibi belirli bir kaynak gerektiriyorsa, bir bağımlılığı olduğunu düşünebilirsiniz. Tüm modern paket yönetim sistemleri, bir paket kurulduğunda tüm bağımlılıklarının da kurulmasını sağlamak için bazı bağımlılık çözümleme yöntemleri ve veritabanları kullanır.  
  
---
### Paketleme Sistemleri**  
Modern bir Linux sistemine kurulan yazılımların neredeyse tamamı İnternette bulunacaktır. Dağıtım satıcısı tarafından merkezi depolar aracılığıyla sağlanabilir (her biri dağıtım için özel olarak oluşturulmuş, test edilmiş ve bakımı yapılmış binlerce paket içerebilir) veya manuel olarak indirilip kurulabilen kaynak kodunda mevcut olabilir.  
  
Farklı dağıtım aileleri farklı paketleme sistemleri kullandığından (Debian: *.deb / CentOS: *.rpm / openSUSE: *.rpm), bir dağıtım için çalışan bir paket başka bir dağıtımla uyumlu olmayacaktır.  
  
Kurduğunuz Linux işletim sistemi üzerine bir programı 3 şekilde kurabilirsiniz,  
1. Compile ederek, kaynak koda, derleyiciye ve kütüphanelere ihtiyacınız vardır(maceralı bir yol)  
2. Paket programı (dpkg veya rpm), Debian kullanıyorsunuz ve bağımlılığı olmayan bir abc.deb dosyasını kurmak istiyorsunuz, neden olmasın  
3. zypper/apt/yum ile paketin bir repository üzerinden yüklenmesi apache, mysql, php kuracaksınız, repo üzerinden örn. apt search mysql ile arayıp bulun ve kurun programınızı, en temiz kurulum şeklidir.
  
---
### Paketleme programı örnekleri (rpm/dpkg)

dpkg ve rpm için en çok kullanılan komut satırı kombinasyonları.  

**yeni bir paket kurmak**  
$ dpkg -i paketadi.deb  
$ rpm -i paketadi.rpm  

**Kurulu bir paketi güncellemek**  
$ dpkg -i paketadi.deb  
$ rpm -U paketadi.rpm  


**Kurulu tüm paketleri listeleme**`en sık kullanacağınız komut!`  
```.term1
dpkg -l
```
  
$ rpm -qa  
  
Mesela sunucunuz üzerinde mysql programı çalışıyor fakat nasıl kurulduğunu bilmiyorsunuz,

``$ dpkg -l | grep mysql``  
``$ rpm -qa | grep mysql``  

size kurulu paketin nereden geldiğini söyleyecektir.  

ben size üstteki grep'li kullanımı tavsiye ederim fakat paketleme programı da size program adını biliyorsanız aynı sonucu getirir.  
mysql isimli programı aramak için aşağıdaki şekilde arama yapabilirsiniz.  

$ dpkg --status mysql  
$ rpm -q mysql  


**Dosya ile hangi paketin kurulduğu bilgisi**  
$ dpkg --search program_dosyası_adi     
$ rpm -qf program_dosyasi_adi  

örn.  
$ rpm -qf /usr/share/vim/menu.vim  
vim-....
  
---
### Paket Yöneticileri Kullanım örnekleri(apt/yum)  

**Paket aramak**  
Önce aptitude/apt paketini kuruyoruz, bu paket yeni ubuntu/debian sürümlerinde varsayılan olarak kurulmaktadır  
```.term1
apt-get update&&apt-get install -y aptitude
```


$ aptitude update  
$ aptitude search Paketadı  

(paket isimlerinde arama yapmak için)  
$ yum search Paketadı  

(açıklamalar içinde arama yapmak için)  
$ yum search all Paketadı  

Örnek olarak sadece programın uzun adının bir kısmını bilelim "Midnight Commander", burada "Midnight" ile bir arama yaparsak programı bulabiliriz.

<center><img src="{{site.baseurl}}/images/yum-search.png" width="100%"></center>  

`yum search all xxx` yaptığınızda tüm açıklamalarda arama yaptığınız için kolaylıkla aradığımız yazılımı bulabildik.

apt üzerinde local search yapmak için aşağıdaki komut yazılmalıdır.   

```.term1  
apt search ^mc$
```
apt regular expression destekler, yani burada ``^`` karakteri bağlangıç için ilk harfin ``m`` olması gerektiğini ve ``$`` ile biten son harfin c olması gerektiğini söylüyor. aynı şekilde mysql-server paketini aramak isterseniz ``apt search ^mysql-server$`` yazmanız gerekir.  
  
veya grep kullanarak aramanızı daraltmanız mümkündür.  
  
```.term1
aptitude search mc|grep Midnight
```

#### Repository üzerinden paket yüklemek.

Bir paketi kurarken, paket yöneticisi tüm bağımlılıkları çözdükten sonra kurulumu onaylamanız istenebilir. Güncellemeyi(update) veya yenilemeyi çalıştırmanın (kullanılan paket yöneticisine göre) kesinlikle gerekli olmadığını, ancak kurulu paketleri güncel tutmanın güvenlik ve bağımlılık nedenleriyle iyi bir sistem yöneticisi uygulaması olduğunu unutmayın.  

Öncelikler **aptitude** yazılımını kuralım, yeni ubuntu sürümlerinde varsayılan paket yöneticisi olarak apt/aptitude gelmektedir.  
  

```.term1
apt-get update && apt-get install aptitude -y
```

  
$ aptitude update && aptitude install Paket_Adı  
$ yum update && yum install Paket_Adı  
$ zypper refresh && zypper install Paket_Adı  
  

Yukarıda verdiğimiz örnekten hareketle mc "Midnight Commander" paketini kuralım. Burada kullandığımız `-y` parametresi bize onaylatmasına gerek kalmadan kurması içindir.  
  
```.term1
apt install mc -y
```

```.term1
mc
```
exit yazarak entera basarsanız MC arayüzünden çıkabilirsiniz. Midnight Commander özellikle efsanevi Norton Commander programını kullanmış olan kişiler için vazgeçilmezdir. Norton Commander anısına yazılmıştır, arayüz üzerinden onlarca işlemi kolaylıkla yapabilirsiniz. 

---
### Repository üzerinden paket silmek

``remove`` seçeneği paketi kaldırır, ancak yapılandırma dosyalarını olduğu gibi bırakır, oysa temizleme ``purge``, programın tüm izlerini sisteminizden siler.  

$ aptitude remove Paket_Adı  
$ aptitude purge Paket_Adı  

$ yum erase Paket_Adı  

Paket yönetim yazılımları mutlaka sizin onayınızı isteyeceklerdir. ``-y veya -a`` gibi onay parametreleri verebilirsiniz, silme işlemleri için otomatik parametre vermemenizi tavsiye etmem.  
  
Burada henüz yeni kurmuş olduğumuz mc "Midnight Commander" yazılımını nasıl sileceğimizi gösteriyoruz.
```.term1
apt purge mc
```
onaylamanızı isteyecektir, sonrasında bağlı bulunan bazı paketleri silmediği bilgisini verir ve isterseniz `apt autoremove` ile kurulmuş fakat fonksiyonel olmayan paketleri silebileceğiniz bilgisi verilir.  

```.term1
apt autoremove -y
```

---
### Paket Hakkında bilgi verme
mc isimli program "Midnight Commander", hakkında bilgi edinmek için aşağıdaki şeklide `show` ve `info` parametreleri kullanılır.  

```.term1
apt show mc
```
  
Centos üzerinde aynı sonucu aşağıdaki komut kullanımı ile alabilirsiniz.  

$ yum info mc  
  
---
### Paket yöneticisi dosyaları 

Debian türevi işletim sistemleri için `/etc/apt/sources.list` dosyası paketlerin güncelleneceği repository bilgisini içerir. Ayrıca kaynakların listesini `/etc/apt/sources.list.d/` klasörü altındaki dosylarda tutar.  

Centos için `/etc/yum.repos.d/` dizini altında bulunan `.repo` dosyları mevcuttur ve bu dosyalar üzerinden reposity tanımları yapılır.  

Yeni kurulmuş bir sistemde Paket yönetimi configurasyonu, kurulum sırasında sorulan sorulara göre yapılandırılır. Yani Almanya veya Türkiye de olmanıza göre size bir repository tanımlanır vs.  
  
### Paket yöneticisi ile sistemi güncellemek

Paket yöneticileri aynı zamanda kurulu bulunan tüm paketleri güncelleyebilirler, hatta işletim sistemi bir üst sürüme taşıyabilirler(debian tabanlı makinelerde).  

Centos için:  
$ yum update -y

Debian tabanlı işletim sistemleri için:  
  
```.term1
apt-get update&&apt-get upgrade -y
```
veya  
  
```.term1
apt-get update && apt-get install aptitude -y && aptitude upgrade -y
```
>
````Sunucularınızda güvenlik güncelleştirmelerini otomatik yükleyecek ayarları yapmanızı herzaman tavsiye ederim. Güvenlik güncelleştirmeleri genellikle oldukça küçük paketler ile yapılır fakat etkileri çok büyük olabilir.
````  
Debian türevi işletim sistemleri için otomatik güvenlik güncelleştirmesi ayarları.  
[Centos /Rhel için](https://www.tecmint.com/auto-install-security-patches-updates-on-centos-rhel/)  
[Debian /Ubuntu için](https://www.tecmint.com/auto-install-security-updates-on-debian-and-ubuntu/)
  
-----
## 6. Library (Kütüphaneler) ve paket yönetimindeki önemi

Çoğu Linux yazılımı, büyük ölçüde paylaşılan kitaplıklara dayanır. Linux 101 eğitimimize başladığımızda Richar Stallman ve Öneminden bahsetmiştim, Linux işletim sistemi üzerindeki her yazılım halen kütüphaneler üzerinden compile edilmekteler. Paylaşılan kitaplık paketlerinin yönetilmesinde bazen ortaya bazı sorunlar çıkmaktadır.  
  
Örneğin, bir kitaplık kurulmamışsa veya yanlış sürümse, bir paketi kurarken yüksek ihtimalle sorun yaşarsınız. Kütüphane yönetimi, yalnızca onları yapılandırmanın ötesine geçer. Bunu anlamak için önce birkaç kütüphane ilkesini anlamalısınız.  
  
Daha sonra kitaplık yolunu belirlemeye ve kitaplıkları yöneten komutları kullanmaya devam edebilirsiniz. Kütüphane İlkeleri bir kütüphanenin arkasındaki fikir, yaygın olarak kullanılanlar sağlayarak programcıların hayatlarını basitleştirmektir.  
  
En önemli kitaplıklardan biri, işletim sistemindeki üst düzey özelliklerin çoğunu sağlayan C kitaplığıdır (libc). Diğer bir yaygın kitaplık türü, Grafik Arabirim GUI'lerle ilişkilidir. Bu kitaplıklara, programlar tarafından kullanılan ekran widget'larını (düğmeler, kaydırma çubukları, menü çubukları vb.) Sağladıkları için genellikle pencere öğesi kümeleri adı verilir.  
  
---
### Kütüphane yolunun ayarları  
Kitaplık yolunu ayarlamanın ilk yolu /etc/ld.so.conf dosyasını düzenlemektir. Bu dosya, her biri paylaşılan kitaplık dosyalarının bulunabileceği bir dizini listeleyen bir dizi satırdan oluşur. Bu dosya yarım düzine ile birkaç düzine dizini listelemektedir. Bazı dağıtımların bu dosyada ek bir tür satırı bulunur.  

Kütüphanelerin kullanımı ile ilgili sorun yaşıyorsanız, 

$ export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/usr/lib64  

Dinamik olarak bağlanabilen kitaplıkların aranacağı ek dizinlerin bir listesini sağlamak için yürütme sırasında $LD_LIBRARY_PATH bakılır.  
  
---
### Linux'ta Paylaşılan Kitaplıkları Bulma
Paylaşılan kitaplıklar ld.so (veya ld.so.x) ve ld-linux.so (veya ld-linux.so.x) programları tarafından yüklenir. burada x ile belirtilen kısım sürüm anlamında kullanılır. Linux'ta /lib/ld-linux.so.x, bir program tarafından kullanılan tüm paylaşılan kitaplıkları arar ve yükler. Bu isim ve lokasyon, daha çok tarihi bir lokasyondur.

Bir program, kitaplık adını veya dosya adını kullanarak bir kitaplığı çağırabilir ve bir kitaplık yolu, kitaplıkların dosya sisteminde bulunabileceği dizinleri saklar. Varsayılan olarak, kitaplıklar /usr/local/lib, /usr/local/lib64, /usr/lib ve /usr/lib64 dizinlerinde bulunur.  
sistem başlatma kitaplıkları /lib ve /lib64 içindedir. Bununla birlikte, programcılar kitaplıkları özel konumlara kurabilir.

Kütüphane yolu,  /etc/ld.so.conf içersinde tanımlanmaktadır.
  
---
###  /etc/ld.so.conf  içeriğini görüntüleme  
```.term1
less /etc/ld.so.conf
```

Bu dosyadaki satırlar, çekirdeğe /etc/ld.so.conf.d yoluna dosya yüklemesini söyler. Bu şekilde, paket bakıcıları veya programcılar kendi özel kitaplık dizinlerini arama listesine ekleyebilir.

/etc/ld.so.conf.d dizinine bakarsanız, bazı yaygın paketler için .conf dosyalarını görürsünüz.
  
---
###  **ldd** Linux'ta Paylaşılan Kitaplıkları Yönetme
Şimdi paylaşılan kütüphanelerle nasıl başa çıkılacağına bakalım. Bir ikili dosya için tüm paylaşılan kitaplık bağımlılıklarının bir listesini almak için, ``ldd`` yardımcı programını kullanabilirsiniz. ldd'nin çıktısı aşağıdaki gibidir.  


```.term1
ldd /usr/bin/ls
```
veya

```.term1 
ldd /bin/ls
```
  
bize bağlı olan tüm paylaşımlı kütüphanelerin listesini verir.  
  
---
### **ldconfig** , ld configurasyonu ve linklerin düzenlenmesi

Varsayılan olarak, ldconfig /etc/ld.so.conf içeriğini okur, dinamik bağlantı dizinlerinde uygun sembolik bağlar oluşturur ve ardından /etc/ld.so.cache'ye bir önbellek yazar. Diğer programlar buradaki yolları ve sembolik linkleri böylece kullanabilirler.

Bu, özellikle yeni paylaşılan kitaplıklar kurduğunuzda veya kendi kitaplığınızı oluşturduğunuzda veya yeni kitaplık dizinleri oluşturduğunuzda çok önemlidir. Değişiklikleri etkilemek için ldconfig komutunu çalıştırmanız gerekir.

>
````
Sunucunuza Oracle veya SAP yazılımı kurduysanız, buradaki linkleme işleminin nasıl gerçekleştiğini ve yoğun bir şekilde kütüphanelerin tekrar linklenerek kurulum yapıldığına şahit olursunuz. Özellikle yazılımların uyumlu bir şekilde çalışabilmesi ve sorun çıkartmamaları için kütüphane konfigürasyonlarını olabildiğince varsayılan ayarlarda kullanmanızı tavsiye ederim. Sunucularınızı single-purpose kurduğunuz sürece yani Oracle Veri Tabanı sunucunuza postgres kurmaya çalışmazssanız(conflict library) problem yaşamazssınız.
````
  

-----
## 7. işlemlerin yönetimi (process management)
  
Linux'ta **init**, Başlatma için kullanılan bir kısaltmadır. Başlatma, bilgisayar başlar başlamaz başlayan ve kapanana kadar çalışmaya devam eden bir daemon işlemidir.  
  
Aslında init, bir bilgisayar önyüklendiğinde başlayan ve onu doğrudan veya dolaylı olarak çalışan diğer tüm işlemlerin üst öğesi yapan ilk süreçtir ve bu nedenle tipik olarak "pid=1" olarak atanır. Yani ilk process init'tir ve sonraki process'ler bu process tarafından yaratılmıştır.  

init process artık yoktır, init process yerine linux üzerinde paralel bir şekilde başka processleri de çalıştırmaya yarayan systemd ile değiştirilmiştir.  
  
---
### **Systemd** nedir?  
**systemd**, arka plan programının sonuna "d" ekleyerek oluşturulmuş, UNIX kuralı ile adlandırılan bir Sistem Yönetimi Arka Plan Programıdır. Böylece tüm arkaplan programları kolayca tanınabilirler. Başlangıçta GNU açık kaynak lisansı altında yayınlandı, ancak şimdi sürümler GNU Kısıtlı Genel Kamu Lisansı altında yapılıyor. **İnit**'e benzer şekilde systemd, doğrudan veya dolaylı olarak diğer tüm işlemlerin ebeveynidir ve önyüklemede başlayan ilk süreçtir, dolayısıyla tipik olarak bir "pid=1" atanır.  
  
Bir **systemd**, arka plan programı çevresindeki tüm paketlere, yardımcı programlara ve kitaplıklara başvurabilir. Init'in eksikliklerinin üstesinden gelmek için tasarlanmıştır. Süreçleri paralel olarak başlatmak için tasarlanmıştır, böylece önyükleme süresini ve hesaplama yükünü azaltan bir arka plan işlemidir. İnit ile karşılaştırıldığında birçok avantajlı özelliğe sahiptir.  
  
**Neden init'i değiştirmeye ihtiyaç vardı?**
**init** başlatma işlemi seri olarak başlardı, yani bir görev yalnızca son görev başlangıcı başarılı olduktan ve belleğe yüklendikten sonra başlayabilirdi. Bu genellikle gecikmeli ve uzun önyükleme süresine neden oluyordu. Bununla birlikte, systemd hız için değil, işlerin düzgün bir şekilde yapılması için tasarlanmıştır.  
  
---
### Process Management Commands - işlem yönetim komutları  
_pgrep, ps, watch, kill, top_  
  
---
### **pgrep** process grep - işlem filtrele
pgrep o anda çalışan işlemlere bakar ve standart çıktı ile seçim kriterine göre arama yapar. Verilen tüm kriterler eşleşmelidir.   
  
kullanım şekli:   
pgrep [options] pattern  

Örneğin,  

```.term1
pgrep -u root ssh
```
sadece sshd olarak adlandırılan ve köke ait olan süreçleri listeleyecektir. 

Diğer yandan,  

```.term1
pgrep -u root,daemon
```

root yada daemon (arka plan) programının sahip olduğu işlemleri listeler.

pkill, standart çıktıda listelemek yerine belirtilen sinyali (varsayılan olarak SIGTERM) her işleme gönderir.

Sözdizimi
pgrep [seçenekler] kalıbı  
pkill [seçenekler] kalıbı  

### **ps** process snapshot - şuan varolan işlemlerin listesi  

`ps` komutu, çalışan işlemleri listeler. Herhangi bir seçenek olmadan ps'yi kullanmak, mevcut kabukta çalışan işlemleri listelemesine neden olur.  

```.term1
ps
```

Belirli bir kullanıcıyla ilgili tüm işlemleri görmek için `-u` (kullanıcı) seçeneğini kullanın. Bu büyük bir olasılıkla uzun bir liste olacaktır, bu nedenle kolaylık sağlamak için `more` komutu ile çıktıyı sınırlayalım.  

```.term1
ps -u root | more
```

Çalışan her işlemi görmek için -e (her işlem) seçeneğini kullanın:  

(Linux/SVR4 kullanımı)  

``ps -e | more``

veya (BSD kullanımı)  

``ps -aux|more``

ben `ps` komutunu en çok `-f` parametresi ile kullanırım. `-f` veya `--forest` orman demektir, ağaç şeklinde ilişkileri getir demektir.  

```.term1
ps auxf
```

size işlemleri sıralar ve fork edilmiş, yani alt işlemlere göre komutları birbiri için ilişkilendirir.  
  
`ps -aux` ile `ps aux` aynı şeyler değildir. `-u` parametresi kullanıcı tanımlamak için kullanılır oysa `u` daha fazla ayrıntı ver demektir.  

Örnek kullanımlar:  
**Kullanıcılara göre işlem listeleme**  
ps -f -u www-data  


**İşlem ismine veya id'sine göre listeleme**  
`-C` command (komut)için kullanılıyor  
  
```.term1
ps -C ssh
```

`-p` parametresi process id için kullanılıyor ve virtül ile birden fazla process id verebilirsiniz  
örn:  
`ps -p 2342`

grep komutu ile çalışan programların hangi process id'ye sahip olduğunu bulabilirsiniz.  

```.term1
ps -ef |grep program_adı
```

**işlemleri kullandıkları CPU ve MEMORY oranına göre sıralama**   
  
```.term1
ps aux --sort=-pcpu,+pmem
```

aynı şekilde en fazla CPU tüketen 5 process sıralaması `head` komutu ile  
  
```.term1
ps aux --sort=-pcpu | head -5
```

**hiyerarşik şekilde `ssh` processinin gösterimi**  

```.term1
ps -f --forest -C ssh
```
**processlerin çalışma sürelerini gösteren çıktı**  

```.term1
ps -e -o pid,comm,etime
```
  
---
### **watch** izle  

watch, kendisine parametre olarak verilen komutu tekrar tekrar çalıştırır, çıktısını ve hatalarını gösterir(stdout). Bu sayede, program çıktı değişimini canlı olarak izleyebilirsiniz. Varsayılan olarak, program 2 saniyede bir çalıştırılır. `-n` parametresi ile süreyi değiştirebilirsiniz örn. `-n 1` 1sn gibi. program ctrl+c ile kesilmediği sürece çalışır.

Watch komutunu gördükten sonra kendimize göre bir `top` komutu yazalım.  

```.term1
watch -n 1 'ps -e -o pid,uname,cmd,pmem,pcpu --sort=-pmem,-pcpu | head -15'
```
Çalışan watch çıktısını, Ctrl+c ile kesebilirsiniz.
  
---
### **kill** send a signal to a process - işleme sinyal gönder  

`Kill` komutu, bir işlemi komut satırından sonlandırmanıza izin verir. Bunu, sonlandırma işleminin işlem kimliğini (PID) sağlayarak yaparsınız. Süreçleri isteyerek öldürmeyin. Bunu yapmak için iyi bir nedene ihtiyacınız var. Bu örnekte, deklanşör programının kilitlenmiş olduğunu varsayacağız.  

kullanım şekli:  

``kill pid ...``

kill -l ile varolan sinyalleri öğrenebilirsiniz. Linux konusunda öğrenebileceğiniz en derin ve önemli konulardan birtanesi Sinyal (signals) konusudur. İşlemler kernel üzerinde birbirleri ile ve Kernel ile sinyaller sayesinde haberleşirler.  
Kill komutu ise komut satırından işlemlere müdahale edebilmemizi sağlar. Modern bir linux sistemi üzerinde 'kill -l' aşağıdaki gibi bir liste verecektir  

```.term1
kill -l
```

Kill ile aynı zamanda normal şekilde durduramadığımız işlemleri durdurabilir.  

998 numaralı process'i normal şekilde durdurmak için:  
  
kill 998

çalışan bir programin process id'sini buluyoruz önce  

ps | grep komut  
ps aux | grep komut  

örnek.
```.term1
ps aux | grep ssh
```
alternatif olarak daha önce gösterdiğimiz `pgrep` isimli bir program mevcuttur   

```.term1
pgrep ssh
```

Aşağıdaki komutların hepsi kill `-9` veya `SIGKILL` ile aynıdır (i.e SIGKILL zorla bir process sonlandırmanız gerektiğinde kullanılır. Örnek olarak 1988 işlemini durduralım) :
  
kill -s SIGKILL 1988  
kill -s KILL 1988  
kill -s 9 1988  
kill -SIGKILL 1988  
kill -KILL 1988  
  
---
### **top** display top linux process - önemli linux işlemlerini listele

`top` komutu, Linux makinenizle ilgili verilerin gerçek zamanlı görüntüsünü gösterir. Ekranın üst kısmı bir durum özetidir.

**İlk satır,** bilgisayarınızın zamanı ve ne kadar süredir çalıştığını, burada kaç kullanıcının oturum açtığını ve son *bir*, *beş* ve *onbeş* dakika içinde gerçekleşmiş yük ortalamasının ne olduğunu gösterir.

**İkinci satır,** görevlerin sayısını ve durumlarını gösterir: çalışan(run), durma(stopped), uyku(sleep) ve zombi.  
  
**Üçüncü satır,** CPU bilgilerini gösterir.
Alanların anlamı şudur:  
  
**us**: değer, CPU'nun kullanıcılar için işlemleri yürütmek için "kullanıcı alanında" harcadığı CPU zamanıdır   
**sy**: değer, sistem "çekirdek alanı" işlemlerini çalıştırmak için harcanan CPU süresidir  
**ni**: değer, manuel olarak ayarlanmış bir güzel değerle işlemleri yürütmek için harcanan CPU süresidir  
**id**: CPU boşta kalma süresi miktarıdır  
**wa**: değer, CPU'nun I/O'nin tamamlanmasını beklerken geçirdiği zamandır  
**hi**: Donanım kesintilerine hizmet etmek için harcanan CPU zamanı  
**si**: Yazılım kesintilerine hizmet vermek için harcanan CPU süresi  
**st**: Sanal makinelerin çalıştırılması nedeniyle kaybedilen CPU zamanı ("çalma süresi")  

**Dördüncü satır,** toplam fiziksel bellek miktarını ve ne kadarının boş, kullanılmış ve arabelleğe alınmış veya önbelleğe alınmış olduğunu gösterir.  

**Beşinci satır,** takas belleğinin toplam miktarını ve ne kadarının boş, kullanılmış ve kullanılabilir olduğunu gösterir (önbelleklerden kurtarılması beklenen bellek dikkate alınarak).   

bir terminal penceresinde top komutu aşağıdaki gibi çalıştırılır.

```.term1
top
```

Kullanıcı, ekranı baytları temsil eden uzun tam sayılar yerine daha insanca sindirilebilir rakamlara dönüştürmek için E tuşuna basabilirsiniz.  

Ana ekrandaki sütunlar şunlardan oluşur:  
  
**PID**: İşlem Kimliği  
**USER**: İşlem sahibinin adı  
**PR**: Süreç önceliği  
**NI**: Sürecin nezaket değeri  
**VIRT**: İşlem tarafından kullanılan sanal bellek  
**RES**: İşlem tarafından kullanılan yerleşik bellek  
**SHR**: İşlem tarafından kullanılan paylaşılan hafıza  
**S**: İşlemin durumu. Bu alanın alabileceği değerler için aşağıdaki listeye bakın  
**% CPU**: son güncellemeden bu yana işlem tarafından kullanılan CPU zamanı payı  
**% MEM**: kullanılan fiziksel bellek payı  
**TIME +**: görev tarafından saniyenin yüzde biri cinsinden kullanılan toplam CPU süresi  
**COMMAND**: komut adı veya komut satırı (ad + seçenekler)  
.... 

İşlemin durumu şunlardan biri olabilir:  
  
D: Kesintisiz uyku  
R: Çalışıyor  
S: Uyuyor  
T: İzlendi (durduruldu)  
Z: Zombi  

Yukarıdan çıkmak için Q tuşuna basın.  

`top` komutu sistemi izlemek için oldukça kullanışlı ve karşılaştığınız sorunlarda sizi soruna yönlendirir. Özellikle ilk çalıştırdığınızda en üstteki load average 5,10,15 dk içindeki yük göstergesi sisteminizin üzerindeki yükleri ne kadar iyi kaldırabildiğini gösterir.  

`htop` isimli alternatif bir top komutu daha vardır, ve çok daha ayrıntılı bilgi vermektedir. Thread ayrıntılarına kadar işlemcilerdeki yükleri analiz edebilirsiniz. Burada sadece 'top' komutunu işleme sebebimiz, her sistemde kolaylıkla paketini bulabilmenizdir.  

-----
<!-- Quiz bölümünü diğer quizlerde aynen kopyalayıp değiştirmemiz gerek.-->

**[Linux101 - Ana Sayfa](/linux101-landing)**  
**[Linux101 - Bolum4](/linux101-bolum4)**  

-----
## Konu tekrarı, kısa sınav
>seçeneklerden doğru olanları seçtikten sonra **Gönder** butonuna basınız. Sonuçları <span style="color:green">**doğru**</span> ve <span style="color:red">**yanlış**</span> görebilirsiniz.




{:.quiz}
Bağlandığınız sunucudaki RAM mikatrını ve dolu slotların bilgisini nasıl öğrenebilirsiniz?

- ( ) ls -la
- ( ) cat /proc/meminfo
- (x) lshw -c memory
- ( ) lshw -businfo

{:.quiz}
Diskinizi tamamen yedeklemek istiyorsunuz, aşağıdaki komutlardan hangisi size bunu sağlar?


- (x) dd
- ( ) gzip
- ( ) cp

{:.quiz}
Hangi komut disk bölümlerinizi(partition) listeler? (Başlangıç ve bitiş bilgileri ile)

- ( ) lsblk
- (x) fdisk
- ( ) diskpart

{:.quiz}
MBR bir disk için aşağıdaki seçeneklerden hangisi yanlıştır?  
  
- ( ) Maksimum 4 birincil bölüm oluşturulabilir  
- ( ) Diskin ilk 512 Byte'ı içine yazılır  
- (x) Disklerde 18TB disk alanına izin verir   
- ( ) Çoklu açılışa izin verir(Multiboot)

{:.quiz}
Bilgisayarınıza yeni bir disk eklediniz, hagi ismi aldığını ve /dev yolunu nasıl öğrenirsiniz?  
  
- ( ) dmidecode programı ile sorgularım
- ( ) lshw programı ile sorgularım 
- ( )    
- ( ) 
