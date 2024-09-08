import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const OpenAIResponse = ({ fullText }: { fullText: string }) => {
  const [displayedContent, setDisplayedContent] = useState("");
  const [fullContent, setFullContent] = useState("");
  const [loading, setLoading] = useState(true);
  const typingSpeed = 0.01; // Speed of the typing animation (ms)
  const markdownContainerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!loading && fullContent) {
      let index = 0;
      const interval = setInterval(() => {
        setDisplayedContent((prev) => prev + fullContent[index]);
        index++;
        if (index >= fullContent.length) clearInterval(interval);
      }, typingSpeed);
      return () => clearInterval(interval);
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
    <div
      className="max-w-lg h-64 p-4 border border-gray-300 overflow-y-auto bg-gray-100"
      ref={markdownContainerRef}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {displayedContent}
      </ReactMarkdown>
    </div>
  );
};

export default OpenAIResponse;
