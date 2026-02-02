/**
 * Amazonの検索結果URLを生成する
 * @param {string} query - 検索キーワード
 * @returns {string} 検索結果ページのURL
 */
export const buildAmazonSearchUrl = (query) => {
  // 環境変数からアソシエイトIDを取得（未設定時はプレースホルダー）
  const ASSOCIATE_ID = import.meta.env.VITE_AMAZON_ASSOCIATE_ID || 'YOUR_ASSOCIATE_ID'; 
  return `https://www.amazon.co.jp/s?k=${encodeURIComponent(query)}&tag=${ASSOCIATE_ID}`;
};
