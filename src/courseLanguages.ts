import type { Course } from "./catalogue";

type CourseText = {
  title: string;
  description: string;
  tag: string;
  lessons: [string, string][];
  quiz: [string, string[]][];
  assignment: string;
};
// Experimental translations: review with fluent speakers before production use.
const content: Record<string, Record<string, CourseText>> = {
  ha: {
    "digital-essentials": {
      title: "Tushen amfani da na’urorin dijital",
      description:
        "Yi amfani da na’urarka, tsara fayiloli kuma sadarwa cikin aminci a intanet.",
      tag: "Fara a nan",
      lessons: [
        [
          "Daidaita na’urarka",
          "Daidaita girman rubutu, haske da ƙara domin su dace da kai. Gwada mai karanta allo, rubutu da murya ko madannin kwamfuta idan suna taimakawa. Gwada buɗe manhaja da komawa gare ta. Huta idan kana bukata.",
        ],
        [
          "Ƙirƙira da nemo fayiloli",
          "Fayil yana ɗauke da rubutu ko hoto; babban fayil yana haɗa fayiloli masu alaƙa. Ba su sunaye masu ma’ana, kamar Kasafin-kasuwa-Oktoba. Ajiye rubutu, rufe shi kuma nemo shi. Ajiye kwafin muhimmin aiki a wani wuri mai aminci.",
        ],
        [
          "Bincika da tambaya bayyananniya",
          "Yi amfani da kalmomin bincike takamaimai. Kwatanta sakamako kuma duba marubuci, ranar sabuntawa da hujjoji. Talla ko sakamakon farko ba lallai ya zama abin dogaro ba. Kada ka sauke fayil da ba ka sani ba.",
        ],
        [
          "Rubuta saƙo mai amfani",
          "Saka gajeren batu, gaisuwa, bukata da rufewa. Duba mai karɓa da fayilolin da aka haɗa kafin aikawa. Raba bayanan kanka da ake bukata kawai. Nemi izini kafin tura saƙon sirrin wani.",
        ],
        [
          "Kare asusunka",
          "Yi amfani da doguwar kalmar sirri dabam ga kowane asusu. Mai kula da kalmomin sirri abin dogaro zai iya taimaka. Kunna mataki na biyu na shiga idan akwai. Kada ka raba kalmar sirri ko lambar shiga ta lokaci ɗaya. Tabbatar da bukatar kuɗi ta hanyar tuntuɓar da ka amince da ita.",
        ],
        [
          "Shirya samun dama da haɗin intanet",
          "Duba ragowar data kafin buɗe manyan fayiloli. Sauke kayan da aka ba da izini domin karantawa daga baya. Nemi rubutun abin da ake faɗa ko takarda mai sauƙin amfani. Bayyana abin da ke hana ka samun dama kuma nemi wata hanya.",
        ],
      ],
      quiz: [
        [
          "Wane sunan fayil ya fi sauƙin nemowa daga baya?",
          [
            "Takarda1",
            "Ba-suna",
            "Kasafin-kasuwa-Oktoba",
            "Sabon-fayil-na-ƙarshe-sabo",
          ],
        ],
        [
          "Wani ya nemi lambar shiga ta lokaci ɗaya. Me za ka yi?",
          [
            "Aika da sauri",
            "Riƙe ta a sirrance kuma tabbatar da bukatar ta wata hanya",
            "Saka ta a rukuni",
            "Aika rabinta",
          ],
        ],
        [
          "Me ke taimaka maka tantance sakamakon bincike?",
          [
            "Ya zo na farko",
            "Yana da launuka masu haske",
            "Marubuci, kwanan wata da hujjoji",
            "Yana tilasta saukewa nan da nan",
          ],
        ],
        [
          "Takarda tana da wahalar karantawa. Me zai taimaka?",
          [
            "Nemi tsarin mai sauƙin amfani ko daidaita allo",
            "Daina koyo har abada",
            "Raba kalmar sirrinka",
            "Yi watsi da matsalar",
          ],
        ],
      ],
      assignment:
        "Rubuta tsarin koyon dijital: sunan babban fayil da fayil, daidaitawar samun dama, jerin kariyar asusu ba tare da sirri ba, madadin lokacin intanet ya yi rauni, da saƙon neman taimakon jagora. Saka aikinka a akwatin aikin gwaji.",
    },
    "spreadsheet-data": {
      title: "Ƙwarewar jadawali da bayanai",
      description:
        "Tsara ƙananan bayanai, lissafa jimla kuma bayyana sakamako cikin kulawa.",
      tag: "Gina ƙwarewa mai amfani",
      lessons: [
        [
          "Gina jadawali mai tsari",
          "Jadawalin kwamfuta yana da layuka, ginshiƙai da ƙwayoyin bayanai. Saka ciniki ɗaya a kowane layi, nau’in bayani ɗaya a kowane ginshiƙi. Yi amfani da Kwanan wata, Kaya, Adadi da Farashin guda. Yi layin kanun ɗaya kuma kada ka haɗa ƙwayoyin bayanai.",
        ],
        [
          "Bincika kafin lissafi",
          "Yi amfani da tsarin kwanan wata ɗaya, adadi na lambobi da sunayen kaya masu daidaito. Wurin da babu bayani na iya nufin ba a sani ba, ba sifili ba. Tabbatar ko bayanan da suka maimaitu ciniki ne dabam. Riƙe asalin bayanai kuma rubuta gyare-gyare.",
        ],
        [
          "Yi amfani da dabarun lissafi",
          "Dabarar lissafi tana farawa da =. Idan adadi yana C2 kuma farashi yana D2, =C2*D2 yana lissafa kuɗin ciniki. Kwafa zuwa ƙasa kuma duba lambobin layi. =SUM(E2:E6) yana haɗa adadi biyar. Tabbatar da lissafi ɗaya da hannu.",
        ],
        [
          "Jera da tace cikin aminci",
          "Jerawa tana sauya tsarin layuka; tacewa tana nuna waɗanda suka cika sharadi. Zaɓi dukan jadawali kafin jerawa domin bayanan ciniki su zauna tare. Tace kaya ɗaya sannan cire tacewar. Layukan da aka ɓoye suna nan kuma wasu lissafi suna haɗa su.",
        ],
        [
          "Zaɓi zane mai sauƙin karantawa",
          "Yi amfani da zanen sanduna don kwatanta jimlar kaya, da zanen layi don canji cikin lokaci. Saka take da ma’auni. Yi rubutu mai sauƙin karantawa; kada ka dogara da launi kawai. Fara ma’aunin sanduna daga sifili. Ƙara gajeren bayanin zane.",
        ],
        [
          "Bayyana iyakar bayanai",
          "Faɗi lokacin, yawan bayanai da ma’auni. Ƙarin tallace-tallace kaɗai ba ya nuna dalilin ƙarin. Ambaci bayanan da suka ɓace ko ba tabbas. Yi amfani da ƙirƙirarrun bayanai ko cire abubuwan da ke gane mutane; kada ka raba sirrin abokan ciniki.",
        ],
      ],
      quiz: [
        [
          "Me ya kamata layi ɗaya na jadawalin ciniki ya wakilta?",
          [
            "Rubutu marar alaƙa",
            "Ciniki ɗaya",
            "Dukan ciniki a ƙwaya ɗaya",
            "Kanun kawai",
          ],
        ],
        [
          "Wace dabara ke ninka C2 da D2?",
          ["=C2+D2", "=SUM(C2:D2)", "=C2*D2", "C2 D2"],
        ],
        [
          "Yaya za ka yi da farashin da ya ɓace?",
          [
            "Yi amfani da sifili kullum",
            "Share jadawali",
            "Bincika ma’anarsa kuma rubuta shawarar",
            "Ɗauki farashi mafi girma",
          ],
        ],
        [
          "Me ke riƙe bayanan ciniki ɗaya tare lokacin jerawa?",
          [
            "Jera ginshiƙin farashi kawai",
            "Zaɓi dukan jadawali",
            "Cire kanun",
            "Haɗa kowane layi",
          ],
        ],
        [
          "Tallace-tallacen da aka rubuta sun ƙaru. Me hakan kaɗai ke nuna?",
          [
            "Talla ce ta jawo shi",
            "Kowane abokin ciniki ya gamsu",
            "Tallace-tallacen da aka rubuta sun ƙaru a lokacin da aka faɗa",
            "An tabbatar da tallace-tallacen gaba",
          ],
        ],
      ],
      assignment:
        "Ƙirƙiri jadawalin ciniki na gwaji mai aƙalla layuka biyar kuma rubuta nau’in kuɗi. Lissafa kowane ciniki da jimla, tabbatar da lissafi ɗaya da hannu kuma bayyana binciken ingancin bayanai. Saka jadawalin da jimlolin bayani uku a akwatin aiki, tare da lokaci da iyaka ɗaya.",
    },
    "business-foundations": {
      title: "Tushen ƙaramar kasuwanci",
      description:
        "Mayar da ra’ayi zuwa tayin abokin ciniki, kasafin kuɗi da ƙaramin gwaji.",
      tag: "Saka ƙwarewa a aiki",
      lessons: [
        [
          "Zaɓi abokin ciniki da matsala",
          "Fara da takamaiman rukunin abokan ciniki da matsalar da za ka magance. ’Yan kasuwa na iya bukatar bayanan ciniki na kullum. Tambayi yadda suke magance matsalar yanzu, kuma saurara kafin bayyana ra’ayinka. Yabo ba hujjar cewa mutum zai biya ba.",
        ],
        [
          "Bayyana tayinka",
          "Faɗi abin da abokin ciniki zai samu, lokacin isowa da farashi. Fara da abin da za ka iya yi da kyau. Bayyana abin da aka haɗa da ƙarin kuɗi. Zaɓi hanyoyin tuntuɓa da isarwa masu sauƙin amfani kuma tambayi bukatun samun dama.",
        ],
        [
          "San kuɗin aiki da saura",
          "Jera kuɗin kowane ciniki, kamar kayan aiki, da kuɗin wani lokaci, kamar haya. Cinikin naira 3,000 mai kuɗin kai tsaye naira 2,000 yana barin naira 1,000 kafin sauran kuɗi. Ƙidaya lokacinka. Kuɗin shiga ba daidai yake da riba ba.",
        ],
        [
          "Riƙe bayanan kuɗi",
          "Rubuta kuɗin shiga da fita tare da kwanan wata, bayani da adadi. Riƙe rasit idan akwai. Raba kuɗin kasuwanci da na kanka a bayanai. Duba kuɗin hannu da rubutun akai-akai. Alkawarin biya daga baya ba kuɗin hannu yau ba ne.",
        ],
        [
          "Yi ƙaramin gwaji",
          "Zaɓi zato ɗaya, kamar ko ’yan kasuwa suna son hidimar rubuta ciniki kowane mako. Saka iyakar kuɗi da lokaci. Bayyana tayin da gaskiya kuma nemi izini don ra’ayi. Ƙidaya tambayoyi da sayayya dabam. Faɗi sakamakon da zai sa ka ci gaba.",
        ],
        [
          "Gina amana kuma inganta",
          "Tabbatar da farashi da lokacin isarwa kafin karɓar oda. Sanar da abokin ciniki da wuri idan abu ya canza. Ba da hanyar ƙorafi kuma kare bayanansa. Tambayi takamaiman ra’ayi bayan isarwa. Duba bayanai kuma zaɓi gyara ɗaya.",
        ],
      ],
      quiz: [
        [
          "Wace tambaya ce mai amfani wajen binciken abokin ciniki?",
          [
            "Kana son ra’ayina, ko?",
            "Yaya kake magance wannan matsala yanzu?",
            "Me ya sa ba ka saya ba tukuna?",
            "Za ka tabbatar da ciniki goma?",
          ],
        ],
        [
          "Cinikin naira 3,000 yana da kuɗin kai tsaye 2,000. Nawa ya rage kafin sauran kuɗi?",
          [
            "Naira 5,000",
            "Naira 2,000",
            "Naira 1,000",
            "Naira 3,000 bayan dukan kuɗi",
          ],
        ],
        [
          "Wane kuɗi ne a hannu yau?",
          [
            "Odar da wataƙila za ta zo",
            "Alkawarin da ba a biya ba",
            "Kuɗin da aka karɓa kuma yana nan",
            "Burin shekara mai zuwa",
          ],
        ],
        [
          "Me ke sa ƙaramin gwaji ya yi amfani?",
          [
            "Kashe kuɗi ba iyaka",
            "Zato, kasafi, iyakar lokaci da sharadin nasara",
            "Ƙidaya yabo kawai",
            "Rashin bayanai",
          ],
        ],
        [
          "Ka sa ran oda za ta makara. Me za ka yi?",
          [
            "Yi watsi da abokin ciniki",
            "Share bayanan oda",
            "Bayyana da wuri kuma amince kan mataki na gaba",
            "Yi alkawarin ranar da ba za ka iya ba",
          ],
        ],
      ],
      assignment:
        "Rubuta tsarin ƙirƙirarriyar kasuwanci: abokin ciniki da matsala, tayi da farashi, kasafin ciniki uku, gwajin mako ɗaya mai iyakar kuɗi da sharadin nasara, da saƙon hidimar abokin ciniki. Rubuta zato kuma bayyana haɗari ɗaya da za ka bincika kafin kashe kuɗi.",
    },
  },
  yo: {
    "digital-essentials": {
      title: "Ìpìlẹ̀ lílo ẹrọ dijital",
      description:
        "Lo ẹrọ rẹ, ṣètò fáìlì, kí o sì bá ènìyàn sọ̀rọ̀ lórí ayélujára láìléwu.",
      tag: "Bẹ̀rẹ̀ níbí",
      lessons: [
        [
          "Ṣètò ẹrọ rẹ fún ìrọ̀rùn",
          "Ṣàtúnṣe ìwọ̀n lẹ́tà, ìmọ́lẹ̀ àti ohùn kí wọ́n rọrùn fún ọ. Gbìyànjú olùkà ojú-ìbojú, kíkọ pẹ̀lú ohùn tàbí bọ́tìnì bí wọ́n bá wúlò. Ṣí ohun èlò kan, lọ sí òmíràn, kí o sì padà. Sinmi bí o bá nílò rẹ̀.",
        ],
        [
          "Ṣẹ̀dá kí o sì rí fáìlì",
          "Fáìlì ń pa ìwé tàbí àwòrán mọ́; fódà ń kó àwọn fáìlì tó jọra pọ̀. Lo orúkọ tó ṣe kedere, bí Ìnáwó-ọjà-Oṣù-kẹwàá. Fipamọ́ àkọsílẹ̀, pa á, kí o sì tún rí i. Pa ẹ̀dà iṣẹ́ pàtàkì mọ́ ní ibòmíràn tó dájú.",
        ],
        [
          "Wá ìmọ̀ pẹ̀lú ìbéèrè tó ṣe kedere",
          "Lo ọ̀rọ̀ ìwádìí pàtó. Fi àwọn èsì wé ara wọn; ṣàyẹ̀wò òǹkọ̀wé, ọjọ́ àtúnṣe àti ẹ̀rí. Ìpolówó tàbí èsì àkọ́kọ́ kò túmọ̀ sí pé ó ṣeé gbẹ́kẹ̀lé. Má ṣe gba fáìlì tí o kò mọ̀ sílẹ̀.",
        ],
        [
          "Kọ ìfiránṣẹ́ tó wúlò",
          "Lo àkòrí kúkúrú, ìkíni, ìbéèrè pàtàkì àti ìparí. Ṣàyẹ̀wò olùgbà àti fáìlì tí o so mọ́ ọn kí o tó ránṣẹ́. Pín àlàyé ara rẹ tí iṣẹ́ náà nílò nìkan. Gba àṣẹ kí o tó fi ìfiránṣẹ́ àṣírí ẹlòmíràn ránṣẹ́.",
        ],
        [
          "Dáàbò bo àkọọ́lẹ̀ rẹ",
          "Lo ọ̀rọ̀ ìgbaniwọlé gígùn tó yàtọ̀ fún àkọọ́lẹ̀ kọ̀ọ̀kan. Ohun èlò ìṣàkóso ọ̀rọ̀ ìgbaniwọlé tí o gbẹ́kẹ̀lé lè ràn ọ́ lọ́wọ́. Lo ìgbésẹ̀ ìwọlé kejì bí ó bá wà. Má pín ọ̀rọ̀ ìgbaniwọlé tàbí kóòdù ìgbà kan. Ṣàyẹ̀wò ìbéèrè owó ní ọ̀nà ìkàn sí tí o ti mọ̀.",
        ],
        [
          "Ṣètò ìwọlé àti ìsopọ̀",
          "Ṣàyẹ̀wò dátà tí ó kù kí o tó ṣí fáìlì ńlá. Gba ohun tí a fàyè gba sílẹ̀ fún kíkà lẹ́yìn náà. Béèrè fún àkọlé ohùn, ìwé tó rọrùn láti lò tàbí ọ̀nà mìíràn. Ṣàlàyé ìdènà rẹ kí o sì béèrè fún ojútùú.",
        ],
      ],
      quiz: [
        [
          "Orúkọ fáìlì wo ni yóò rọrùn láti rí lẹ́yìn náà?",
          [
            "Ìwé1",
            "Láìsí-orúkọ",
            "Ìnáwó-ọjà-Oṣù-kẹwàá",
            "Fáìlì-tuntun-ìkẹyìn-tuntun",
          ],
        ],
        [
          "Ẹnìkan béèrè fún kóòdù ìwọlé ìgbà kan rẹ. Kí ni o yẹ kí o ṣe?",
          [
            "Rán an lẹ́sẹ̀kẹsẹ̀",
            "Pa á mọ́ ní àṣírí, kí o sì ṣàyẹ̀wò ìbéèrè lọ́tọ̀",
            "Fi sí ẹgbẹ́ kan",
            "Rán ìdajì rẹ̀",
          ],
        ],
        [
          "Kí ni ó ràn ọ́ lọ́wọ́ láti ṣàyẹ̀wò èsì ìwádìí?",
          [
            "Ó wà ní àkọ́kọ́",
            "Ó ní àwọ̀ tó mọ́lẹ̀",
            "Òǹkọ̀wé, ọjọ́ àti ẹ̀rí",
            "Ó ń béèrè pé kí o gba fáìlì lẹ́sẹ̀kẹsẹ̀",
          ],
        ],
        [
          "Ìwé ṣòro láti kà. Ìgbésẹ̀ wo ni ó wúlò?",
          [
            "Béèrè fún ọ̀nà tó rọrùn tàbí ṣàtúnṣe ojú-ìbojú",
            "Dá ẹ̀kọ́ dúró títí láé",
            "Pín ọ̀rọ̀ ìgbaniwọlé rẹ",
            "Foju kọ ìṣòro náà",
          ],
        ],
      ],
      assignment:
        "Ṣẹ̀dá ètò ẹ̀kọ́ dijital: orúkọ fódà àti fáìlì tó ṣe kedere, ètò ìrọ̀rùn ìwọlé, àkọsílẹ̀ ààbò láìsí àṣírí, ọ̀nà mìíràn fún ìsopọ̀ tí kò dára àti ìfiránṣẹ́ sí olùtọ́sọ́nà. Fi iṣẹ́ rẹ sínú àpótí iṣẹ́ àṣegbà.",
    },
    "spreadsheet-data": {
      title: "Ọgbọ́n ìwé ìṣírò àti dátà",
      description:
        "Ṣètò dátà kékeré, ṣe ìṣírò àpapọ̀, kí o sì ṣàlàyé èsì pẹ̀lú ìṣọ́ra.",
      tag: "Kọ́ ọgbọ́n tó wúlò",
      lessons: [
        [
          "Ṣẹ̀dá tábìlì tó mọ́",
          "Ìwé ìṣírò ní ìlà, òpó àti sẹ́ẹ̀lì. Fi títà kan sí ìlà kọ̀ọ̀kan, àti irú àlàyé kan sí òpó kọ̀ọ̀kan. Lo Ọjọ́, Ọjà, Iye àti Owó ẹyọ kan. Lo ìlà àkọlé kan; má darapọ̀ sẹ́ẹ̀lì dátà.",
        ],
        [
          "Ṣàyẹ̀wò kí o tó ṣe ìṣírò",
          "Lo ọ̀nà ọjọ́ kan, nọ́ńbà fún iye àti orúkọ ọjà tó bá ara wọn mu. Sẹ́ẹ̀lì òfo lè túmọ̀ sí pé a kò mọ̀, kì í ṣe òdo. Ṣàyẹ̀wò bóyá àkọsílẹ̀ tó tún wà jẹ́ títà míì. Pa dátà àkọ́kọ́ mọ́, kí o sì kọ àtúnṣe sílẹ̀.",
        ],
        [
          "Lo fọ́múlà fún iṣẹ́ tó ń tún wá",
          "Fọ́múlà bẹ̀rẹ̀ pẹ̀lú =. Bí iye bá wà ní C2 àti owó ní D2, =C2*D2 ń ṣe ìṣírò owó títà. Da a sí ìlà ìsàlẹ̀, kí o sì ṣàyẹ̀wò nọ́ńbà ìlà. =SUM(E2:E6) ń kó iye márùn-ún pọ̀. Ṣàyẹ̀wò ìṣírò kan pẹ̀lú ọwọ́.",
        ],
        [
          "Tò àti yàn dátà láìléwu",
          "Títò ń yí ipò ìlà padà; àlẹ̀mọ́ ń fi ìlà tó bá àṣẹ mu hàn. Yan gbogbo tábìlì kí o tó tò ó, kí dátà títà kan lè wà pọ̀. Yan ọjà kan, lẹ́yìn náà yọ àlẹ̀mọ́. Ìlà tí a fi pamọ́ ṣì wà, àwọn fọ́múlà kan sì ń kà wọ́n.",
        ],
        [
          "Yan àwòrán ìṣírò tó ṣeé kà",
          "Lo àwòrán ọ̀pá fún fífi àpapọ̀ ọjà wé ara wọn, àti àwòrán ìlà fún àyípadà ní àkókò. Fi àkọlé àti ẹyọ ìwọ̀n sí i. Lo lẹ́tà tó ṣeé kà, má gbẹ́kẹ̀lé àwọ̀ nìkan. Bẹ̀rẹ̀ ìwọ̀n ọ̀pá ní òdo, kí o sì kọ àlàyé kúkúrú.",
        ],
        [
          "Ṣàlàyé ohun tí dátà lè sọ",
          "Sọ àkókò, iye àkọsílẹ̀ àti ẹyọ ìwọ̀n. Ìlọsíwájú títà nìkan kò fi ìdí rẹ̀ hàn. Sọ dátà tó sọnù tàbí tí kò dájú. Lo dátà àpẹẹrẹ tàbí yọ orúkọ ènìyàn kúrò; má pín àlàyé àṣírí oníbàárà.",
        ],
      ],
      quiz: [
        [
          "Kí ni ìlà kan nínú tábìlì títà yẹ kí ó dúró fún?",
          [
            "Àkọsílẹ̀ tí kò jọra",
            "Títà kan",
            "Gbogbo títà nínú sẹ́ẹ̀lì kan",
            "Àkọlé nìkan",
          ],
        ],
        [
          "Fọ́múlà wo ni ó ń ṣe C2 ìlọ́po D2?",
          ["=C2+D2", "=SUM(C2:D2)", "=C2*D2", "C2 D2"],
        ],
        [
          "Báwo ni o yẹ kí o ṣe sí owó tó sọnù?",
          [
            "Lo òdo nígbà gbogbo",
            "Pa ìwé ìṣírò rẹ́",
            "Ṣàyẹ̀wò ìtumọ̀ rẹ̀, kí o sì kọ ìpinnu sílẹ̀",
            "Lo owó tó ga jù",
          ],
        ],
        [
          "Kí ni ó ń pa dátà títà kan pọ̀ nígbà títò?",
          [
            "Tò òpó owó nìkan",
            "Yan gbogbo tábìlì",
            "Yọ àkọlé",
            "Darapọ̀ gbogbo ìlà",
          ],
        ],
        [
          "Títà tí a kọ sílẹ̀ pọ̀ sí i. Kí ni èyí nìkan fi hàn?",
          [
            "Ìpolówó ló fà á",
            "Gbogbo oníbàárà ní ìtẹ́lọ́rùn",
            "Títà tí a kọ sílẹ̀ pọ̀ sí i ní àkókò tí a sọ",
            "Títà ọjọ́ iwájú dájú",
          ],
        ],
      ],
      assignment:
        "Ṣẹ̀dá tábìlì títà àpẹẹrẹ pẹ̀lú ó kéré tán ìlà márùn-ún, kí o sì sọ irú owó. Ṣe ìṣírò títà kọ̀ọ̀kan àti àpapọ̀, ṣàyẹ̀wò kan pẹ̀lú ọwọ́, kí o sì ṣàlàyé àyẹ̀wò dátà kan. Fi tábìlì àti gbólóhùn mẹ́ta sínú àpótí iṣẹ́, pẹ̀lú àkókò àti ààlà kan.",
    },
    "business-foundations": {
      title: "Ìpìlẹ̀ iṣẹ́ òwò kékeré",
      description: "Yí èrò kan sí ìpèsè oníbàárà, ètò ìnáwó àti ìdánwò kékeré.",
      tag: "Fi ọgbọ́n ṣiṣẹ́",
      lessons: [
        [
          "Yan oníbàárà àti ìṣòro",
          "Bẹ̀rẹ̀ pẹ̀lú ẹgbẹ́ oníbàárà pàtó àti ìṣòro tí o lè yanjú. Àwọn oníṣòwò lè nílò àkọsílẹ̀ títà ojoojúmọ́. Béèrè bí wọ́n ṣe ń yanjú ìṣòro náà lónìí; fetí sí wọn kí o tó sọ èrò rẹ. Ìyìn kò fi hàn pé ẹni náà yóò san owó.",
        ],
        [
          "Ṣàlàyé ìpèsè rẹ",
          "Sọ ohun tí oníbàárà yóò rí gbà, ìgbà àti owó. Bẹ̀rẹ̀ pẹ̀lú iṣẹ́ tí o lè ṣe dáadáa. Sọ ohun tó wà nínú owó àti ohun tó nílò owó míì. Lo ọ̀nà ìkàn sí àti fífi ránṣẹ́ tí ó rọrùn, kí o sì béèrè nípa àìní ìwọlé.",
        ],
        [
          "Mọ ìnáwó àti owó tó kù",
          "Kọ ìnáwó títà kọ̀ọ̀kan, bí ohun èlò, àti ìnáwó àkókò kan, bí owó ilé. Títà naira 3,000 pẹ̀lú ìnáwó taara 2,000 fi 1,000 sílẹ̀ kí ìnáwó míì tó wọlé. Ka àkókò rẹ sí ètò. Owó tó wọlé kì í ṣe èrè.",
        ],
        [
          "Pa àkọsílẹ̀ owó mọ́",
          "Kọ owó tó wọlé àti tó jáde pẹ̀lú ọjọ́, àlàyé àti iye. Pa rísíìtì mọ́ bí ó bá wà. Ya ìnáwó òwò sọ́tọ̀ sí ti ara rẹ. Fi owó tó wà wé àkọsílẹ̀ déédéé. Ìlérí owó lẹ́yìn náà kì í ṣe owó tó wà lónìí.",
        ],
        [
          "Ṣe ìdánwò kékeré",
          "Yan èrò kan láti dán wò, bí bóyá oníṣòwò fẹ́ iṣẹ́ àkọsílẹ̀ lọ́sọ̀ọ̀sẹ̀. Sọ ààlà owó àti àkókò. Ṣàlàyé ìpèsè pẹ̀lú òtítọ́, gba àṣẹ fún àbá. Ka ìbéèrè àti rírà lọ́tọ̀. Sọ èsì tí yóò jẹ́ kí o tẹ̀síwájú.",
        ],
        [
          "Kọ ìgbẹ́kẹ̀lé kí o sì mú iṣẹ́ dára",
          "Jẹ́rìí sí owó àti ìgbà fífi ránṣẹ́ kí o tó gba àṣẹ. Sọ fún oníbàárà ní kutukutu bí ohun bá yí padà. Pèsè ọ̀nà ẹ̀dùn, kí o sì pa àlàyé rẹ mọ́. Béèrè ìbéèrè àbá pàtó lẹ́yìn iṣẹ́; ṣàyẹ̀wò àkọsílẹ̀ kí o sì yan àtúnṣe kan.",
        ],
      ],
      quiz: [
        [
          "Ìbéèrè wo ni ó wúlò fún ìwádìí oníbàárà?",
          [
            "O fẹ́ràn èrò mi, àbí?",
            "Báwo ni o ṣe ń yanjú ìṣòro yìí lónìí?",
            "Kí ló dé tí o kò tíì rà?",
            "Ṣé o lè jẹ́rìí títà mẹ́wàá?",
          ],
        ],
        [
          "Títà naira 3,000 ní ìnáwó taara 2,000. Kí ló kù kí ìnáwó míì tó wọlé?",
          [
            "Naira 5,000",
            "Naira 2,000",
            "Naira 1,000",
            "Naira 3,000 lẹ́yìn gbogbo ìnáwó",
          ],
        ],
        [
          "Èwo ni owó tó wà lónìí?",
          [
            "Àṣẹ tí ó lè dé lọ́jọ́ iwájú",
            "Ìlérí tí a kò tíì san",
            "Owó tí a ti gbà tí ó sì ṣì wà",
            "Àfojúsùn ọdún tó ń bọ̀",
          ],
        ],
        [
          "Kí ni ó mú ìdánwò kékeré wúlò?",
          [
            "Ìnáwó láìsí ààlà",
            "Èrò, ètò owó, ààlà àkókò àti àmì àṣeyọrí",
            "Kíka ìyìn nìkan",
            "Láìsí àkọsílẹ̀",
          ],
        ],
        [
          "O retí pé iṣẹ́ yóò pẹ́. Kí ni o yẹ kí o ṣe?",
          [
            "Foju kọ oníbàárà",
            "Pa àkọsílẹ̀ àṣẹ rẹ́",
            "Ṣàlàyé ní kutukutu, kí ẹ sì fohùn ṣọ̀kan lórí ìgbésẹ̀ tó kàn",
            "Ṣèlérí ọjọ́ tí o kò lè mú",
          ],
        ],
      ],
      assignment:
        "Kọ ètò òwò àpẹẹrẹ: oníbàárà àti ìṣòro, ìpèsè àti owó, ètò owó fún títà mẹ́ta, ìdánwò ọ̀sẹ̀ kan pẹ̀lú ààlà owó àti àmì àṣeyọrí, àti ìfiránṣẹ́ oníbàárà. Sọ àwọn èrò tí kò tíì dájú àti ewu kan láti ṣàyẹ̀wò kí o tó náwó.",
    },
  },
  ig: {
    "digital-essentials": {
      title: "Ntọala iji ngwaọrụ dijital",
      description:
        "Jiri ngwaọrụ gị, hazie faịlụ ma kwurịta okwu n’ịntanetị n’enweghị nsogbu.",
      tag: "Malite ebe a",
      lessons: [
        [
          "Hazie ngwaọrụ gị",
          "Gbanwee nha ederede, ìhè na ụda ka ha dịrị gị mfe. Nwaa onye na-agụ ihuenyo, ide site n’olu ma ọ bụ iji bọtịnụ ma ọ bụrụ na ha na-enyere gị aka. Mepee ngwa, gaa na nke ọzọ ma laghachi. Zuru ike mgbe ịchọrọ.",
        ],
        [
          "Mepụta ma chọta faịlụ",
          "Faịlụ na-echekwa akwụkwọ ma ọ bụ foto; folda na-achịkọta faịlụ yiri ibe ha. Nye ha aha doro anya, dịka Mmefu-ahịa-Ọktoba. Chekwaa obere ederede, mechie ya ma chọta ya ọzọ. Debe otu akwụkwọ ọrụ dị mkpa n’ebe ọzọ dị nchebe.",
        ],
        [
          "Jiri ajụjụ doro anya chọọ",
          "Jiri okwu ọchụchọ kpọmkwem. Tụnyere nsonaazụ; lelee onye dere ya, ụbọchị emelitere na ihe akaebe. Mgbasa ozi ma ọ bụ nsonaazụ mbụ anaghị egosi na ọ bụ eziokwu. Ebula faịlụ ị na-amaghị.",
        ],
        [
          "Dee ozi bara uru",
          "Jiri isiokwu dị mkpirikpi, ekele, arịrịọ bụ isi na mmechi. Lelee onye ga-anata ya na faịlụ agbakwunyere tupu izipu. Kesaa naanị ozi onwe gị ọrụ chọrọ. Rịọ ikike tupu iziga ozi nzuzo onye ọzọ.",
        ],
        [
          "Chebe akaụntụ gị",
          "Jiri okwuntughe ogologo dị iche maka akaụntụ ọ bụla. Ngwa nchekwa okwuntughe ị tụkwasịrị obi nwere ike inye aka. Tinye usoro nkwenye nke abụọ ma ọ bụrụ na ọ dị. Ekekọrịtala okwuntughe ma ọ bụ koodu otu oge. Nyochaa arịrịọ ego site n’ụzọ kọntaktị ị maara.",
        ],
        [
          "Hazie ohere na njikọ",
          "Lelee data fọdụrụ tupu imepe nnukwu faịlụ. Budata ihe enyere ikike ka ị gụọ ha mgbe e mesịrị. Rịọ ederede okwu a na-ekwu, akwụkwọ dị mfe iji ma ọ bụ ụdị ọzọ. Kọwaa ihe na-egbochi gị ma rịọ ụzọ ọzọ bara uru.",
        ],
      ],
      quiz: [
        [
          "Kedu aha faịlụ ga-adị mfe ịchọta mgbe e mesịrị?",
          [
            "Akwụkwọ1",
            "Enweghị-aha",
            "Mmefu-ahịa-Ọktoba",
            "Faịlụ-ọhụrụ-ikpeazụ-ọhụrụ",
          ],
        ],
        [
          "Mmadụ rịọrọ koodu nbanye otu oge gị. Kedu ihe ị ga-eme?",
          [
            "Zipu ya ozugbo",
            "Debe ya na nzuzo ma nyochaa arịrịọ ahụ n’ụzọ ọzọ",
            "Tinye ya n’otu",
            "Zipu ọkara ya",
          ],
        ],
        [
          "Kedu ihe na-enyere gị inyocha nsonaazụ ọchụchọ?",
          [
            "Ọ pụtara mbụ",
            "Ọ nwere agba na-enwu",
            "Onye dere ya, ụbọchị na ihe akaebe",
            "Ọ chọrọ ka ị budata ozugbo",
          ],
        ],
        [
          "Akwụkwọ siri ike ịgụ. Kedu nzọụkwụ bara uru?",
          [
            "Rịọ ụdị dị mfe iji ma ọ bụ gbanwee ihuenyo",
            "Kwụsị ịmụ ruo mgbe ebighị ebi",
            "Kesaa okwuntughe gị",
            "Eleghara nsogbu ahụ anya",
          ],
        ],
      ],
      assignment:
        "Mepụta atụmatụ mmụta dijital: aha folda na faịlụ doro anya, ntọala na-enyere ohere, ndepụta nchekwa akaụntụ na-enweghị ihe nzuzo, ụzọ ọzọ maka njikọ na-adịghị mma na ozi ịrịọ onye nduzi enyemaka. Tinye ọrụ gị n’igbe ọrụ omume.",
    },
    "spreadsheet-data": {
      title: "Nkà akwụkwọ mgbakọ na data",
      description:
        "Hazie obere data, gbakọọ ngụkọta ma kọwaa nsonaazụ nke ọma.",
      tag: "Mụta nkà bara uru",
      lessons: [
        [
          "Mepụta tebụl dị n’usoro",
          "Akwụkwọ mgbakọ nwere ahịrị, kọlụm na sel. Tinye otu ire ahịa n’ahịrị ọ bụla, otu ụdị ozi na kọlụm ọ bụla. Jiri Ụbọchị, Ngwaahịa, Ọnụọgụ na Ọnụ ahịa otu. Jiri otu ahịrị isiokwu; ejikọla sel data ọnụ.",
        ],
        [
          "Nyochaa tupu ịgbakọọ",
          "Jiri otu usoro ụbọchị, ọnụọgụ n’ụdị nọmba na aha ngwaahịa kwekọrọ. Sel efu nwere ike ịpụta amaghị kama efu. Nyochaa ma ndekọ abụọ yiri ibe ha bụ ire ahịa dị iche. Debe data mbụ ma dee mmezi niile.",
        ],
        [
          "Jiri usoro mgbakọ",
          "Usoro mgbakọ na-amalite na =. Ọ bụrụ na ọnụọgụ dị na C2 na ọnụ ahịa na D2, =C2*D2 na-enye ego ire ahịa. Detuo ya n’ahịrị ndị ọzọ ma lelee nọmba ahịrị. =SUM(E2:E6) na-agbakọta ego ise. Jiri aka nyochaa otu mgbakọ.",
        ],
        [
          "Hazie ma yọchaa nke ọma",
          "Ịhazi na-agbanwe ọnọdụ ahịrị; ịyọcha na-egosi ndị kwekọrọ na ọnọdụ. Họrọ tebụl dum tupu ịhazi ka ozi otu ire ahịa nọkọọ. Yọchaa otu ngwaahịa ma wepụ nzacha ọzọ. Ahịrị zoro ezo ka dị, ụfọdụ mgbakọ na-etinye ha.",
        ],
        [
          "Họrọ eserese dị mfe ịgụ",
          "Jiri eserese ogwe tụnyere ngụkọta ngwaahịa, na eserese ahịrị gosipụta mgbanwe n’oge. Tinye aha na nkeji nha. Jiri akara dị mfe ịgụ; adaberekwala naanị na agba. Malite nha ogwe na efu, tinye nkọwa dị mkpirikpi.",
        ],
        [
          "Kọwaa ihe data nwere ike ikwu",
          "Kọwaa oge, ọnụọgụ ndekọ na nkeji nha. Mmụba ire ahịa naanị anaghị egosi ihe kpatara ya. Kwuo data na-efu ma ọ bụ nke na-edoghị anya. Jiri data atụ ma ọ bụ wepụ ihe na-achọpụta mmadụ; ekekọrịtala ozi nzuzo ndị ahịa.",
        ],
      ],
      quiz: [
        [
          "Kedu ihe otu ahịrị tebụl ire ahịa kwesịrị ịnọchi anya?",
          [
            "Ndetu enweghị njikọ",
            "Otu ire ahịa",
            "Ire ahịa niile n’otu sel",
            "Naanị isiokwu",
          ],
        ],
        [
          "Kedu usoro na-amụba C2 site na D2?",
          ["=C2+D2", "=SUM(C2:D2)", "=C2*D2", "C2 D2"],
        ],
        [
          "Kedu ihe ị ga-eme banyere ọnụ ahịa na-efu?",
          [
            "Jiri efu mgbe niile",
            "Hichapụ akwụkwọ mgbakọ",
            "Nyochaa ihe ọ pụtara ma dee mkpebi",
            "Were ọnụ ahịa kacha elu",
          ],
        ],
        [
          "Kedu ihe na-edobe ozi otu ire ahịa ọnụ mgbe ị na-ahazi?",
          [
            "Hazie naanị kọlụm ọnụ ahịa",
            "Họrọ tebụl dum",
            "Wepụ isiokwu",
            "Jikọta ahịrị niile",
          ],
        ],
        [
          "Ire ahịa e dekọrọ abawanyela. Kedu ihe nke a naanị na-egosi?",
          [
            "Mgbasa ozi kpatara ya",
            "Afọ juru ndị ahịa niile",
            "Ire ahịa e dekọrọ abawanyela n’oge a kọwara",
            "Ire ahịa ọdịnihu bụ ihe doro anya",
          ],
        ],
      ],
      assignment:
        "Mepụta tebụl ire ahịa atụ nwere ma ọ dịkarịa ala ahịrị ise, kọwaa ụdị ego. Gbakọọ ego nke ọ bụla na ngụkọta, jiri aka nyochaa otu mgbakọ ma kọwaa otu nyocha ịdị mma data. Tinye tebụl na ahịrịokwu atọ n’igbe ọrụ, kọwaa oge na otu njedebe.",
    },
    "business-foundations": {
      title: "Ntọala obere azụmahịa",
      description:
        "Mee ka echiche bụrụ ihe ị na-enye ndị ahịa, atụmatụ ego na obere nnwale.",
      tag: "Jiri nkà gị rụọ ọrụ",
      lessons: [
        [
          "Họrọ onye ahịa na nsogbu",
          "Malite na otu ndị ahịa kpọmkwem na nsogbu ị nwere ike idozi. Ndị ahịa mpaghara nwere ike ịchọ ndekọ ire ahịa kwa ụbọchị. Jụọ otu ha si edozi nsogbu ugbu a; gee ntị tupu ịkọwa echiche gị. Otuto anaghị egosi na mmadụ ga-akwụ ụgwọ.",
        ],
        [
          "Kọwaa ihe ị na-enye",
          "Kọwaa ihe onye ahịa ga-enweta, mgbe ọ ga-enweta ya na ọnụ ahịa. Malite na obere ọrụ ị nwere ike ịrụ nke ọma. Kwuo ihe gụnyere na ihe chọrọ ego ọzọ. Họrọ ụzọ kọntaktị na nnyefe dị mfe iji; jụọ maka mkpa ohere.",
        ],
        [
          "Mara mmefu na ego fọdụrụ",
          "Depụta mmefu nke ire ahịa ọ bụla, dịka akụrụngwa, na mmefu nke oge, dịka ụgwọ ụlọ. Ire ahịa naira 3,000 nwere mmefu kpọmkwem 2,000 na-ahapụ 1,000 tupu mmefu ndị ọzọ. Gụnye oge gị n’atụmatụ. Ego mbata abụghị uru.",
        ],
        [
          "Debe ndekọ ego dị mfe",
          "Dee ego na-abata na nke na-apụ na ụbọchị, nkọwa na ọnụọgụ. Debe risit ma ọ bụrụ na ọ dị. Kewapụ mmefu azụmahịa na nke onwe gị na ndekọ. Tụnyere ego dị na ndekọ mgbe niile. Nkwa ịkwụ ụgwọ mgbe e mesịrị abụghị ego dị taa.",
        ],
        [
          "Mee obere nnwale",
          "Họrọ otu echiche ị ga-anwale, dịka ma ndị ahịa chọrọ ọrụ ndekọ kwa izu. Tọọ oke ego na oge. Kọwaa ihe ị na-enye n’eziokwu ma nweta ikike ịnakọta nzaghachi. Gụọ ajụjụ na ịzụrụ ihe iche. Kọwaa nsonaazụ ga-eme ka ị gaa n’ihu.",
        ],
        [
          "Wulite ntụkwasị obi ma meziwanye",
          "Kwenye ọnụ ahịa na oge nnyefe tupu ịnabata iwu ahịa. Gwa onye ahịa n’oge ma ihe gbanwee. Nye ụzọ ịkọ mkpesa ma chebe ozi ya. Jụọ ajụjụ nzaghachi kpọmkwem mgbe nnyefe gasịrị. Nyochaa ndekọ ma họrọ otu mmezi.",
        ],
      ],
      quiz: [
        [
          "Kedu ajụjụ bara uru n’ịchọpụta mkpa ndị ahịa?",
          [
            "Ị hụrụ echiche m n’anya, ọ bụghị ya?",
            "Kedu otu ị si edozi nsogbu a ugbu a?",
            "Gịnị mere ị zụtabeghị?",
            "Ị nwere ike ikwe nkwa ire ahịa iri?",
          ],
        ],
        [
          "Ire ahịa naira 3,000 nwere mmefu kpọmkwem 2,000. Gịnị fọdụrụ tupu mmefu ndị ọzọ?",
          [
            "Naira 5,000",
            "Naira 2,000",
            "Naira 1,000",
            "Naira 3,000 mgbe mmefu niile gasịrị",
          ],
        ],
        [
          "Kedu ego dị taa?",
          [
            "Iwu ahịa nwere ike ịbịa n’ọdịnihu",
            "Nkwa a na-akwụbeghị",
            "Ego anabatara nke ka dị",
            "Ebumnuche afọ ọzọ",
          ],
        ],
        [
          "Kedu ihe na-eme obere nnwale bara uru?",
          [
            "Mmefu enweghị oke",
            "Echiche, atụmatụ ego, oke oge na ihe ga-egosi ihe ịga nke ọma",
            "Ịgụta naanị otuto",
            "Enweghị ndekọ",
          ],
        ],
        [
          "Ị na-atụ anya na nnyefe ga-egbu oge. Kedu ihe ị ga-eme?",
          [
            "Eleghara onye ahịa anya",
            "Hichapụ ndekọ iwu",
            "Kọwaa n’oge ma kwekọrịta nzọụkwụ ọzọ",
            "Kwe nkwa ụbọchị ị na-enweghị ike ime",
          ],
        ],
      ],
      assignment:
        "Dee atụmatụ obere azụmahịa atụ: onye ahịa na nsogbu, ihe ị na-enye na ọnụ ahịa, atụmatụ ego maka ire ahịa atọ, nnwale otu izu nwere oke ego na ihe ga-egosi ihe ịga nke ọma, na ozi ọrụ ndị ahịa. Kaa echiche na-edoghị anya ma kọwaa otu ihe ize ndụ ị ga-enyocha tupu imefu ego.",
    },
  },
};

export function localizeCourse(course: Course, lang: string): Course {
  const text = content[lang]?.[course.id];
  if (!text) return course;
  return {
    ...course,
    title: text.title,
    description: text.description,
    tag: text.tag,
    lessons: course.lessons.map((lesson, index) => {
      const translated = text.lessons[index];
      if (!translated) return lesson;
      return {
        ...lesson,
        title: translated[0],
        body: translated[1],
        resource: undefined,
      };
    }),
    quiz: course.quiz.map((question, index) => {
      const translated = text.quiz[index];
      return translated
        ? { ...question, question: translated[0], options: translated[1] }
        : question;
    }),
    assignment: text.assignment,
  };
}
