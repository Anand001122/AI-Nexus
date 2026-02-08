import React, { useState } from 'react';
import { ChevronDown, Check, Sparkles, Plus } from 'lucide-react';
import { AI_MODELS, ALL_MODELS_ID } from '../utils/constants';
import { useChatStore } from '../store/chatStore';
import { useAuthStore } from '../store/authStore';
import * as LucideIcons from 'lucide-react';

export const ModelSelector: React.FC = () => {
  const { selectedModels, setSelectedModels } = useChatStore();
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleModelToggle = (modelId: string) => {
    const model = AI_MODELS.find(m => m.id === modelId);
    if (model?.isExpert && !user?.isPremium) {
      alert(`✨ ${model.displayName} is an Expert-tier model. Upgrade to access advanced reasoning!`);
      return;
    }

    if (modelId === ALL_MODELS_ID) {
      const allModelIds = AI_MODELS.filter(m => !m.isExpert || user?.isPremium).map(m => m.id);
      setSelectedModels(selectedModels.length === allModelIds.length ? [AI_MODELS[0].id] : allModelIds);
    } else {
      if (selectedModels.includes(modelId)) {
        const newSelection = selectedModels.filter(id => id !== modelId);
        setSelectedModels(newSelection.length > 0 ? newSelection : [modelId]);
      } else {
        setSelectedModels([...selectedModels, modelId]);
      }
    }
  };

  const allModelsSelected = selectedModels.length === AI_MODELS.length;
  const displayText = allModelsSelected
    ? 'All Models'
    : selectedModels.length === 1
      ? AI_MODELS.find(m => m.id === selectedModels[0])?.displayName
      : `${selectedModels.length} Models`;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between px-5 py-3.5 glass rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 min-w-[200px] group border border-blue-500/20"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Plus className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Compare</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{displayText}</span>
          </div>
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 z-[100] w-full mt-3 glass rounded-2xl shadow-2xl max-h-80 overflow-y-auto scrollbar-thin animate-in">
          <div className="p-3">
            {/* All Models Option */}
            <button
              onClick={() => handleModelToggle(ALL_MODELS_ID)}
              className="flex items-center justify-between w-full px-4 py-4 text-sm rounded-xl hover:bg-gray-50/80 dark:hover:bg-gray-700/50 transition-all duration-200 group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 flex items-center justify-center shadow-lg">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400">All Models</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Compare responses from all AI models</div>
                </div>
              </div>
              {allModelsSelected && (
                <Check className="h-5 w-5 text-purple-500" />
              )}
            </button>

            <div className="border-t border-gray-100 dark:border-gray-700 my-3" />

            {/* Individual Models */}
            {AI_MODELS.map((model) => {
              const IconComponent = (LucideIcons as any)[model.icon];
              const isSelected = selectedModels.includes(model.id);

              return (
                <button
                  key={model.id}
                  onClick={() => handleModelToggle(model.id)}
                  className="flex items-center justify-between w-full px-4 py-4 text-sm rounded-xl hover:bg-gray-50/80 dark:hover:bg-gray-700/50 transition-all duration-200 group"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${model.color} flex items-center justify-center shadow-lg`}>
                      {IconComponent && <IconComponent className="h-5 w-5 text-white" />}
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">{model.displayName}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{model.description}</div>
                    </div>
                  </div>
                  {isSelected && (
                    <Check className="h-5 w-5 text-blue-500" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};