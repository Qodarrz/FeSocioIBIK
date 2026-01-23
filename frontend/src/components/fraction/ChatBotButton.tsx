import { BotMessageSquare } from 'lucide-react';

type ChatBotButtonProps = {
    onClick: () => void;
};

export default function ChatBotButton({ onClick }: ChatBotButtonProps) {
    return (
        <button
            onClick={onClick}
            className="fixed bottom-6 right-6 z-50 bg-[#70B2B2] dark:bg-[#70B2B2] text-textDark rounded-full p-4 shadow-lg hover:scale-105 transition-transform"
        >
            <BotMessageSquare className="w-6 h-6" />
        </button>
    )
}
