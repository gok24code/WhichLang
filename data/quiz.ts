export interface Language {
  id: string;
  name: string;
  description: string;
  url: string;
  traits: { [key: string]: number };
}

export interface Question {
  id: number;
  text: string;
  trait: string;
  iconName: any; // Using 'any' for icon names from @expo/vector-icons
}

export const LANGUAGES: Language[] = [
  {
    id: 'python',
    name: 'Python',
    description: 'Okunabilirliği ve basitliği ile bilinen, web geliştirmeden veri bilimine kadar geniş bir alanda kullanılan çok yönlü bir dildir.',
    url: 'https://www.python.org/',
    traits: {
      beginnerFriendly: 5,
      web: 4,
      dataScience: 5,
      mobile: 2,
      games: 2,
      performance: 3,
      jobMarket: 5,
      system: 1,
      embedded: 2,
      enterprise: 3,
      community: 5,
    },
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    description: 'Web\'in temel dili olan JavaScript, modern web siteleri ve uygulamaları için vazgeçilmezdir. Geniş bir ekosisteme sahiptir.',
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    traits: {
      beginnerFriendly: 4,
      web: 5,
      dataScience: 3,
      mobile: 5,
      games: 3,
      performance: 3,
      jobMarket: 5,
      system: 1,
      embedded: 2,
      enterprise: 4,
      community: 5,
    },
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    description: 'JavaScript\'in üzerine inşa edilmiş, statik tipler ekleyerek büyük ve karmaşık projelerde güvenilirliği artıran bir dildir.',
    url: 'https://www.typescriptlang.org/',
    traits: {
      beginnerFriendly: 3,
      web: 5,
      dataScience: 3,
      mobile: 5,
      games: 3,
      performance: 4,
      jobMarket: 5,
      system: 1,
      embedded: 2,
      enterprise: 5,
      community: 4,
    },
  },
  {
    id: 'java',
    name: 'Java',
    description: 'Platform bağımsızlığı ("bir kere yaz, her yerde çalıştır") ilkesiyle tanınan, özellikle büyük kurumsal uygulamalarda yaygın olarak kullanılan güçlü bir dildir.',
    url: 'https://www.java.com/',
    traits: {
      beginnerFriendly: 2,
      web: 4,
      dataScience: 4,
      mobile: 5,
      games: 4,
      performance: 4,
      jobMarket: 5,
      system: 2,
      embedded: 3,
      enterprise: 5,
      community: 5,
    },
  },
  {
    id: 'csharp',
    name: 'C#',
    description: 'Microsoft tarafından geliştirilen C#, özellikle Windows uygulamaları, web servisleri ve oyun geliştirmede (Unity ile) popülerdir.',
    url: 'https://docs.microsoft.com/en-us/dotnet/csharp/',
    traits: {
      beginnerFriendly: 3,
      web: 4,
      dataScience: 3,
      mobile: 4,
      games: 5,
      performance: 4,
      jobMarket: 4,
      system: 3,
      embedded: 3,
      enterprise: 5,
      community: 4,
    },
  },
  {
    id: 'go',
    name: 'Go',
    description: 'Google tarafından geliştirilen Go, basitliği ve yüksek performansı ile öne çıkar. Özellikle ağ servisleri ve eş zamanlı programlama için idealdir.',
    url: 'https://golang.org/',
    traits: {
      beginnerFriendly: 3,
      web: 5,
      dataScience: 2,
      mobile: 2,
      games: 1,
      performance: 5,
      jobMarket: 4,
      system: 4,
      embedded: 2,
      enterprise: 4,
      community: 3,
    },
  },
  {
    id: 'rust',
    name: 'Rust',
    description: 'Güvenlik ve performansı bir arada sunan Rust, özellikle sistem programlama ve bellek yönetiminin kritik olduğu alanlarda tercih edilir.',
    url: 'https://www.rust-lang.org/',
    traits: {
      beginnerFriendly: 1,
      web: 4,
      dataScience: 2,
      mobile: 2,
      games: 4,
      performance: 5,
      jobMarket: 3,
      system: 5,
      embedded: 5,
      enterprise: 3,
      community: 4,
    },
  },
  {
    id: 'cpp',
    name: 'C++',
    description: 'Yüksek performansı ve donanım kontrolü ile bilinen C++, oyun motorları, işletim sistemleri ve yüksek frekanslı ticaret gibi alanlarda kullanılır.',
    url: 'https://isocpp.org/',
    traits: {
      beginnerFriendly: 1,
      web: 1,
      dataScience: 3,
      mobile: 3,
      games: 5,
      performance: 5,
      jobMarket: 4,
      system: 5,
      embedded: 5,
      enterprise: 4,
      community: 5,
    },
  },
];

export const QUESTIONS: Question[] = [
  {
    id: 1,
    text: 'Web siteleri veya web uygulamaları oluşturmakla ilgileniyor musunuz?',
    trait: 'web',
    iconName: 'web',
  },
  {
    id: 2,
    text: 'Veri analizi, makine öğrenmesi veya yapay zeka ile çalışmak ister misiniz?',
    trait: 'dataScience',
    iconName: 'brain',
  },
  {
    id: 3,
    text: 'iOS veya Android için mobil uygulamalar geliştirmek ister misiniz?',
    trait: 'mobile',
    iconName: 'cellphone',
  },
  {
    id: 4,
    text: 'Oyun geliştirmeye ilginiz var mı?',
    trait: 'games',
    iconName: 'gamepad-variant',
  },
  {
    id: 5,
    text: 'Programlamaya yeni mi başlıyorsunuz?',
    trait: 'beginnerFriendly',
    iconName: 'human-greeting-variant',
  },
  {
    id: 6,
    text: 'Yazdığınız kodun olabildiğince hızlı çalışması sizin için önemli mi?',
    trait: 'performance',
    iconName: 'rocket-launch',
  },
  {
    id: 7,
    text: 'Geniş bir iş piyasası olan bir dil öğrenmek ister misiniz?',
    trait: 'jobMarket',
    iconName: 'cash-multiple',
  },
  {
    id: 8,
    text: 'İşletim sistemleri veya sürücüler gibi alt seviye sistemler programlamak ilginizi çekiyor mu?',
    trait: 'system',
    iconName: 'chip',
  },
  {
    id: 9,
    text: 'Mikrodenetleyiciler gibi kaynakları kısıtlı cihazlar için geliştirme yapmak ister misiniz?',
    trait: 'embedded',
    iconName: 'memory',
  },
  {
    id: 10,
    text: 'Büyük ölçekli, kurumsal düzeyde uygulamalar oluşturmayı mı hedefliyorsunuz?',
    trait: 'enterprise',
    iconName: 'office-building',
  },
  {
    id: 11,
    text: 'Güçlü bir topluluk desteği ve bol öğrenme kaynağı sizin için önemli mi?',
    trait: 'community',
    iconName: 'account-group',
  },
    {
    id: 12,
    text: 'Ön uç (front-end) veya arka uç (back-end) geliştirme arasında bir tercihiniz var mı?',
    trait: 'web',
    iconName: 'web-check',
  },
  {
    id: 13,
    text: 'Büyük veri setleriyle çalışmak ve onlardan anlamlı sonuçlar çıkarmak hoşunuza gider mi?',
    trait: 'dataScience',
    iconName: 'chart-bar',
  },
  {
    id: 14,
    text: 'Kodunuzun bellek kullanımını optimize etmek gibi detaylarla uğraşmaktan hoşlanır mısınız?',
    trait: 'performance',
    iconName: 'database',
  },
  {
    id: 15,
    text: 'Basit ve anlaşılır bir söz dizimi (syntax) olan bir dille başlamayı mı tercih edersiniz?',
    trait: 'beginnerFriendly',
    iconName: 'format-letter-case',
  },
];

export const TRAIT_LABELS: { [key: string]: string } = {
  beginnerFriendly: 'Yeni Başlayanlar İçin',
  web: 'Web Geliştirme',
  dataScience: 'Veri Bilimi',
  mobile: 'Mobil Uygulamalar',
  games: 'Oyun Geliştirme',
  performance: 'Yüksek Performans',
  jobMarket: 'Geniş İş İmkanı',
  system: 'Sistem Programlama',
  embedded: 'Gömülü Sistemler',
  enterprise: 'Kurumsal Çözümler',
  community: 'Topluluk Desteği',
};

