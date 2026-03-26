import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  PieChart as PieChartIcon, 
  Film, 
  Image, 
  Layers, 
  CheckCircle2, 
  Users,
  FileText,
  ChevronRight,
  BarChart as BarChartIcon
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { toast } from 'sonner';

// 模拟项目数据
interface ProjectData {
  id: string;
  name: string;
  description: string;
  progress: number;
  pendingReview: number;
  createdAt: string;
  thumbnail: string;
  stats: {
    totalAssets: number;
    completedAssets: number;
    totalStoryboards: number;
    completedStoryboards: number;
    totalVideos: number;
    completedVideos: number;
  };
  members: {
    id: string;
    name: string;
    role: string;
    avatar: string;
  }[];
}

// Mock项目数据
const getMockProjectData = (id: string): ProjectData => {
  const projects: Record<string, ProjectData> = {
    'proj-001': {
      id: 'proj-001',
      name: '星际冒险之旅',
      description: '一部科幻题材的AI短片，讲述人类探索外星文明的故事',
      progress: 68,
      pendingReview: 3,
      createdAt: '2026-03-10',
      thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=sci-fi%20space%20adventure%20landscape%2C%20futuristic%20spacecraft%2C%20nebulas%2C%20stars&sign=e11a1c3db4ecb0a03704221ecb6fd8e9',
      stats: {
        totalAssets: 24,
        completedAssets: 18,
        totalStoryboards: 36,
        completedStoryboards: 25,
        totalVideos: 12,
        completedVideos: 8
      },
      members: [
        { id: 'user-1', name: '李导演', role: '导演', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=director%20male%20asian&sign=b4f3dc923b004417f3e7006d9beaaa63' },
        { id: 'user-2', name: '王美术', role: '美术指导', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=art%20director%20female%20asian&sign=453228198377b9d2c3d375b7b2fdc97b' },
        { id: 'user-3', name: '张小明', role: 'AI艺术家', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=artist%20male%20asian&sign=f24d0adfaf7c7e2e49df8176030ae7ad' },
        { id: 'user-4', name: '李小华', role: 'AI艺术家', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=artist%20female%20asian&sign=1e7f3c8a0b43a542a62bed4e2605c361' }
      ]
    },
    'proj-002': {
      id: 'proj-002',
      name: '奇幻森林',
      description: '一部奇幻题材的短片，描绘了一个充满魔法生物的神秘森林',
      progress: 42,
      pendingReview: 5,
      createdAt: '2026-03-15',
      thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=fantasy%20forest%20with%20magic%20creatures%2C%20lush%20greenery%2C%20sunlight%20through%20trees&sign=797d41de0da6d900693d03c85a5be043',
      stats: {
        totalAssets: 18,
        completedAssets: 8,
        totalStoryboards: 24,
        completedStoryboards: 10,
        totalVideos: 8,
        completedVideos: 3
      },
      members: [
        { id: 'user-1', name: '李导演', role: '导演', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=director%20male%20asian&sign=b4f3dc923b004417f3e7006d9beaaa63' },
        { id: 'user-5', name: '陈美术', role: '美术指导', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=art%20director%20male%20asian&sign=1078e32216af51a65a4fdc17fb2f9067' },
        { id: 'user-3', name: '张小明', role: 'AI艺术家', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=artist%20male%20asian&sign=f24d0adfaf7c7e2e49df8176030ae7ad' }
      ]
    },
    'proj-003': {
      id: 'proj-003',
      name: '未来城市',
      description: '一部关于未来城市生活的概念短片，展示AI与人类和谐共存的场景',
      progress: 90,
      pendingReview: 1,
      createdAt: '2026-03-05',
      thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=futuristic%20city%20with%20floating%20vehicles%2C%20neon%20lights%2C%20tall%20buildings&sign=e06d2faa91be2cbb4824a81341f2fce5',
      stats: {
        totalAssets: 30,
        completedAssets: 28,
        totalStoryboards: 40,
        completedStoryboards: 36,
        totalVideos: 15,
        completedVideos: 14
      },
      members: [
        { id: 'user-6', name: '赵导演', role: '导演', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=director%20female%20asian&sign=3179746eafada053afbd55e7ec1dbe56' },
        { id: 'user-2', name: '王美术', role: '美术指导', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=art%20director%20female%20asian&sign=453228198377b9d2c3d375b7b2fdc97b' },
        { id: 'user-4', name: '李小华', role: 'AI艺术家', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=artist%20female%20asian&sign=1e7f3c8a0b43a542a62bed4e2605c361' },
        { id: 'user-7', name: '刘技术', role: '技术指导', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=technical%20director%20male%20asian&sign=d9d010c4a77bea115d2820d13f1929f6' }
      ]
    }
  };
  
  // 如果找不到指定ID的项目，返回默认项目
  return projects[id] || projects['proj-001'];
};

// 进度图表数据
const getProgressData = (progress: number) => {
  return [
    { name: '已完成', value: progress },
    { name: '未完成', value: 100 - progress }
  ];
};

const COLORS = ['#4f46e5', '#e2e8f0'];

// 项目概览卡片组件
const OverviewCard = ({ title, value, icon, color }: { 
  title: string; 
  value: string; 
  icon: React.ReactNode; 
  color: string;
}) => {
  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </div>
        <div className={`p-2 rounded-lg ${color.replace('text-', 'bg-').replace('600', '100')} ${color} dark:${color.replace('text-', 'bg-').replace('600', '900/30')}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

// 项目成员卡片组件
const TeamMemberCard = ({ member }: { member: { name: string; role: string; avatar: string } }) => {
  return (
    <div className="flex items-center p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      <img 
        src={member.avatar} 
        alt={member.name} 
        className="w-10 h-10 rounded-full mr-3"
      />
      <div>
        <p className="font-medium text-gray-900 dark:text-white">{member.name}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{member.role}</p>
      </div>
    </div>
  );
};

// 功能导航项组件
const FeatureNavItem = ({ 
  title, 
  icon, 
  count, 
  color, 
  isActive = false, 
  onClick 
}: { 
  title: string; 
  icon: React.ReactNode; 
  count: number; 
  color: string;
  isActive?: boolean;
  onClick: () => void;
}) => {
  return (
    <motion.button
      onClick={onClick}
      className={`flex items-center justify-between w-full p-4 rounded-xl border ${
        isActive 
          ? 'border-blue-300 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20' 
          : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
      } shadow-sm transition-all`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center">
        <div className={`p-2 rounded-lg ${color} text-white mr-3`}>
          {icon}
        </div>
        <span className="font-medium">{title}</span>
      </div>
      {count > 0 && (
        <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs px-2 py-1 rounded-full">
          {count}
        </span>
      )}
    </motion.button>
  );
};

const ProjectOverview = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectData>(getMockProjectData(projectId || ''));
  const [progressData, setProgressData] = useState(getProgressData(project.progress));
  
  // 模拟加载项目数据
  useEffect(() => {
    if (projectId) {
      // 模拟API请求延迟
      const timer = setTimeout(() => {
        setProject(getMockProjectData(projectId));
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [projectId]);
  
  // 更新进度图表数据
  useEffect(() => {
    setProgressData(getProgressData(project.progress));
  }, [project.progress]);
  
  // 导航到任务制作页面
  const navigateToProduction = (type: string) => {
    navigate(`/project/${projectId}/production/${type}`);
  };
  
  // 导航到项目管理页面
  const navigateToManagement = (type: string) => {
    navigate(`/project/${projectId}/${type}`);
  };
  
  // 模拟添加成员
  const handleAddMember = () => {
    toast.success('添加成员功能即将上线');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* 顶部导航 */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <img 
                src="https://lf-code-agent.coze.cn/obj/x-ai-cn/351498431490/attachment/image_20260325190829.png" 
                alt="链影" 
                className="w-8 h-8"
              />
              <h1 className="text-xl font-bold">链影</h1>
            </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-700 dark:text-gray-300">张小明 (AI艺术家)</span>
            </div>
          </div>
        </div>
      </header>
      
      {/* 项目标题栏 */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold">{project.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{project.description}</p>
          </div>
          <div className="flex space-x-3 mt-4 md:mt-0">
            <button 
              onClick={() => navigateToProduction('assets')}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Layers className="mr-2 w-4 h-4" />
              开始制作
            </button>
            <button 
              onClick={() => navigateToManagement('assets')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <BarChartIcon className="mr-2 w-4 h-4" />
              项目管理
            </button>
          </div>
        </div>
      </div>
      
      {/* 主内容区 */}
      <main className="container mx-auto px-4 py-6">
        {/* 项目概览 */}
        <section className="mb-8">
          <h3 className="text-lg font-bold mb-4">项目概览</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <OverviewCard 
              title="项目进度" 
              value={`${project.progress}%`} 
              icon={<PieChartIcon className="w-5 h-5" />} 
              color="text-blue-600 dark:text-blue-400" 
            />
            <OverviewCard 
              title="待审核任务" 
              value={project.pendingReview.toString()} 
              icon={<CheckCircle2 className="w-5 h-5" />} 
              color="text-amber-600 dark:text-amber-400" 
            />
            <OverviewCard 
              title="创建日期" 
              value={project.createdAt} 
              icon={<FileText className="w-5 h-5" />} 
              color="text-green-600 dark:text-green-400" 
            />
          </div>
          
          {/* 项目进度图表 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm mt-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="w-full md:w-1/2 mb-6 md:mb-0">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">总体完成度</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={progressData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {progressData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="w-full md:w-1/2">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">任务统计</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">资产生成</span>
                      <span className="text-sm font-medium">{project.stats.completedAssets}/{project.stats.totalAssets}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                      <div 
                        className="h-full bg-blue-600 rounded-full" 
                        style={{ width: `${(project.stats.completedAssets / project.stats.totalAssets) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">分镜图生成</span>
                      <span className="text-sm font-medium">{project.stats.completedStoryboards}/{project.stats.totalStoryboards}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                      <div 
                        className="h-full bg-purple-600 rounded-full" 
                        style={{ width: `${(project.stats.completedStoryboards / project.stats.totalStoryboards) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">视频生成</span>
                      <span className="text-sm font-medium">{project.stats.completedVideos}/{project.stats.totalVideos}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                      <div 
                        className="h-full bg-green-600 rounded-full" 
                        style={{ width: `${(project.stats.completedVideos / project.stats.totalVideos) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* 项目团队 */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">项目团队</h3>
            <button 
              onClick={handleAddMember}
              className="inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
            >
              <Users className="mr-1.5 w-4 h-4" />
              添加成员
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {project.members.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </div>
        </section>
        
        {/* 功能导航 */}
        <section>
          <h3 className="text-lg font-bold mb-4">功能导航</h3>
          
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">任务制作</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <FeatureNavItem 
                title="资产生成任务" 
                icon={<Layers className="w-5 h-5" />} 
                count={8} 
                color="bg-blue-600"
                onClick={() => navigateToProduction('assets')}
              />
              <FeatureNavItem 
                title="分镜图生成任务" 
                icon={<Image className="w-5 h-5" />} 
                count={6} 
                color="bg-purple-600"
                onClick={() => navigateToProduction('storyboards')}
              />
              <FeatureNavItem 
                title="视频生成任务" 
                icon={<Film className="w-5 h-5" />} 
                count={4} 
                color="bg-green-600"
                onClick={() => navigateToProduction('videos')}
              />
              <FeatureNavItem 
                title="审核任务" 
                icon={<CheckCircle2 className="w-5 h-5" />} 
                count={3} 
                color="bg-amber-600"
                onClick={() => navigateToProduction('reviews')}
              />
              <FeatureNavItem 
                title="已完成任务" 
                icon={<CheckCircle2 className="w-5 h-5" />} 
                count={12} 
                color="bg-gray-600"
                onClick={() => navigateToProduction('completed')}
              />
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">项目管理</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <FeatureNavItem 
                title="集清单" 
                icon={<FileText className="w-5 h-5" />} 
                count={3} 
                color="bg-indigo-600"
                onClick={() => navigateToManagement('episodes')}
              />
              <FeatureNavItem 
                title="场清单" 
                icon={<FileText className="w-5 h-5" />} 
                count={12} 
                color="bg-pink-600"
                onClick={() => navigateToManagement('scenes')}
              />
              <FeatureNavItem 
                title="资产任务清单" 
                icon={<Layers className="w-5 h-5" />} 
                count={24} 
                color="bg-cyan-600"
                onClick={() => navigateToManagement('assets')}
              />
              <FeatureNavItem 
                title="镜头清单" 
                icon={<Image className="w-5 h-5" />} 
                count={48} 
                color="bg-emerald-600"
                onClick={() => navigateToManagement('shots')}
              />
              <FeatureNavItem 
                title="镜头任务" 
                icon={<Film className="w-5 h-5" />} 
                count={36} 
                color="bg-rose-600"
                onClick={() => navigateToManagement('tasks')}
              />
            </div>
          </div>
        </section>
      </main>
      
      {/* 页脚 */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>AIGC制片管理及生成平台 © 2026 版权所有</p>
        </div>
      </footer>
    </div>
  );
};

export default ProjectOverview;