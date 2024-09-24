// faq page
import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';


const Faq = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleAccordion = (index) => {
      setActiveIndex(activeIndex === index ? null : index);
    };
  
    const faqData = [
      {
        question: 'What is the product made of?',
        answer: 'Our product is crafted from high-quality, sustainable materials that ensure durability and comfort.',
      },
      {
        question: 'How do I care for the product?',
        answer: 'To maintain the quality, we recommend hand washing with mild detergent and air drying. Avoid direct sunlight for prolonged periods.',
      },
      {
        question: 'What is the return policy?',
        answer: 'We offer a 30-day return policy from the date of purchase, provided the product is in its original condition.',
      },
      {
        question: 'Do you offer international shipping?',
        answer: 'Yes, we ship internationally. Shipping times and costs vary based on your location.',
      },
    ];
  
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg m-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqData.map((faq, index) => (
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
