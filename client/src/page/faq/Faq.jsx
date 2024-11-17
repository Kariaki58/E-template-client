import React, { useEffect, useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';


const Faq = ({ faq }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg m-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faq.map((faq, index) => (
          <div key={index} className="border-b border-gray-200">
            <button
              onClick={() => toggleAccordion(index)}
              className="w-full text-left py-4 flex justify-between items-center text-gray-700 font-medium focus:outline-none"
            >
              <span>{faq.question}</span>
              {activeIndex === index ? (
                <FaChevronUp className="text-gray-500" />
              ) : (
                <FaChevronDown className="text-gray-500" />
              )}
            </button>
            {activeIndex === index && (
              <div className="p-4 text-gray-600">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
    );
}

export default Faq;
