import { FORTUNE_WEIGHTS } from './fortuneConfig';

// おみくじデータ
export const FORTUNES = {
  "大吉": {
    messages: ["最高の一日になります", "すべてがうまくいく予感", "今日はあなたが主役です"],
    items: {
      "願望": "思うままに叶う", "失物": "すぐに見つかる", "旅立": "どこへ行っても吉",
      "商売": "利益が大きく出る", "学問": "安心して励みなさい", "恋愛": "理想の人が現れる",
      "転居": "急いでも大丈夫", "健康": "万事好調です", "就職": "希望通りに決まる", "家庭": "笑いが絶えない"
    }
  },
  "中吉": {
    messages: ["着実な一歩が実を結びます", "穏やかで良い日です", "努力が報われるでしょう"],
    items: {
      "願望": "粘り強く願えば叶う", "失物": "誰かが知っている", "旅立": "準備を整えれば吉",
      "商売": "焦らなければ利益あり", "学問": "基礎を固めると良い", "恋愛": "誠実な態度が実る",
      "転居": "落ち着いて探せば吉", "健康": "規則正しい生活を", "就職": "焦らず縁を待とう", "家庭": "感謝を伝えれば円満"
    }
  },
  "吉": {
    messages: ["小さな幸せを見つける日", "現状維持が幸運の鍵", "焦らず進みましょう", "穏やかな風が吹く予感", "無理をせず自然体で吉"],
    items: {
      "願望": "焦らなければ叶う", "失物": "遅れて出てくる", "旅立": "近場なら吉",
      "商売": "売り買い共に順調", "学問": "努力が報われる", "恋愛": "良い縁がある",
      "転居": "慎重に進めば良い", "健康": "休息を大切に", "就職": "知人の助けがある", "家庭": "穏やかに過ごせる"
    }
  },
  "末吉": {
    messages: ["これから運気が上がります", "一歩ずつ進めば大丈夫", "慎重さが成功を呼びます"],
    items: {
      "願望": "辛抱強く待てば叶う", "失物": "思わぬ所から出る", "旅立": "大きな支障なし",
      "商売": "徐々に良くなる", "学問": "地道な努力が必要", "恋愛": "焦りは禁物",
      "転居": "時機を待つのが吉", "健康": "適度な運動が効果的", "就職": "目標を下げず挑戦", "家庭": "会話を増やすと吉"
    }
  },
  "凶": {
    messages: ["今日は無理せず休みましょう", "自分を見つめ直す良い機会", "明日はきっと良くなります"],
    items: {
      "願望": "今は準備の時期", "失物": "掃除で見つかるかも", "旅立": "家でゆっくりが吉",
      "商売": "無駄を省けば道あり", "学問": "苦手な所を見直して", "恋愛": "自分を磨く時期",
      "転居": "念入りな調査を", "健康": "早寝早起きを", "就職": "条件を再確認して", "家庭": "思いやりを忘れずに"
    }
  }
};

/**
 * 重み付き抽選で運勢を選択する
 * @returns {string} 選ばれた運勢キー（大吉、中吉、吉、末吉、凶）
 */
const selectWeightedFortune = () => {
  // 明示的な順序で運勢と重みを配列として定義
  const fortuneOrder = ['大吉', '中吉', '吉', '末吉', '凶'];
  
  // 重みの合計を計算
  const totalWeight = fortuneOrder.reduce((sum, key) => sum + FORTUNE_WEIGHTS[key], 0);
  
  // 0から合計値未満の乱数を生成
  let random = Math.random() * totalWeight;
  
  // 重みに基づいて運勢を選択
  for (const fortune of fortuneOrder) {
    const weight = FORTUNE_WEIGHTS[fortune];
    if (random < weight) {
      return fortune;
    }
    random -= weight;
  }
  
  // フォールバック（通常は到達しない）
  return '吉';
};

/**
 * ランダムに運勢を選択し、その運勢から3つの項目をランダムに選択する
 * @returns {Object} { fortune: string, mainMessage: string, selectedItems: Array }
 */
export const getRandomFortune = () => {
  // 1. 重み付き抽選で運勢を選択
  const fortuneKey = selectWeightedFortune();
  const fortuneData = FORTUNES[fortuneKey];
  
  // 2. メッセージをランダムに選択
  const mainMessage = fortuneData.messages[Math.floor(Math.random() * fortuneData.messages.length)];
  
  // 3. itemsオブジェクトから3つをランダムに選択
  const itemEntries = Object.entries(fortuneData.items);
  const shuffledItems = [...itemEntries].sort(() => Math.random() - 0.5);
  const selectedItems = shuffledItems.slice(0, 3).map(([label, value]) => ({ label, value }));
  
  return {
    fortune: fortuneKey,
    mainMessage,
    selectedItems
  };
};

// ラッキーアイテム定義 (100選)
export const luckyItems = [
  // --- シュール・謎（Surreal/Mystery） ---
  { id: 1, name: 'バナナケース', query: 'バナナケース', icon: 'Banana' },
  { id: 2, name: '卓上呼び出しベル', query: '卓上ベル 呼び出し', icon: 'Bell' },
  { id: 3, name: '準備中の木看板', query: '営業中 看板 木製', icon: 'XOctagon' },
  { id: 4, name: '寿司の食品サンプル', query: '食品サンプル 寿司', icon: 'Utensils' },
  { id: 5, name: 'ゴリラマスク', query: 'ゴリラ マスク リアル', icon: 'Smile' },
  { id: 6, name: '光るゲーミング箸', query: 'ゲーミング箸', icon: 'Zap' },
  { id: 7, name: '宇宙食（本物）', query: '宇宙食 セット', icon: 'Rocket' },
  { id: 8, name: '嘘発見器おもちゃ', query: '嘘発見器 ビリビリ', icon: 'AlertTriangle' },
  { id: 9, name: '消えるボールペン', query: 'フリクション ボールペン', icon: 'PenTool' },
  { id: 10, name: '札束メモ帳', query: '札束 メモ帳', icon: 'Banknote' },
  { id: 11, name: 'ツチノコのぬいぐるみ', query: 'ツチノコ ぬいぐるみ', icon: 'Ghost' },
  { id: 12, name: 'カニのペン立て', query: 'カニ ペンホルダー', icon: 'Scissors' },
  { id: 13, name: '100面サイコロ', query: 'ダイス 100面', icon: 'Dices' },
  { id: 14, name: '頭につける傘', query: 'アンブレラハット', icon: 'Umbrella' },
  { id: 15, name: '赤いゼムクリップ', query: 'ゼムクリップ 赤', icon: 'Paperclip' },
  { id: 16, name: '巨大なエンターキー', query: '巨大 エンターキー', icon: 'CornerDownLeft' },
  { id: 17, name: '叫ぶニワトリ', query: 'びっくりチキン', icon: 'Bird' },
  { id: 18, name: '魚のサンダル', query: '魚 サンダル', icon: 'Fish' },
  { id: 19, name: 'モアイのティッシュ', query: 'モアイ ティッシュケース', icon: 'Smile' },
  { id: 20, name: 'パンのスリッパ', query: 'フランスパン スリッパ', icon: 'Search' },

  // --- 高額・野次馬（Expensive/Curiosity） ---
  { id: 21, name: '石油王コスプレ', query: '石油王 コスプレ', icon: 'Crown' },
  { id: 22, name: '食用金箔', query: '金箔 食用', icon: 'Sparkles' },
  { id: 23, name: '高級歯ブラシ', query: '歯ブラシ 高級 ギフト', icon: 'Brush' },
  { id: 24, name: 'アンティーク地球儀', query: '地球儀 アンティーク', icon: 'Globe' },
  { id: 25, name: '天体望遠鏡', query: '天体望遠鏡 自動導入', icon: 'Telescope' },
  { id: 26, name: '等身大ガイコツ', query: '人体模型 骨格 等身大', icon: 'Skull' },
  { id: 27, name: '水晶玉（本物）', query: '水晶玉 台座付き', icon: 'Disc' },
  { id: 28, name: '金の延べ棒ティッシュ', query: 'ゴールドバー ティッシュ', icon: 'Package' },
  { id: 29, name: '高級ワイングラス', query: 'ワイングラス リーデル', icon: 'Wine' },
  { id: 30, name: 'ペルシャ玄関マット', query: 'ペルシャ絨毯 玄関マット', icon: 'Layers' },
  { id: 31, name: 'チタン製つまようじ', query: 'チタン 爪楊枝', icon: 'Sword' },
  { id: 32, name: 'タクティカルペン', query: 'タクティカルペン', icon: 'PenTool' },
  { id: 33, name: '王様の椅子', query: 'エルゴヒューマン', icon: 'Armchair' },
  { id: 34, name: '成功者の万年筆', query: 'モンブラン 万年筆', icon: 'PenTool' },
  { id: 35, name: '純金のトランプ', query: 'トランプ ゴールド', icon: 'Landmark' },

  // --- 癒やし・虚無（Zen/Healing） ---
  { id: 36, name: '真っ白なパズル', query: '純白地獄 パズル', icon: 'Grid' },
  { id: 37, name: '無限プチプチ', query: '無限プチプチ', icon: 'CircleDot' },
  { id: 38, name: '般若心経CD', query: '般若心経 CD', icon: 'Music' },
  { id: 39, name: '禅の庭セット', query: '枯山水 ミニチュア', icon: 'Wind' },
  { id: 40, name: '最強の耳栓', query: '耳栓 遮音 モルデックス', icon: 'EarOff' },
  { id: 41, name: '人をダメにするソファ', query: 'ビーズクッション 特大', icon: 'Armchair' },
  { id: 42, name: '焚き火のDVD', query: '焚き火 DVD', icon: 'Flame' },
  { id: 43, name: 'ひのきのブロック', query: 'ひのき ブロック お風呂', icon: 'TreeDeciduous' },
  { id: 44, name: '金属ハンドスピナー', query: 'ハンドスピナー 金属', icon: 'Loader' },
  { id: 45, name: 'お風呂のアヒル', query: 'ラバーダック', icon: 'Bird' },
  { id: 46, name: '虚無（禅の本）', query: '禅 本 入門', icon: 'BookOpen' },
  { id: 47, name: 'シンギングボウル', query: 'シンギングボウル', icon: 'Bell' },
  { id: 48, name: 'プラネタリウム', query: '家庭用 プラネタリウム', icon: 'Star' },
  { id: 49, name: '苔テラリウム', query: '苔テラリウム キット', icon: 'Sprout' },
  { id: 50, name: '深海魚の図鑑', query: '深海魚 図鑑', icon: 'Book' },

  // --- 実用・レトロ・ガジェット（Retro/Gadget） ---
  { id: 51, name: '数取器（カチカチ）', query: '数取器 アナログ', icon: 'Watch' },
  { id: 52, name: 'ガラス砂時計', query: '砂時計 おしゃれ 3分', icon: 'Hourglass' },
  { id: 53, name: 'ニュートンのゆりかご', query: 'カチカチ玉 ニュートン', icon: 'Activity' },
  { id: 54, name: 'レトロキーボード', query: 'タイプライター風 キーボード', icon: 'Keyboard' },
  { id: 55, name: '職人のそろばん', query: 'そろばん 23桁', icon: 'AlignJustify' },
  { id: 56, name: '赤青えんぴつ', query: '赤青鉛筆', icon: 'Edit3' },
  { id: 57, name: '夜空色のインク', query: '万年筆 インク 色彩雫', icon: 'Droplet' },
  { id: 58, name: '卓上掃除機', query: '卓上クリーナー', icon: 'Eraser' },
  { id: 59, name: '電子メモパッド', query: '電子メモパッド', icon: 'Tablet' },
  { id: 60, name: '決断サイコロ', query: '決断 ダイス', icon: 'HelpCircle' },
  { id: 61, name: 'ロケット鉛筆', query: 'ロケット鉛筆', icon: 'Edit2' },
  { id: 62, name: '多機能ボールペン', query: 'マルチツール ボールペン', icon: 'Wrench' },
  { id: 63, name: 'ストームグラス', query: 'ストームグラス', icon: 'CloudRain' },
  { id: 64, name: 'ガリレオ温度計', query: 'ガリレオ温度計', icon: 'Thermometer' },
  { id: 65, name: 'ラジオメーター', query: 'ラジオメーター', icon: 'Sun' },
  { id: 66, name: '水飲み鳥', query: '水飲み鳥 平和鳥', icon: 'Bird' },
  { id: 67, name: '永久機関のおもちゃ', query: '永久機関 オブジェ', icon: 'RefreshCw' },
  { id: 68, name: 'モールス信号機', query: 'モールス信号 練習機', icon: 'Radio' },
  { id: 69, name: '金属探知機', query: '金属探知機 ハンディ', icon: 'Search' },
  { id: 70, name: 'ダウジングロッド', query: 'ダウジング ロッド', icon: 'GitBranch' },

  // --- 開運・謎パワー（Lucky/Power） ---
  { id: 71, name: '盛り塩セット', query: '盛り塩 八角', icon: 'Triangle' },
  { id: 72, name: '動く招き猫', query: '招き猫 ソーラー', icon: 'Cat' },
  { id: 73, name: 'ドリームキャッチャー', query: 'ドリームキャッチャー', icon: 'Network' },
  { id: 74, name: '四つ葉栽培キット', query: '四つ葉のクローバー 栽培', icon: 'Clover' },
  { id: 75, name: '勝負の赤パンツ', query: '赤パンツ', icon: 'Shirt' },
  { id: 76, name: '金運の蛇の抜け殻', query: '蛇の抜け殻 お守り', icon: 'DollarSign' },
  { id: 77, name: 'パワーストーン', query: 'パワーストーン 原石', icon: 'Gem' },
  { id: 78, name: '開運だるま', query: 'だるま 赤', icon: 'Smile' },
  { id: 79, name: '風水コンパス', query: '風水 羅盤', icon: 'Compass' },
  { id: 80, name: '魔除けの鈴', query: '水琴鈴', icon: 'Bell' },

  // --- 追加のシュール・インパクト枠（Extra Impact） ---
  { id: 81, name: 'わらじ（本物）', query: 'わらじ 履物', icon: 'Footprints' },
  { id: 82, name: '忍者の靴', query: '地下足袋', icon: 'Footprints' },
  { id: 83, name: 'ゴム鉄砲（木製）', query: 'ゴム鉄砲 連射', icon: 'Crosshair' },
  { id: 84, name: '海賊の単眼鏡', query: '単眼鏡 レトロ', icon: 'Eye' },
  { id: 85, name: '腹筋ローラー', query: '腹筋ローラー', icon: 'Circle' },
  { id: 86, name: '握力計（100kg）', query: '握力計 アナログ', icon: 'Activity' },
  { id: 87, name: 'オタマトーン', query: 'オタマトーン', icon: 'Music' },
  { id: 88, name: '鍵盤ハーモニカ', query: 'ピアニカ 大人', icon: 'Music' },
  { id: 89, name: '木魚（セット）', query: '木魚 布団セット', icon: 'Music' },
  { id: 90, name: 'ミラーボール', query: 'ミラーボール 家庭用', icon: 'Disc' },
  { id: 91, name: 'プラズマボール', query: 'プラズマボール', icon: 'Zap' },
  { id: 92, name: 'アンモナイト化石', query: 'アンモナイト 化石 実物', icon: 'Snail' },
  { id: 93, name: 'サメの寝袋', query: 'サメ 寝袋', icon: 'Maximize' },
  { id: 94, name: 'ロブスターの手袋', query: 'ザリガニ 手袋 コスプレ', icon: 'Hand' },
  { id: 95, name: '馬のマスク', query: '馬マスク', icon: 'Smile' },
  { id: 96, name: '宇宙人のメガネ', query: 'エイリアン サングラス', icon: 'Glasses' },
  { id: 97, name: 'お祝いクラッカー', query: 'クラッカー 巨大', icon: 'PartyPopper' },
  { id: 98, name: '金のマイク', query: 'マイク ゴールド 模型', icon: 'Mic' },
  { id: 99, name: 'カチンコ', query: 'カチンコ 映画', icon: 'Clapperboard' },
  { id: 100, name: '拡声器', query: '拡声器 ハンドマイク', icon: 'Megaphone' },
];
