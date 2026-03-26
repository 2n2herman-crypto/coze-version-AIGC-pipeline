import { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { 
  FileText, 
  Users, 
  Clock, 
  PlusCircle, 
  MoreHorizontal, 
  Image
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '@/contexts/authContext';

// 镜头数据类型定义
interface Shot {
  id: string;
  name: string;
  description: string;
  type: '特写' | '近景' | '中景' | '全景' | '远景' | '推镜头' | '拉镜头' | '摇镜头' | '移镜头';
  episodes: string[];
  scenes: string[];
  assets: string[];
}

// Mock数据
const mockShots: Shot[] = [
  {
    id: 'shot-001',
    name: '特写-主角回头',
    description: '镜头从主角背后缓缓推进，最终定格在主角回头的表情上',
    type: '特写',
    episodes: ['第一集'],
    scenes: ['太空船内部'],
    assets: ['主角-星际探险家', '太空船-主舰']
  },
  {
    id: 'shot-002',
    name: '全景-神秘星球',
    description: '从太空俯瞰神秘星球，展示整个星球的地形地貌',
    type: '全景',
    episodes: ['第一集'],
    scenes: ['神秘星球表面'],
    assets: ['神秘星球表面', '太空船-主舰']
  },
  {
    id: 'shot-003',
    name: '推镜头-外星生物',
    description: '镜头从远处推向外星生物，逐渐清晰展示其外貌特征',
    type: '推镜头',
    episodes: ['第二集'],
    scenes: ['外星村落'],
    assets: ['外星生物-智慧种族', '外星村落']
  },
  {
    id: 'shot-004',
    name: '摇镜头-外星村落全景',
    description: '镜头从左到右摇动，展示整个外星村落的布局和建筑风格',
    type: '摇镜头',
    episodes: ['第二集'],
    scenes: ['外星村落'],
    assets: ['外星村落', '外星建筑-圆顶', '外星生物-智慧种族']
  },
  {
    id: 'shot-005',
    name: '近景-主角对话',
    description: '近景拍摄主角与外星生物的对话场景，重点展示表情交流',
    type: '近景',
    episodes: ['第二集'],
    scenes: ['外星村落'],
    assets: ['主角-星际探险家', '外星生物-智慧种族']
  },
  {
    id: 'shot-006',
    name: '远景-太空战斗',
    description: '远景展示太空船之间的激烈战斗场面',
    type: '远景',
    episodes: ['第三集'],
    scenes: ['太空船战斗'],
    assets: ['太空船-主舰', '激光枪-标准型']
  },
  {
    id: 'shot-007',
    name: '移镜头-船舱内景',
    description: '镜头平滑移动，展示太空船内部的各个功能区域',
    type: '移镜头',
    episodes: ['第一集', '第三集'],
    scenes: ['太空船内部'],
    assets: ['太空船-主舰', '主角-星际探险家', '通讯器-wrist型']
  },
  {
    id: 'shot-008',
    name: '中景-主角操作控制台',
    description: '中景展示主角在太空船控制台前操作的场景',
    type: '中景',
    episodes: ['第一集', '第三集'],
    scenes: ['太空船内部'],
    assets: ['主角-星际探险家', '太空船-主舰']
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

// 镜头类型标签组件
const TypeBadge = ({ type }: { type: Shot['type'] }) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case '特写':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case '近景':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case '中景':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      case '全景':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case '远景':
        return 'bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-200';
      case '推镜头':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case '拉镜头':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200';
      case '摇镜头':
        return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200';
      case '移镜头':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(type)}`}>
      {type}
    </span>
  );
};

// 创建镜头任务模态框
const CreateShotTaskModal = ({ 
  isOpen, 
  onClose, 
  shot,
  onSubmit 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  shot: Shot;
  onSubmit: (taskTypes: string[]) => void; 
}) => {
  const [selectedTaskTypes, setSelectedTaskTypes] = useState<string[]>([]);
  
  const taskTypes = [
    '分镜图制作',
    '分镜编辑',
    '分镜视频制作',
    '分镜视频编辑',
    '分镜视频超分',
    '视频对口型'
  ];
  
  const handleCheckboxChange = (taskType: string) => {
    setSelectedTaskTypes(prev => 
      prev.includes(taskType)
        ? prev.filter(type => type !== taskType)
        : [...prev, taskType]
    );
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTaskTypes.length > 0) {
      onSubmit(selectedTaskTypes);
      onClose();
    } else {
      toast.error('请至少选择一种任务类型');
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
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">创建镜头任务</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            为 <span className="font-medium text-blue-600 dark:text-blue-400">{shot.name}</span> 创建任务
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                选择任务类型（可多选）
              </label>
              <div className="space-y-2">
                {taskTypes.map((type) => (
                  <label key={type} className="flex items-center space-x-2 p-2 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <input 
                      type="checkbox" 
                      checked={selectedTaskTypes.includes(type)}
                      onChange={() => handleCheckboxChange(type)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{type}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="pt-2 flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                创建任务
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

const ShotsList = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const [shots, setShots] = useState<Shot[]>(mockShots);
  const [isCreateShotTaskModalOpen, setIsCreateShotTaskModalOpen] = useState(false);
  const [selectedShot, setSelectedShot] = useState<Shot | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; shotId: string } | null>(null);

  // 右键菜单处理
  const handleContextMenu = (e: React.MouseEvent, shot: Shot) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, shotId: shot.id });
    setSelectedShot(shot);
  };

  // 关闭右键菜单
  const closeContextMenu = () => {
    setContextMenu(null);
  };

  // 创建镜头任务
  const handleCreateShotTask = (e: React.MouseEvent) => {
    e.preventDefault();
    closeContextMenu();
    if (selectedShot) {
      setIsCreateShotTaskModalOpen(true);
    }
  };

  // 处理镜头任务创建提交
  const handleCreateShotTaskSubmit = (taskTypes: string[]) => {
    toast.success(`${taskTypes.length} 个镜头任务创建成功！`);
    // 实际项目中这里会调用API创建镜头任务
    // 然后跳转到镜头任务列表页
    navigate(`/project/${projectId}/tasks`);
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
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
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
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">镜头清单</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">管理项目的镜头信息</p>
          </div>
          
          <div className="flex space-x-3">
            <button
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
              onClick={() => toast.success('新建镜头功能开发中')}
            >
              <PlusCircle className="mr-1.5 w-4 h-4" />
              新建镜头
            </button>
          </div>
        </div>
        
        {/* 镜头列表表格 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    镜头名称
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    镜头类型
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell"
                  >
                    镜头描述
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell"
                  >
                    关联集
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell"
                  >
                    关联场次
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden xl:table-cell"
                  >
                    关联资产
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
                {shots.map((shot) => (
                  <tr
                    key={shot.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    onContextMenu={(e) => handleContextMenu(e, shot)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Image className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
                        <div className="font-medium text-gray-900 dark:text-white">{shot.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <TypeBadge type={shot.type} />
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="text-sm text-gray-900 dark:text-white line-clamp-2 max-w-xs">{shot.description}</div>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <MultiValueBadge items={shot.episodes} />
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <MultiValueBadge items={shot.scenes} />
                    </td>
                    <td className="px-6 py-4 hidden xl:table-cell">
                      <MultiValueBadge items={shot.assets} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          // 阻止默认右键菜单并显示自定义右键菜单
                          const rect = e.currentTarget.getBoundingClientRect();
                          setContextMenu({ x: rect.right, y: rect.top, shotId: shot.id });
                          setSelectedShot(shot);
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
                  显示 <span className="font-medium">1</span> 到 <span className="font-medium">{shots.length}</span> 条，共 <span className="font-medium">{shots.length}</span> 条
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
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
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
                <p>• 右键点击任意镜头，选择"创建镜头任务"可以为该镜头添加相关的制作任务。</p>
                <p>• 镜头任务会自动继承镜头的基本信息、关联集、关联场次和关联资产。</p>
                <p>• 支持多种任务类型，包括分镜图制作、视频制作、视频编辑等。</p>
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
            onClick={handleCreateShotTask}
          >
            创建镜头任务
          </button>
          <button
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => {
              closeContextMenu();
              toast.success('编辑镜头功能开发中');
            }}
          >
            编辑镜头
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
      
      {/* 创建镜头任务模态框 */}
      {isCreateShotTaskModalOpen && selectedShot && (
        <CreateShotTaskModal
          isOpen={isCreateShotTaskModalOpen}
          onClose={() => setIsCreateShotTaskModalOpen(false)}
          shot={selectedShot}
          onSubmit={handleCreateShotTaskSubmit}
        />
      )}
    </div>
  );
};

export default ShotsList;