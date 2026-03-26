import { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { 
  FileText, 
  Users, 
  Clock, 
  PlusCircle, 
  MoreHorizontal, 
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '@/contexts/authContext';

// 集数据类型定义
interface Episode {
  id: string;
  name: string;
  code: string;
  description: string;
  createdAt: string;
  createdBy: string;
  reviewedBy: string;
  createMethod: '手动创建' | '剧本导入';
  relatedAssets: string[];
}

// Mock数据
const mockEpisodes: Episode[] = [
  {
    id: 'ep-001',
    name: '第一集',
    code: 'EP01',
    description: '故事的开始，介绍主要角色和背景设定',
    createdAt: '2026-03-10 14:30',
    createdBy: '李导演',
    reviewedBy: '王美术',
    createMethod: '剧本导入',
    relatedAssets: ['主角-星际探险家', '太空船-主舰', '神秘星球表面']
  },
  {
    id: 'ep-002',
    name: '第二集',
    code: 'EP02',
    description: '冒险继续，主角们遇到第一个挑战',
    createdAt: '2026-03-12 10:15',
    createdBy: '李导演',
    reviewedBy: '王美术',
    createMethod: '剧本导入',
    relatedAssets: ['主角-星际探险家', '外星生物-智慧种族', '外星村落']
  },
  {
    id: 'ep-003',
    name: '第三集',
    code: 'EP03',
    description: '故事高潮，揭示关键秘密',
    createdAt: '2026-03-15 16:45',
    createdBy: '李导演',
    reviewedBy: '',
    createMethod: '手动创建',
    relatedAssets: ['主角-星际探险家', '太空船-主舰', '太空服-备用款']
  }
];

// 多值标签组件
const MultiValueBadge = ({ items }: { items: string[] }) => {
  if (!items || items.length === 0) {
    return <span className="text-xs text-gray-500 dark:text-gray-400">-</span>;
  }
  
  if (items.length > 3) {
    return (
      <div className="flex flex-wrap gap-1">
        {items.slice(0, 3).map((item, index) => (
          <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
            {item}
          </span>
        ))}
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
          +{items.length - 3}
        </span>
      </div>
    );
  }
  
  return (
    <div className="flex flex-wrap gap-1">
      {items.map((item, index) => (
        <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
          {item}
        </span>
      ))}
    </div>
  );
};

// 创建场次模态框
const CreateSceneModal = ({ 
  isOpen, 
  onClose, 
  episodeId, 
  episodeName,
  onSubmit 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  episodeId: string;
  episodeName: string;
  onSubmit: (scene: { name: string, code: string, description: string }) => void; 
}) => {
  const [sceneName, setSceneName] = useState('');
  const [sceneCode, setSceneCode] = useState('');
  const [sceneDescription, setSceneDescription] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sceneName.trim() && sceneCode.trim()) {
      onSubmit({
        name: sceneName,
        code: sceneCode,
        description: sceneDescription
      });
      onClose();
    } else {
      toast.error('请填写场次名称和代号');
    }
  };
  
  return (
    isOpen && (
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
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">创建场次</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            为 <span className="font-medium text-blue-600 dark:text-blue-400">{episodeName}</span> 创建新场次
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                场次名称
              </label>
              <input
                type="text"
                value={sceneName}
                onChange={(e) => setSceneName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="如：雨夜追逐场"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                场次代号
              </label>
              <input
                type="text"
                value={sceneCode}
                onChange={(e) => setSceneCode(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="如：SC01"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                场次描述
              </label>
              <textarea
                value={sceneDescription}
                onChange={(e) => setSceneDescription(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="详细描述场景内容..."
                rows={3}
              />
            </div>
            
            <div className="pt-2 flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                创建场次
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium py-2 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                取消
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    )
  );
};

const EpisodesList = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const [episodes, setEpisodes] = useState<Episode[]>(mockEpisodes);
  const [isCreateSceneModalOpen, setIsCreateSceneModalOpen] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; episodeId: string } | null>(null);

  // 右键菜单处理
  const handleContextMenu = (e: React.MouseEvent, episode: Episode) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, episodeId: episode.id });
    setSelectedEpisode(episode);
  };

  // 关闭右键菜单
  const closeContextMenu = () => {
    setContextMenu(null);
  };

  // 创建场次
  const handleCreateScene = (e: React.MouseEvent) => {
    e.preventDefault();
    closeContextMenu();
    if (selectedEpisode) {
      setIsCreateSceneModalOpen(true);
    }
  };

  // 处理场次创建提交
  const handleCreateSceneSubmit = (scene: { name: string, code: string, description: string }) => {
    toast.success(`场次 "${scene.name}" 创建成功！`);
    // 实际项目中这里会调用API创建场次
    // 然后跳转到场次列表页
    navigate(`/project/${projectId}/scenes`);
  };

  // 编辑审核人
  const handleEditReviewer = (e: React.MouseEvent, episodeId: string) => {
    e.preventDefault();
    closeContextMenu();
    toast.success(`编辑审核人功能开发中`);
  };

  // 跳转到项目管理的其他页面
  const navigateToManagement = (type: string) => {
    navigate(`/project/${projectId}/${type}`);
  };

  // 跳转到任务制作页面
  const navigateToProduction = (type: string) => {
    navigate(`/project/${projectId}/production/${type}`);
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
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-700 dark:text-gray-300">李导演 (导演)</span>
            </div>
          </div>
        </div>
      </header>
      
      {/* 项目标题栏 */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold">项目管理</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">管理项目的集、场、资产和镜头信息</p>
          </div>
        </div>
      </div>
      
      {/* 项目导航 */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4">
        <div className="container mx-auto overflow-x-auto">
          <nav className="flex space-x-1 py-1">
            <button
              onClick={() => navigateToManagement('overview')}
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <span className="mr-1.5"><FileText className="w-4 h-4" /></span>
              概况
            </button>
            <button
              onClick={() => navigateToManagement('episodes')}
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
            >
              <span className="mr-1.5"><FileText className="w-4 h-4" /></span>
              集清单
            </button>
            <button
              onClick={() => navigateToManagement('scenes')}
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <span className="mr-1.5"><FileText className="w-4 h-4" /></span>
              场清单
            </button>
            <button
              onClick={() => navigateToManagement('assets')}
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <span className="mr-1.5"><FileText className="w-4 h-4" /></span>
              资产任务清单
            </button>
            <button
              onClick={() => navigateToManagement('shots')}
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <span className="mr-1.5"><FileText className="w-4 h-4" /></span>
              镜头清单
            </button>
            <button
              onClick={() => navigateToManagement('tasks')}
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <span className="mr-1.5"><FileText className="w-4 h-4" /></span>
              镜头任务
            </button>
          </nav>
        </div>
      </div>
      
      {/* 主内容区 */}
      <main className="container mx-auto px-4 py-6">
        {/* 页面标题和操作区 */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">集清单</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">管理项目的剧集信息</p>
          </div>
          
          <div className="flex space-x-3">
            <button
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
              onClick={() => toast.success('新建集功能开发中')}
            >
              <PlusCircle className="mr-1.5 w-4 h-4" />
              新建集
            </button>
          </div>
        </div>
        
        {/* 集列表表格 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    集名称
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    集代号
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell"
                  >
                    集描述
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell"
                  >
                    创建时间
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell"
                  >
                    创建人
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell"
                  >
                    审核人
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell"
                  >
                    创建方式
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden xl:table-cell"
                  >
                    关联资产名称
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {episodes.map((episode) => (
                  <tr
                    key={episode.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    onContextMenu={(e) => handleContextMenu(e, episode)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900 dark:text-white">{episode.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {episode.code}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="text-sm text-gray-900 dark:text-white line-clamp-2 max-w-xs">{episode.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                      <div className="flex items-center text-sm text-gray-900 dark:text-white">
                        <Clock className="w-3.5 h-3.5 mr-1.5 text-gray-500 dark:text-gray-400" />
                        {episode.createdAt}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <div className="flex items-center text-sm text-gray-900 dark:text-white">
                        <Users className="w-3.5 h-3.5 mr-1.5 text-gray-500 dark:text-gray-400" />
                        {episode.createdBy}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <div className="flex items-center text-sm text-gray-900 dark:text-white">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-gray-500 dark:text-gray-400" />
                        {episode.reviewedBy || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        {episode.createMethod}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden xl:table-cell">
                      <MultiValueBadge items={episode.relatedAssets} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          // 阻止默认右键菜单并显示自定义右键菜单
                          const rect = e.currentTarget.getBoundingClientRect();
                          setContextMenu({ x: rect.right, y: rect.top, episodeId: episode.id });
                          setSelectedEpisode(episode);
                        }}
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* 分页 */}
          <div className="px-6 py-3 bg-gray-50 dark:bg-gray-900 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  显示 <span className="font-medium">1</span> 到 <span className="font-medium">{episodes.length}</span> 条，共 <span className="font-medium">{episodes.length}</span> 条
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                    disabled
                  >
                    <span className="sr-only">上一页</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-blue-50 dark:bg-blue-900/30 text-sm font-medium text-blue-700 dark:text-blue-300">
                    1
                  </button>
                  <button
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                    disabled
                  >
                    <span className="sr-only">下一页</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
        
        {/* 功能提示 */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">功能提示</h3>
              <div className="mt-2 text-sm text-blue-700 dark:text-blue-400">
                <p>• 右键点击任意集，选择"创建场次"可以为该集添加新的场次。</p>
                <p>• 审核人字段可以直接编辑，设置负责审核该集的人员。</p>
                <p>• 集信息会自动同步到相关的任务制作页面。</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* 页脚 */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>AIGC制片管理及生成平台 © 2026 版权所有</p>
        </div>
      </footer>
      
      {/* 右键菜单 */}
      {contextMenu && (
        <div
          className="fixed z-50 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 py-1"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={closeContextMenu}
        >
          <button
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={handleCreateScene}
          >
            创建场次
          </button>
          <button
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={(e) => handleEditReviewer(e, contextMenu.episodeId)}
          >
            编辑审核人
          </button>
          <button
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => {
              closeContextMenu();
              toast.success('查看详情功能开发中');
            }}
          >
            查看详情
          </button>
        </div>
      )}
      
      {/* 创建场次模态框 */}
      {isCreateSceneModalOpen && selectedEpisode && (
        <CreateSceneModal
          isOpen={isCreateSceneModalOpen}
          onClose={() => setIsCreateSceneModalOpen(false)}
          episodeId={selectedEpisode.id}
          episodeName={selectedEpisode.name}
          onSubmit={handleCreateSceneSubmit}
        />
      )}
    </div>
  );
};

export default EpisodesList;