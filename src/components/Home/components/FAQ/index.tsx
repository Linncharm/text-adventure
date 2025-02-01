import React from "react";
import SectionHeader from "@/components/Home/components/SectionHeader";
import FAQCard from "@/components/Home/components/FAQCard";

const HomeFAQ: React.FC = () => {

    const faqContents = [
      {
        id: 1,
        question: 'faq.content.first.question',
        answer: 'faq.content.first.answer'
      },
      {
        id: 2,
        question: 'faq.content.second.question',
        answer: 'faq.content.second.answer'
      },
      {
        id: 3,
        question: 'faq.content.third.question',
        answer: 'faq.content.third.answer'
      },
      {
        id: 4,
        question: 'faq.content.fourth.question',
        answer: 'faq.content.fourth.answer'
      },
      {
        id: 5,
        question: 'faq.content.fifth.question',
        answer: 'faq.content.fifth.answer'
      },
      {
        id: 6,
        question: 'faq.content.sixth.question',
        answer: 'faq.content.sixth.answer'
      },
      {
        id: 7,
        question: 'faq.content.seventh.question',
        answer: 'faq.content.seventh.answer'
      },
      {
        id: 8,
        question: 'faq.content.eighth.question',
        answer: 'faq.content.eighth.answer'
      },
      {
        id: 9,
        question: 'faq.content.ninth.question',
        answer: 'faq.content.ninth.answer'
      }
    ];

    const faqHeader = {
      icon: '❓',
      title: 'faq.title',
      subtitle: 'faq.subtitle'
    }

    return (
      <section className="w-full pt-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            {
              <SectionHeader
                title={faqHeader.title}
                subtitle={faqHeader.subtitle}
                icon={faqHeader.icon}
              />
            }
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            {faqContents.map((card, _index) => (
              <FAQCard
                key={card.id}
                question={card.question}
                answer={card.answer}
              />
            ))}
          </div>
        </div>
      </section>
    )
}

export default HomeFAQ
