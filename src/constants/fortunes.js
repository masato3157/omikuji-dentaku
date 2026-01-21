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
