'use client'

import { useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Toggle } from '@/components/ui/toggle'
import Canvas from './Canvas'
import { Bold, Italic, UnderlineIcon, AlignLeft, AlignCenter, AlignRight, AlignJustify, SubscriptIcon, SuperscriptIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

export default function TextInputModal({ isOpen, onClose }) {
  const [showCanvas, setShowCanvas] = useState(false)
  const [content, setContent] = useState('')

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      Color,
      Subscript,
      Superscript,
    ],
    content: '<p>Enter your shayari here...</p>',
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML())
    },
  })

  const handleNext = () => {
    setShowCanvas(true)
  }

  if (showCanvas) {
    return <Canvas content={content} onBack={() => setShowCanvas(false)} onClose={() => {
      setShowCanvas(false)
      onClose()
    }} />
  }

  if (!editor) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Enter Your Shayari</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4" style={{ display: 'flex\', flexDirection: \'column\', height: \'calc(100vh - 200px)' }}>
          <div className="flex flex-wrap gap-2 mb-4">
            <Toggle
              pressed={editor.isActive('bold')}
              onPressedChange={() => editor.chain().focus().toggleBold().run()}
            >
              <Bold className="h-4 w-4" />
            </Toggle>
            <Toggle
              pressed={editor.isActive('italic')}
              onPressedChange={() => editor.chain().focus().toggleItalic().run()}
            >
              <Italic className="h-4 w-4" />
            </Toggle>
            <Toggle
              pressed={editor.isActive('underline')}
              onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
            >
              <UnderlineIcon className="h-4 w-4" />
            </Toggle>
            <Toggle
              pressed={editor.isActive({ textAlign: 'left' })}
              onPressedChange={() => editor.chain().focus().setTextAlign('left').run()}
            >
              <AlignLeft className="h-4 w-4" />
            </Toggle>
            <Toggle
              pressed={editor.isActive({ textAlign: 'center' })}
              onPressedChange={() => editor.chain().focus().setTextAlign('center').run()}
            >
              <AlignCenter className="h-4 w-4" />
            </Toggle>
            <Toggle
              pressed={editor.isActive({ textAlign: 'right' })}
              onPressedChange={() => editor.chain().focus().setTextAlign('right').run()}
            >
              <AlignRight className="h-4 w-4" />
            </Toggle>
            <Toggle
              pressed={editor.isActive({ textAlign: 'justify' })}
              onPressedChange={() => editor.chain().focus().setTextAlign('justify').run()}
            >
              <AlignJustify className="h-4 w-4" />
            </Toggle>
            <Toggle
              pressed={editor.isActive('subscript')}
              onPressedChange={() => editor.chain().focus().toggleSubscript().run()}
            >
              <SubscriptIcon className="h-4 w-4" />
            </Toggle>
            <Toggle
              pressed={editor.isActive('superscript')}
              onPressedChange={() => editor.chain().focus().toggleSuperscript().run()}
            >
              <SuperscriptIcon className="h-4 w-4" />
            </Toggle>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[110px]">
                  Font Color
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Choose Color</h4>
                    <Input
                      type="color"
                      onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex-grow overflow-auto">
            <EditorContent 
              editor={editor} 
              className="min-h-full border p-4 rounded-md [&_*:focus]:outline-none" 
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleNext}>Next</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

