**"Lielais futbols"**

Lielās Futbola Līgas (LFL) turnīrā piedalās vairākas komandas, kas savā starpā izspēlē noteiktu spēļu skaitu. Mūsu lielajā futbola līgā (LFL) būs nedaudz nestandarta noteikumi salīdzinot ar starptautiskajā futbola federācijā apstiprinātajiem noteikumiem.

LFL katrā komandā vienai spēlei tiek pieteikti ne vairāk kā 16 spēlētāji (katram spēlētājam uz krekla ir viņa numurs, kas komandas ietvaros visa turnīra laikā ir unikāls) no kuriem ne vairāk kā vienpadsmit un ne mazāk kā septiņi katru brīdi atrodas laukumā. Katram komandas spēlētājam ir sava loma - katrs ir vai nu vārtsargs, aizsargs vai uzbrucējs. Spēles mērķis ir pēc iespējas vairāk reižu iesist bumbu pretinieka vārtos, vienlaikus pēc iespējas mazāk reižu ielaižot to savējos. Spēlētājs, kurš iesitis bumbu pretinieka vārtos, tiek saukts par vārtu guvēju, bet spēlētāji, kas piespēlējuši vārtu guvējam bumbu pirms vārtu guvuma (parasti ne vairāk kā divi), tiek saukti par rezultatīvi piespēlējušiem spēlētājiem un arī tiek atzīmēti spēles protokolā. Atsevišķos gadījumos vārtu guvumā rezultatīvi piespēlējušo spēlētāju var arī nebūt. Vārtus var gūt vai nu no spēles vai nu izpildot 11m soda sitienu. Spēlē uzvar komanda, kas spēles beigās pretinieka vārtos bumbu ir iesitusi vairāk reižu. Neviena spēle LFL nebeidzas neizšķirti - ja spēles pamatlaiks (divi puslaiki pa 30 minūtēm katrs) beidzies neizšķirti, tad tiek izspēlēts viens vai vairāki papildlaiki (pa 15 min katrs) līdz kādai komandai izdodas gūt vārtus. Papildlaiku skaits nav ierobežots. Pēc vārtu guvuma papildlaikā spēle tiek pārtraukta. Par uzvaru pamatlaikā komanda saņem **PIECUS** punktus, par uzvaru papildlaikā komanda saņem **TRĪS** punktus, par zaudējumu papildlaikā komanda saņem **DIVUS** punktus, par zaudējumu pamatlaikā komanda saņem **VIENU** punktu. Katru spēli tiesā vecākais tiesnesis un divi līnijtiesneši. Par pārkāpumiem spēlētājiem tiek piešķirtas dzeltenās kartītes. Ja spēlētājs, kādā spēlē jau ir saņēmis dzelteno kartīti un izdara atkārtotu pārkāpumu, tad tas saņem sarkano kartīti un šo spēli vairs turpināt nedrīkst un komanda turpina atlikušo spēles daļu mazākumā.

Pēc katras spēles tehniskā informācija par šo spēli tiek noformēta atsevišķā XML vai JSON failā ar noteiktu struktūru (skat. piemēros).

Piezīmes par XML un JSON faila struktūru un saturu:

*   Failā ir doti tikai būtiskie elementi. Ja kāds elements nav dots, vai arī kādam skaitliskam elementam nav norādīta vērtība, tad jāuzskata, ka šī vērtība ir 0. Failos ir arī daži citi "negludumi". Piemēram, JSON gadījumā, kādā pozīcijā var būt gan tukšs objekts, gan citā gadījumā masīvs.
*   No katras komandas sadaļām obligātas ir tikai "Spēlētāji" un "Pamatsastāvs". Ja komanda nav guvusi nevienus vārtus un neviens spēlētājs nav sodīts un nav izdarīta neviena spēlētāja maiņa, attiecīgās sadaļas "Vārti", "Sodi" un "Mainas" var būt tukšas vai to var nebūt nemaz.
*   Spēlētāja loma var būt "V" (vārtsargs), "A" (aizsargs) vai "U" (uzbrucējs). Spēlētāja loma visa turnīra laikā nemainās.
*   Visi laiki failā ir doti formā "mm:ss" - t.i. vismaz divi cipari, kas apzīmē minūtes (bet varētu būt vairāk ciparu, ja spēle beidzas papildlaikā 60+15+...) un divi cipari, kas apzīmē sekundes; starp minūtēm un sekundēm ir kols. Laiks norāda relatīvo spēles laiku. Spēle sākas 00:00 un pamatlaiks beidzas 60:00.
*   "Pamatsastavs" sadaļā ir pārskaitīti spēlētāji, kuri atrodas laukumā spēles sākumā.
*   "Vārtu" sadaļā katrs "VG" ieraksts atbilst vienam vārtu guvumam. Atribūta "Sitiens" vērtība var būt "J" (vārti gūti no 11m soda sitiena) vai "N" (vārti gūti no spēles). Atribūti "P" ir neobligāti un var būt vairāk par vienu.
*   "Sodu" sadaļā katrs "Sods" ieraksts atbilst vienam pārkāpumam. "Laiks" norāda spēles laiku, kad ir noticis pārkāpums, "Nr" norāda tā spēlētāja numuru, kuram piespriests sods. Katram spēlētajam vienā spēlē var būt ne vairāk kā divi pārkāpumi. Par pirmo pārkāpumu spēlētājs "saņem" dzelteno kartīti, par otro pārkāpumu sarkano kartīti un no spēles izstājas.
*   "Mainas" sadaļā katrs "Maina" ieraksts atbilst kādām izmaiņām komandas spēlētāju sastāvā. "Nr1" norāda tā spēlētāja numuru, kurš tiek nomainīts, "Nr2" norāda tā spēlētāja numuru, kurš uzsāk spēli nomainītā spēlētāja vietā.



**Jums jāuzraksta programma** (vai programmu komplekss), kas ļautu apkopot informāciju no atsevišķajiem XML **vai** JSON failiem (izvēlaties vienu no formātiem) un iegūt šādus apkopojošus statistikas rādītājus:

*   turnīra tabulu (komandas vieta tabulā pēc kārtas, nosaukums, iegūto punktu skaits, uzvaru un zaudējumu skaits pamatlaikā, uzvaru un zaudējumu skaits papildlaikā, spēlēs gūto un zaudēto vārtu skaits). Augstākā vietā jāatrodas komandai, kurai ir vairāk punktu.
*   turnīra desmit rezultatīvāko spēlētāju (sakārtoti pēc gūto vārtu skaita un rezultatīvo piespēļu skaita dilstošā secībā) saraksts. Jānorāda vieta sarakstā pēc kārtas, spēlētāja vārds un uzvārds, komandas nosaukums, gūto vārtu skaits un rezultatīvo piespēļu skaits. Sarakstā augstāk jāatrodas spēlētājam, kas guvis vairāk vārtu, bet, vienāda gūto vārtu skaita gadījumā, tam spēlētājam, kas vairāk reižu rezultatīvi piespēlējis.

Jārealizē vismaz divi papildus statistikas rādītāji, kas atšķiras no iepriekšminētajiem, tos Jūs varat izdomāt paši. Vai arī implementēt kādu no zemāk minētajiem. Lielāka vērtība būs tādam statistikas rādītājam, kas atšķirsies no kolēģu izstrādātā.

*   turnīra rupjāko spēlētāju (sakārtoti pēc piešķirto sodu skaita dilstošā secībā) saraksts.
*   visu vienas komandas spēlētāju apkopojošā statistika, par katru spēlētāju norādot tā numuru, vārdu, uzvārdu, nospēlēto spēļu skaitu, nospēlēto spēļu skaits pamatsastāvā, nospēlētās minūtes, iesisto vārtu un rezultatīvo piespēļu skaits, saņemtās dzeltenās kartītes, saņemtās sarkanās kartītes. Spēlētājs ir spēlējis spēli, ja viņš tajā ir piedalījies kaut vienu sekundi. Atsevišķi jāveido vārtsargu statistika - nospēlēto spēļu skaits, ielaistie vārti, vidēji vienā spēlē ielaistie vārti.
*   turnīra "stingrāko" tiesnešu saraksts, kas sakārtots vidēji vienā spēlē piešķirto sodu skaita dilšanas secībā.
*   turnīra piecu labāko vārtsargu (sakārtoti pēc visā turnīrā vidēji vienā spēlē ielaisto vārtu skaita) saraksts. Jānorāda vieta sarakstā pēc kārtas, spēlētāja vārds un uzvārds, komandas nosaukums, vidēji spēlē ielaisto vārtu skaits kā reāls skaitlis ar tieši vienu ciparu aiz decimālā punkta. Ja kāds vārtsargs nav bijis vārtos nevienā spēlē, viņš šajā sarakstā nedrīkst parādīties.
*   . . .

Vēl dažas vispārīgas prasības:

*   Informācijai par iepriekš ievadītajām spēlēm **ir jāsaglabājas** starp programmas darbināšanas reizēm un to nedrīkst prasīt ievadīt atkārtoti pēc informācijas par jaunām spēlēm saņemšanas. Tātad programmatūra tiks darbināta vairākas reizes.
*   Atšķirībā no mājas darbiem, autoriem praktiskā darba rezultāts **būs arī jāatrāda** uz sava datora un tā būs daļa no eksāmena. 
*   Darbs **NAV** obligāti jāizstrādā programmēšanas valodā JAVA. 

Uzskatiet, ka dati būs korekti (spēlētājs nevar gūt vārtus, ja tobrīd nepiedalās spēlē, papildlaikā nevar būt gūti vairāk par vieniem vārtiem, sodu nevar saņemt spēlētājs, kas spēlei nav pieteikts, utt.)

Vienā dienā katra komanda aizvada ne vairāk kā vienu spēli. Programmā jāiestrādā aizsardzība pret vienas un tās pašas spēles datu vairākkārtēju ievadīšanu.

Vienā dienā vienā sacensību norises vietā var notikt vairākas spēles.

Turnīra laikā nenotiek spēlētāju pāreja no vienas komandas uz citu, bet ir iespējams, ka dažādās komandās spēlē spēlētāji ar vienādu vārdu un uzvārdu.

Dotie XML vai JSON faili ir **vienīgais** informācijas avots par LFL turnīru, tāpēc visa nepieciešamā informācija jāiegūst tikai no tiem. Statistiskā informācija ir turnīra "momentuzņēmums" brīdī, kad ievadīta informācija par noteiktu spēļu skaitu. Zināms, ka tiks ievadīta korekta informācija par vismaz vienu un ne vairāk kā 99 spēlēm. Lielam spēļu skaitam failu nosaukumu ievadīšana to ielādei var nebūt īpaši patīkama, tāpēc vēlams izstrādāt metodiku, kas ļautu pēc kārtas automātiski apstrādāt visus .xml (.json) failus no norādītā kataloga.

Ja nepieciešams padoms ar futbola statistiku saistītās lietās, varat ielūkoties [](https://lff.lv/sacensibas/viriesi/synottip-virsliga/)[https://lff.lv/sacensibas/viriesi/optibet-virsliga/](https://lff.lv/sacensibas/viriesi/optibet-virsliga/) lapās. Var arī Tīmeklī meklēt vārdu savienojumu "futbola noteikumi". Tikai ņemiet vērā, ka noteikumi mūsu LFL ir nodefinēti atšķirīgi no vispārpieņemtajiem. Ja kāda jūsu realizācijā svarīga norma uzdevuma nosacījumos nav precīzi definēta vai neskaidra, jūsu uzdevums ir izvēlēties jebkuru saprātīgu risinājuma variantu un varēt to paskaidrot.

Viens no ērtiem risinājuma variantiem ir datu saglabāšana relāciju datu bāzē (piem., MySQL, JavaDB) un statistikas datu iegūšana izmantojot SQL vai citas analoģiskas sniegtās iespējas.

Lai atvieglotu datu ievadi, visi datu faili būs ar nosaukumu formā futbols <n>.xml (.json), kur <n> - naturāls skaitlis robežās no 0 līdz 99 (ieskaitot). Dažādās programmas darbināšanas reizēs fails ar vienu un to pašu nosaukumu var saturēt atšķirīgu informāciju, tāpēc nevar uzskatīt, ka faila vārds pats par sevi nodrošina datu unikalitāti.

**Jums ir jāiesūta:**

*   saarhivētus programmas izejas tekstus
*   izpildāmu moduli (ja tas ir iespējams, atkarīgs no izvēltās izstrādes vides/valodas...),
*   neliels (1 - 2 lpp.) apraksts (MS Word vai kādā citā populārā formātā). Aprakstā vispārīgos vilcienos jāraksturo risinājuma variants (kur un kā tiek saglabāti dati, kā tiek sagatavota nepieciešamā statistika, utt.). Ja tiek izmantota datubāze, jāapraksta tās shēma. Citas lietas, kuras pēc jūsu domām būtu svarīgi izlasīt par Jūsu darbu.

Punkti par praktisko darbu tiks piešķirti pēc shēmas: 35 punkti par funkcionalitāti + 10 punkti par saskarni un dokumentāciju.

Savas programmas darbības pārbaudei varat izmantot dotos failus:  **[XML\_TestData.zip](https://estudijas.lu.lv/pluginfile.php/279370/mod_assign/intro/XML_TestData.zip?time=1669709558920 "XML_TestData.zip")** (xml formātā) vai **[JSON\_TestData.zip](https://estudijas.lu.lv/pluginfile.php/279370/mod_assign/intro/JSON_TestData.zip?time=1670839950145 "JSON_TestData.zip")** (json formātā). Failos ir "spēļu protokoli", kuri atbilst šādiem rezultātiem -  [Statistika.txt](https://estudijas.lu.lv/pluginfile.php/279370/mod_assign/intro/Statistika.txt?time=1670839985761 "Statistika.txt") .   

Vēl dažas tīmekļa vietnes, kurās var smelties iedvesmu... (tabulas piemērs: [https://www.premierleague.com/tables](https://www.premierleague.com/tables), tunīra statistikas un tabulas piemērs: [](https://lff.lv/sacensibas/viriesi/synottip-virsliga/)[https://lff.lv/sacensibas/viriesi/optibet-virsliga/](https://lff.lv/sacensibas/viriesi/optibet-virsliga/))

Kursa eksāmens būs paskatīšanās kā strādā PD2 un aprunāšanās par jūsu izmantotajiem tehnoloģiskajiem risinājumiem, kā arī varu pajautāt kaut ko par kursā mācīto...

lai veicas...