import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const BubbleInput = () => {
  const [inputValue, setInputValue] = useState('');
  const [bubbles, setBubbles] = useState<string[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault(); 
      // Add the current input value to the list of bubbles
      setBubbles([...bubbles, inputValue]);
      // Clear the input
      setInputValue('');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      {/* Input field */}
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type something and press Enter"
        className="mb-4"
      />

      {/* Render bubbles below */}
      <div className="space-y-2">
        {bubbles.map((bubble, index) => (
          <Card key={index} className="inline-flex p-2 h-[35px] overflow-hidden item-center justify-center rounded-full bg-orange-500 ">
            <CardContent className="text-xs text-center overflow-hidden whitespace-nowrap text-white">{bubble}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BubbleInput;