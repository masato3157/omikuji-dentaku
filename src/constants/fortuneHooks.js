// フックの文言（計算完了後のボタンテキスト）
export const fortuneHooks = [
  '結果が出ました',
  '運勢をチェック',
  'おみくじを開く',
  '何かが出ました',
  '計算終了。運勢は？',
  '今日の運勢は...'
];

// ランダムに1つ選択するヘルパー関数
export const getRandomFortuneHook = () => {
  const randomIndex = Math.floor(Math.random() * fortuneHooks.length);
  return fortuneHooks[randomIndex];
};
