import React, { useState } from 'react';

const Accordion = ({ faqItems, setFaqItems }) => {
  const handleToggle = (index) => {
    const updatedFaqItems = [...faqItems];
    updatedFaqItems[index].isOpen = !updatedFaqItems[index].isOpen;
    setFaqItems(updatedFaqItems);
  };

  const handleChange = (index, field, value) => {
    const updatedFaqItems = [...faqItems];
    updatedFaqItems[index][field] = value;
    setFaqItems(updatedFaqItems);
  };

  const handleAdd = () => {
    setFaqItems([...faqItems, { question: '', answer: '', isOpen: false }]);
  };

  const handleRemove = (index) => {
    setFaqItems(faqItems.filter((_, i) => i !== index));
  };

  return (
    <div className="faq-section p-4 bg-white shadow-lg rounded-md">
      <h3 className="text-xl font-bold mb-6 border-b pb-2 border-gray-200">FAQ</h3>
      {faqItems.map((item, index) => (
        <div key={index} className="faq-item mb-4 border rounded-md border-gray-200">
          <div
            onClick={() => handleToggle(index)}
            className="faq-question cursor-pointer p-4 bg-gray-100 hover:bg-gray-200 flex justify-between items-center"
          >
            <span className="font-medium text-gray-700">{item.question || 'Add a question'}</span>
            <span className="text-gray-500">{item.isOpen ? '−' : '+'}</span>
          </div>
          {item.isOpen && (
            <div className="faq-answer p-4 bg-gray-50">
              <textarea
                value={item.question}
                onChange={(e) => handleChange(index, 'question', e.target.value)}
                placeholder="Question here..."
                className="w-full p-2 border border-gray-300 rounded-md mb-2 resize-none h-20"
              />
              <textarea
                value={item.answer}
                onChange={(e) => handleChange(index, 'answer', e.target.value)}
                placeholder="Answer here..."
                className="w-full p-2 border border-gray-300 rounded-md mb-2 resize-none h-20"
              />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="mt-2 py-1 px-3 text-white bg-red-500 hover:bg-red-600 rounded-md"
              >
                Remove FAQ
              </button>
            </div>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={handleAdd}
        className="mt-4 py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
      >
        Add FAQ
      </button>
    </div>
  );
};

export default Accordion;
