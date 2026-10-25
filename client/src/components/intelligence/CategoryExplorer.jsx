import { useState } from "react";
import { analysisData } from '../../data/AnalysisData';

export default function CategoryExplorer() {
  const [activeCategoryId, setActiveCategoryId] = useState(analysisData[0].id);

  const activeCategory = analysisData.find(c => c.id === activeCategoryId);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-24">
      {/* Sidebar: Categories */}
      <div className="md:col-span-4 flex flex-col space-y-6 border-l border-enerblock-dark/10 pl-6">
        {analysisData.map(category => (
          <button
            key={category.id}
            onClick={() => setActiveCategoryId(category.id)}
            className={`text-left text-xl lg:text-2xl font-medium transition-colors duration-300 ${activeCategoryId === category.id
                ? 'text-enerblock-dark'
                : 'text-enerblock-dark/30 hover:text-enerblock-dark/60'
              }`}
          >
            {category.title}
          </button>
        ))}
      </div>

      {/* Main Content: Details */}
      <div className="md:col-span-8">
        <div key={activeCategory.id} className="animate-fade-in-up">
          <h3 className="text-4xl font-bold mb-12 tracking-tight">{activeCategory.title}</h3>

          {activeCategory.content.type === 'keyValue' && (
            <div className="space-y-8">
              {activeCategory.content.data.map((item, index) => (
                <div key={index} className="flex flex-col md:flex-row md:items-center py-4 border-b border-enerblock-dark/5 last:border-0">
                  <span className="w-48 text-sm uppercase tracking-widest text-enerblock-dark/50 font-bold mb-2 md:mb-0">
                    {item.label}
                  </span>
                  <span className="text-xl font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          )}

          {activeCategory.content.type === 'list' && (
            <div className="grid grid-cols-1 gap-8">
              {activeCategory.content.data.map((item, index) => (
                <div key={index} className="p-6 bg-white border border-enerblock-dark/5 shadow-sm">
                  <h4 className="text-2xl font-bold mb-3">{item.name}</h4>
                  <p className="text-enerblock-dark/70 text-lg leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          )}

          {activeCategory.content.type === 'text' && (
            <div className="prose prose-lg text-enerblock-dark/80 font-medium leading-relaxed max-w-2xl">
              <p>{activeCategory.content.data}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
