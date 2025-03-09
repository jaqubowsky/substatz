"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface FAQItemProps {
  question: string;
  answer: string;
}

export const FAQItem = ({ question, answer }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleFaq = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="group">
      <button
        onClick={toggleFaq}
        className="flex w-full items-center justify-between bg-white px-6 py-5 text-left hover:bg-gray-50 transition-colors"
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${question
          .replace(/\s+/g, "-")
          .toLowerCase()}`}
      >
        <span className="text-base font-semibold leading-7 text-gray-900">
          {question}
        </span>
        <span className="ml-6 flex-shrink-0 transition-transform duration-200 ease-in-out">
          {isOpen ? (
            <ChevronUp className="h-6 w-6 text-primary" />
          ) : (
            <ChevronDown className="h-6 w-6 text-gray-400" />
          )}
        </span>
      </button>
      <div
        id={`faq-answer-${question.replace(/\s+/g, "-").toLowerCase()}`}
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
        aria-hidden={!isOpen}
      >
        <div className="bg-orange-50 px-6 py-5">
          <p className="text-base leading-7 text-gray-600">{answer}</p>
        </div>
      </div>
    </div>
  );
};
