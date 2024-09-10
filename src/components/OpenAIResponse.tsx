import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useReactToPrint } from "react-to-print";
import { exportMarkdownToDocx } from "@/utils/exportDocxWithMarkdown";

const OpenAIResponse = ({ fullText }: { fullText: string }) => {
  const [displayedContent, setDisplayedContent] = useState("aaa");
  const [fullContent, setFullContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true); 
  const typingSpeed = 1; // Speed of the typing animation (ms)
  const markdownContainerRef = useRef<HTMLDivElement>(null);

  const contentRef = useRef();

  const handleExport = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    exportMarkdownToDocx(fullContent);
  };


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Simulated OpenAI API response
      // const response = {
      //   choices: [
      //     {
      //       text: `### Background of Deloitte\n\nDeloitte is one of the largest professional services networks in the world, providing audit, consulting, tax, and advisory services...\n\n##### Principal Activities:\n* **Audit and Assurance**: Helping clients ensure the accuracy and reliability of financial information.\n* **Consulting**: Providing advice on strategy, operations, technology, and human capital management.\n`,
      //     },
      //   ],
      // };

      setFullContent(fullText); // Set full content
      setLoading(false);
    };

    fetchData();
  }, []);

  // useEffect(() => { 
  //   if (!loading && fullContent) {
  //     let index = 0;
  //     const interval = setInterval(() => {
  //       setDisplayedContent(
  //         (prev) => prev + fullContent.slice(index, index + 20)
  //       );
  //       console.log(index); 
  //       index += 20;
  //       if (index >= 30) {
  //         clearInterval(interval); 
  //         setIsDisabled(false); 
  //       }
  //     }, typingSpeed);
  //     return () => clearInterval(interval);
  //   }
  // }, [fullContent, loading, typingSpeed]);
  useEffect(() => {
    if (!loading && fullContent) {
      let index = 0;  // Initialize index
      let accumulatedContent = '';  // Initialize accumulatedContent as an empty string
      setDisplayedContent('');  // Clear any previously displayed content
  
      const interval = setInterval(() => {
        // Slice the next chunk of 20 characters
        const nextChunk = fullContent.slice(index, index + 20);
        
        // Accumulate the content
        accumulatedContent += nextChunk;
        
        // Update the state with accumulated content
        setDisplayedContent(accumulatedContent);
  
        // // Debugging logs
        // console.log('Index:', index);
        // console.log('Next Chunk:', nextChunk);
        // console.log('Accumulated Content:', accumulatedContent);
  
        // Increment index by 20
        index += 20;
  
        // Stop the interval when all content is displayed
        if (index >= fullContent.length) {
          clearInterval(interval);
          setIsDisabled(false); // Enable whatever functionality should be available after displaying all content
        }
      }, typingSpeed);
  
      return () => clearInterval(interval);  // Clean up on component unmount
    }
  }, [fullContent, loading, typingSpeed]);
  

  useEffect(() => {
    if (markdownContainerRef.current) {
      markdownContainerRef.current.scrollTop =
        markdownContainerRef.current.scrollHeight;
    }
  }, [displayedContent]); // Run whenever new content is added

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div
        className="w-full h-80 p-4 border border-gray-300 overflow-y-auto bg-gray-100"
        ref={markdownContainerRef}
      >
        <ReactMarkdown>
          {displayedContent}
        </ReactMarkdown>
      </div>
      <button type="button" onClick={handleExport} disabled={isDisabled} className={`mt-5 bg-black text-white rounded-lg px-4 py-2 ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'}`}>Export</button> {/* Button to trigger PDF download */}
    </div>
  );
};

export default OpenAIResponse;
