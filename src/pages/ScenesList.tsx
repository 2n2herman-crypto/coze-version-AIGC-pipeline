import { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { 
  FileText, 
  Users, 
  Clock, 
  PlusCircle, 
  MoreHorizontal, 
  CheckCircle2,
  Layers,
  Image
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '@/contexts/authContext';

// 场数据类型定义
interface Scene {
  id: string;
  name: string;
  code: string;
  description: string;
  createdAt: string;
  createdBy: string;
  reviewedBy: string;
  createMethod: '手动' | '剧本导入' | '集页面创建';
  relatedAssets: string[];
  relatedShots: string[];
  relatedEpisode: string;
}

// Mock数据
const mockScenes: Scene[] = [
  {
    id: 'sc-001',
    name: '太空船内部',
    code: 'SC01',
    description: '主角在太空船内部进行日常维护和准备工作',
    createdAt: '2026-03-10 15:00',
    createdBy: '李导演',
    reviewedBy: '王美术',
    createMethod: '剧本导入',
    relatedAssets: ['太空船-主舰', '主角-星际探险家', '通讯器-wrist型'],
    relatedShots: ['SH01', 'SH02', 'SH03'],
    relatedEpisode: '第一集'
  },
  {
    id: 'sc-002',
    name: '神秘星球表面',
    code: 'SC02',
    description: '主角登陆神秘星球，探索未知的环境和生物',
    createdAt: '2026-03-11 11:30',
    createdBy: '李导演',
    reviewedBy: '王美术',
    createMethod: '剧本导入',
    relatedAssets: ['主角-星际探险家', '神秘星球表面', '外星植物-发光'],
    relatedShots: ['SH04', 'SH05', 'SH06', 'SH07'],
    relatedEpisode: '第一集'
  },
  {
    id: 'sc-003',
    name: '外星村落',
    code: 'SC03',
    description: '主角发现并接触友好的外星智慧生物村落',
    createdAt: '2026-03-13 09:15',
    createdBy: '张小明',
    reviewedBy: '',
    createMethod: '集页面创建',
    relatedAssets: ['外星生物-智慧种族', '外星村落', '外星建筑-圆顶'],
    relatedShots: ['SH10', 'SH11', 'SH12'],
    relatedEpisode: '第二集'
  },
  {
    id: 'sc-004',
    name: '太空船战斗',
    code: 'SC04',
    description: '太空船遭遇未知敌人袭击，展开激烈战斗',
    createdAt: '2026-03-14 14:45',
    createdBy: '李小华',
    reviewedBy: '李导演',
    createMethod: '手动',
    relatedAssets: ['太空船-主舰', '激光枪-标准型', '引擎-脉冲'],
    relatedShots: ['SH15', 'SH16', 'SH17', 'SH18', 'SH19'],
    relatedEpisode: '第三集'
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

// 创建镜头模态框
const CreateShotModal = ({ 
  isOpen, 
  onClose, 
  sceneId, 
  sceneName,
  onSubmit 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  sceneId: string;
  sceneName: string;
  onSubmit: (shot: { name: string, description: string, type: string }) => void; 
}) => {
  const [shotName, setShotName] = useState('');
  const [shotDescription, setShotDescription] = useState('');
  const [shotType, setShotType] = useState('');
  
  const shotTypes = ['特写', '近景', '中景', '全景', '远景', '推镜头', '拉镜头', '摇镜头', '移镜头'];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (shotName.trim() && shotType) {
      onSubmit({
        name: shotName,
        description: shotDescription,
        type: shotType
      });
      onClose();
    } else {
      toast.error('请填写镜头名称和选择镜头类型');
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
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">创建镜头</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            为 <span className="font-medium text-blue-600 dark:text-blue-400">{sceneName}</span> 创建新镜头
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                镜头名称
              </label>
              <input
                type="text"
                value={shotName}
                onChange={(e) => setShotName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="如：特写-主角回头"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                镜头类型
              </label>
              <select
                value={shotType}
                onChange={(e) => setShotType(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">请选择镜头类型</option>
                {shotTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                镜头描述
              </label>
              <textarea
                value={shotDescription}
                onChange={(e) => setShotDescription(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="详细描述镜头内容和运镜方式..."
                rows={3}
              />
            </div>
            
            <div className="pt-2 flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                创建镜头
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

const ScenesList = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const [scenes, setScenes] = useState<Scene[]>(mockScenes);
  const [isCreateShotModalOpen, setIsCreateShotModalOpen] = useState(false);
  const [selectedScene, setSelectedScene] = useState<Scene | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; sceneId: string } | null>(null);

  // 右键菜单处理
  const handleContextMenu = (e: React.MouseEvent, scene: Scene) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, sceneId: scene.id });
    setSelectedScene(scene);
  };

  // 关闭右键菜单
  const closeContextMenu = () => {
    setContextMenu(null);
  };

  // 创建镜头
  const handleCreateShot = (e: React.MouseEvent) => {
    e.preventDefault();
    closeContextMenu();
    if (selectedScene) {
      setIsCreateShotModalOpen(true);
    }
  };

  // 处理镜头创建提交
  const handleCreateShotSubmit = (shot: { name: string, description: string, type: string }) => {
    toast.success(`镜头 "${shot.name}" 创建成功！`);
    // 实际项目中这里会调用API创建镜头
    // 然后跳转到镜头列表页
    navigate(`/project/${projectId}/shots`);
  };

  // 编辑审核人
  const handleEditReviewer = (e: React.MouseEvent, sceneId: string) => {
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
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <span className="mr-1.5"><FileText className="w-4 h-4" /></span>
              集清单
            </button>
            <button
              onClick={() => navigateToManagement('scenes')}
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
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
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">场清单</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">管理项目的场景信息</p>
          </div>
          
          <div className="flex space-x-3">
            <button
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
              onClick={() => toast.success('新建场次功能开发中')}
            >
              <PlusCircle className="mr-1.5 w-4 h-4" />
              新建场次
            </button>
          </div>
        </div>
        
        {/* 场列表表格 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    场次名称
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    场次代号
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell"
                  >
                    场次描述
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell"
                  >
                    所属集
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden xl:table-cell"
                  >
                    关联资产名称
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden xl:table-cell"
                  >
                    关联镜头名称
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
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {scenes.map((scene) => (
                  <tr
                    key={scene.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    onContextMenu={(e) => handleContextMenu(e, scene)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900 dark:text-white">{scene.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {scene.code}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="text-sm text-gray-900 dark:text-white line-clamp-2 max-w-xs">{scene.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                      <div className="flex items-center text-sm text-gray-900 dark:text-white">
                        <FileText className="w-3.5 h-3.5 mr-1.5 text-gray-500 dark:text-gray-400" />
                        {scene.relatedEpisode}
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden xl:table-cell">
                      <MultiValueBadge items={scene.relatedAssets} />
                    </td>
                    <td className="px-6 py-4 hidden xl:table-cell">
                      <MultiValueBadge items={scene.relatedShots} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <div className="flex items-center text-sm text-gray-900 dark:text-white">
                        <Users className="w-3.5 h-3.5 mr-1.5 text-gray-500 dark:text-gray-400" />
                        {scene.createdBy}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <div className="flex items-center text-sm text-gray-900 dark:text-white">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-gray-500 dark:text-gray-400" />
                        {scene.reviewedBy || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          // 阻止默认右键菜单并显示自定义右键菜单
                          const rect = e.currentTarget.getBoundingClientRect();
                          setContextMenu({ x: rect.right, y: rect.top, sceneId: scene.id });
                          setSelectedScene(scene);
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
                  显示 <span className="font-medium">1</span> 到 <span className="font-medium">{scenes.length}</span> 条，共 <span className="font-medium">{scenes.length}</span> 条
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
                <p>• 右键点击任一场次，选择"创建镜头"可以为该场次添加新的镜头。</p>
                <p>• 场次信息会自动关联到相关的资产和镜头任务中。</p>
                <p>• 点击关联资产或镜头可以快速查看详情。</p>
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
            onClick={handleCreateShot}
          >
            创建镜头
          </button>
          <button
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={(e) => handleEditReviewer(e, contextMenu.sceneId)}
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
      
      {/* 创建镜头模态框 */}
      {isCreateShotModalOpen && selectedScene && (
        <CreateShotModal
          isOpen={isCreateShotModalOpen}
          onClose={() => setIsCreateShotModalOpen(false)}
          sceneId={selectedScene.id}
          sceneName={selectedScene.name}
          onSubmit={handleCreateShotSubmit}
        />
      )}
    </div>
  );
};

export default ScenesList;