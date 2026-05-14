export interface SponsorTier {
  id: string;
  name_mn: string;
  amount_usd: number;
  amount_mnt: string;
  highlight: boolean;
  benefits_mn: string[];
}

export const tiers: SponsorTier[] = [
  {
    id: 'gold',
    name_mn: 'Алтан ивээн тэтгэгч',
    amount_usd: 3000,
    amount_mnt: '₮10,800,000',
    highlight: true,
    benefits_mn: [
      'Бүх материал, баннер, CNBC нэвтрүүлэгт гол лого',
      'Угтах зоог дээр 5 суудал (UBHOTEL Grand Room)',
      'Олон нийтийн лекц дээр үг хэлэх боломж',
      'Монгол болон олон улсын хэвлэлд дурдах',
      'Талархлын гэрчилгээ + арга хэмжээний бүрэн баримт',
    ],
  },
  {
    id: 'silver',
    name_mn: 'Мөнгөн ивээн тэтгэгч',
    amount_usd: 1500,
    amount_mnt: '₮5,400,000',
    highlight: false,
    benefits_mn: [
      'Арга хэмжээний материал, CNBC нэвтрүүлэгт лого',
      'Угтах зоог дээр 2 суудал',
      'Нийгмийн сүлжээний таниулга',
      'Талархлын гэрчилгээ',
    ],
  },
  {
    id: 'bronze',
    name_mn: 'Хүрэл ивээн тэтгэгч',
    amount_usd: 500,
    amount_mnt: '₮1,800,000',
    highlight: false,
    benefits_mn: [
      'Арга хэмжээний материалд лого',
      'Нийгмийн сүлжээний таниулга',
      'Талархлын гэрчилгээ',
    ],
  }
];
