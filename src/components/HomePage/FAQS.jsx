import React, { useState } from 'react';
import fa from '../HomePage/FAQS.module.css';

export default function FAQS() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "Can I customize the invoice templates?",
      answer: "Yes, all plans include customizable templates. You can add your logo, change colors, and adjust layouts to match your brand. The Professional and Enterprise plans offer more advanced customization options."
    },
    {
      question: "Is there a free trial available?",
      answer: "Yes, you can try our basic plan free for 14 days without providing credit card details."
    },
    {
      question: "Can I export invoices as PDF?",
      answer: "Absolutely, all generated invoices can be exported as PDF or shared via email directly."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={fa.main}>
      <h2 className={fa.title}>Frequently Asked Questions</h2>
      <p className={fa.subtitle}>Click on a question to view the answer</p>

      <div className={fa.container}>
        {faqs.map((faq, index) => (
          <div key={index} className={fa.item}>
            <div className={fa.question} onClick={() => toggleFAQ(index)}>
              <span>{faq.question}</span>
              <span className={fa.arrow}>
                {openIndex === index ? "▲" : "▼"}
              </span>
            </div>

            <div
              className={`${fa.answer} ${
                openIndex === index ? fa.open : ""
              }`}
            >
              {faq.answer}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
