export interface PageVoiceGuide {
  id: string;
  titleEn: string;
  titleTa: string;
  titleHi: string;
  whatYouCanDoEn: string;
  whatYouCanDoTa: string;
  whatYouCanDoHi: string;
  speechEn: string;
  speechTa: string;
  speechHi: string;
}

export const PAGE_VOICE_GUIDES: Record<string, PageVoiceGuide> = {
  // Citizen: Identity Wallet
  customer_wallet: {
    id: 'customer_wallet',
    titleEn: 'Identity Wallet & Verifiable Credentials',
    titleTa: 'டிஜிட்டல் அடையாள வாலட் & நற்சான்றிதழ்கள்',
    titleHi: 'पहचान वॉलेट एवं सत्यापित क्रेडेंशियल',
    whatYouCanDoEn: 'View and manage sovereign credentials (Aadhaar, PAN, Driving License), inspect cryptographic signatures, backup credentials, and manage WebAuthn biometric passkeys.',
    whatYouCanDoTa: 'உங்கள் ஆதார், பான், ஓட்டுநர் உரிமம் போன்ற டிஜிட்டல் ஆவணங்களைக் காணலாம், கிரிப்டோகிராஃபிக் கையொப்பங்களைச் சரிபார்க்கலாம் மற்றும் பாஸ்கீகளைப் பாதுகாக்கலாம்.',
    whatYouCanDoHi: 'अपने आधार, पैन और ड्राइविंग लाइसेंस डिजिटल क्रेडेंशियल देखें, क्रिप्टोग्राफिक हस्ताक्षर सत्यापित करें और बायोमेट्रिक पासकी प्रबंधित करें।',
    speechEn: 'Welcome to your Identity Wallet. On this page, you can view your sovereign digital credentials including Aadhaar, PAN, and Driving License. You can check cryptographic authenticity, backup your wallet, and manage biometric passkeys without revealing your raw documents.',
    speechTa: 'உங்கள் டிஜிட்டல் அடையாள வாலட்டிற்கு வரவேற்கிறோம். இந்த பக்கத்தில் உங்கள் ஆதார், பான் மற்றும் ஓட்டுநர் உரிமம் போன்ற அதிகாரப்பூர்வ ஆவணங்களைக் காணலாம். கிரிப்டோகிராஃபிக் கையொப்பங்களை சரிபார்த்து, உங்கள் அசல் ஆவணங்களை யாருக்கும் கொடுக்காமல் பாதுகாப்பாக நிர்வகிக்கலாம்.',
    speechHi: 'आपके पहचान वॉलेट में आपका स्वागत है। इस पेज पर आप अपने आधार, पैन और ड्राइविंग लाइसेंस जैसे डिजिटल दस्तावेज देख सकते हैं, क्रिप्टोग्राफिक प्रमाण जांच सकते हैं और बिना दस्तावेज साझा किए पासकी प्रबंधित कर सकते हैं।'
  },

  // Citizen: KYC Passport
  customer_passport: {
    id: 'customer_passport',
    titleEn: 'Reusable KYC Passport',
    titleTa: 'மறுபயன்பாட்டு KYC பாஸ்போர்ட்',
    titleHi: 'पुनः प्रयोज्य केवाईसी पासपोर्ट',
    whatYouCanDoEn: 'Monitor your unified KYC passport verification level, track Indian banking compliance status, review active bank endorsements, and download verifiable passport hashes.',
    whatYouCanDoTa: 'உங்கள் ஒருங்கிணைந்த KYC சரிபார்ப்பு நிலையை கண்காணிக்கலாம், இந்திய வங்கி விதிமுறை இணக்கத்தை அறியலாம் மற்றும் அங்கீகரிக்கப்பட்ட வங்கிகளின் நேரடி ஒப்புதல்களைக் காணலாம்.',
    whatYouCanDoHi: 'अपना एकीकृत केवाईसी पासपोर्ट सत्यापन स्तर जांचें, भारतीय बैंकिंग अनुपालन स्थिति देखें और अनुमोदित बैंकों से सक्रिय समर्थन देखें।',
    speechEn: 'Reusable KYC Passport. On this page, you can view your standardized KYC completion score, compliance tier across all Indian banks, and verify that your identity is valid across financial institutions with zero repeated paperwork.',
    speechTa: 'மறுபயன்பாட்டு KYC பாஸ்போர்ட். இந்த பக்கத்தில் உங்கள் முழுமையான KYC சரிபார்ப்பு மதிப்பெண் மற்றும் அனைத்து இந்திய வங்கிகளிலும் உங்கள் பாஸ்போர்ட் ஏற்றுக்கொள்ளப்படும் நிலையை நீங்கள் அறியலாம். மீண்டும் மீண்டும் ஆவணங்கள் சமர்ப்பிக்க வேண்டியதில்லை.',
    speechHi: 'पुनः प्रयोज्य केवाईसी पासपोर्ट। इस पेज पर आप अपना केवाईसी सत्यापन स्कोर देख सकते हैं, जिससे आप बिना बार-बार कागजात दिए भारत के किसी भी बैंक में तुरंत पहचान साबित कर सकते हैं।'
  },

  // Citizen: Privacy Score
  customer_privacy: {
    id: 'customer_privacy',
    titleEn: 'Privacy Score & Exposure Radar',
    titleTa: 'தனியுரிமை மதிப்பெண் & ரேடார்',
    titleHi: 'गोपनीयता स्कोर एवं ट्रैकिंग रडार',
    whatYouCanDoEn: 'Audit real-time privacy health score, inspect identity exposure risks across institutions, configure selective disclosure policies, and minimize identity surface area.',
    whatYouCanDoTa: 'உங்கள் நேரடி தனியுரிமை மதிப்பெண்ணைக் கண்காணிக்கலாம், நிறுவனங்களுடனான தரவு பகிர்வு அபாயங்களை ஆய்வு செய்யலாம் மற்றும் ஜீரோ நாலெட்ஜ் தனியுரிமை விதிகளை அமைக்கலாம்.',
    whatYouCanDoHi: 'अपना वास्तविक समय गोपनीयता स्कोर देखें, पहचान जोखिमों की जांच करें और न्यूनतम डेटा साझाकरण की नीतियां सेट करें।',
    speechEn: 'Privacy Score and Exposure Radar. This page monitors how well your sensitive personal information is protected. You can review your threat score, audit third-party tracking risks, and enforce strict zero-knowledge redaction.',
    speechTa: 'தனியுரிமை மதிப்பெண் மற்றும் ரேடார். உங்கள் முக்கியமான தனிப்பட்ட விவரங்கள் எந்த அளவிற்கு பாதுகாப்பாக உள்ளன என்பதை இந்த பக்கம் கண்காணிக்கிறது. உங்கள் பாதுகாப்பு மதிப்பெண்ணை உயர்த்தி, அத்தியாவசியமற்ற தரவு கசிவை தடுக்கலாம்.',
    speechHi: 'गोपनीयता स्कोर और एक्सपोजर रडार। यह पेज बताता है कि आपकी व्यक्तिगत जानकारी कितनी सुरक्षित है। आप तीसरे पक्ष के ट्रैकिंग जोखिमों की जांच कर सकते हैं और पूर्ण गोपनीयता सुनिश्चित कर सकते हैं।'
  },

  // Citizen: TrustAI Sentinel
  customer_trustai: {
    id: 'customer_trustai',
    titleEn: 'TrustAI Sentinel Security Engine',
    titleTa: 'ட்ரஸ்ட்ஏஐ சென்டினல் பாதுகாப்பு அமைப்பு',
    titleHi: 'ट्रस्टएआई सेंटिनल सुरक्षा इंजन',
    whatYouCanDoEn: 'Run real-time synthetic identity detection, evaluate deepfake spoofing defenses, review automated risk assessments, and interact with AI safety recommendations.',
    whatYouCanDoTa: 'செயற்கை நுண்ணறிவு மூலம் போலி அடையாளங்கள் மற்றும் டீப்ஃபேக் அச்சுறுத்தல்களை உடனுக்குடன் கண்டறியலாம், பாதுகாப்பு வழிமுறைகளை ஆய்வு செய்யலாம்.',
    whatYouCanDoHi: 'वास्तविक समय में नकली पहचान और डीपफेक खतरों का पता लगाएं, एआई सुरक्षा सिफारिशों की समीक्षा करें और अपने खाते को सुरक्षित रखें।',
    speechEn: 'TrustAI Sentinel. This page provides artificial intelligence powered surveillance to protect your identity against synthetic fraud, credential tampering, and deepfake injection attacks with real-time defense actions.',
    speechTa: 'ட்ரஸ்ட்ஏஐ சென்டினல். செயற்கை நுண்ணறிவு தொழில்நுட்பம் மூலம் உங்கள் அடையாளத்தை போலி நகல்கள், டீப்ஃபேக் மோசடிகள் மற்றும் ஊடுருவல்களிலிருந்து பாதுகாப்பதற்கான பாதுகாப்பு வழிகாட்டுதல்களை இந்த பக்கம் வழங்குகிறது.',
    speechHi: 'ट्रस्टएआई सेंटिनल। यह पेज कृत्रिम बुद्धिमत्ता सुरक्षा का उपयोग करके आपकी पहचान को नकली दस्तावेजों, धोखाधड़ी और डीपफेक हमलों से सुरक्षित रखने में मदद करता है।'
  },

  // Citizen: Zero-Knowledge Proofs
  customer_zkp: {
    id: 'customer_zkp',
    titleEn: 'Zero-Knowledge Proof (ZKP) Generator',
    titleTa: 'ஜீரோ-நாலெட்ஜ் ப்ரூஃப் (ZKP) உருவாக்கி',
    titleHi: 'ज़ीरो-नॉलेज प्रूफ़ (ZKP) जनरेटर',
    whatYouCanDoEn: 'Generate cryptographic zk-SNARK proofs to verify age (over 18), income eligibility, residency, or civil status without disclosing your raw identity numbers or certificates.',
    whatYouCanDoTa: 'உங்கள் பிறந்த தேதி அல்லது வருமான ஆவணங்களை காட்டாமல், நீங்கள் 18 வயது நிரம்பியவர் அல்லது தகுதியானவர் என்பதை கணித ரீதியாக நிரூபிக்க கிரிப்டோகிராஃபிக் ஆதாரங்களை உருவாக்கலாம்.',
    whatYouCanDoHi: 'अपने संवेदनशील पहचान नंबर दिखाए बिना आयु (18 से अधिक) या आय सीमा साबित करने के लिए गणितीय क्रिप्टोग्राफ़िक प्रमाण तैयार करें।',
    speechEn: 'Zero Knowledge Proof Generator. On this page, you can create cryptographic zk-SNARK mathematical proofs. You can prove to banks that you are over 18 or satisfy income thresholds without showing your birth date, salary slip, or Aadhaar number.',
    speechTa: 'ஜீரோ நாலெட்ஜ் ப்ரூஃப் உருவாக்கி. உங்கள் பிறந்த தேதி, சம்பள சான்றிதழ் அல்லது ஆதார் எண்ணை யாருக்கும் காட்டாமல், உங்கள் தகுதியை கணித சூத்திரம் மூலம் வங்கிகளுக்கு நிரூபிக்க இந்த பக்கத்தில் ஆதாரங்களை உருவாக்கலாம்.',
    speechHi: 'ज़ीरो नॉलेज प्रूफ़ जनरेटर। इस पेज पर आप अपनी जन्मतिथि या आय दस्तावेज दिखाए बिना बैंकों को साबित कर सकते हैं कि आप 18 वर्ष से अधिक हैं या ऋण के लिए पात्र हैं।'
  },

  // Citizen: Bank Requests
  customer_requests: {
    id: 'customer_requests',
    titleEn: 'Institutional KYC & Data Requests',
    titleTa: 'வங்கி & நிறுவன KYC கோரிக்கைகள்',
    titleHi: 'बैंक एवं संस्थागत डेटा अनुरोध',
    whatYouCanDoEn: 'Review incoming requests from verified financial institutions, see exactly what attributes are requested, approve with custom validity periods, or decline requests.',
    whatYouCanDoTa: 'வங்கிகளிடமிருந்து வரும் புதிய தரவு கோரிக்கைகளை ஆய்வு செய்யலாம், தேவையான விவரங்களுக்கு மட்டும் குறிப்பிட்ட காலத்திற்கு அனுமதி வழங்கலாம் அல்லது நிராகரிக்கலாம்.',
    whatYouCanDoHi: 'सत्यापित वित्तीय संस्थानों से आने वाले अनुरोधों की समीक्षा करें, आवश्यक डेटा की जांच करें और अपनी पसंद से स्वीकृति या अस्वीकृति दें।',
    speechEn: 'Institutional Data Requests. On this page, you can review requests from verified banks wanting to verify your credentials. You can inspect what specific data they need and securely grant or reject access.',
    speechTa: 'நிறுவன தரவு கோரிக்கைகள். இந்த பக்கத்தில் அங்கீகரிக்கப்பட்ட வங்கிகள் உங்களிடம் கேட்கும் தகவல்களைக் காணலாம். அவர்கள் கேட்கும் விவரங்களை ஆய்வு செய்து உங்கள் விருப்பப்படி ஒப்புதல் அளிக்கலாம் அல்லது நிராகரிக்கலாம்.',
    speechHi: 'संस्थागत डेटा अनुरोध। इस पेज पर आप बैंकों द्वारा भेजे गए केवाईसी अनुरोध देख सकते हैं और तय कर सकते हैं कि किस बैंक को कितनी जानकारी और कितने समय के लिए देनी है।'
  },

  // Citizen: QR Verification Token
  customer_qr: {
    id: 'customer_qr',
    titleEn: 'Verifiable QR Token & Offline Verification',
    titleTa: 'சரிபார்க்கக்கூடிய QR டோக்கன் & ஆஃப்லைன் சரிபார்ப்பு',
    titleHi: 'सत्यापनीय क्यूआर टोकन एवं ऑफलाइन सत्यापन',
    whatYouCanDoEn: 'Generate self-expiring encrypted QR codes and dynamic one-time tokens for in-person branch visits, agent verification, or instant banking verification.',
    whatYouCanDoTa: 'வங்கி கிளைகளில் ஆஃப்லைனில் உடனடியாக சரிபார்க்க காலாவதியாகும் பாதுகாப்பான QR குறியீடுகள் மற்றும் ஒரு முறை டோக்கன்களை இங்கே உருவாக்கலாம்.',
    whatYouCanDoHi: 'बैंक शाखाओं में तुरंत सत्यापन के लिए समय-सीमित एन्क्रिप्टेड क्यूआर कोड और वन-टाइम टोकन जनरेट करें।',
    speechEn: 'Verifiable QR Token. On this page, you can generate cryptographic QR codes and temporary alphanumeric tokens. Show this at bank branches or to authorized field agents for instant one-touch verification.',
    speechTa: 'சரிபார்க்கக்கூடிய QR டோக்கன். வங்கி கிளைகள் அல்லது முகவர்களிடம் செல்லும்போது உடனடியாக சரிபார்க்க இந்த பக்கத்தில் உள்ள பாதுகாப்பான QR குறியீடு அல்லது ரகசிய டோக்கனை பயன்படுத்தலாம்.',
    speechHi: 'सत्यापनीय क्यूआर टोकन। बैंक शाखा या अधिकृत एजेंट के पास जाने पर तुरंत सत्यापन के लिए इस पेज पर दिया गया सुरक्षित क्यूआर कोड या टोकन दिखाएं।'
  },

  // Citizen: Consent Center
  customer_consent: {
    id: 'customer_consent',
    titleEn: 'Sovereign Consent Management Center',
    titleTa: 'இறையாண்மை ஒப்புதல் மேலாண்மை மையம்',
    titleHi: 'सॉवरेन सहमति प्रबंधन केंद्र',
    whatYouCanDoEn: 'Inspect active data-sharing consents with banks, view cryptographic consent timestamps, pause permissions, or immediately revoke access with 1-click.',
    whatYouCanDoTa: 'வங்கிகளுடன் நீங்கள் செய்துள்ள அனைத்து தரவு பகிர்வு ஒப்பந்தங்களையும் காணலாம், எந்த நேரத்திலும் ஒரே கிளிக்கில் அனுமதியை முழுமையாக ரத்து செய்யலாம்.',
    whatYouCanDoHi: 'बैंकों के साथ सक्रिय डेटा सहमति देखें, अनुमति का इतिहास जांचें और किसी भी समय एक क्लिक से तुरंत सहमति वापस लें।',
    speechEn: 'Consent Management Center. You have complete control over your identity. On this page, view every bank that currently has access to your data, and revoke or pause any permission instantly.',
    speechTa: 'ஒப்புதல் மேலாண்மை மையம். உங்கள் அடையாளம் உங்கள் முழு கட்டுப்பாட்டில் உள்ளது. உங்கள் விவரங்களை அணுக அனுமதி பெற்றுள்ள வங்கிகளை இங்கே பார்க்கலாம், எந்த நேரத்திலும் அனுமதியை உடனடியாக ரத்து செய்யலாம்.',
    speechHi: 'सहमति प्रबंधन केंद्र। आपका डेटा आपके पूर्ण नियंत्रण में है। इस पेज पर देखें कि किन बैंकों के पास आपकी जानकारी की अनुमति है, और जब चाहें तुरंत अनुमति रद्द करें।'
  },

  // Citizen: Smart CBDC Loans
  customer_loans: {
    id: 'customer_loans',
    titleEn: 'Smart CBDC Loans & Verifiable Credit',
    titleTa: 'ஸ்மார்ட் கடன்கள் & சரிபார்க்கப்பட்ட கிரெடிட்',
    titleHi: 'स्मार्ट सीबीडीसी ऋण एवं सत्यापित क्रेडिट',
    whatYouCanDoEn: 'Explore pre-approved microloans powered by verifiable credentials, run Zero-Knowledge creditworthiness simulations, and apply with instant digital rupee disbursement.',
    whatYouCanDoTa: 'உங்கள் சான்றளிக்கப்பட்ட ஆவணங்கள் மூலம் பிணையில்லா குறுங்கடன் வாய்ப்புகளை ஆராயலாம் மற்றும் உடனடி டிஜிட்டல் ரூபாய் கடன் பெற விண்ணப்பிக்கலாம்.',
    whatYouCanDoHi: 'अपनी डिजिटल साख के आधार पर पूर्व-स्वीकृत ऋण प्रस्ताव देखें और स्मार्ट अनुबंधों के माध्यम से तुरंत ऋण प्राप्त करें।',
    speechEn: 'Smart CBDC Microloans. On this page, explore collateral-free credit lines powered by verifiable credentials. Check automated smart contract terms and apply with instant disbursement.',
    speechTa: 'ஸ்மார்ட் கடன்கள். இந்த பக்கத்தில் உங்கள் நம்பகமான ஆவணங்களின் அடிப்படையில் பிணையில்லா உடனடி கடன்களை நீங்கள் பெறலாம். வெளிப்படையான வட்டி விகிதங்களை ஆராய்ந்து உடனடியாக விண்ணப்பிக்கலாம்.',
    speechHi: 'स्मार्ट सीबीडीसी ऋण। इस पेज पर अपनी डिजिटल पहचान के आधार पर बिना किसी बंधक के तुरंत ऋण सुविधाओं का लाभ उठाएं और डिजिटल रुपये में भुगतान पाएं।'
  },

  // Citizen: Blockchain Audit
  customer_audit: {
    id: 'customer_audit',
    titleEn: 'Blockchain Audit Ledger & Proof History',
    titleTa: 'பிளாக்செயின் தணிக்கை லெட்ஜர் & வரலாற்று பதிவுகள்',
    titleHi: 'ब्लॉकचेन ऑडिट लेजर एवं सत्यापन इतिहास',
    whatYouCanDoEn: 'Verify immutable block transactions, inspect cryptographic SHA-256 hashes for each identity event, verify zero-tampering guarantees, and download audit trail exports.',
    whatYouCanDoTa: 'உங்கள் அடையாள சரிபார்ப்பு மற்றும் ஒப்புதல் மாற்றங்களின் மாற்ற முடியாத பிளாக்செயின் பதிவுகள் மற்றும் கிரிப்டோகிராஃபிக் ஹாஷ்களை இங்கே ஆய்வு செய்யலாம்.',
    whatYouCanDoHi: 'अपने सत्यापन और सहमति परिवर्तनों का अपरिवर्तनीय ब्लॉकचेन रिकॉर्ड देखें और क्रिप्टोग्राफिक हैश द्वारा सत्यता की पुष्टि करें।',
    speechEn: 'Blockchain Audit Ledger. On this page, you can audit the immutable distributed ledger. Every verification event, credential issuance, and consent change is recorded here with tamper-proof cryptographic block hashes.',
    speechTa: 'பிளாக்செயின் தணிக்கை லெட்ஜர். இந்த பக்கத்தில் உங்களின் அனைத்து சரிபார்ப்புகளும் மாற்ற முடியாத பிளாக்செயினில் பதியப்பட்டுள்ளதை நீங்கள் ஆய்வு செய்யலாம். எந்தவொரு மாற்றமும் கிரிப்டோகிராஃபிக் ஹாஷ் மூலம் நிரூபிக்கப்படும்.',
    speechHi: 'ब्लॉकचेन ऑडिट लेजर। इस पेज पर आप वितरित बहीखाता देख सकते हैं। आपकी पहचान से जुड़ी हर गतिविधि और सहमति का सुरक्षित एवं अपरिवर्तनीय ब्लॉकचेन रिकॉर्ड यहाँ मौजूद है।'
  },

  // Citizen: Notifications
  customer_notifications: {
    id: 'customer_notifications',
    titleEn: 'Notifications & Security Alerts',
    titleTa: 'அறிவிப்புகள் & பாதுகாப்பு எச்சரிக்கைகள்',
    titleHi: 'सूचनाएं एवं सुरक्षा अलर्ट',
    whatYouCanDoEn: 'Read real-time account updates, institution verification alerts, smart contract milestones, consent renewal notices, and identity security advisories.',
    whatYouCanDoTa: 'நிகழ்நேர வங்கி கோரிக்கை எச்சரிக்கைகள், பாதுகாப்பு அறிவிப்புகள் மற்றும் ஒப்புதல் காலாவதி நினைவூட்டல்களை இங்கே படிக்கலாம்.',
    whatYouCanDoHi: 'बैंक अनुरोध अलर्ट, सुरक्षा चेतावनियां और सहमति समाप्ति के महत्वपूर्ण अनुस्मारक यहां देखें।',
    speechEn: 'Notifications and Alerts. On this page, check real-time notices regarding bank access requests, security advisories, and credentials status updates.',
    speechTa: 'அறிவிப்புகள் மற்றும் எச்சரிக்கைகள். வங்கிகளிடமிருந்து வரும் புதிய கோரிக்கைகள், கணக்கு பாதுகாப்பு எச்சரிக்கைகள் மற்றும் புதுப்பிப்புகளை இந்த பக்கத்தில் காணலாம்.',
    speechHi: 'सूचनाएं और अलर्ट। इस पेज पर बैंक अनुरोध, सुरक्षा सलाह और अपनी पहचान से संबंधित सभी महत्वपूर्ण अपडेट देखें।'
  },

  // Citizen: Account Settings
  customer_settings: {
    id: 'customer_settings',
    titleEn: 'Account Settings & Privacy Preferences',
    titleTa: 'கணக்கு அமைப்புகள் & தனியுரிமை விருப்பங்கள்',
    titleHi: 'खाता सेटिंग्स एवं गोपनीयता प्राथमिकताएं',
    whatYouCanDoEn: 'Configure language, manage biometric credentials, adjust voice guidance speed, toggle privacy shields, export local credentials, and manage active sessions.',
    whatYouCanDoTa: 'மொழி, கைரேகை பயோமெட்ரிக்ஸ், ஆடியோ வழிகாட்டுதல் வேகம் மற்றும் பாதுகாப்பு அமைப்புகளை உங்கள் விருப்பத்திற்கேற்ப மாற்றலாம்.',
    whatYouCanDoHi: 'भाषा, बायोमेट्रिक सुरक्षा, आवाज गति और खाता प्राथमिकताओं को अपनी पसंद अनुसार बदलें।',
    speechEn: 'Account Settings. On this page, customize your preferred language, biometric passkeys, audio speed, and privacy configurations.',
    speechTa: 'கணக்கு அமைப்புகள். இந்த பக்கத்தில் உங்கள் விருப்பமான மொழி, கைரேகை பாதுகாப்பு, குரல் வேகம் மற்றும் தனியுரிமை அமைப்புகளை எளிதாக மாற்றியமைக்கலாம்.',
    speechHi: 'खाता सेटिंग्स। इस पेज पर अपनी भाषा, बायोमेट्रिक पासकी, ऑडियो गति और सुरक्षा प्राथमिकताओं को आसानी से अनुकूलित करें।'
  },

  // Bank: Overview
  bank_overview: {
    id: 'bank_overview',
    titleEn: 'Institutional Verification Overview',
    titleTa: 'நிறுவன சரிபார்ப்பு கண்ணோட்டம்',
    titleHi: 'संस्थागत सत्यापन अवलोकन',
    whatYouCanDoEn: 'Track total verified citizens, monitor pending verification queues, audit network throughput, inspect identity risk distribution, and analyze compliance metrics.',
    whatYouCanDoTa: 'மொத்த சரிபார்க்கப்பட்ட குடிமக்கள், நிலுவையில் உள்ள சரிபார்ப்பு வரிசை, ஆபத்து மதிப்பீடுகள் மற்றும் வங்கி நெட்வொர்க் நிலையை நிகழ்நேரத்தில் கண்காணிக்கலாம்.',
    whatYouCanDoHi: 'कुल सत्यापित नागरिकों, लंबित कतार, जोखिम स्तर और संस्थागत अनुपालन मेट्रिक्स की वास्तविक समय में निगरानी करें।',
    speechEn: 'Bank Manager Overview. This dashboard provides institutional metrics, citizen verification volumes, pending approval pipeline, and network risk distribution.',
    speechTa: 'வங்கி மேலாளர் கண்ணோட்டம். சரிபார்க்கப்பட்ட குடிமக்களின் எண்ணிக்கை, நிலுவையில் உள்ள விண்ணப்பங்கள் மற்றும் வங்கி அமைப்பின் பாதுகாப்பை இந்த பக்கத்தில் கண்காணிக்கலாம்.',
    speechHi: 'बैंक प्रबंधक अवलोकन। इस पेज पर आप सत्यापित नागरिकों की संख्या, लंबित सत्यापन कतार और संस्थागत सुरक्षा मेट्रिक्स की निगरानी कर सकते हैं।'
  },

  // Bank: Verification Queue
  bank_requests: {
    id: 'bank_requests',
    titleEn: 'Citizen Verification Approval Queue',
    titleTa: 'குடிமக்கள் சரிபார்ப்பு ஒப்புதல் வரிசை',
    titleHi: 'नागरिक सत्यापन अनुमोदन कतार',
    whatYouCanDoEn: 'Examine submitted citizen applications, inspect cryptographic zero-knowledge claims, audit liveness checks, and issue digital approvals or rejections.',
    whatYouCanDoTa: 'குடிமக்கள் சமர்ப்பித்த விண்ணப்பங்களை ஆய்வு செய்யலாம், ஜீரோ-நாலெட்ஜ் ஆதாரங்களை சரிபார்த்து உடனடி ஒப்புதல் அல்லது நிராகரிப்பு வழங்கலாம்.',
    whatYouCanDoHi: 'जमा किए गए नागरिक आवेदनों की जांच करें, प्रमाणों का सत्यापन करें और नियमों के अनुसार स्वीकृति या अस्वीकृति दें।',
    speechEn: 'Verification Queue. On this page, review submitted citizen KYC applications, evaluate mathematical zero-knowledge proof credentials, and approve or reject submissions.',
    speechTa: 'சரிபார்ப்பு வரிசை. குடிமக்கள் சமர்ப்பித்த KYC ஆவணங்களை ஆய்வு செய்து, அவர்களின் உண்மைத்தன்மையை சரிபார்த்து உடனடியாக ஒப்புதல் வழங்க இந்த பக்கத்தை பயன்படுத்தவும்.',
    speechHi: 'सत्यापन कतार। इस पेज पर नागरिकों द्वारा जमा किए गए आवेदनों की समीक्षा करें, प्रमाणों की पुष्टि करें और अनुमोदन या अस्वीकार करें।'
  },

  // Bank: Token Verification Desk
  bank_verification: {
    id: 'bank_verification',
    titleEn: 'Instant QR & Token Verification Desk',
    titleTa: 'உடனடி QR & டோக்கன் சரிபார்ப்பு மேசை',
    titleHi: 'त्वरित क्यूआर एवं टोकन सत्यापन डेस्क',
    whatYouCanDoEn: 'Scan customer QR codes via camera or paste cryptographic alphanumeric tokens to instantly verify authorized citizen claims without viewing raw unredacted documents.',
    whatYouCanDoTa: 'வாடிக்கையாளரின் QR குறியீட்டை கேமரா மூலம் ஸ்கேன் செய்யலாம் அல்லது டோக்கனை உள்ளிட்டு மூல ஆவணங்களை பார்க்காமலேயே அடையாளத்தை உடனடியாக அங்கீகரிக்கலாம்.',
    whatYouCanDoHi: 'ग्राहक के क्यूआर कोड को स्कैन करें या टोकन दर्ज करके मूल दस्तावेज देखे बिना तुरंत सुरक्षित पहचान सत्यापित करें।',
    speechEn: 'Token Verification Desk. Scan customer QR codes or paste cryptographic tokens to instantly authenticate identity claims and satisfy RBI compliance without handling raw paper copies.',
    speechTa: 'டோக்கன் சரிபார்ப்பு மேசை. வாடிக்கையாளரின் QR குறியீட்டை ஸ்கேன் செய்து அல்லது டோக்கனை உள்ளிட்டு, அசல் காகித ஆவணங்கள் தேவையின்றி அவர்களின் அடையாளத்தை உடனடியாக சரிபார்க்கலாம்.',
    speechHi: 'टोकन सत्यापन डेस्क। ग्राहक के क्यूआर कोड को स्कैन करके या टोकन दर्ज करके बिना कागजी दस्तावेजों के तुरंत पहचान सत्यापित करें।'
  },

  // Bank: Citizens Directory
  bank_customers: {
    id: 'bank_customers',
    titleEn: 'Verified Citizens Directory',
    titleTa: 'சரிபார்க்கப்பட்ட குடிமக்கள் அடைவு',
    titleHi: 'सत्यापित नागरिक निर्देशिका',
    whatYouCanDoEn: 'Search verified customer profiles, filter by risk score and KYC level, inspect cryptographic audit trails, and review active institutional authorizations.',
    whatYouCanDoTa: 'சரிபார்க்கப்பட்ட வாடிக்கையாளர் விவரங்களை தேடலாம், ஆபத்து நிலை மூலம் வடிகட்டலாம் மற்றும் அவர்களின் சரிபார்ப்பு வரலாற்றை ஆய்வு செய்யலாம்.',
    whatYouCanDoHi: 'सत्यापित ग्राहकों की सूची खोजें, जोखिम स्तर के अनुसार फ़िल्टर करें और प्रमाणीकरण इतिहास देखें।',
    speechEn: 'Verified Citizens Directory. Search and browse authorized customer identity records, audit historical interactions, and check risk classifications.',
    speechTa: 'குடிமக்கள் அடைவு. சரிபார்க்கப்பட்ட வாடிக்கையாளர்களைத் தேடவும், அவர்களின் பாதுகாப்பு நிலை மற்றும் அங்கீகாரங்களை இந்த பக்கத்தில் எளிதாக பார்வையிடலாம்.',
    speechHi: 'सत्यापित नागरिक निर्देशिका। अधिकृत ग्राहकों की सूची देखें, जोखिम वर्गीकरण जांचें और ग्राहक इतिहास की समीक्षा करें।'
  },

  // Bank: Fraud Radar
  bank_fraud_radar: {
    id: 'bank_fraud_radar',
    titleEn: 'Fraud Radar & Identity Surveillance',
    titleTa: 'மோசடி ரேடார் & அடையாள கண்காணிப்பு',
    titleHi: 'धोखाधड़ी रडार एवं निगरानी सुरक्षा',
    whatYouCanDoEn: 'Detect synthetic identities, flag credential duplication attempts, monitor deepfake facial replay patterns, and manage blacklisted cryptographic hashes.',
    whatYouCanDoTa: 'போலி அடையாளங்கள், ஆவண நகல்கள் மற்றும் டீப்ஃபேக் முக மோசடி முயற்சிகளை நிகழ்நேரத்தில் கண்டறிந்து தடுக்கலாம்.',
    whatYouCanDoHi: 'नकली पहचान, दस्तावेजों की अनधिकृत नकल और डीपफेक धोखाधड़ी के प्रयासों का वास्तविक समय में पता लगाएं।',
    speechEn: 'Fraud Radar and Surveillance. This page provides automated defense against synthetic identity creation, biometric replay attacks, and compromised credentials.',
    speechTa: 'மோசடி ரேடார் மற்றும் கண்காணிப்பு. போலி அடையாளங்கள், ஆவண திருட்டு மற்றும் தொழில்நுட்ப மோசடிகளை நிகழ்நேரத்தில் தடுத்து நிறுத்த இந்த பக்கத்தை பயன்படுத்தவும்.',
    speechHi: 'धोखाधड़ी रडार और सुरक्षा। यह पेज नकली पहचान निर्माण और बायोमेट्रिक धोखाधड़ी को रोकने के लिए स्वचालित सुरक्षा विश्लेषण प्रदान करता है।'
  },

  // Bank: Customer Support
  bank_support: {
    id: 'bank_support',
    titleEn: 'Customer Support & Resolution Desk',
    titleTa: 'வாடிக்கையாளர் உதவி & தீர்வு மேசை',
    titleHi: 'ग्राहक सहायता एवं समाधान डेस्क',
    whatYouCanDoEn: 'Resolve citizen identity disputes, assist with biometric re-enrollment, inspect credential challenge tickets, and issue administrative overrides.',
    whatYouCanDoTa: 'குடிமக்களின் சரிபார்ப்பு சிக்கல்கள், பயோமெட்ரிக் சவால்கள் மற்றும் அடையாள கேள்விகளுக்கு உடனடி தீர்வு காணலாம்.',
    whatYouCanDoHi: 'नागरिकों की पहचान से जुड़े प्रश्नों, बायोमेट्रिक समस्याओं और सत्यापन शिकायतों का समाधान करें।',
    speechEn: 'Customer Support Desk. On this page, bank officers can manage customer support tickets, resolve identity verification hurdles, and guide citizens.',
    speechTa: 'வாடிக்கையாளர் உதவி மேசை. குடிமக்களின் சந்தேகங்கள், சரிபார்ப்பு சிக்கல்கள் மற்றும் தொழில்நுட்ப உதவிகளை வழங்க இந்த பக்கத்தை பயன்படுத்தலாம்.',
    speechHi: 'ग्राहक सहायता डेस्क। इस पेज पर बैंक अधिकारी नागरिकों की सत्यापन समस्याओं का समाधान कर सकते हैं और उन्हें सहायता प्रदान कर सकते हैं।'
  },

  // Bank: Smart Loans
  bank_loans: {
    id: 'bank_loans',
    titleEn: 'Smart Contract Loan Approvals',
    titleTa: 'ஸ்மார்ட் ஒப்பந்த கடன் ஒப்புதல்கள்',
    titleHi: 'स्मार्ट अनुबंध ऋण अनुमोदन',
    whatYouCanDoEn: 'Evaluate algorithmic credit solvency checks, review automated zero-knowledge debt-to-income proofs, and disburse digital rupee loans via smart contracts.',
    whatYouCanDoTa: 'கடன் விண்ணப்பங்களை மதிப்பாய்வு செய்யலாம், ZKP நிதி தகுதியை சரிபார்த்து ஸ்மார்ட் ஒப்பந்தங்கள் மூலம் டிஜிட்டல் ரூபாய் கடன் வழங்கலாம்.',
    whatYouCanDoHi: 'क्रेडिट आवेदनों का मूल्यांकन करें, वित्तीय साख जांचें और स्मार्ट अनुबंधों द्वारा तुरंत ऋण स्वीकृत करें।',
    speechEn: 'Smart Contract Loan Approvals. On this page, review algorithmic credit applications and disburse CBDC digital rupee financing with automated compliance enforcement.',
    speechTa: 'ஸ்மார்ட் ஒப்பந்த கடன் ஒப்புதல்கள். கடன் விண்ணப்பங்களின் தகுதியை சரிபார்த்து, ஸ்மார்ட் ஒப்பந்தங்கள் மூலம் பாதுகாப்பாக நிதி விடுவிக்க இந்த பக்கத்தை பயன்படுத்தவும்.',
    speechHi: 'स्मार्ट अनुबंध ऋण अनुमोदन। इस पेज पर ऋण आवेदनों की समीक्षा करें और नियमों के अनुसार स्वचालित रूप से ऋण स्वीकृत करें।'
  },

  // Bank: Rural Assisted Desk
  bank_assisted: {
    id: 'bank_assisted',
    titleEn: 'Rural Assisted Verification Kiosk',
    titleTa: 'கிராமப்புற உதவி சரிபார்ப்பு மையம்',
    titleHi: 'ग्रामीण सहायता सत्यापन कियोस्क',
    whatYouCanDoEn: 'Streamlined high-contrast, voice-guided interface for banking correspondents and kiosk agents to onboard and verify rural citizens with offline resilience.',
    whatYouCanDoTa: 'கிராமப்புற மக்கள் மற்றும் முதியவர்களுக்கு வங்கி முகவர்கள் மூலம் எளிதாக சரிபார்ப்பு செய்ய உதவும் சிறப்பு வாய்ஸ் வழிகாட்டி மேசை.',
    whatYouCanDoHi: 'ग्रामीण और दूरदराज के नागरिकों को सरल आवाज और बायोमेट्रिक मार्गदर्शन के साथ सत्यापित करने के लिए विशेष कियोस्क इंटरफेस।',
    speechEn: 'Rural Assisted Verification Desk. Specially designed for banking correspondents and rural kiosks to assist citizens with voice prompts, vernacular language guidance, and low bandwidth support.',
    speechTa: 'கிராமப்புற உதவி சரிபார்ப்பு மையம். படிக்க தெரியாதவர்கள் மற்றும் கிராமப்புற மக்களுக்கு வங்கி முகவர்கள் எளிதாக சரிபார்ப்பு செய்ய உதவும் குரல் வழிகாட்டி மேசை இதுவாகும்.',
    speechHi: 'ग्रामीण सहायता सत्यापन डेस्क। ग्रामीण क्षेत्रों और कियोस्क केंद्रों में नागरिकों को आसान आवाज मार्गदर्शन के साथ जोड़ने के लिए यह विशेष रूप से तैयार किया गया है।'
  },

  // Bank: Distributed Ledger
  bank_ledger: {
    id: 'bank_ledger',
    titleEn: 'Distributed Consortium Blockchain Explorer',
    titleTa: 'விநியோகிக்கப்பட்ட பிளாக்செயின் எக்ஸ்ப்ளோரர்',
    titleHi: 'डिस्ट्रिब्यूटेड ब्लॉकचेन एक्सप्लोरर',
    whatYouCanDoEn: 'Inspect consensus blocks, validator node signatures, cryptographic gas metrics, and tamper-proof state transitions across the banking consortium.',
    whatYouCanDoTa: 'பிளாக்செயின் பிளாக்குகள், வேலிடேட்டர் கையொப்பங்கள் மற்றும் அனைத்து வங்கி பரிவர்த்தனைகளின் மாற்ற முடியாத பதிவுகளை வெளிப்படையாக ஆய்வு செய்யலாம்.',
    whatYouCanDoHi: 'ब्लॉकचेन ब्लॉक्स, सत्यापनकर्ता नोड्स के हस्ताक्षर और संस्थागत लेन-देन को पारदर्शी रूप से जांचें।',
    speechEn: 'Distributed Ledger Explorer. Audit cryptographic consensus blocks, node validator health, transaction timestamps, and immutable identity state transitions.',
    speechTa: 'பிளாக்செயின் எக்ஸ்ப்ளோரர். அனைத்து வங்கிகளுக்கிடையேயான சரிபார்ப்பு பதிவுகள் மற்றும் பிளாக்செயின் பிளாக்குகளை வெளிப்படையாக ஆய்வு செய்ய இந்த பக்கத்தை பயன்படுத்தவும்.',
    speechHi: 'डिस्ट्रिब्यूटेड लेजर एक्सप्लोरर। इस पेज पर ब्लॉकचेन नोड्स, लेन-देन हैश और बैंक नेटवर्क के अपरिवर्तनीय रिकॉर्ड की जांच करें।'
  },

  // Bank: Settings
  bank_settings: {
    id: 'bank_settings',
    titleEn: 'Institutional Node & Compliance Configuration',
    titleTa: 'நிறுவன நோட் & இணக்க அமைப்புகள்',
    titleHi: 'संस्थागत नोड एवं अनुपालन सेटिंग्स',
    whatYouCanDoEn: 'Configure verification policies, manage node sync parameters, inspect cryptographic signing keys, set API webhooks, and manage staff privileges.',
    whatYouCanDoTa: 'வங்கி சரிபார்ப்பு விதிகள், நோட் ஒத்திசைவு மற்றும் பாதுகாப்பு அனுமதிகளை இங்கே கட்டமைக்கலாம்.',
    whatYouCanDoHi: 'सत्यापन नीतियां, नोड सिंक्रनाइज़ेशन और सुरक्षा अनुमतियों को यहाँ कॉन्फ़िगर करें।',
    speechEn: 'Institutional Settings. On this page, configure bank risk thresholds, node consensus parameters, regulatory audit policies, and security credentials.',
    speechTa: 'நிறுவன அமைப்புகள். வங்கி சரிபார்ப்பு விதிகள், நோட் ஒத்திசைவு மற்றும் பாதுகாப்பு அனுமதிகளை இந்த பக்கத்தில் மாற்றியமைக்கலாம்.',
    speechHi: 'संस्थागत सेटिंग्स। इस पेज पर बैंक सत्यापन नियम, नोड सेटिंग्स और विनियामक अनुपालन प्राथमिकताओं को प्रबंधित करें।'
  },

  // Auth: Citizen Login
  login_customer: {
    id: 'login_customer',
    titleEn: 'Citizen Sovereign Login Portal',
    titleTa: 'குடிமக்கள் உள்நுழைவு தளம்',
    titleHi: 'नागरिक सॉवरेन लॉगिन पोर्टल',
    whatYouCanDoEn: 'Log in using biometric fingerprint, cryptographic WebAuthn passkey, mobile OTP, or demo test accounts. Switch to Bank Staff portal anytime.',
    whatYouCanDoTa: 'பயோமெட்ரிக் கைரேகை, பாஸ்கீ, மொபைல் OTP அல்லது டெமோ கணக்குகள் மூலம் எளிதாக உள்நுழையலாம். வங்கி போர்ட்டலுக்கும் மாறலாம்.',
    whatYouCanDoHi: 'बायोमेट्रिक फिंगरप्रिंट, पासकी या मोबाइल ओटीपी से सुरक्षित लॉगिन करें। किसी भी समय बैंक पोर्टल पर स्विच करें।',
    speechEn: 'Welcome to TrustChain Citizen Login. Enter your identity number, or use biometric fingerprint, cryptographic passkey, or mobile OTP to access your sovereign identity wallet.',
    speechTa: 'டிரஸ்ட்செயின் குடிமக்கள் தளத்திற்கு வரவேற்கிறோம். உங்கள் கைரேகை, பாஸ்கீ அல்லது மொபைல் OTP மூலம் பாதுகாப்பாக உள்நுழையலாம்.',
    speechHi: 'ट्रस्टचेन नागरिक पोर्टल में आपका स्वागत है। अपने पहचान वॉलेट तक पहुँचने के लिए बायोमेट्रिक फिंगरप्रिंट, पासकी या मोबाइल ओटीपी का उपयोग करें।'
  },

  // Auth: Bank Staff Login
  login_bank: {
    id: 'login_bank',
    titleEn: 'Authorized Bank Staff Login Portal',
    titleTa: 'வங்கி பணியாளர் உள்நுழைவு தளம்',
    titleHi: 'अधिकृत बैंक स्टाफ लॉगिन पोर्टल',
    whatYouCanDoEn: 'Authenticate with institutional banking credentials, security tokens, or employee access passes to manage the citizen verification desk.',
    whatYouCanDoTa: 'வங்கி சரிபார்ப்பு மேசையை அணுக உங்கள் நிறுவன ஐடி அல்லது பணியாளர் நற்சான்றிதழ்கள் மூலம் பாதுகாப்பாக உள்நுழையவும்.',
    whatYouCanDoHi: 'सत्यापन डेस्क तक पहुँचने के लिए अपने अधिकृत बैंक क्रेडेंशियल या सुरक्षा टोकन से लॉगिन करें।',
    speechEn: 'Welcome to the Institutional Bank Staff Login. Enter your employee ID and authorized bank credentials to access the verification queue.',
    speechTa: 'வங்கி போர்ட்டலுக்கு வரவேற்கிறோம். சரிபார்ப்பு மற்றும் வாடிக்கையாளர் ஒப்புதல் வரிசையை அணுக உங்கள் வங்கி நற்சான்றிதழ்களைப் பயன்படுத்தி உள்நுழையவும்.',
    speechHi: 'बैंक संस्थान पोर्टल में आपका स्वागत है। सत्यापन डेस्क और अनुमोदन कतार तक पहुंचने के लिए अपने बैंक क्रेडेंशियल से सुरक्षित लॉगिन करें।'
  }
};

export function getPageVoiceGuide(pageKey: string): PageVoiceGuide {
  return PAGE_VOICE_GUIDES[pageKey] || PAGE_VOICE_GUIDES.customer_wallet;
}
