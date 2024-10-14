'use client'
import { useTheme } from 'next-themes';
import { AnimatePresence, motion } from 'framer-motion';
import { useState, useContext } from 'react';
import { AppStateContext } from '@/lib/AppProvider';
import { Assistant } from '@/app/api/model/chatModel';

interface SidebarListProps {
    children?: React.ReactNode;
}

export function SidebarAssistants({  }: SidebarListProps) {
    const { theme } = useTheme();
    const appStateContext = useContext(AppStateContext)
    const borderColor = theme === 'dark' ? 'border-gray-600' : 'border-gray-200';
    const backgroundColor = theme === 'dark' ? 'bg-gray-900' : 'bg-white';
    const hoverBackgroundColor = theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100';
    const textColor = theme === 'dark' ? 'text-white' : 'text-gray-800';
    const assistants = appStateContext?.state.assistants || [];
    const selectedAssistant = appStateContext?.state.selectedAssistant
    const [hoveredAssistant, setHoveredAssistant] = useState<Assistant | null>(null);

    const handleAssistantClick = (assistant: any) => {
        appStateContext?.dispatch({ type: 'UPDATE_SELECTED_ASSISTANT', payload: assistant })
    };

    return (
        <div className="flex flex-1 flex-col overflow-hidden">
            <div className="flex-1 overflow-auto">
                {assistants?.length ? (
                    <div className="space-y-2 px-2">
                        <AnimatePresence>
                            <h3 className="font-semibold">Your Assistants</h3>
                            {assistants.map((botAssistant, index) => {
                                console.log(selectedAssistant?.id === botAssistant.id); // Log botAssistant here
                                return (
                                    <motion.div
                                        key={botAssistant.id}
                                        onMouseEnter={() => setHoveredAssistant(botAssistant)}
                                        onMouseLeave={() => setHoveredAssistant(assistants[-1])}
                                        onClick={() => handleAssistantClick(botAssistant)}
                                        className={`cursor-pointer border ${borderColor} rounded p-4 ${backgroundColor} ${hoverBackgroundColor} ${textColor} ${selectedAssistant?.id === botAssistant.id ? 'bg-yellow-500' : ''}`} // Highlight the selected assistant
                                    >
                                        <h4 className="font-semibold">{botAssistant.name}</h4>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="p-8 text-center">
                        <p className="text-sm text-muted-foreground">No Assistants Found</p>
                    </div>
                )}
            </div>
            {hoveredAssistant && (
                <div className="tooltip">
                    {hoveredAssistant.description}
                </div>
            )}
        </div>
    );
}