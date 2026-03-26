import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { 
  FileText, 
  Plus, 
  Upload, 
  ChevronRight, 
  MoreHorizontal,
  PieChart,
  CheckCircle,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useNavigate } from 'react-router-dom';

// Mock数据：已有项目列表
const mockProjects = [
  {
    id: 'proj-001',
    name: '星际冒险之旅',
    description: '一部科幻题材的AI短片，讲述人类探索外星文明的故事',
    progress: 68,
    pendingReview: 3,
    createdAt: '2026-03-10',
    thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=sci-fi%20space%20adventure%20landscape%2C%20futuristic%20spacecraft%2C%20nebulas%2C%20stars&sign=e11a1c3db4ecb0a03704221ecb6fd8e9'
  },
  {
    id: 'proj-002',
    name: '奇幻森林',
    description: '一部奇幻题材的短片，描绘了一个充满魔法生物的神秘森林',
    progress: 42,
    pendingReview: 5,
    createdAt: '2026-03-15',
    thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=fantasy%20forest%20with%20magic%20creatures%2C%20lush%20greenery%2C%20sunlight%20through%20trees&sign=797d41de0da6d900693d03c85a5be043'
  },
  {
    id: 'proj-003',
    name: '未来城市',
    description: '一部关于未来城市生活的概念短片，展示AI与人类和谐共存的场景',
    progress: 90,
    pendingReview: 1,
    createdAt: '2026-03-05',
    thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=futuristic%20city%20with%20floating%20vehicles%2C%20neon%20lights%2C%20tall%20buildings&sign=e06d2faa91be2cbb4824a81341f2fce5'
  }
];

// 项目进度图表数据
const getProgressChartData = (progress: number) => {
  return [
    { name: '已完成', value: progress },
    { name: '未完成', value: 100 - progress }
  ];
};

// 项目卡片组件
const ProjectCard = ({ project }: { project: typeof mockProjects[0] }) => {
  const navigate = useNavigate();
  
  const handleCardClick = () => {
    navigate(`/project/${project.id}/overview`);
  };

  const handleMoreOptions = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast('项目操作菜单 - 功能开发中');
  };

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 dark:border-gray-700"
      whileHover={{ y: -5 }}
      onClick={handleCardClick}
    >
      <div className="relative h-48">
        <img 
          src={project.thumbnail} 
          alt={project.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4">
          <button 
            onClick={handleMoreOptions}
            className="bg-white/80 dark:bg-gray-800/80 p-2 rounded-full shadow-md hover:bg-white dark:hover:bg-gray-800 transition-colors"
          >
            <MoreHorizontal className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{project.name}</h3>
          <span className="text-sm font-medium px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
            进行中
          </span>
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
          {project.description}
        </p>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-xs text-gray-500 dark:text-gray-400">创建于 {project.createdAt}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            {project.pendingReview > 0 && (
              <div className="flex items-center space-x-1 text-amber-500">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-xs font-medium">{project.pendingReview} 待审核</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">项目进度</span>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{project.progress}%</span>
          </div>
          
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${project.progress}%` }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <motion.button
            className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            whileHover={{ x: 5 }}
          >
            进入项目
            <ChevronRight className="ml-1 w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// 新建项目模态框组件
const NewProjectModal = ({ 
  isOpen, 
  onClose, 
  onSubmit 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSubmit: (name: string) => void; 
}) => {
  const [projectName, setProjectName] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (projectName.trim()) {
      onSubmit(projectName);
      setProjectName('');
      onClose();
    } else {
      toast.error('请输入项目名称');
    }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">新建项目</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  项目名称
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="输入项目名称"
                />
              </div>
              
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                >
                  <Plus className="mr-2 w-4 h-4" />
                  创建项目
                </button>
              </div>
            </form>
            
            <div className="mt-4 text-center">
              <button
                onClick={onClose}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm"
              >
                取消
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// 剧本导入模态框组件
const ImportScriptModal = ({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleImport = () => {
    if (fileInputRef.current?.files && fileInputRef.current.files.length > 0) {
      const file = fileInputRef.current.files[0];
      const validTypes = ['text/plain', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      
      if (validTypes.includes(file.type)) {
        toast.success(`已选择文件: ${file.name}`);
        // 这里模拟导入处理
        setTimeout(() => {
          toast.success('剧本导入成功！正在拆解剧本结构...');
          setTimeout(() => {
            toast.success('剧本拆解完成，已生成项目结构');
            onClose();
          }, 2000);
        }, 1000);
      } else {
        toast.error('请选择有效的文件格式 (.txt, .pdf, .docx)');
      }
    } else {
      toast.error('请选择一个文件');
    }
  };
  
  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">导入剧本</h2>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                支持的文件格式：.txt, .pdf, .docx
              </p>
              
              <div 
                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                onClick={handleFileSelect}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.pdf,.docx"
                  className="hidden"
                />
                <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  点击上传剧本文件
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  或拖拽文件到此处
                </p>
              </div>
            </div>
            
            <div className="pt-2 flex space-x-3">
              <button
                onClick={handleImport}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                导入并拆解
              </button>
              <button
                onClick={onClose}
                className="flex-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium py-2 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                取消
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function Home() {
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isImportScriptModalOpen, setIsImportScriptModalOpen] = useState(false);
  const [projects, setProjects] = useState(mockProjects);
  
  const handleCreateProject = (projectName: string) => {
    // 模拟创建新项目
    const newProject = {
      id: `proj-${Date.now()}`,
      name: projectName,
      description: '新项目',
      progress: 0,
      pendingReview: 0,
      createdAt: new Date().toISOString().split('T')[0],
      thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=blank%20canvas%20creative%20project%20concept&sign=7c4e19b972b88796561af3312ef05689'
    };
    
    setProjects([newProject, ...projects]);
    toast.success(`项目 "${projectName}" 创建成功！`);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* 顶部导航 */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h1 className="text-xl font-bold">AIGC制片管理及生成平台</h1>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => setIsImportScriptModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Upload className="mr-2 w-4 h-4" />
              导入剧本
            </button>
            
            <button
              onClick={() => setIsNewProjectModalOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus className="mr-2 w-4 h-4" />
              新建项目
            </button>
          </div>
        </div>
      </header>
      
      {/* 主内容区 */}
      <main className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold mb-2">欢迎使用AIGC制片平台</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            一站式AI短片制作管理解决方案，从剧本导入到最终交付，全流程管控
          </p>
        </div>
        
        {/* 项目列表 */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">已有项目</h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">共 {projects.length} 个项目</span>
          </div>
          
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-10 text-center border border-gray-200 dark:border-gray-700 shadow-sm">
              <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">暂无项目</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">点击"新建项目"或"导入剧本"开始您的创作</p>
              <button
                onClick={() => setIsNewProjectModalOpen(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Plus className="mr-2 w-4 h-4" />
                新建第一个项目
              </button>
            </div>
          )}
        </section>
      </main>
      
      {/* 页脚 */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>AIGC制片管理及生成平台 © 2026 版权所有</p>
        </div>
      </footer>
      
      {/* 模态框 */}
      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        onSubmit={handleCreateProject}
      />
      
      <ImportScriptModal
        isOpen={isImportScriptModalOpen}
        onClose={() => setIsImportScriptModalOpen(false)}
      />
    </div>
  );
}