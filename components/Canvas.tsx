'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import html2canvas from 'html2canvas'
import DrawingToolbar from './DrawingToolbar'

export default function Canvas({ content, onBack, onClose }) {
  const [bgType, setBgType] = useState('color')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [bgImage, setBgImage] = useState('')
  const [opacity, setOpacity] = useState(1)
  const [shadow, setShadow] = useState(0)
  const canvasRef = useRef(null)
  const fileInputRef = useRef(null)
  const [currentTool, setCurrentTool] = useState('brush')
  const [brushSize, setBrushSize] = useState(5)
  const [isDrawing, setIsDrawing] = useState(false)
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 })
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null)
  const [drawings, setDrawings] = useState<ImageData[]>([])
  const [lastDrawing, setLastDrawing] = useState<ImageData | null>(null)

  useEffect(() => {
    const contentElement = canvasRef.current.querySelector('.content')
    if (contentElement) {
      const parser = new DOMParser()
      const doc = parser.parseFromString(content, 'text/html')
      
      doc.body.childNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as HTMLElement
          const textAlign = element.style.textAlign
          if (textAlign) {
            element.style.display = 'block'
            element.style.width = '100%'
          }
        }
      })

      contentElement.innerHTML = doc.body.innerHTML
    }
  }, [content])

  const handleExport = async () => {
    if (canvasRef.current) {
      const scale = 2; // Increase resolution
      const canvas = await html2canvas(canvasRef.current, {
        scale: scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null, // Ensure transparent background
      });

      // Create a new canvas with the entire content
      const exportCanvas = document.createElement('canvas');
      const ctx = exportCanvas.getContext('2d');
      
      exportCanvas.width = canvas.width;
      exportCanvas.height = canvas.height;

      // Draw the background
      if (bgType === 'color') {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
      } else if (bgType === 'image' && bgImage) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = bgImage;
        await new Promise((resolve) => {
          img.onload = resolve;
        });
        ctx.drawImage(img, 0, 0, exportCanvas.width, exportCanvas.height);
      }

      // Apply opacity
      ctx.globalAlpha = opacity;

      // Draw the entire canvas content (including text)
      ctx.drawImage(canvas, 0, 0);

      // Reset global alpha
      ctx.globalAlpha = 1;

      // Apply shadow if needed
      if (shadow > 0) {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = shadow * scale;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.drawImage(exportCanvas, 0, 0);
      }

      const image = exportCanvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = 'shayari.png';
      link.click();
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setBgImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const getCanvasCoordinates = (e: React.MouseEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    }
  }

  const startDrawing = (e: React.MouseEvent) => {
    const canvas = drawingCanvasRef.current
    if (!canvas) return
    
    const pos = getCanvasCoordinates(e, canvas)
    setIsDrawing(true)
    setLastPos(pos)

    if (currentTool === 'shape') {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        setLastDrawing(ctx.getImageData(0, 0, canvas.width, canvas.height))
      }
    }
  }

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing || !drawingCanvasRef.current) return
    
    const canvas = drawingCanvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const currentPos = getCanvasCoordinates(e, canvas)

    if (currentTool === 'shape') {
      // Restore the canvas to its state before starting the line
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      if (lastDrawing) {
        ctx.putImageData(lastDrawing, 0, 0)
      }
      
      // Draw the new line
      ctx.beginPath()
      ctx.globalAlpha = 1
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.strokeStyle = '#000000'
      ctx.lineWidth = brushSize
      ctx.moveTo(lastPos.x, lastPos.y)
      ctx.lineTo(currentPos.x, currentPos.y)
      ctx.stroke()
      return
    }

    // Only clear for shape tool preview
    if (currentTool === 'shape') {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      drawings.forEach(imageData => {
        ctx.putImageData(imageData, 0, 0)
      })
    }

    ctx.beginPath()
    ctx.moveTo(lastPos.x, lastPos.y)

    switch (currentTool) {
      case 'brush':
        ctx.globalAlpha = 0.3
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.strokeStyle = '#000000'
        ctx.lineWidth = brushSize * 2
        // Add multiple offset strokes for brush effect
        for (let i = 0; i < 3; i++) {
          ctx.beginPath()
          ctx.moveTo(lastPos.x, lastPos.y)
          ctx.lineTo(currentPos.x, currentPos.y)
          ctx.stroke()
        }
        break
      
      case 'pencil':
        ctx.globalAlpha = 0.9
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.strokeStyle = '#000000'
        ctx.lineWidth = brushSize * 0.5
        ctx.lineTo(currentPos.x, currentPos.y)
        break
      
      case 'eraser':
        ctx.globalAlpha = 1
        ctx.lineCap = 'square'
        ctx.lineJoin = 'round'
        ctx.strokeStyle = '#ffffff'
        ctx.lineWidth = brushSize * 2
        break
      
      case 'shape':
        ctx.globalAlpha = 1
        ctx.lineCap = 'square'
        ctx.lineJoin = 'miter'
        ctx.strokeStyle = '#000000'
        ctx.lineWidth = brushSize
        // Draw a straight line from start to current position
        ctx.moveTo(lastPos.x, lastPos.y)
        break
    }

    if (currentTool === 'shape') {
      ctx.beginPath()
      ctx.moveTo(lastPos.x, lastPos.y)
      ctx.lineTo(currentPos.x, currentPos.y)
    } else if (currentTool !== 'brush') {
      ctx.lineTo(currentPos.x, currentPos.y)
      ctx.stroke()
    }
    
    if (currentTool !== 'shape') {
      setLastPos(currentPos)
    }

    // Save the stroke immediately for brush and pencil
    if (currentTool === 'brush' || currentTool === 'pencil') {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      setDrawings(prev => [...prev, imageData])
    }
  }

  const stopDrawing = () => {
    if (isDrawing && drawingCanvasRef.current) {
      const canvas = drawingCanvasRef.current
      const ctx = canvas.getContext('2d')
      if (ctx) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        setDrawings(prev => [...prev, imageData])
      }
    }
    setIsDrawing(false)
    setLastDrawing(null)
  }

  const clearCanvas = () => {
    const canvas = drawingCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setDrawings([]) // Clear drawing history
  }

  const addText = (e: React.MouseEvent) => {
    if (currentTool !== 'text') return
    
    const canvas = drawingCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const pos = getCanvasCoordinates(e, canvas)
    
    const text = prompt('Enter text:')
    if (text) {
      ctx.font = `${brushSize * 2}px Arial`
      ctx.fillStyle = '#000000'
      ctx.textAlign = 'center'
      ctx.fillText(text, pos.x, pos.y)
    }
  }

  const saveDrawing = () => {
    const canvas = drawingCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    setDrawings(prev => [...prev, imageData])
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-4">Customize Your Shayari</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <div ref={canvasRef} className="w-full aspect-square rounded-lg overflow-hidden shadow-lg" style={{
              backgroundColor: bgType === 'color' ? bgColor : 'transparent',
              backgroundImage: bgType === 'image' ? `url(${bgImage})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: opacity,
              boxShadow: `0 0 ${shadow}px rgba(0,0,0,0.5)`,
            }}>
              <div className="content p-4 h-full flex items-center justify-center" />
              <canvas
                ref={drawingCanvasRef}
                width={800}
                height={800}
                className="absolute inset-0 w-full h-full"
                style={{ touchAction: 'none' }}
                onMouseDown={(e) => {
                  if (currentTool === 'text') {
                    addText(e)
                  } else {
                    startDrawing(e)
                  }
                }}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onContextMenu={(e) => e.preventDefault()} // Prevent right-click menu
              />
            </div>
            <DrawingToolbar
              currentTool={currentTool}
              setCurrentTool={setCurrentTool}
              brushSize={brushSize}
              setBrushSize={setBrushSize}
              onClear={clearCanvas}
            />
          </div>
          <div className="space-y-4">
            <RadioGroup defaultValue="color" onValueChange={(value) => setBgType(value as 'color' | 'image')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="color" id="color" />
                <Label htmlFor="color">Color</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="image" id="image" />
                <Label htmlFor="image">Image</Label>
              </div>
            </RadioGroup>
            {bgType === 'color' ? (
              <div>
                <Label htmlFor="bgColor">Background Color</Label>
                <Input id="bgColor" type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
              </div>
            ) : (
              <div>
                <Label htmlFor="bgImage">Background Image</Label>
                <Input id="bgImage" type="file" accept="image/*" onChange={handleImageUpload} ref={fileInputRef} />
              </div>
            )}
            <div>
              <Label htmlFor="opacity">Opacity</Label>
              <Slider id="opacity" min={0} max={1} step={0.1} value={[opacity]} onValueChange={([value]) => setOpacity(value)} />
            </div>
            <div>
              <Label htmlFor="shadow">Shadow</Label>
              <Slider id="shadow" min={0} max={20} value={[shadow]} onValueChange={([value]) => setShadow(value)} />
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={onBack}>Back</Button>
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={handleExport}>Export</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

