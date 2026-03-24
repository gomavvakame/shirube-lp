import React from 'react';

const App = () => {
  return (
    <div className="min-h-screen bg-[#FAFAF9] flex flex-col items-center justify-center font-serif text-stone-900 selection:bg-stone-200">
      <h1 className="text-2xl md:text-3xl tracking-widest mb-6">標 <span className="text-sm ml-2 font-sans opacity-60 uppercase tracking-widest">Shirube</span></h1>
      <p className="text-stone-500 tracking-widest font-light text-sm">ただいま準備中です。公開まで今しばらくお待ちください。</p>
      <div className="mt-12 w-[1px] h-16 bg-stone-300"></div>
    </div>
  );
};

export default App;
```

2. ターミナルでいつもの3点セットを打って、本番へ反映させる。
   ```powershell
   git add.
   git commit - m "chore: 一時的にComing Soon画面へ差し替え"
   git push