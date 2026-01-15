/* eslint-disable */
import React, { useRef, useState, useEffect, useCallback, ReactNode, MouseEventHandler, UIEvent } from 'react';
import { AnimatePresence, motion, useInView } from 'motion/react';
import { formatRupiah } from '../services/formatRupiah';
import Swal from 'sweetalert2';

interface AnimatedItemProps {
  children: ReactNode;
  delay?: number;
  index: number;
  onMouseEnter?: MouseEventHandler<HTMLDivElement>;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

const AnimatedItem: React.FC<AnimatedItemProps> = ({ children, delay = 0, index, onMouseEnter, onClick }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5, once: false });
  return (
    <motion.div
      ref={ref}
      data-index={index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      initial={{ scale: 0.7, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0 }}
      transition={{ duration: 0.2, delay }}
      className="mb-4 cursor-pointer"
    >
      {children}
    </motion.div>
  );
};

interface AnimatedListProps {
  items: any[];
  onItemSelect?: (item: string, index: number) => void;
  showGradients?: boolean;
  enableArrowNavigation?: boolean;
  className?: string;
  itemClassName?: string;
  displayScrollbar?: boolean;
  initialSelectedIndex?: number;
}

const CardTrenKomunitas: React.FC<AnimatedListProps> = ({
  items,
  onItemSelect,
  showGradients = true,
  enableArrowNavigation = true,
  className = '',
  itemClassName = '',
  displayScrollbar = true,
  initialSelectedIndex = -1
}) => {
  const listRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(initialSelectedIndex);
  const [keyboardNav, setKeyboardNav] = useState<boolean>(false);
  const [topGradientOpacity, setTopGradientOpacity] = useState<number>(0);
  const [bottomGradientOpacity, setBottomGradientOpacity] = useState<number>(1);

  const [openModal, setOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const handleItemMouseEnter = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);
  
  const handleItemClick = useCallback(
    (item: any, index: number) => {
      setSelectedIndex(index)
      setSelectedItem(item) // ⬅️ SIMPAN DATA
      setOpenModal(true)

      if (onItemSelect) {
        onItemSelect(item, index)
      }
    },
    [onItemSelect]
  )

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target as HTMLDivElement;
    setTopGradientOpacity(Math.min(scrollTop / 50, 1));
    const bottomDistance = scrollHeight - (scrollTop + clientHeight);
    setBottomGradientOpacity(scrollHeight <= clientHeight ? 0 : Math.min(bottomDistance / 50, 1));
  };

  useEffect(() => {
    if (!enableArrowNavigation) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey)) {
        e.preventDefault();
        setKeyboardNav(true);
        setSelectedIndex(prev => Math.min(prev + 1, items.length - 1));
      } else if (e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey)) {
        e.preventDefault();
        setKeyboardNav(true);
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        if (selectedIndex >= 0 && selectedIndex < items.length) {
          e.preventDefault();
          if (onItemSelect) {
            onItemSelect(items[selectedIndex], selectedIndex);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items, selectedIndex, onItemSelect, enableArrowNavigation]);

  useEffect(() => {
    if (!keyboardNav || selectedIndex < 0 || !listRef.current) return;
    const container = listRef.current;
    const selectedItem = container.querySelector(`[data-index="${selectedIndex}"]`) as HTMLElement | null;
    if (selectedItem) {
      const extraMargin = 50;
      const containerScrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      const itemTop = selectedItem.offsetTop;
      const itemBottom = itemTop + selectedItem.offsetHeight;
      if (itemTop < containerScrollTop + extraMargin) {
        container.scrollTo({ top: itemTop - extraMargin, behavior: 'smooth' });
      } else if (itemBottom > containerScrollTop + containerHeight - extraMargin) {
        container.scrollTo({
          top: itemBottom - containerHeight + extraMargin,
          behavior: 'smooth'
        });
      }
    }
    setKeyboardNav(false);
  }, [selectedIndex, keyboardNav]);

  return (
    <div className={`relative w-full ${className}`}>
      <div
        ref={listRef}
        className={`max-h-[400px] overflow-y-auto pr-2 ${
          displayScrollbar
            ? '[&::-webkit-scrollbar]:w-[8px] [&::-webkit-scrollbar-track]:!bg-primary [&::-webkit-scrollbar-thumb]:bg-secondary [&::-webkit-scrollbar-thumb]:rounded-[4px]'
            : 'scrollbar-hide'
        }`}
        onScroll={handleScroll}
        style={{
          scrollbarWidth: displayScrollbar ? 'thin' : 'none',
        //   scrollbarColor: '#222 #060010'
        }}
      >
        {items.map((item, index) => (
          <AnimatedItem
            key={index}
            delay={0.1}
            index={index}
            onMouseEnter={() => handleItemMouseEnter(index)}
            onClick={() => handleItemClick(item, index)}
          >
            <div className={`p-3  dark:bg-gray-900 flex relative overflow-hidden justify-between  dark:border-none dark:text-white border-gray-200 text-black border transition-all ease-in-out rounded-lg ${selectedIndex === index ? 'bg-primary !text-white' : ''} ${itemClassName}`}>
              
                <div className="flex items-start  justify-start gap-4">

                <div className="flex flex-col items-start h-full justify-start  w-[70%] ">
                    <span className="text-md font-semibold">
                    {item.name}
                    </span>
                    <span className="text-xs opacity-90">
                    {item?.description}
                    </span>
                </div>
                </div>

                <div className='absolute top-0 right-0 h-full'>
                  <img src={item.banner} className='w-20 object-cover h-full' alt="" />
                </div>
            </div>
          </AnimatedItem>
        ))}
      </div>
      {showGradients && (
        <>
          <div
            className="absolute top-0 left-0 right-0 h-[50px] bg-gradient-to-b from-white dark:from-black to-transparent pointer-events-none transition-opacity duration-300 ease"
            style={{ opacity: topGradientOpacity }}
          ></div>
          <div
            className="absolute bottom-0 left-0 right-0 h-[100px] bg-gradient-to-t from-white dark:from-black to-transparent pointer-events-none transition-opacity duration-300 ease"
            style={{ opacity: bottomGradientOpacity }}
          ></div>
        </>
      )}
      <AnimatePresence>
        {openModal && selectedItem && (
          <motion.div
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setOpenModal(false)}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 40 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-full max-w-xl rounded-xl bg-white dark:bg-gray-900 h-[80vh] overflow-y-auto p-6 shadow-xl"
            >
                {selectedItem?.banner && (
                  <img
                    src={selectedItem.banner}
                    alt={selectedItem.name}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                )}

              <h2 className="text-lg font-semibold mb-1 text-black dark:text-white">
                {selectedItem?.name}
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                {selectedItem?.description ?? 'Detail donasi'}
              </p>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CardTrenKomunitas;
