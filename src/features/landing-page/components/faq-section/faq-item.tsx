"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { memo, useCallback, useState } from "react";

interface FAQItemProps {
  question: string;
  answer: string;
}

export const FAQItem = memo(({ question, answer }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleFaq = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const id = `faq-answer-${question.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className="group">
      <button
        onClick={toggleFaq}
        className="flex w-full items-center justify-between bg-white px-6 py-5 text-left hover:bg-gray-50 transition-colors"
        aria-expanded={isOpen}
        aria-controls={id}
      >
        <span className="text-base font-semibold leading-7 text-gray-900">
          {question}
        </span>
        <span className="ml-6 flex-shrink-0">
          {isOpen ? (
            <ChevronUp className="h-6 w-6 text-primary" />
          ) : (
            <ChevronDown className="h-6 w-6 text-gray-400" />
          )}
        </span>
      </button>
      {isOpen && (
        <div id={id} className="bg-orange-50 px-6 py-5" aria-hidden={!isOpen}>
          <p className="text-base leading-7 text-gray-600">{answer}</p>
        </div>
      )}
    </div>
  );
});

FAQItem.displayName = "FAQItem";
