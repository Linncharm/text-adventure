import { GetServerSideProps } from 'next'
import {useRef, useState} from 'react'
  import Image from 'next/image'
import { useRouter } from 'next/router'
import { deleteCookie } from 'cookies-next'

interface UserProfile {
  id: string
  username: string
  avatar: string
  bio: string
  tags: string[]
  createdScenarios: number
  completedAdventures: number
  favorites: number
}

interface ProfilePageProps {
  user: UserProfile
}

// import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
//
// export const getServerSideProps: GetServerSideProps = async (context) => {
//   try {
//     // 创建服务端 Supabase 客户端
//     const supabase = createServerSupabaseClient(context)
//
//     // 获取当前会话
//     const {
//       data: { session },
//       error: sessionError,
//     } = await supabase.auth.getSession()
//
//     console.log('session:', session)
//     console.log('sessionError:', sessionError)
//
//     // if (sessionError || !session) {
//     //   return {
//     //     redirect: {
//     //       destination: '/login',
//     //       permanent: false,
//     //     },
//     //   }
//     // }
//
//     // 获取用户资料
//     const { data: userProfile, error: profileError } = await supabase
//       .from('user_profiles')
//       .select('*')
//       .eq('user_id', session.user.id)
//       .single()
//
//     if (profileError) {
//       console.error('获取用户资料失败:', profileError)
//       throw profileError
//     }
//
//     // 返回用户数据
//     return {
//       props: {
//         user: {
//           ...userProfile,
//           email: session.user.email
//         }
//       }
//     }
//   } catch (error) {
//     console.error('服务端错误:', error)
//     // 如果出错，返回基本用户数据结构，而不是重定向
//     return {
//       props: {
//         user: {
//           id: '',
//           username: '',
//           avatar: '',
//           bio: '',
//           tags: [],
//           createdScenarios: 0,
//           completedAdventures: 0,
//           favorites: 0
//         }
//       }
//     }
//   }
// }

const ProfilePage = ()=> {
  const user:UserProfile = {
    id: '1',
    username: 'test',
    avatar: '/avatar/avatar1.png',
    bio: '这个冒险家还没有留下自我介绍~',
    tags: ['冒险', '探险', '游戏'],
    createdScenarios: 0,
    completedAdventures: 0,
    favorites: 0
  }
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      // 清除cookie
      deleteCookie('token')
      console.log('delete cookie')
      // 重定向到登录页
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pt-20 pb-8"> {/* 添加 pt-20 顶部间距 */}
      <div className="max-w-4xl mx-auto px-4">
        {/* 个人信息卡片 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* 顶部封面区域 */}
          <div className="h-32 bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600"/>

          {/* 个人信息区域 */}
          <div className="relative px-6 pb-6">
            {/* 头像 */}
            <div className="absolute -top-16 left-6">
              <div className="relative inline-block">
                {/* 外层白色圆形边框 */}
                <div className="w-32 h-32 rounded-full bg-white dark:bg-gray-800">
                  {/* 图片容器 */}
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <Image
                      src={user.avatar || '/default-avatar.png'}
                      alt={user.username}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover rounded-full"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 用户信息 */}
            <div className="pt-20">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {user.username}
                  </h1>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    {user.bio || '这个冒险家还没有留下自我介绍~'}
                  </p>
                </div>

                {/* 操作按钮 */}
                <div className="space-x-3">
                  <button
                    onClick={() => router.push('/profile/edit')}
                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 transition"
                  >
                    编辑资料
                  </button>
                  <button
                    onClick={handleLogout}
                    disabled={isLoading}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition"
                  >
                    {isLoading ? '退出中...' : '退出登录'}
                  </button>
                </div>
              </div>

              {/* 标签区域 */}
              <div className="mt-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  个人标签
                </h2>
                <div className="flex flex-wrap gap-2">
                  {user.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* 统计数据 */}
              <div className="mt-8 grid grid-cols-3 gap-4">
                <StatsCard
                  title="创建的场景"
                  value={user.createdScenarios}
                  icon="📝"
                />
                <StatsCard
                  title="完成的冒险"
                  value={user.completedAdventures}
                  icon="🎯"
                />
                <StatsCard
                  title="收藏数"
                  value={user.favorites}
                  icon="⭐"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface StatsCardProps {
  title: string
  value: number
  icon: string
}

function StatsCard({title, value, icon}: StatsCardProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex items-center space-x-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
