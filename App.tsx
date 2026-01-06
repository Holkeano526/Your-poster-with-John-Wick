
import React, { useState, useCallback } from 'react';
import { Camera, Upload, Trash2, Download, RefreshCw, AlertCircle, Sparkles, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { GenerationState, AppState } from './types';
import { generateWickPoster } from './services/geminiService';

const WICK_PROMPT = `John Wick: Chapter 4'ün bastırılmış görsel tonlarında, sakin ve içe dönük, teatral bir poster tarzı görsel oluştur. Sahne, erken şafakta, sessiz bir Paris çatısında geçiyor; incelen bulutların arasından süzülen yumuşak altın rengi sabah ışığı, çakıl yüzeyler ve havalandırma boşlukları üzerinde uzun ve nazik gölgeler oluşturuyor. Ufukta, puslu atmosfer içinde Eyfel Kulesi ve Sacré-Cœur siluetleri hafifçe seçiliyor; metal korkulukların üzerindeki çiy damlaları soluk gökyüzünü yansıtıyor. Merkezde, bir çıkıntıya yan yana yaslanmış, sakin bir ittifak anında duran iki figür var. Keanu Reeves'in canlandırdığı John Wick; uzun saçları gevşekçe bağlı, yüzünde sessiz bir yorgunluk ve ince yara izleri taşıyor. Üzerinde sade siyah bir gömlek ve koyu renk pantolon var; kolları çapraz, dışarıya düşünceli bir bakış atarken karşısındakini dinliyor. Yanında, alçak sesle süren bir konuşmaya dahil olan, ölçülü ve destekleyici bir ifadeye sahip, yüklenen fotoğraftaki kişi bulunuyor — yüz hatları birebir doğru şekilde aktarılmalı; saç stili, yüz hatları ve doğrudan bakışlar korunmalı. Üzerinde taktik bir kazak üzerine giyilmiş koyu renk bir palto var; bir eli cebinde, diğer eli yanmamış bir sigara tutuyor; aralarındaki güveni ve ortak kararlılığı yansıtıyor. Sahne, nadir rastlanan bir dinginlik ve karşılıklı anlayış yayıyor; silah yok, aksiyon yok. Sadece ikisinin arasında, çıkıntının üzerinde duran bir kahve fincanından yükselen hafif buhar var. Yumuşak, dağılmış sabah ışığı profillerinde sıcak bir kenar ışığı oluştururken; soğuk gri tonların nazik turuncu ve altın renklerle harmanlandığı, bastırılmış bir renk paleti kullanılıyor. Ciltte, sakal kıllarında, kumaş kıvrımlarında ve uzak şehir siluetinde ultra detaylı 8K dokular yer alıyor. Görsel; intikamın ortasında kısa bir soluklanma ve kaderle şekillenmiş bir kardeşlik temasını çağrıştırıyor. Tamamen yazısız, başlık veya logo içermeyen ve yakın çekim bir kompozisyon.`;

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    status: GenerationState.IDLE,
    userImage: null,
    resultImage: null,
    error: null,
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setState(prev => ({
          ...prev,
          userImage: reader.result as string,
          error: null
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setState(prev => ({ ...prev, userImage: null, resultImage: null, status: GenerationState.IDLE }));
  };

  const handleGenerate = async () => {
    if (!state.userImage) return;

    setState(prev => ({ ...prev, status: GenerationState.GENERATING, error: null }));

    try {
      const result = await generateWickPoster(state.userImage, WICK_PROMPT);
      setState(prev => ({
        ...prev,
        status: GenerationState.SUCCESS,
        resultImage: result,
      }));
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        status: GenerationState.ERROR,
        error: "Failed to generate poster. Please try again later.",
      }));
    }
  };

  const downloadImage = () => {
    if (!state.resultImage) return;
    const link = document.createElement('a');
    link.href = state.resultImage;
    link.download = `wick-studio-poster-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen wick-gradient flex flex-col items-center p-4 md:p-8">
      {/* Header */}
      <header className="w-full max-w-5xl flex justify-between items-center mb-12 border-b border-white/10 pb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/5 border border-white/20 rounded-lg flex items-center justify-center">
            <Sparkles className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tighter text-white uppercase italic">Wick Studio</h1>
            <p className="text-xs text-white/50 uppercase tracking-widest">Theatrical Art Generator</p>
          </div>
        </div>
        <div className="hidden md:block">
          <span className="text-[10px] text-white/30 uppercase tracking-[0.2em]">Inspired by John Wick: Chapter 4</span>
        </div>
      </header>

      <main className="w-full max-w-5xl flex flex-col lg:flex-row gap-8">
        {/* Control Panel */}
        <div className="w-full lg:w-1/3 flex flex-col space-y-6">
          <section className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-yellow-500/80" />
              1. Upload Reference
            </h2>
            <p className="text-sm text-white/60 mb-6">
              Upload a clear photo of your face. We'll render you as John's ally on a foggy Paris rooftop.
            </p>

            <div className="relative group">
              {!state.userImage ? (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-yellow-500/50 hover:bg-white/5 transition-all duration-300">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 text-white/40 mb-3 group-hover:scale-110 transition-transform" />
                    <p className="text-sm text-white/50 font-medium">Click to upload photo</p>
                    <p className="text-xs text-white/30 mt-1">PNG, JPG up to 10MB</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                </label>
              ) : (
                <div className="relative w-full h-64 rounded-xl overflow-hidden border border-white/20 shadow-inner">
                  <img src={state.userImage} alt="User" className="w-full h-full object-cover" />
                  <button 
                    onClick={removeImage}
                    className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-red-500/80 rounded-full transition-colors backdrop-blur-md"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                </div>
              )}
            </div>
          </section>

          <section className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500/80" />
              2. Generate Poster
            </h2>
            <p className="text-sm text-white/60 mb-6">
              Our AI will merge your features with a cinematic dawn landscape in Paris alongside John Wick.
            </p>
            
            <button
              onClick={handleGenerate}
              disabled={!state.userImage || state.status === GenerationState.GENERATING}
              className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all ${
                !state.userImage || state.status === GenerationState.GENERATING
                  ? 'bg-white/10 text-white/30 cursor-not-allowed'
                  : 'bg-yellow-600 hover:bg-yellow-500 text-black shadow-[0_0_20px_rgba(202,138,4,0.3)] active:scale-95'
              }`}
            >
              {state.status === GenerationState.GENERATING ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Rendering Scene...
                </>
              ) : (
                <>
                  Generate Masterpiece
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>

            {state.error && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {state.error}
              </div>
            )}
          </section>
        </div>

        {/* Display Panel */}
        <div className="w-full lg:w-2/3 flex flex-col space-y-4">
          <div className="relative aspect-[3/4] w-full max-w-2xl mx-auto bg-black rounded-3xl overflow-hidden border border-white/10 shadow-2xl group">
            {state.status === GenerationState.GENERATING ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-10">
                <div className="w-20 h-20 relative">
                  <div className="absolute inset-0 border-4 border-yellow-500/20 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="mt-8 text-white font-light tracking-[0.2em] animate-pulse uppercase text-sm">Drafting Cinematic Frame</p>
                <div className="mt-4 flex gap-1">
                  <div className="w-1 h-1 bg-yellow-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1 h-1 bg-yellow-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1 h-1 bg-yellow-500 rounded-full animate-bounce"></div>
                </div>
              </div>
            ) : state.resultImage ? (
              <img src={state.resultImage} alt="Result" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white/20">
                <div className="p-8 border-2 border-dashed border-white/10 rounded-full mb-6">
                  <Camera className="w-16 h-16" />
                </div>
                <p className="text-lg font-light italic">Your cinematic moment awaits</p>
                <p className="text-xs uppercase tracking-[0.3em] mt-2">Paris • Dawn • Brotherhood</p>
              </div>
            )}

            {state.status === GenerationState.SUCCESS && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button 
                  onClick={downloadImage}
                  className="px-6 py-3 bg-white text-black rounded-full font-bold flex items-center gap-2 hover:bg-yellow-500 transition-colors shadow-xl"
                >
                  <Download className="w-4 h-4" />
                  Download 8K
                </button>
                <button 
                  onClick={() => setState(prev => ({ ...prev, status: GenerationState.IDLE, resultImage: null }))}
                  className="p-3 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors border border-white/20 backdrop-blur-md"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
          
          {/* Metadata Footer */}
          <div className="flex justify-between items-center text-[10px] text-white/30 uppercase tracking-[0.2em] px-2">
            <div>Style: Chapter 4 • Muted Tones</div>
            <div>Resolution: 3000 x 4000 px</div>
            <div>Location: Paris Rooftops</div>
          </div>
        </div>
      </main>

      {/* Footer Disclaimer */}
      <footer className="w-full max-w-5xl mt-12 pt-8 border-t border-white/5 text-center">
        <p className="text-[10px] text-white/20 uppercase tracking-[0.1em]">
          All generated imagery is for artistic expression. We use Gemini 2.5 Flash Image technology.
        </p>
      </footer>
    </div>
  );
};

export default App;
