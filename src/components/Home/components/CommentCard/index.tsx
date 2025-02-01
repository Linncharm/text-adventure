import React from "react";
import { useTranslation } from "react-i18next";

interface CommentCardProps {
  name: string;
  comment: string;
  avatar: string;
}

const CommentCard: React.FC<CommentCardProps> = (props) => {

  const { name, comment, avatar } = props;
  const { t } = useTranslation('home');

  return (
    <div className="bg-white/70 dark:bg-black/20 backdrop-blur-sm rounded-2xl p-8">
      <div className="flex items-center gap-4">
        <img
          src={avatar}
          alt="Player Avatar"
          className="w-12 h-12 rounded-full"
        />
        <div>
          <h3 className="text-xl font-semibold dark:text-gray-200 mb-1">
            {t(name)}
          </h3>
          <p className="text-gray-500 dark:text-gray-300">
            {t(comment)}
          </p>
        </div>
      </div>
    </div>
  )

}

export default CommentCard;
