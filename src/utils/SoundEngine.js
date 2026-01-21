export const SoundEngine = {
  ctx: null,

  // Initialize AudioContext (must be called from a user interaction)
  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  },

  // 1. キー入力音（Mechanical Click）
  // イメージ: 「カツカツカツ」。乾いた打鍵音。
  // 実装: 短い矩形波（Square wave）+ ローパスフィルタでプラスチック感を出す
  playClick() {
    this.init();
    const t = this.ctx.currentTime;
    
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    // 音色設定: 矩形波
    osc.type = 'square';
    // ピッチ: 少し低めのプラスチック音 (300Hz -> 100Hz)
    osc.frequency.setValueAtTime(300, t);
    osc.frequency.exponentialRampToValueAtTime(100, t + 0.05);

    // フィルタ: 高域を削って「カチッ」というより「コトッ」に近づける
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, t); // 1000Hz -> 800Hzに下げて角を取る
    filter.frequency.exponentialRampToValueAtTime(100, t + 0.03);

    // エンベロープ: 非常に短く減衰
    gainNode.gain.setValueAtTime(0.04, t); // 音量を大幅に下げる (0.15 -> 0.04)
    gainNode.gain.exponentialRampToValueAtTime(0.001, t + 0.03); // 減衰を早くする

    // 接続
    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    // 再生
    osc.start(t);
    osc.stop(t + 0.04);
  },

  // 2. 計算結果表示音（The "Piyoon"）
  // イメージ: 「ピヨーン…」。間の抜けた、バネが伸びる音。
  // 実装: 三角波 + 周波数ダウン + ビブラート
  playPiyoon() {
    this.init();
    const t = this.ctx.currentTime;
    
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    
    // --- LFO for Vibrato (ビブラート用発振器) ---
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    
    lfo.type = 'sine';
    lfo.frequency.value = 12; // 12Hzの速い揺れ
    lfoGain.gain.value = 30;  // 揺れの深さ (+-30Hz)

    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    lfo.start(t);

    // --- Main Oscillator ---
    // 音色: 三角波（丸みのある音）
    osc.type = 'triangle';
    
    // Frequency Ramp Down (ピヨーン)
    // 800Hzから150Hzへ、0.6秒かけてゆっくり下がる
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(150, t + 0.6);

    // Envelope
    gainNode.gain.setValueAtTime(0.15, t);
    gainNode.gain.linearRampToValueAtTime(0, t + 0.6);

    // 接続
    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    // 再生
    osc.start(t);
    osc.stop(t + 0.65);
    osc.stop(t + 0.65);
    lfo.stop(t + 0.65);
  },

  // 3. 爆発音 (Explosion)
  // イメージ: 「ドカーン！」または「バシャー！」
  // 実装: ホワイトノイズ + ローパスフィルタスイープ
  playExplosion() {
    this.init();
    const t = this.ctx.currentTime;
    // ノイズバッファの生成 (1秒分)
    const bufferSize = this.ctx.sampleRate * 1.0; 
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, t);
    filter.frequency.exponentialRampToValueAtTime(100, t + 0.5);

    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(1.0, t);
    gainNode.gain.exponentialRampToValueAtTime(0.01, t + 0.5);

    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    noise.start(t);
  }
};
