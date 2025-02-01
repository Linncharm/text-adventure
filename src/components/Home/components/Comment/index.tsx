import React from "react";
import CommentCard from "@/components/Home/components/CommentCard";
import SectionHeader from "@/components/Home/components/SectionHeader";

const HomeComment: React.FC = () => {

  const commentContents = [
    {
      id: 1,
      name: 'comment.content.first.name',
      comment: 'comment.content.first.comment',
      avatar: '/avatar/avatar1.png'
    },
    {
      id: 2,
      name: 'comment.content.second.name',
      comment: 'comment.content.second.comment',
      avatar: '/avatar/avatar2.png'
    },
    {
      id: 3,
      name: 'comment.content.third.name',
      comment: 'comment.content.third.comment',
      avatar: '/avatar/avatar3.png'
    },
    {
      id: 4,
      name: 'comment.content.fourth.name',
      comment: 'comment.content.fourth.comment',
      avatar: '/avatar/avatar4.png'
    },
    {
      id: 5,
      name: 'comment.content.fifth.name',
      comment: 'comment.content.fifth.comment',
      avatar: '/avatar/avatar5.png'
    },
    {
      id: 6,
      name: 'comment.content.sixth.name',
      comment: 'comment.content.sixth.comment',
      avatar: '/avatar/avatar6.png'
    },
    {
      id: 7,
      name: 'comment.content.seventh.name',
      comment: 'comment.content.seventh.comment',
      avatar: '/avatar/avatar7.png'
    },
    {
      id: 8,
      name: 'comment.content.eighth.name',
      comment: 'comment.content.eighth.comment',
      avatar: '/avatar/avatar8.png'
    },
    {
      id: 9,
      name: 'comment.content.ninth.name',
      comment: 'comment.content.ninth.comment',
      avatar: '/avatar/avatar9.png'
    },
  ];

  const commentHeader = {
    icon: '🌟',
    title: 'comment.title',
    subtitle: 'comment.subtitle'
  }

  return (
    <section className="w-full pt-32">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-16">
          {
            <SectionHeader
              title={commentHeader.title}
              subtitle={commentHeader.subtitle}
              icon={commentHeader.icon}
            />
          }
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {
            commentContents.map((comment, _index) => (
              <CommentCard
                key={comment.id}
                name={comment.name}
                comment={comment.comment}
                avatar={comment.avatar}
              />
            ))
          }
        </div>
        </div>
    </section>
  )
}

export default HomeComment;
