/* eslint-disable */
import React, { useState } from 'react';
import { BsFillShareFill, BsHeart, BsHeartFill } from 'react-icons/bs';
import { FaRegComment } from 'react-icons/fa';
import { Repeat } from 'lucide-react';

type ActionState = {
  like: boolean;
  comment: boolean;
  repost: boolean;
};

interface CardKomunitasProps {
  items: any[];
  onItemSelect?: (item: any, index: number) => void;
  className?: string;
  displayScrollbar?: boolean;
}

const CardKomunitas: React.FC<CardKomunitasProps> = ({
  items,
  onItemSelect,
  className = '',
  displayScrollbar = true,
}) => {
  const [clicked, setClicked] = useState<Record<number, ActionState>>({});

  const toggleAction = (e: React.MouseEvent, id: number, key: keyof ActionState) => {
    e.stopPropagation(); // Mencegah trigger onItemSelect
    setClicked((prev) => ({
      ...prev,
      [id]: {
        like: prev[id]?.like ?? false,
        comment: prev[id]?.comment ?? false,
        repost: prev[id]?.repost ?? false,
        [key]: !prev[id]?.[key],
      },
    }));
  };

  return (
    <div className={`w-full divide-y divide-gray-200 dark:divide-gray-800 ${className}`}>
      {items.map((item, index) => {
        const state = clicked[item.id] ?? {
          like: false,
          comment: false,
          repost: false,
        };

        return (
          <div
            key={item.id || index}
            onClick={() => onItemSelect?.(item, index)}
            className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
          >
            <div className="flex gap-4">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <img
                  src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${item.name}`}
                  alt={item.name}
                  className="w-12 h-12 rounded-full object-cover bg-gray-200 dark:bg-gray-700"
                />
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 dark:text-white hover:underline">
                      {item.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      • 25m
                    </span>
                  </div>
                  <button 
                    onClick={(e) => e.stopPropagation()}
                    className="text-gray-400 hover:text-blue-500 p-1 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  >
                    <BsFillShareFill size={14} />
                  </button>
                </div>

                <p className="text-[15px] text-gray-800 dark:text-gray-200 mt-1 leading-relaxed">
                  {item.pesan}
                </p>

                {/* Images Grid */}
                {item.images && item.images.length > 0 && (
                  <div className={`mt-3 grid gap-2 overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 ${
                    item.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
                  }`}>
                    {item.images.map((img: string, i: number) => (
                      <img
                        key={i}
                        src={img}
                        alt="Post content"
                        className="w-full h-64 object-cover hover:opacity-90 transition-opacity"
                      />
                    ))}
                  </div>
                )}

                {/* Interaction Buttons */}
                <div className="mt-4 flex justify-between max-w-md text-gray-500 dark:text-gray-400">
                  <button
                    onClick={(e) => toggleAction(e, item.id, 'comment')}
                    className="flex items-center gap-2 group hover:text-blue-500 transition-colors"
                  >
                    <div className="p-2 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 rounded-full">
                      <FaRegComment size={18} />
                    </div>
                    <span className="text-sm">212</span>
                  </button>

                  <button
                    onClick={(e) => toggleAction(e, item.id, 'repost')}
                    className={`flex items-center gap-2 group transition-colors ${
                      state.repost ? 'text-green-500' : 'hover:text-green-500'
                    }`}
                  >
                    <div className="p-2 group-hover:bg-green-50 dark:group-hover:bg-green-900/20 rounded-full">
                      <Repeat size={18} />
                    </div>
                    <span className="text-sm">45</span>
                  </button>

                  <button
                    onClick={(e) => toggleAction(e, item.id, 'like')}
                    className={`flex items-center gap-2 group transition-colors ${
                      state.like ? 'text-pink-500' : 'hover:text-pink-500'
                    }`}
                  >
                    <div className="p-2 group-hover:bg-pink-50 dark:group-hover:bg-pink-900/20 rounded-full">
                      {state.like ? (
                        <BsHeartFill size={18} className="text-pink-500" />
                      ) : (
                        <BsHeart size={18} />
                      )}
                    </div>
                    <span className="text-sm">1.2k</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CardKomunitas;