import { useState, useEffect } from 'react';

export default function OmikujiCalculator() {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [omikujiPreview, setOmikujiPreview] = useState(null);
  const [fullOmikuji, setFullOmikuji] = useState(null);
  const [showAd, setShowAd] = useState(false);
  const [adTimer, setAdTimer] = useState(5);
  const [showFullOmikuji, setShowFullOmikuji] = useState(false);
  const [isNewNumber, setIsNewNumber] = useState(true);
  const [lastCalculation, setLastCalculation] = useState('');

  // 意味深な一言系おみくじ
  const omikujiData = [
    {
      preview: "あの人、まだ怒ってますよ",
      full: "謝るなら今日中がいいかもしれません。明日になると、もう一段階こじれます。"
    },
    {
      preview: "冷蔵庫の中、確認した？",
      full: "奥の方に何かあります。たぶん、もう手遅れですが。"
    },
    {
      preview: "3日前のあれ、バレてないと思ってるでしょ",
      full: "気づいてる人は気づいてます。ただ、言わないだけ。"
    },
    {
      preview: "今日、誰かがあなたの名前を口にします",
      full: "良い文脈かどうかは、あなた次第です。"
    },
    {
      preview: "その判断、合ってます",
      full: "自信持っていいですよ。少なくとも今回は。"
    },
    {
      preview: "返信、来ませんよ",
      full: "既読はついてます。ただ、それだけです。"
    },
    {
      preview: "鍵、持った？",
      full: "確認してください。今ならまだ戻れます。"
    },
    {
      preview: "あのとき言わなかったこと、正解でした",
      full: "言ってたら今頃もっとややこしいことになってました。"
    },
    {
      preview: "誰かが夢にあなたを出しました",
      full: "どんな役だったかは、聞かない方がいいかもしれません。"
    },
    {
      preview: "明日の15時、ちょっと気をつけて",
      full: "何がとは言えませんが、左側を意識してください。"
    },
    {
      preview: "その服、正解です",
      full: "今日会う人の中に、気づく人がいます。"
    },
    {
      preview: "最近、忘れてることがあります",
      full: "大事なことではないです。たぶん。"
    },
    {
      preview: "あの件、まだ間に合います",
      full: "ただし、今週中に動かないと厳しくなります。"
    },
    {
      preview: "言い訳、考えておいた方がいいかも",
      full: "聞かれたとき用に。聞かれなかったらラッキーです。"
    },
    {
      preview: "見られてますよ",
      full: "悪い意味じゃないです。たぶん。"
    },
    {
      preview: "今日じゃない",
      full: "それをやるのは、今日じゃないです。"
    },
    {
      preview: "思い出して",
      full: "先週、何か約束しませんでしたか？"
    },
    {
      preview: "大丈夫、届いてます",
      full: "あなたの気持ち、ちゃんと届いてますよ。"
    },
    {
      preview: "後ろ",
      full: "何かあるわけじゃないです。ただ、なんとなく。"
    },
    {
      preview: "水、飲んだ？",
      full: "コーヒーは水じゃないですよ。"
    },
  ];

  const fakeAds = [
    { title: "🎮 伝説のRPG", text: "今なら★5キャラ確定！", button: "無料ダウンロード" },
    { title: "💎 マッチングアプリ", text: "運命の出会いがここに", button: "今すぐ登録" },
    { title: "📱 スマホ料金診断", text: "あなた払いすぎかも？", button: "無料診断する" },
    { title: "🏠 不動産投資", text: "老後の不安を解消", button: "資料請求" },
    { title: "💪 パーソナルジム", text: "2ヶ月で-10kg！", button: "無料カウンセリング" },
    { title: "🎓 プログラミング講座", text: "未経験から転職成功", button: "無料体験" },
  ];

  const [currentAd, setCurrentAd] = useState(fakeAds[0]);

  useEffect(() => {
    let interval;
    if (showAd && adTimer > 0) {
      interval = setInterval(() => {
        setAdTimer(prev => prev - 1);
      }, 1000);
    } else if (showAd && adTimer === 0) {
      setShowAd(false);
      setShowFullOmikuji(true);
    }
    return () => clearInterval(interval);
  }, [showAd, adTimer]);

  const drawOmikuji = () => {
    const index = Math.floor(Math.random() * omikujiData.length);
    return omikujiData[index];
  };

  const handleNumber = (num) => {
    if (isNewNumber) {
      setDisplay(num);
      setIsNewNumber(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleOperator = (op) => {
    setEquation(display + ' ' + op + ' ');
    setIsNewNumber(true);
  };

  const handleEquals = () => {
    try {
      const fullEquation = equation + display;
      const sanitized = fullEquation.replace(/×/g, '*').replace(/÷/g, '/');
      const result = eval(sanitized);
      const formattedResult = Number.isInteger(result) 
        ? result.toString() 
        : parseFloat(result.toFixed(8)).toString();
      setDisplay(formattedResult);
      setLastCalculation(fullEquation.replace(/\*/g, '×').replace(/\//g, '÷') + ' = ' + formattedResult);
      setEquation('');
      setIsNewNumber(true);
      
      const newOmikuji = drawOmikuji();
      setOmikujiPreview(newOmikuji.preview);
      setFullOmikuji(newOmikuji.full);
      setShowFullOmikuji(false);
    } catch {
      setDisplay('Error');
      setEquation('');
      setIsNewNumber(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
    setIsNewNumber(true);
    setOmikujiPreview(null);
    setFullOmikuji(null);
    setShowFullOmikuji(false);
    setLastCalculation('');
  };

  const handlePreviewTap = () => {
    const randomAd = fakeAds[Math.floor(Math.random() * fakeAds.length)];
    setCurrentAd(randomAd);
    setAdTimer(5);
    setShowAd(true);
  };

  const shareToTwitter = () => {
    const text = `${lastCalculation}\n\n「${omikujiPreview}」\n\n#うらない電卓`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const closeFullOmikuji = () => {
    setShowFullOmikuji(false);
  };

  const Button = ({ value, onClick, className = '', span = 1 }) => (
    <button
      onClick={onClick}
      className={`h-14 text-xl font-bold rounded-xl transition-all duration-150 
        hover:scale-105 active:scale-95 shadow-md ${className}`}
      style={{ gridColumn: `span ${span}` }}
    >
      {value}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="bg-slate-100 rounded-3xl shadow-2xl p-5 w-80 relative">
        <h1 className="text-center text-lg font-bold text-slate-600 mb-3">
          電卓
        </h1>
        
        {/* Display */}
        <div className="bg-white rounded-2xl p-3 mb-3 shadow-inner">
          <div className="text-right text-slate-400 text-sm h-5 overflow-hidden">
            {equation}
          </div>
          <div className="text-right text-3xl font-bold text-slate-800 overflow-hidden font-mono">
            {display}
          </div>
        </div>

        {/* Omikuji Preview */}
        <div 
          className={`mb-3 p-3 rounded-2xl text-center transition-all duration-300
            ${omikujiPreview ? 'bg-amber-50 border border-amber-200 cursor-pointer hover:bg-amber-100' : 'bg-slate-50'}`}
          onClick={omikujiPreview && !showFullOmikuji ? handlePreviewTap : undefined}
          style={{ minHeight: '70px' }}
        >
          {omikujiPreview && !showFullOmikuji && (
            <>
              <div className="text-slate-700 font-medium">
                「{omikujiPreview}」
              </div>
              <div className="text-amber-600 text-xs mt-2">
                続きを見る →
              </div>
            </>
          )}
          {showFullOmikuji && fullOmikuji && (
            <div className="text-slate-500 text-sm">
              ↓ 結果を表示中
            </div>
          )}
          {!omikujiPreview && (
            <div className="text-slate-400 text-sm pt-3">
              計算すると何か出ます
            </div>
          )}
        </div>

        {/* Calculator Buttons */}
        <div className="grid grid-cols-4 gap-2">
          <Button value="C" onClick={handleClear} 
            className="bg-red-400 text-white hover:bg-red-500" />
          <Button value="±" onClick={() => setDisplay((parseFloat(display) * -1).toString())} 
            className="bg-slate-300 text-slate-700 hover:bg-slate-400" />
          <Button value="%" onClick={() => setDisplay((parseFloat(display) / 100).toString())} 
            className="bg-slate-300 text-slate-700 hover:bg-slate-400" />
          <Button value="÷" onClick={() => handleOperator('÷')} 
            className="bg-amber-500 text-white hover:bg-amber-600" />

          <Button value="7" onClick={() => handleNumber('7')} 
            className="bg-white text-slate-800 hover:bg-slate-100" />
          <Button value="8" onClick={() => handleNumber('8')} 
            className="bg-white text-slate-800 hover:bg-slate-100" />
          <Button value="9" onClick={() => handleNumber('9')} 
            className="bg-white text-slate-800 hover:bg-slate-100" />
          <Button value="×" onClick={() => handleOperator('×')} 
            className="bg-amber-500 text-white hover:bg-amber-600" />

          <Button value="4" onClick={() => handleNumber('4')} 
            className="bg-white text-slate-800 hover:bg-slate-100" />
          <Button value="5" onClick={() => handleNumber('5')} 
            className="bg-white text-slate-800 hover:bg-slate-100" />
          <Button value="6" onClick={() => handleNumber('6')} 
            className="bg-white text-slate-800 hover:bg-slate-100" />
          <Button value="-" onClick={() => handleOperator('-')} 
            className="bg-amber-500 text-white hover:bg-amber-600" />

          <Button value="1" onClick={() => handleNumber('1')} 
            className="bg-white text-slate-800 hover:bg-slate-100" />
          <Button value="2" onClick={() => handleNumber('2')} 
            className="bg-white text-slate-800 hover:bg-slate-100" />
          <Button value="3" onClick={() => handleNumber('3')} 
            className="bg-white text-slate-800 hover:bg-slate-100" />
          <Button value="+" onClick={() => handleOperator('+')} 
            className="bg-amber-500 text-white hover:bg-amber-600" />

          <Button value="0" onClick={() => handleNumber('0')} span={2}
            className="bg-white text-slate-800 hover:bg-slate-100" />
          <Button value="." onClick={() => !display.includes('.') && setDisplay(display + '.')} 
            className="bg-white text-slate-800 hover:bg-slate-100" />
          <Button value="=" onClick={handleEquals} 
            className="bg-slate-700 text-white hover:bg-slate-800" />
        </div>

        {/* Full Omikuji Display */}
        {showFullOmikuji && fullOmikuji && (
          <div className="mt-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-slate-700 font-medium mb-2">
              「{omikujiPreview}」
            </div>
            <div className="text-slate-500 text-sm leading-relaxed mb-4">
              {fullOmikuji}
            </div>
            
            {/* SNS Share Button */}
            <button 
              onClick={shareToTwitter}
              className="w-full py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-black flex items-center justify-center gap-2 mb-2"
            >
              <span>𝕏</span>
              <span>ポストする</span>
            </button>
            
            <button 
              onClick={closeFullOmikuji}
              className="w-full py-2 bg-slate-100 rounded-xl text-slate-500 text-sm hover:bg-slate-200"
            >
              閉じる
            </button>
          </div>
        )}
      </div>

      {/* 広告オーバーレイ */}
      {showAd && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-72 text-center relative">
            <div className="absolute top-2 right-3 text-slate-400 text-xs">
              広告
            </div>
            <div className="text-4xl mb-3">{currentAd.title.split(' ')[0]}</div>
            <div className="text-xl font-bold text-slate-800 mb-2">
              {currentAd.title.split(' ').slice(1).join(' ')}
            </div>
            <div className="text-slate-600 mb-4">{currentAd.text}</div>
            <button className="w-full py-3 bg-green-500 text-white font-bold rounded-xl mb-4 hover:bg-green-600">
              {currentAd.button}
            </button>
            <div className="text-slate-400 text-sm">
              {adTimer > 0 ? (
                <span>あと {adTimer} 秒...</span>
              ) : (
                <span>読み込み中...</span>
              )}
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
              <div 
                className="bg-amber-500 h-1.5 rounded-full transition-all duration-1000"
                style={{ width: `${(5 - adTimer) * 20}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
