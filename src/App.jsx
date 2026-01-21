import { useState, useRef, useEffect } from 'react';
import { SoundEngine } from './utils/SoundEngine';
import { ChevronRight, Copy } from 'lucide-react';
import messagesData from './data/messages.json';
import { getRandomFortuneHook } from './constants/fortuneHooks';
import { getRandomFortune } from './constants/fortunes';

export default function App() {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [currentMessage, setCurrentMessage] = useState(null);
  const [isCalculated, setIsCalculated] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isNewNumber, setIsNewNumber] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [scale, setScale] = useState(1);
  const [isExploded, setIsExploded] = useState(false);
  const [explosionStyles, setExplosionStyles] = useState(Array(19).fill({}));
  const [hookText, setHookText] = useState('');
  
  const adContainerRef = useRef(null);

  // オートスケール機能：画面フィット（横幅も考慮）
  useEffect(() => {
    const handleResize = () => {
      const BASE_WIDTH = 360;  // 電卓幅(340) + 余白(20)
      const BASE_HEIGHT = 720; // 基準高さ

      const w = window.innerWidth;
      const h = window.innerHeight;

      // 横幅に合わせる比率
      const scaleX = w / BASE_WIDTH;
      // 縦幅に合わせる比率
      const scaleY = h / BASE_HEIGHT;

      // どちらか「小さいほう」採用（画面からはみ出さないため）
      // ただし上限は1（PCで巨大化させない）、下限は0.7
      let newScale = Math.min(1, scaleX, scaleY);
      newScale = Math.max(0.7, newScale);

      setScale(newScale);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // おみくじをランダムに選択
  const selectRandomMessage = () => {
    // 新しいfortunes.jsからランダムに運勢・項目を取得
    const fortuneResult = getRandomFortune();
    setCurrentMessage({
      fortune: fortuneResult.fortune,
      hook: fortuneResult.mainMessage,
      items: fortuneResult.selectedItems
    });
    setHookText(getRandomFortuneHook());
  };

  // 広告読み込み
  const loadAd = () => {
    if (adContainerRef.current) {
      const adFile = navigator.userAgent.includes('Line') ? '/ad_line.html' : '/ad_web.html';
      
      fetch(adFile)
        .then(res => res.text())
        .then(html => {
          if (adContainerRef.current) {
            adContainerRef.current.innerHTML = '';
            const range = document.createRange();
            range.selectNode(adContainerRef.current);
            const fragment = range.createContextualFragment(html);
            adContainerRef.current.appendChild(fragment);
          }
        })
        .catch(err => console.error("Failed to load ad:", err));
    }
  };

  // 情けない音を生成・再生
  const playPatheticSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      oscillator.type = 'triangle';
      const gainNode = audioCtx.createGain();
      gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.frequency.setValueAtTime(400, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.8);
      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.8);
    } catch (e) {}
  };

  const openDetailScreen = () => {
    setShowModal(true);
    setTimeout(() => loadAd(), 100);
    playPatheticSound();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(display).then(() => {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    });
  };

  const handleRepair = () => {
    setIsExploded(false);
    setIsCalculated(false);
    setDisplay('0');
    setEquation('');
    setIsNewNumber(true);
    setExplosionStyles(Array(19).fill({}));
  };

  const resetCalcState = () => {
    setIsCalculated(false);
    setShowModal(false);
    setCurrentMessage(null);
  };

  const handleNumber = (num) => {
    SoundEngine.playClick();
    if (isCalculated) resetCalcState();
    if (isNewNumber) {
      setDisplay(num);
      setIsNewNumber(false);
    } else {
      if (display.replace('.', '').length >= 12) return;
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleOperator = (op) => {
    SoundEngine.playClick();
    if (isCalculated) setIsCalculated(false);
    setEquation(display + ' ' + op + ' ');
    setIsNewNumber(true);
  };

  const handleEquals = () => {
    SoundEngine.playClick();
    try {
      const fullEquation = equation + display;
      const sanitized = fullEquation.replace(/×/g, '*').replace(/÷/g, '/');
      const result = eval(sanitized); 

      if (!isFinite(result)) {
        setIsExploded(true);
        setIsCalculated(true);
        const styles = Array(19).fill(0).map(() => ({
          transform: `translate(${Math.random() * 1000 - 500}px, ${Math.random() * 1000 - 500}px) rotate(${Math.random() * 720}deg) scale(0)`,
          transition: 'transform 0.8s ease-out, opacity 0.5s',
          pointerEvents: 'none',
          opacity: 0
        }));
        setExplosionStyles(styles);
        
        // Glitch Display
        const glitchChars = '!@#$%^&*()_+{}|:"<>?~`-=[]\\;\',./1234567890';
        let glitchText = '';
        for(let i=0; i<30; i++) {
            glitchText += glitchChars.charAt(Math.floor(Math.random() * glitchChars.length));
        }
        setDisplay(glitchText);
        
        SoundEngine.playExplosion();
        return;
      }

      const formattedResult = Number.isInteger(result) 
        ? result.toString() 
        : parseFloat(result.toFixed(8)).toString();
      setDisplay(formattedResult);
      setEquation('');
      setIsNewNumber(true);
      selectRandomMessage();
      setIsCalculated(true);
      SoundEngine.playPiyoon();
    } catch {
      setDisplay('Error');
      setEquation('');
      setIsNewNumber(true);
    }
  };

  const handleClear = () => {
    SoundEngine.playClick();
    setDisplay('0');
    setEquation('');
    setIsNewNumber(true);
    resetCalcState();
  };

  const handlePercent = () => {
    SoundEngine.playClick();
    if (isCalculated) resetCalcState();
    setDisplay((parseFloat(display) / 100).toString());
  };

  const handleSign = () => {
    SoundEngine.playClick();
    if (isCalculated) resetCalcState();
    setDisplay((parseFloat(display) * -1).toString());
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      
      {/* 電卓本体（スケーリング対象） */}
      <div 
        style={{ 
          transform: `scale(${scale})`, 
          transformOrigin: 'center center' 
        }}
      >
        {/* Chassis: 固定幅 340px, 角丸 20px */}
        <div 
          className="relative overflow-hidden silver-chassis ring-1 ring-white/20 select-none"
          style={{ 
            width: '340px',
            minWidth: '340px',
            padding: '25px 20px',
            borderRadius: '20px'
          }}
        >
          
          <h1 
            className="text-center text-xl tracking-widest mb-6"
            style={{ 
              fontFamily: 'Yomogi, cursive',
              color: '#4b5563',
              textShadow: '0px 1px 1px rgba(255,255,255,0.3), 0px -1px 1px rgba(0,0,0,0.5)'
            }}
          >
            ⛩️ おみくじ電卓
          </h1>

          {/* Display + Gimmick Area */}
          <div className="relative w-full mb-6 z-10" style={{ height: '120px' }}>
             {/* Gimmick Panel */}
             <div 
                className="absolute top-2 w-full h-[100px] bg-neutral-800 flex items-end justify-center px-4 pb-3 z-0"
                style={{ 
                  boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.8)', 
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '12px'
                }}
             >
                {isExploded ? (
                  <div className="flex flex-col items-center justify-center w-full pb-1">
                    <p className="text-white text-lg font-bold mb-2" style={{ fontFamily: 'Yomogi, cursive' }}>あーあ、壊れちゃった。</p>
                    <button 
                      onClick={handleRepair}
                      className="bg-red-500 hover:bg-red-400 text-white font-bold py-1 px-6 rounded-full shadow-lg transition-all active:scale-95"
                    >
                      直す
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={openDetailScreen}
                    className="flex items-center gap-2 bg-[#f99406] py-2 shadow-lg hover:brightness-110 active:scale-95 transition-all animate-pulse-scale"
                    style={{ 
                      width: '100%',
                      borderRadius: '8px',
                      paddingLeft: '1rem',
                      paddingRight: '1rem'
                    }}
                  >
                    <span className="text-xl font-bold text-white tracking-tight leading-tight truncate max-w-[200px] mx-auto" style={{ fontFamily: 'Yomogi, cursive' }}>
                      {hookText || ''}
                    </span>
                    <ChevronRight size={24} className="text-white shrink-0" strokeWidth={3} />
                  </button>
                )}
             </div>

             {/* LCD Display: width: 100%, overflow: hidden */}
             <div 
               className={`relative z-10 w-full bg-black p-5 shadow-[inset_0_2px_10px_rgba(0,0,0,1)] border border-white/10 ring-2 ring-black/20 transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]
                 ${isCalculated ? '-translate-y-[90px]' : 'translate-y-0'} overflow-hidden`}
               style={{ 
                 height: '120px',
                 borderRadius: '16px'
               }}
             >
                <div className="absolute top-0 right-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"
                  style={{ borderRadius: '16px 16px 0 0' }}></div>
                <div className="flex flex-col items-end justify-end h-full w-full">
                    <span className="text-white/40 text-xs font-mono tracking-wider mb-1 h-4 whitespace-nowrap">{equation}</span>
                    <h1 
                      className="text-white text-5xl font-mono font-medium tracking-tight w-full text-right" 
                      id="display-value"
                      style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {display}
                    </h1>
                </div>
             </div>
          </div>

          {/* Buttons Grid - Font Size Increased */}
          <div className="grid grid-cols-4 gap-3 relative z-20">
              <ButtonWrapper index={0} onClick={handleClear} disabled={isExploded} explosionStyle={explosionStyles[0]} className="bg-neutral-500 text-2xl">AC</ButtonWrapper>
              <ButtonWrapper index={1} onClick={handleSign} disabled={isExploded} explosionStyle={explosionStyles[1]} className="bg-neutral-500 text-2xl">+/-</ButtonWrapper>
              <ButtonWrapper index={2} onClick={handlePercent} disabled={isExploded} explosionStyle={explosionStyles[2]} className="bg-neutral-500 text-2xl">%</ButtonWrapper>
              <ButtonWrapper index={3} onClick={() => handleOperator('÷')} disabled={isExploded} explosionStyle={explosionStyles[3]} className="bg-neutral-500 text-3xl">÷</ButtonWrapper>

              <ButtonWrapper index={4} onClick={() => handleNumber('7')} disabled={isExploded} explosionStyle={explosionStyles[4]} className="bg-[#333] text-3xl font-bold">7</ButtonWrapper>
              <ButtonWrapper index={5} onClick={() => handleNumber('8')} disabled={isExploded} explosionStyle={explosionStyles[5]} className="bg-[#333] text-3xl font-bold">8</ButtonWrapper>
              <ButtonWrapper index={6} onClick={() => handleNumber('9')} disabled={isExploded} explosionStyle={explosionStyles[6]} className="bg-[#333] text-3xl font-bold">9</ButtonWrapper>
              <ButtonWrapper index={7} onClick={() => handleOperator('×')} disabled={isExploded} explosionStyle={explosionStyles[7]} className="bg-neutral-500 text-3xl">×</ButtonWrapper>

              <ButtonWrapper index={8} onClick={() => handleNumber('4')} disabled={isExploded} explosionStyle={explosionStyles[8]} className="bg-[#333] text-3xl font-bold">4</ButtonWrapper>
              <ButtonWrapper index={9} onClick={() => handleNumber('5')} disabled={isExploded} explosionStyle={explosionStyles[9]} className="bg-[#333] text-3xl font-bold">5</ButtonWrapper>
              <ButtonWrapper index={10} onClick={() => handleNumber('6')} disabled={isExploded} explosionStyle={explosionStyles[10]} className="bg-[#333] text-3xl font-bold">6</ButtonWrapper>
              <ButtonWrapper index={11} onClick={() => handleOperator('-')} disabled={isExploded} explosionStyle={explosionStyles[11]} className="bg-neutral-500 text-3xl">-</ButtonWrapper>

              <ButtonWrapper index={12} onClick={() => handleNumber('1')} disabled={isExploded} explosionStyle={explosionStyles[12]} className="bg-[#333] text-3xl font-bold">1</ButtonWrapper>
              <ButtonWrapper index={13} onClick={() => handleNumber('2')} disabled={isExploded} explosionStyle={explosionStyles[13]} className="bg-[#333] text-3xl font-bold">2</ButtonWrapper>
              <ButtonWrapper index={14} onClick={() => handleNumber('3')} disabled={isExploded} explosionStyle={explosionStyles[14]} className="bg-[#333] text-3xl font-bold">3</ButtonWrapper>
              <ButtonWrapper index={15} onClick={() => handleOperator('+')} disabled={isExploded} explosionStyle={explosionStyles[15]} className="bg-neutral-500 text-3xl">+</ButtonWrapper>

              <div 
                className="col-span-2 relative z-0 rounded-[100px]"
                style={{ 
                    backgroundColor: '#000',
                    boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.8)'
                }}
              >
                  <button 
                    onClick={() => handleNumber('0')} 
                    disabled={isExploded}
                    className="w-full h-full bg-[#333] text-white text-3xl font-bold pl-8 text-left btn-shadow hover:bg-[#444] active:translate-y-[1px]"
                    style={{ borderRadius: '100px', ...explosionStyles[16] }}
                  >0</button>
              </div>

              <ButtonWrapper index={17} onClick={() => !display.includes('.') && setDisplay(display + '.')} disabled={isExploded} explosionStyle={explosionStyles[17]} className="bg-[#333] text-3xl font-bold">.</ButtonWrapper>
              <ButtonWrapper index={18} onClick={handleEquals} disabled={isExploded} explosionStyle={explosionStyles[18]} className="bg-[#f99406] text-3xl font-bold">=</ButtonWrapper>
          </div>
        </div>
      </div>

      {/* 詳細メッセージ画面 */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
            {/* 純和風モーダル：朱色二重線の外枠 */}
            <div 
              className="relative w-[340px] flex flex-col overflow-hidden select-none"
              style={{
                backgroundColor: '#fffbf0',
                border: '4px double #c53d43',
                boxShadow: '0 15px 50px rgba(0,0,0,0.4)',
                transform: `scale(${scale})`,
                transformOrigin: 'center center',
                borderRadius: '4px'
              }}
            >
                {/* ヘッダー：タイトル＋閉じるボタン */}
                <div className="w-full flex items-center justify-between px-4 pt-3 pb-2">
                  <h2 
                    className="text-lg font-bold" 
                    style={{ 
                      fontFamily: 'Shippori Mincho, serif',
                      color: '#c53d43'
                    }}
                  >
                    ⛩️ おみくじ電卓
                  </h2>
                  <button 
                    onClick={() => setShowModal(false)}
                    className="w-10 h-10 flex items-center justify-center text-neutral-400 hover:text-neutral-800 hover:bg-neutral-200/50 rounded-full transition-colors text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>

                {/* ===== 上段：計算結果エリア ===== */}
                <div className="mx-4 mb-3">
                  <div 
                    className="bg-neutral-900 p-4 relative overflow-hidden"
                    style={{ 
                      boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.8)',
                      borderRadius: '4px'
                    }}
                  >
                    <span className="absolute top-2 left-3 text-[10px] text-gray-400 tracking-wider">計算結果</span>
                    <div className="pt-4">
                      <span className="text-3xl font-mono font-bold text-white block text-right truncate">
                        {display}
                      </span>
                    </div>
                  </div>
                  {/* コピーボタン */}
                  <div className="flex justify-center mt-2">
                    <button 
                      onClick={copyToClipboard}
                      className="flex items-center gap-2 px-5 py-2 bg-green-600 hover:bg-green-500 text-white text-sm font-bold transition-colors shadow-md"
                      style={{ borderRadius: '4px' }}
                    >
                      <Copy size={16} />
                      <span>コピー</span>
                    </button>
                  </div>
                </div>

                {/* ===== 中段：広告エリア ===== */}
                <div 
                  className="mx-4 mb-3 flex items-center justify-center relative"
                  style={{ 
                    height: '60px', 
                    backgroundColor: '#f5f5f0',
                    border: '1px solid #c53d43',
                    borderRadius: '4px'
                  }}
                >
                    <span className="text-[10px] text-neutral-400 absolute top-1 right-2">AD</span>
                    <div ref={adContainerRef} className="w-full h-full flex items-center justify-center">
                        <span className="text-neutral-400 text-sm">AD SPACE (320×50)</span>
                    </div>
                </div>

                {/* ===== 下段：おみくじ詳細エリア（純和風・縦書き） ===== */}
                <div 
                  className="mx-4 mb-4 relative"
                  style={{ 
                    backgroundColor: '#fffbf0',
                    border: '2px solid #c53d43',
                    borderRadius: '4px',
                    minHeight: '200px'
                  }}
                >
                  {/* 左右2分割レイアウト（flex-row-reverse で向かって右側に運勢を配置） */}
                  <div className="flex flex-row-reverse h-full" style={{ minHeight: '180px' }}>
                    
                    {/* 右側（向かって右）：運勢スタンプ＋メインの一言 - 上下中央 */}
                    <div 
                      className="flex justify-center items-center"
                      style={{ 
                        borderLeft: '1px solid #c53d43',
                        width: '50%',
                        padding: '16px 8px'
                      }}
                    >
                      <div 
                        style={{ 
                          writingMode: 'vertical-rl',
                          textOrientation: 'upright',
                          display: 'inline-block',
                        }}
                      >
                        {/* 運勢スタンプ - 赤い丸 */}
                        <div 
                          style={{
                            border: '2px solid #c53d43',
                            borderRadius: '50%',
                            width: '48px',
                            height: '48px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#c53d43',
                            fontFamily: 'Shippori Mincho, serif',
                            fontSize: '1.3rem',
                            fontWeight: 'bold',
                            marginLeft: '20px'
                          }}
                        >
                          {currentMessage?.fortune || '吉'}
                        </div>
                        {/* メインの一言（hook） */}
                        <p 
                          style={{
                            fontFamily: 'Shippori Mincho, serif',
                            fontSize: '1.1rem',
                            color: '#333',
                            lineHeight: '1.8'
                          }}
                        >
                          {currentMessage?.hook || ''}
                        </p>
                      </div>
                    </div>

                    {/* 左側（向かって左）：項目3つ横並び - 上詰め */}
                    <div 
                      className="flex justify-center"
                      style={{ 
                        width: '50%',
                        padding: '16px 8px',
                        alignItems: 'flex-start'
                      }}
                    >
                      {/* 3つの項目を横並びに配置 */}
                      <div 
                        style={{ 
                          display: 'flex',
                          justifyContent: 'space-around',
                          width: '100%',
                          alignItems: 'flex-start'
                        }}
                      >
                        {/* 項目1：願望 - 縦一行（項目名＋文言） */}
                        <div 
                          style={{ 
                            writingMode: 'vertical-rl',
                            textOrientation: 'upright',
                            display: 'inline-block',
                            fontFamily: 'Shippori Mincho, serif',
                            fontSize: '1rem',
                            color: '#333',
                            lineHeight: '1.6'
                          }}
                        >
                          <span style={{ color: '#c53d43' }}>
                            {currentMessage?.items?.[0]?.label || '願望'}
                          </span>
                          <span>
                            {'　'}{currentMessage?.items?.[0]?.value || 'かなう'}
                          </span>
                        </div>
                        {/* 項目2：恋愛 - 縦一行（項目名＋文言） */}
                        <div 
                          style={{ 
                            writingMode: 'vertical-rl',
                            textOrientation: 'upright',
                            display: 'inline-block',
                            fontFamily: 'Shippori Mincho, serif',
                            fontSize: '1rem',
                            color: '#333',
                            lineHeight: '1.6'
                          }}
                        >
                          <span style={{ color: '#c53d43' }}>
                            {currentMessage?.items?.[1]?.label || '恋愛'}
                          </span>
                          <span>
                            {'　'}{currentMessage?.items?.[1]?.value || 'ほどほど'}
                          </span>
                        </div>
                        {/* 項目3：待人 - 縦一行（項目名＋文言） */}
                        <div 
                          style={{ 
                            writingMode: 'vertical-rl',
                            textOrientation: 'upright',
                            display: 'inline-block',
                            fontFamily: 'Shippori Mincho, serif',
                            fontSize: '1rem',
                            color: '#333',
                            lineHeight: '1.6'
                          }}
                        >
                          <span style={{ color: '#c53d43' }}>
                            {currentMessage?.items?.[2]?.label || '待人'}
                          </span>
                          <span>
                            {'　'}{currentMessage?.items?.[2]?.value || '来る'}
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

            </div>
        </div>
      )}

      {showToast && (
        <div 
          className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-neutral-800 text-white px-4 py-2 shadow-lg animate-fade-in"
          style={{ 
            transform: `translateX(-50%) scale(${scale})`,
            borderRadius: '8px'
          }}
        >
          コピーしました
        </div>
      )}
      
      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        @keyframes pulse-scale { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
        .animate-pulse-scale { animation: pulse-scale 1.5s ease-in-out infinite; }
      `}
      </style>
    </div>
  );
}

// Helper to wrap button with a hole background
function ButtonWrapper({ children, onClick, className, disabled, explosionStyle }) {
    return (
        <div 
            className="relative z-0 aspect-square rounded-[100px]"
            style={{ 
                backgroundColor: '#000',
                boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.8)'
            }}
        >
            <button 
              onClick={onClick} 
              disabled={disabled}
              className={`w-full h-full text-white text-2xl font-medium btn-shadow transition-all active:translate-y-[1px] absolute top-0 left-0 z-10 ${className}`}
              style={{ borderRadius: '100px', ...explosionStyle }}
            >
              {children}
            </button>
        </div>
    );
}

function CalcButton({ onClick, children, className = "", style = {}, disabled = false }) {
  // Legacy support if needed, but we're replacing usage with ButtonWrapper
  return null; 
}