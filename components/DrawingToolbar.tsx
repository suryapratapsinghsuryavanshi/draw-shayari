'use client'

import { Paintbrush, Pencil, Eraser, RotateCcw, Type, PenLine } from 'lucide-react'
import * as Slider from '@radix-ui/react-slider'

interface DrawingToolbarProps {
  currentTool: string;
  setCurrentTool: (tool: string) => void;
  brushSize: number;
  setBrushSize: (size: number) => void;
  onClear: () => void;
}

export default function DrawingToolbar({ 
  currentTool, 
  setCurrentTool, 
  brushSize, 
  setBrushSize, 
  onClear 
}: DrawingToolbarProps) {
  const tools = [
    { 
      id: 'brush', 
      icon: Paintbrush, 
      tooltip: 'Brush (Soft)',
      color: '#7752ae'
    },
    { 
      id: 'pencil', 
      icon: Pencil, 
      tooltip: 'Pencil (Hard)',
      color: '#cf4ec2'
    },
    { 
      id: 'eraser', 
      icon: Eraser, 
      tooltip: 'Eraser',
      color: '#ff6b6b'
    },
    { 
      id: 'shape', 
      icon: PenLine, 
      tooltip: 'Draw Line',
      color: '#6b6bff'
    },
  ]

  return (
    <div className="absolute left-[-90px] top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-lg rounded-lg p-2 flex flex-col gap-2">
      {tools.map((tool) => (
        <button
          key={tool.id}
          onClick={() => setCurrentTool(tool.id)}
          className={`p-2 rounded-lg hover:bg-white/20 transition-colors ${
            currentTool === tool.id ? 'bg-white/30 ring-2 ring-offset-2 ring-offset-white/10' : ''
          }`}
          title={tool.tooltip}
        >
          <tool.icon 
            className="w-5 h-5 transition-colors duration-200" 
            style={{ 
              color: currentTool === tool.id ? tool.color : '#666',
              stroke: currentTool === tool.id ? tool.color : '#666'
            }} 
          />
        </button>
      ))}
      <div className="w-full h-px bg-gray-200/20 my-1" />
      <div className="h-32 flex items-center justify-center px-2">
        <Slider.Root
          className="relative flex items-center justify-center w-2 h-full touch-none select-none bg-[#7752ae] rounded-sm"
          orientation="vertical"
          defaultValue={[brushSize]}
          value={[brushSize]}
          onValueChange={([value]) => setBrushSize(value)}
          max={20}
          min={1}
          step={1}
        >
          <Slider.Track className="relative grow rounded-full w-[3px] bg-white/20">
            <Slider.Range className="absolute w-full rounded-full bg-[#7752ae]" />
          </Slider.Track>
          <Slider.Thumb
            className="block w-5 h-5 bg-white rounded-full border-2 border-[#7752ae] hover:bg-violet-50 focus:outline-none focus:ring-2 focus:ring-[#7752ae] focus:ring-offset-2"
            aria-label="Brush size"
          />
        </Slider.Root>
      </div>
      <div className="w-full h-px bg-gray-200/20 my-1" />
      <button
        onClick={onClear}
        className="p-2 rounded-lg hover:bg-white/20 transition-colors"
        title="Clear Canvas"
      >
        <RotateCcw className="w-5 h-5 text-gray-800" />
      </button>
    </div>
  )
} 