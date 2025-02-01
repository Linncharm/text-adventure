import React from 'react';
import FeatureCard from "@/components/Home/components/FeatureCard";
import SectionHeader from "@/components/Home/components/SectionHeader";
import { useTranslation } from "react-i18next";

const HomeFeature: React.FC = () => {

  const { t } = useTranslation('home');

  const featureContents = [
    {
      id: 1,
      title: 'feature.content.first.title',
      description: 'feature.content.first.description',
      icon: '🖼️'
    },
    {
      id: 2,
      title: 'feature.content.second.title',
      description: 'feature.content.second.description',
      icon: '⚡'
    },
    {
      id: 3,
      title: 'feature.content.third.title',
      description: 'feature.content.third.description',
      icon: '🧠'
    },
    {
      id: 4,
      title: 'feature.content.fourth.title',
      description: 'feature.content.fourth.description',
      icon: '📊'
    }
  ];

  const featureHeader = {
    icon: '❤️',
    title: 'feature.title',
    subtitle: 'feature.subtitle'
  }

  return (
      <section className="w-full pt-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            {
              <SectionHeader
                title={featureHeader.title}
                subtitle={featureHeader.subtitle}
                icon={featureHeader.icon}
              />
            }
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featureContents.map((card, _index) => (
              <FeatureCard
                key={card.id}
                title={card.title}
                description={card.description}
                icon={card.icon}
              />
            ))}
          </div>
        </div>
      </section>
  )
}

export default HomeFeature;
