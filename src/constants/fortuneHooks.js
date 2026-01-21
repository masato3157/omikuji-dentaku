// フックの文言（計算完了後のボタンテキスト）
export const fortuneHooks = [
  '今日の運勢を見る',
  '運勢を計算しました',
  '結果を今すぐ確認',
  'あなたの運命は？',
  'おみくじを開封する',
  '幸運の数字を読み解く',
  'ここをタップして開く',
  '良い結果が出ました',
  '運勢をチェック！',
  '中身を見てみる'
];

// ランダムに1つ選択するヘルパー関数
export const getRandomFortuneHook = () => {
  const randomIndex = Math.floor(Math.random() * fortuneHooks.length);
  return fortuneHooks[randomIndex];
};
