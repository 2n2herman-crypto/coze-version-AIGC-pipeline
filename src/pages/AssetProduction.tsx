import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { 
  ChevronDown, 
  Filter, 
  Search, 
  Plus, 
  Edit, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  User, 
  Users, 
  Layers, 
  Film, 
  Image,
  MoreHorizontal,
  ChevronRight,
  Upload,
  FileText
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

// 资产生成任务类型定义
interface AssetTask {
  id: string;
  name: string;
  level: 'P0' | 'P1' | 'P2';
  description: string;
  type: '角色' | '场景' | '道具' | '服装';
  episodes: string[];
  shots: string[];
  relatedAssets: string[];
  status: '待制作' | '制作中' | '待审核' | '已通过' | '已驳回' | '已废弃';
  maker: string;
  reviewer: string;
}

// Mock数据：资产生成任务列表
const mockAssetTasks: AssetTask[] = [
  {
    id: 'asset-001',
    name: '主角-星际探险家',
    level: 'P0',
    description: '一位勇敢的星际探险家，身着未来科技感十足的太空服',
    type: '角色',
    episodes: ['第一集', '第二集', '第三集'],
    shots: ['SH01', 'SH02', 'SH05'],
    relatedAssets: ['头盔-探险家', '太空服-未来科技'],
    status: '待制作',
    maker: '张小明',
    reviewer: '李导演'
  },
  {
    id: 'asset-002',
    name: '外星生物-智慧种族',
    level: 'P0',
    description: '友好的外星智慧生物，拥有独特的生理特征和文化',
    type: '角色',
    episodes: ['第二集', '第三集'],
    shots: ['SH10', 'SH15', 'SH20'],
    relatedAssets: [],
    status: '制作中',
    maker: '王小红',
    reviewer: '李导演'
  },
  {
    id: 'asset-003',
    name: '太空船-主舰',
    level: 'P0',
    description: '主角的主要交通工具，具有流线型设计和先进的科技感',
    type: '场景',
    episodes: ['第一集', '第二集', '第三集'],
    shots: ['SH01', 'SH03', 'SH07', 'SH12'],
    relatedAssets: ['引擎-脉冲', '驾驶舱-未来'],
    status: '待审核',
    maker: '张小明',
    reviewer: '王美术'
  },
  {
    id: 'asset-004',
    name: '神秘星球表面',
    level: 'P1',
    description: '一颗充满未知和神秘感的星球表面，有奇特的地形和植被',
    type: '场景',
    episodes: ['第二集', '第三集'],
    shots: ['SH10', 'SH11', 'SH15', 'SH18'],
    relatedAssets: ['外星植物-发光', '岩石-奇异纹理'],
    status: '已通过',
    maker: '王小红',
    reviewer: '王美术'
  },
  {
    id: 'asset-005',
    name: '激光枪-标准型',
    level: 'P1',
    description: '星际探险中使用的标准武器，具有未来感的设计和蓝色激光效果',
    type: '道具',
    episodes: ['第一集', '第二集'],
    shots: ['SH02', 'SH04', 'SH06'],
    relatedAssets: [],
    status: '已驳回',
    maker: '李小华',
    reviewer: '李导演'
  },
  {
    id: 'asset-006',
    name: '通讯器- wrist型',
    level: 'P2',
    description: '戴在手腕上的通讯设备，具有全息投影功能',
    type: '道具',
    episodes: ['第一集', '第二集', '第三集'],
    shots: ['SH01', 'SH03', 'SH05', 'SH08', 'SH12'],
    relatedAssets: [],
    status: '已废弃',
    maker: '李小华',
    reviewer: '王美术'
  },
  {
    id: 'asset-007',
    name: '太空服-备用款',
    level: 'P2',
    description: '备用的太空服设计，与主太空服风格一致但有颜色差异',
    type: '服装',
    episodes: ['第三集'],
    shots: ['SH20', 'SH22'],
    relatedAssets: ['头盔-备用'],
    status: '待制作',
    maker: '张小明',
    reviewer: '王美术'
  },
  {
    id: 'asset-008',
    name: '外星村落',
    level: 'P1',
    description: '外星智慧生物的居住地，建筑风格独特，与自然环境融为一体',
    type: '场景',
    episodes: ['第二集', '第三集'],
    shots: ['SH15', 'SH16', 'SH17', 'SH19'],
    relatedAssets: ['外星建筑-圆顶', '外星植物-大型'],
    status: '制作中',
    maker: '王小红',
    reviewer: '李导演'
  }
];

// 状态标签组件
const StatusBadge = ({ status }: { status: AssetTask['status'] }) => {
  const statusConfig = {
    '待制作': { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', icon: <Clock className="w-3.5 h-3.5" /> },
    '制作中': { color: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200', icon: <Clock className="w-3.5 h-3.5" /> },
    '待审核': { color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
    '已通过': { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
    '已驳回': { color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
    '已废弃': { color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200', icon: <AlertTriangle className="w-3.5 h-3.5" /> }
  };

  const config = statusConfig[status];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.icon}
      <span className="ml-1">{status}</span>
    </span>
  );
};

// 资产等级标签组件
const LevelBadge = ({ level }: { level: AssetTask['level'] }) => {
  const levelConfig = {
    'P0': { color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', label: 'P0-核心资产' },
    'P1': { color: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200', label: 'P1-重要' },
    'P2': { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', label: 'P2-普通' }
  };

  const config = levelConfig[level];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
};

// 资产类型标签组件
const TypeBadge = ({ type }: { type: AssetTask['type'] }) => {
  const typeConfig = {
    '角色': { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
    '场景': { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
    '道具': { color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
    '服装': { color: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200' }
  };

  const config = typeConfig[type];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {type}
    </span>
  );
};

// 多值标签组件（用于显示关联集、镜头等）
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

// 资产生成任务操作页组件
const AssetCreationPage = ({ taskId, onClose }: { taskId: string, onClose: () => void }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [historyVersions, setHistoryVersions] = useState<Array<{
    id: string;
    version: number;
    thumbnail: string;
    createdAt: string;
  }>>([]);
  
  // 模拟已生成的历史版本
  const mockHistoryVersions = [
    {
      id: 'v1',
      version: 1,
      thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=sci-fi%20space%20explorer%20character%20design%20version%201&sign=e10b9d6d344c077f0ef5056b0dbad28f',
      createdAt: '2026-03-25 10:30'
    },
    {
      id: 'v2',
      version: 2,
      thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=sci-fi%20space%20explorer%20character%20design%20version%202&sign=2615b264f91e663671e289bd6a1cf4ea',
      createdAt: '2026-03-25 11:15'
    }
  ];
  
  useEffect(() => {
    // 模拟加载任务数据
    setHistoryVersions(mockHistoryVersions);
  }, [taskId]);
  
  const handleGenerate = () => {
    setIsGenerating(true);
    
    // 模拟生成过程
    setTimeout(() => {
      const newVersion = {
        id: `v${historyVersions.length + 1}`,
        version: historyVersions.length + 1,
        thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=sci-fi%20space%20explorer%20character%20design%20new%20version&sign=43f94dba595f6709fe64246fe5c5041b',
        createdAt: new Date().toLocaleString('zh-CN')
      };
      
      setHistoryVersions([newVersion, ...historyVersions]);
      setPreviewImage(newVersion.thumbnail);
      setSelectedVersion(newVersion.id);
      setIsGenerating(false);
      
      toast.success('资产生成成功！');
    }, 2000);
  };
  
  const handlePublish = () => {
    if (!selectedVersion) {
      toast.error('请先选择一个版本进行发布');
      return;
    }
    
    toast.success('资产已提交审核！');
    setTimeout(() => {
      onClose();
    }, 1000);
  };
  
  const handleSubAssetGenerate = () => {
    toast.success('子资产生成任务已创建，将伴随主资产一起生成');
  };
  
  const handleVersionSelect = (versionId: string, thumbnail: string) => {
    setSelectedVersion(versionId);
    setPreviewImage(thumbnail);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 h-full flex flex-col"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">资产生成操作</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 左侧输入区 */}
        <div className="space-y-4 overflow-y-auto p-2">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">输入设置</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                参考图上传
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  点击上传或拖拽文件到此处
                </p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                资产引用
              </label>
              <select className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
                <option value="">选择已有资产作为风格参考</option>
                <option value="asset-003">太空船-主舰</option>
                <option value="asset-004">神秘星球表面</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                文本描述
              </label>
              <textarea
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm h-24"
                placeholder="详细描述您想要生成的资产..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                视图选择
              </label>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center space-x-2 p-2 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">左视图</span>
                </label>
                <label className="flex items-center space-x-2 p-2 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">右视图</span>
                </label>
                <label className="flex items-center space-x-2 p-2 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">后视图</span>
                </label>
                <label className="flex items-center space-x-2 p-2 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">俯视图</span>
                </label>
              </div>
            </div>
          </div>
          
          <div className="pt-4 flex space-x-3">
            <button
              onClick={handleSubAssetGenerate}
              className="flex-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium py-2 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
            >
              子资产生成
            </button>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center text-sm"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  生成中...
                </>
              ) : (
                '生成'
              )}
            </button>
          </div>
        </div>
        
        {/* 中间画布区 */}
        <div className="flex flex-col">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">预览区</h3>
          <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
            {previewImage ? (
              <img 
                src={previewImage} 
                alt="资产预览" 
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <div className="text-center p-8">
                <Image className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  生成后将在此处显示资产预览图
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* 右侧结果区 */}
        <div className="space-y-4 overflow-hidden flex flex-col">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">历史版本</h3>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-3">
            {historyVersions.length > 0 ? (
              historyVersions.map((version) => (
                <div 
                  key={version.id}
                  onClick={() => handleVersionSelect(version.id, version.thumbnail)}
                  className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedVersion === version.id 
                      ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800' 
                      : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedVersion === version.id}
                    onChange={() => handleVersionSelect(version.id, version.thumbnail)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <img 
                    src={version.thumbnail} 
                    alt={`版本 ${version.version}`} 
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        版本 {version.version}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {version.createdAt}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-6 text-sm text-gray-500 dark:text-gray-400">
                暂无历史版本
              </div>
            )}
          </div>
          
          <div className="pt-2">
             <div className="flex space-x-2">
              <button
                onClick={handlePublish}
                disabled={!selectedVersion}
                className={`flex-1 font-medium py-2 px-4 rounded-lg transition-colors text-sm ${
                  selectedVersion 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                发布审核
              </button>
               {/* 下一个任务按钮 - 由于缺少必要的上下文数据，暂时禁用此功能 */}
               <button
                 disabled={true}
                 className="flex-1 font-medium py-2 px-4 rounded-lg transition-colors text-sm bg-gray-300 text-gray-500 cursor-not-allowed"
               >
                 下一个
               </button>
            </div>
           </div>
         </div>
       </div>
     </motion.div>
   );
  }
  
  // 资产创建页面组件已经包含了 handleNextTask 函数
  // 此处为避免重复定义，已移除

// 主组件
const AssetProduction = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<AssetTask[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<AssetTask[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState<AssetTask | null>(null);
  const [isCreationPageOpen, setIsCreationPageOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    status: '' as AssetTask['status'] | '',
    level: '' as AssetTask['level'] | '',
    type: '' as AssetTask['type'] | '',
  });
  
  // 加载任务数据
  useEffect(() => {
    // 模拟API请求
    setTasks(mockAssetTasks);
    setFilteredTasks(mockAssetTasks);
  }, [projectId]);
  
  // 应用搜索和筛选
  useEffect(() => {
    let result = [...tasks];
    
    // 应用搜索
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        task => 
          task.name.toLowerCase().includes(query) || 
          task.description.toLowerCase().includes(query) ||
          task.maker.toLowerCase().includes(query) ||
          task.reviewer.toLowerCase().includes(query)
      );
    }
    
    // 应用筛选
    if (activeFilters.status) {
      result = result.filter(task => task.status === activeFilters.status);
    }
    
    if (activeFilters.level) {
      result = result.filter(task => task.level === activeFilters.level);
    }
    
    if (activeFilters.type) {
      result = result.filter(task => task.type === activeFilters.type);
    }
    
    setFilteredTasks(result);
  }, [tasks, searchQuery, activeFilters]);
  
  const handleTaskSelect = (task: AssetTask) => {
    setSelectedTask(task);
  };
  
  const handleCreateTask = () => {
    toast.success('新资产任务创建成功！');
  };
  
  const handleMakeTask = () => {
    if (!selectedTask) {
      toast.error('请先选择一个任务');
      return;
    }
    
    setIsCreationPageOpen(true);
  };
  
  const handleFilterChange = (filterType: keyof typeof activeFilters, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };
  
  const handleClearFilters = () => {
    setActiveFilters({
      status: '',
      level: '',
      type: '',
    });
    setSearchQuery('');
  };
  
  const handleTaskAction = (action: string, taskId: string) => {
    toast(`${action} - 任务ID: ${taskId}`);
  };

  const renderTaskActions = (task: AssetTask) => {
    return (
      <button
        className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        onClick={() => handleTaskAction('更多操作', task.id)}
      >
        <MoreHorizontal className="w-5 h-5" />
      </button>
    );
  };

  const navItems = [
    { id: 'assets', label: '资产生成任务', icon: <Layers className="w-4 h-4" /> },
    { id: 'storyboards', label: '分镜图生成任务', icon: <Image className="w-4 h-4" /> },
    { id: 'videos', label: '视频生成任务', icon: <Film className="w-4 h-4" /> },
    { id: 'reviews', label: '审核任务', icon: <CheckCircle2 className="w-4 h-4" /> },
    { id: 'completed', label: '已完成任务', icon: <CheckCircle2 className="w-4 h-4" /> },
  ];
  
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
              <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-700 dark:text-gray-300">张小明 (AI艺术家)</span>
            </div>
          </div>
        </div>
      </header>
      
      {/* 项目导航 */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4">
        <div className="container mx-auto overflow-x-auto">
          <nav className="flex space-x-1 py-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  item.id === 'assets' 
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                onClick={() => navigate(`/project/${projectId}/production/${item.id}`)}
              >
                <span className="mr-1.5">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
      
      {/* 主内容区 */}
      <main className="container mx-auto px-4 py-6">
        {/* 页面标题和操作区 */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">资产生成任务</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">管理和执行资产生成相关任务</p>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleCreateTask}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
            >
              <Plus className="mr-1.5 w-4 h-4" />
              新建资产任务
            </button>
            
            <button
              onClick={handleMakeTask}
              disabled={!selectedTask}
              className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors text-sm ${
                selectedTask 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Edit className="mr-1.5 w-4 h-4" />
              制作任务
            </button>
          </div>
        </div>
        
        {/* 搜索和筛选区 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="搜索资产名称、描述、制作人..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            
            <div className="flex flex-wrap items-center space-x-2">
              <div className="relative">
                <select
                  value={activeFilters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="appearance-none block w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm pr-8"
                >
                  <option value="">全部状态</option>
                  <option value="待制作">待制作</option>
                  <option value="制作中">制作中</option>
                  <option value="待审核">待审核</option>
                  <option value="已通过">已通过</option>
                  <option value="已驳回">已驳回</option>
                  <option value="已废弃">已废弃</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              
              <div className="relative">
                <select
                  value={activeFilters.level}
                  onChange={(e) => handleFilterChange('level', e.target.value)}
                  className="appearance-none block w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm pr-8"
                >
                  <option value="">全部等级</option>
                  <option value="P0">P0-核心资产</option>
                  <option value="P1">P1-重要</option>
                  <option value="P2">P2-普通</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              
              <div className="relative">
                <select
                  value={activeFilters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="appearance-none block w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm pr-8"
                >
                  <option value="">全部类型</option>
                  <option value="角色">角色</option>
                  <option value="场景">场景</option>
                  <option value="道具">道具</option>
                  <option value="服装">服装</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              
              {Object.values(activeFilters).some(Boolean) && (
                <button
                  onClick={handleClearFilters}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                >
                  清除筛选
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* 任务列表 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    资产名称
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    资产等级
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell"
                  >
                    资产类型
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
                    关联镜头
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    任务状态
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell"
                  >
                    制作人
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell"
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
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
                    <tr
                      key={task.id}
                      className={`cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                        selectedTask?.id === task.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}
                      onClick={() => handleTaskSelect(task)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {task.name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">
                              {task.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <LevelBadge level={task.level} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                        <TypeBadge type={task.type} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                        <MultiValueBadge items={task.episodes} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                        <MultiValueBadge items={task.shots} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={task.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                        <div className="flex items-center text-sm text-gray-900 dark:text-white">
                          <User className="w-3.5 h-3.5 mr-1.5 text-gray-500 dark:text-gray-400" />
                          {task.maker}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                        <div className="flex items-center text-sm text-gray-900 dark:text-white">
                          <Users className="w-3.5 h-3.5 mr-1.5 text-gray-500 dark:text-gray-400" />
                          {task.reviewer}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTaskAction('更多操作', task.id);
                          }}
                          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                      <div className="flex flex-col items-center">
                        <Layers className="w-10 h-10 mb-2 text-gray-300 dark:text-gray-600" />
                        <p>暂无符合条件的资产生成任务</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* 分页 */}
          <div className="px-6 py-3 bg-gray-50 dark:bg-gray-900 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  显示 <span className="font-medium">1</span> 到 <span className="font-medium">{filteredTasks.length}</span> 条，共 <span className="font-medium">{tasks.length}</span> 条
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
      </main>
      
      {/* 资产生成操作页模态框 */}
      {isCreationPageOpen && selectedTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <AssetCreationPage 
              taskId={selectedTask.id}
              onClose={() => setIsCreationPageOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetProduction;