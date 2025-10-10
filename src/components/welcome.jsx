function Welcome({ inputName, setInputName, handleWelcome }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full border border-gray-700">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🇨🇳</div>
          <h1 className="text-3xl font-bold text-white mb-2">学习中文</h1>
          <p className="text-xl text-gray-300 mb-1">Xuéxí Zhōngwén</p>
          <p className="text-gray-400">Aprende Chino - HSK 1</p>
        </div>
        <div className="space-y-4">
          <input 
            type="text" 
            placeholder="Escribe tu nombre..." 
            value={inputName} 
            onChange={(e) => setInputName(e.target.value)} 
            onKeyPress={(e) => e.key === 'Enter' && handleWelcome()} 
            className="w-full px-4 py-3 border-2 border-gray-600 rounded-lg focus:border-red-500 focus:outline-none text-lg bg-gray-700 text-white placeholder-gray-400" 
          />
          <button 
            onClick={handleWelcome} 
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition"
          >
            ¡Comenzar!
          </button>
        </div>
      </div>
    </div>
  );
}

export default Welcome;