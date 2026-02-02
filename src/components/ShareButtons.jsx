import React from 'react';
import { Share2, MessageCircle } from 'lucide-react';
import liff from '@line/liff';
import { LINE_MINI_APP_URL } from '../constants/config';

const ShareButtons = ({ fortune, luckyItem }) => {
  // LINEミニアプリのURL
  const appUrl = LINE_MINI_APP_URL;
  
  // シェアするテキストの生成
  const shareText = `今日の運勢は【${fortune}】でした！\nラッキーアイテム：${luckyItem?.name || 'ヒミツ'}\n`;
  const hashTags = "おみくじ電卓";

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(appUrl)}&hashtags=${encodeURIComponent(hashTags)}`;
    
    // LIFF内なら外部ブラウザで開く、そうでなければ通常オープン
    if (liff.isInClient()) {
      liff.openWindow({ url: url, external: true });
    } else {
      window.open(url, '_blank');
    }
  };

  const handleLineShare = () => {
    // LINE URLスキームを使用
    const lineUrl = `https://line.me/R/msg/text/?${encodeURIComponent(shareText + ' ' + appUrl)}`;
    
    if (liff.isInClient()) {
      liff.openWindow({ url: lineUrl, external: true });
    } else {
      window.open(lineUrl, '_blank');
    }
  };

  return (
    <div className="mt-0 mb-2 flex justify-center space-x-4">
      {/* X (Twitter) Share Button */}
      <button
        onClick={handleTwitterShare}
        className="flex items-center px-4 py-2 bg-black text-white rounded-full shadow-md active:scale-95 transition-transform hover:bg-gray-800 cursor-pointer"
      >
        <span className="font-bold mr-2">𝕏</span>
        <span className="text-sm font-bold">ポスト</span>
      </button>

      {/* LINE Share Button */}
      <button
        onClick={handleLineShare}
        className="flex items-center px-4 py-2 bg-[#06C755] text-white rounded-full shadow-md active:scale-95 transition-transform hover:bg-[#05b34c] cursor-pointer"
      >
        <MessageCircle size={18} className="mr-2" />
        <span className="text-sm font-bold">送る</span>
      </button>
    </div>
  );
};

export default ShareButtons;
