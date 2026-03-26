import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { 
  ChevronDown, 
  Filter, 
  Search, 
  Plus, 
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
  Download,
  Eye,
  FileText
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

// 定义共享的已完成任务接口
interface BaseCompletedTask {
  id: string;
  code: string;
  name: string;
  description: string;
  status: '已完成' | '已通过' | '已锁定' | '已交付';
  maker: string;
  reviewer: string;
  createdAt: string;
  completedAt: string;
  thumbnail?: string;
}

// 资产已完成任务接口
interface AssetCompletedTask extends BaseCompletedTask {
  type: 'asset';
  assetLevel: 'P0' | 'P1' | 'P2';
  assetType: '角色' | '场景' | '道具' | '服装';
  relatedEpisodes: string[];
  relatedShots: string[];
  tokenUsage: number;
}

// 分镜图已完成任务接口
interface StoryboardCompletedTask extends BaseCompletedTask {
  type: 'storyboard';
  storyboardLevel: 'P0' | 'P1' | 'P2';
  shotType: string;
  relatedEpisode: string;
  relatedShotId: string;
  versionCount: number;
  tokenUsage: number;
}

// 视频已完成任务接口
interface VideoCompletedTask extends BaseCompletedTask {
  type: 'video';
  videoLevel: 'S' | 'A' | 'B';
  videoType: '图生视频' | '文生视频' | '视频转视频' | '口型同步';
  duration: number;
  relatedEpisode: string;
  relatedShotId: string;
  tokenUsage: number;
}

// 统一的已完成任务类型
type CompletedTask = AssetCompletedTask | StoryboardCompletedTask | VideoCompletedTask;

// Mock数据：资产已完成任务
const mockAssetCompletedTasks: AssetCompletedTask[] = [
  {
    id: 'completed-asset-001',
    type: 'asset',
    code: 'ASSET-004',
    name: '神秘星球表面',
    description: '一颗充满未知和神秘感的星球表面，有奇特的地形和植被',
    status: '已通过',
    maker: '王小红',
    reviewer: '王美术',
    createdAt: '2026-03-23 14:20',
    completedAt: '2026-03-24 16:45',
    thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=mysterious%20alien%20planet%20surface%20with%20strange%20terrain%20and%20vegetation&sign=2125340f821380b4a98bafdb5c512b3b',
    assetLevel: 'P1',
    assetType: '场景',
    relatedEpisodes: ['第二集', '第三集'],
    relatedShots: ['SH10', 'SH11', 'SH15', 'SH18'],
    tokenUsage: 3200
  },
  {
    id: 'completed-asset-002',
    type: 'asset',
    code: 'ASSET-006',
    name: '通讯器-wrist型',
    description: '戴在手腕上的通讯设备，具有全息投影功能',
    status: '已完成',
    maker: '李小华',
    reviewer: '王美术',
    createdAt: '2026-03-22 09:30',
    completedAt: '2026-03-23 11:15',
    thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=futuristic%20wrist%20communicator%20with%20holographic%20projection&sign=49a2cb4e09b6d863f0195b5cfa0f9724',
    assetLevel: 'P2',
    assetType: '道具',
    relatedEpisodes: ['第一集', '第二集', '第三集'],
    relatedShots: ['SH01', 'SH03', 'SH05', 'SH08', 'SH12'],
    tokenUsage: 1500
  }
];

// Mock数据：分镜图已完成任务
const mockStoryboardCompletedTasks: StoryboardCompletedTask[] = [
  {
    id: 'completed-sb-001',
    type: 'storyboard',
    code: 'SB-SC01-SH01',
    name: '主角在太空船内部操作控制台',
    description: '主角在太空船内部操作控制台的场景，展现紧张感',
    status: '已锁定',
    maker: '张小明',
    reviewer: '李导演',
    createdAt: '2026-03-22 13:45',
    completedAt: '2026-03-23 15:30',
    thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=spaceship%20control%20room%20interior%20with%20character%20operating%20console&sign=39be9eae44885424dec691e8824bcd8f',
    storyboardLevel: 'P0',
    shotType: '特写',
    relatedEpisode: '第一集',
    relatedShotId: 'SHOT-001',
    versionCount: 3,
    tokenUsage: 2800
  },
  {
    id: 'completed-sb-002',
    type: 'storyboard',
    code: 'SB-SC02-SH11',
    name: '外星村落全景',
    description: '外星村落的全景展示，建筑风格奇特',
    status: '已锁定',
    maker: '李小华',
    reviewer: '王美术',
    createdAt: '2026-03-21 10:15',
    completedAt: '2026-03-22 14:20',
    thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=alien%20village%20with%20unique%20architecture%20full%20view&sign=7baf5859bab344ed7bb84d6bfc27d904',
    storyboardLevel: 'P1',
    shotType: '全景',
    relatedEpisode: '第二集',
    relatedShotId: 'SHOT-011',
    versionCount: 2,
    tokenUsage: 2200
  }
];

// Mock数据：视频已完成任务
const mockVideoCompletedTasks: VideoCompletedTask[] = [
  {
    id: 'completed-vd-001',
    type: 'video',
    code: 'VD-SC03-SH20-V1',
    name: '外星村落的日常生活场景',
    description: '外星村落的日常生活场景，展示外星文明细节',
    status: '已交付',
    maker: '王小红',
    reviewer: '李导演',
    createdAt: '2026-03-20 09:30',
    completedAt: '2026-03-23 16:45',
    thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=alien%20village%20daily%20life%20scene%20showing%20alien%20civilization%20details&sign=4e02599a4e4eac441f1f933c90716928',
    videoLevel: 'B',
    videoType: '文生视频',
    duration: 10.3,
    relatedEpisode: '第二集',
    relatedShotId: 'SHOT-020',
    tokenUsage: 5800
  },
  {
    id: 'completed-vd-002',
    type: 'video',
    code: 'VD-SC01-SH05-V4',
    name: '主预告片核心镜头',
    description: '主预告片核心镜头，展示故事高潮片段',
    status: '已交付',
    maker: '李小华',
    reviewer: '李导演',
    createdAt: '2026-03-18 14:20',
    completedAt: '2026-03-24 16:45',
    thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=movie%20trailer%20key%20shot%20sci-fi%20action%20scene&sign=5890ee525d90f673e5bfa76cc543e2e9',
    videoLevel: 'S',
    videoType: '图生视频',
    duration: 20.0,
    relatedEpisode: '第三集',
    relatedShotId: 'SHOT-005',
    tokenUsage: 12500
  }
];

// 合并所有已完成任务
const mockCompletedTasks: CompletedTask[] = [
  ...mockAssetCompletedTasks,
  ...mockStoryboardCompletedTasks,
  ...mockVideoCompletedTasks
];

// 状态标签组件
const StatusBadge = ({ status }: { status: BaseCompletedTask['status'] }) => {
  const statusConfig = {
    '已完成': { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
    '已通过': { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
    '已锁定': { color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
    '已交付': { color: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200', icon: <CheckCircle2 className="w-3.5 h-3.5" /> }
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
const AssetLevelBadge = ({ level }: { level: 'P0' | 'P1' | 'P2' }) => {
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
const AssetTypeBadge = ({ type }: { type: '角色' | '场景' | '道具' | '服装' }) => {
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

// 预览模态框组件
const PreviewModal = ({ 
  isOpen, 
  onClose, 
  task
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  task: CompletedTask;
}) => {
  // 根据任务类型获取相关图标
  const getTaskIcon = () => {
    switch (task.type) {
      case 'asset':
        return <Layers className="w-5 h-5" />;
      case 'storyboard':
        return <Image className="w-5 h-5" />;
      case 'video':
        return <Film className="w-5 h-5" />;
      default:
        return <Layers className="w-5 h-5" />;
    }
  };
  
  // 渲染任务详情内容
  const renderTaskDetails = () => {
    switch (task.type) {
      case 'asset':
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">资产等级</label>
                <span className="text-sm font-medium">{task.assetLevel}</span>
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">资产类型</label>
                <span className="text-sm font-medium">{task.assetType}</span>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">关联剧集</label>
              <MultiValueBadge items={task.relatedEpisodes} />
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">关联镜头</label>
              <MultiValueBadge items={task.relatedShots} />
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Token消耗</label>
              <span className="text-sm font-medium">{task.tokenUsage}</span>
            </div>
          </div>
        );
      case 'storyboard':
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">分镜等级</label>
                <span className="text-sm font-medium">{task.storyboardLevel}</span>
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">镜头类型</label>
                <span className="text-sm font-medium">{task.shotType}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">关联剧集</label>
                <span className="text-sm font-medium">{task.relatedEpisode}</span>
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">版本数</label>
                <span className="text-sm font-medium">{task.versionCount}</span>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Token消耗</label>
              <span className="text-sm font-medium">{task.tokenUsage}</span>
            </div>
          </div>
        );
      case 'video':
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">视频等级</label>
                <span className="text-sm font-medium">{task.videoLevel}</span>
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">视频类型</label>
                <span className="text-sm font-medium">{task.videoType}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">关联剧集</label>
                <span className="text-sm font-medium">{task.relatedEpisode}</span>
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">时长(秒)</label>
                <span className="text-sm font-medium">{task.duration}</span>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Token消耗</label>
              <span className="text-sm font-medium">{task.tokenUsage}</span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  
  // 渲染预览内容
  const renderPreview = () => {
    if (!task.thumbnail) {
      return (
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-8 flex items-center justify-center h-64">
          <div className="text-center">
            <Image className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              暂无预览图
            </p>
          </div>
        </div>
      );
    }
    
    switch (task.type) {
      case 'video':
        return (
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
            <div className="aspect-video bg-black flex items-center justify-center relative">
              <img 
                src={task.thumbnail} 
                alt={task.name} 
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-2 flex items-center justify-center">
            <img 
              src={task.thumbnail} 
              alt={task.name} 
              className="max-w-full max-h-[300px] object-contain"
            />
          </div>
        );
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
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              <span className="mr-2 text-blue-600 dark:text-blue-400">{getTaskIcon()}</span>
              任务详情 - {task.name}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 左侧：任务详情 */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">任务信息</h3>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-3">
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">任务编号</label>
                    <span className="text-sm font-medium">{task.code}</span>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">任务描述</label>
                    <p className="text-sm text-gray-900 dark:text-white">{task.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">制作人</label>
                      <div className="flex items-center text-sm">
                        <User className="w-3.5 h-3.5 mr-1.5 text-gray-500 dark:text-gray-400" />
                        {task.maker}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">审核人</label>
                      <div className="flex items-center text-sm">
                        <Users className="w-3.5 h-3.5 mr-1.5 text-gray-500 dark:text-gray-400" />
                        {task.reviewer}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">创建时间</label>
                      <div className="flex items-center text-sm">
                        <Clock className="w-3.5 h-3.5 mr-1.5 text-gray-500 dark:text-gray-400" />
                        {task.createdAt}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">完成时间</label>
                      <div className="flex items-center text-sm">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-gray-500 dark:text-gray-400" />
                        {task.completedAt}
                      </div>
                    </div>
                  </div>
                  
                  {renderTaskDetails()}
                </div>
              </div>
            </div>
            
            {/* 右侧：预览区 */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">作品预览</h3>
              {renderPreview()}
              
              {/* 操作按钮 */}
              <div className="pt-4">
                <button
                  onClick={() => toast.success('下载功能开发中')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center text-sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  下载文件
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )
  );
};

// 主组件
const CompletedTasks = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<CompletedTask[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<CompletedTask[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState<CompletedTask | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'asset' | 'storyboard' | 'video'>('all');
  const [activeFilters, setActiveFilters] = useState({
    status: '' as BaseCompletedTask['status'] | '',
    type: '' as string | '',
  });
  
  // 加载任务数据
  useEffect(() => {
    // 模拟API请求
    setTasks(mockCompletedTasks);
    setFilteredTasks(mockCompletedTasks);
  }, [projectId]);
  
  // 应用搜索、筛选和标签
  useEffect(() => {
    let result = [...tasks];
    
    // 应用标签筛选
    if (activeTab !== 'all') {
      result = result.filter(task => task.type === activeTab);
    }
    
    // 应用搜索
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        task => 
          task.code.toLowerCase().includes(query) || 
          task.name.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query) ||
          task.maker.toLowerCase().includes(query)
      );
    }
    
    // 应用状态筛选
    if (activeFilters.status) {
      result = result.filter(task => task.status === activeFilters.status);
    }
    
    setFilteredTasks(result);
  }, [tasks, searchQuery, activeFilters, activeTab]);
  
  const handleTaskSelect = (task: CompletedTask) => {
    setSelectedTask(task);
    setIsPreviewModalOpen(true);
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
      type: '',
    });
    setSearchQuery('');
    setActiveTab('all');
  };

  const navItems = [
    { id: 'assets', label: '资产生成任务', icon: <Layers className="w-4 h-4" /> },
    { id: 'storyboards', label: '分镜图生成任务', icon: <Image className="w-4 h-4" /> },
    { id: 'videos', label: '视频生成任务', icon: <Film className="w-4 h-4" /> },
    { id: 'reviews', label: '审核任务', icon: <CheckCircle2 className="w-4 h-4" /> },
    { id: 'completed', label: '已完成任务', icon: <CheckCircle2 className="w-4 h-4" /> },
  ];
  
  // 根据任务类型获取相关图标
  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'asset':
        return <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />;
      case 'storyboard':
        return <Image className="w-4 h-4 text-purple-600 dark:text-purple-400 mr-2" />;
      case 'video':
        return <Film className="w-4 h-4 text-green-600 dark:text-green-400 mr-2" />;
      default:
        return <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />;
    }
  };
  
  // 根据任务类型获取相关信息
  const getTaskTypeInfo = (task: CompletedTask) => {
    switch (task.type) {
      case 'asset':
        return (
          <div className="flex items-center space-x-2">
            <AssetLevelBadge level={task.assetLevel} />
            <AssetTypeBadge type={task.assetType} />
          </div>
        );
      case 'storyboard':
        return (
          <div className="flex items-center space-x-2">
            <AssetLevelBadge level={task.storyboardLevel} /><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
              {task.shotType}
            </span>
          </div>
        );
      case 'video':
        return (
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
              {task.videoLevel}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              {task.videoType}
            </span>
          </div>
        );
      default:
        return null;
    }
  };
  
  // 根据任务类型获取相关数据（如时长、版本数、Token消耗）
  const getTaskMetaInfo = (task: CompletedTask) => {
    switch (task.type) {
      case 'storyboard':
        return (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            版本数: {task.versionCount} | Token: {task.tokenUsage}
          </div>
        );
      case 'video':
        return (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            时长: {task.duration}秒 | Token: {task.tokenUsage}
          </div>
        );
      case 'asset':
        return (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Token: {task.tokenUsage}
          </div>
        );
      default:
        return null;
    }
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
                  item.id === 'completed' 
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
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">已完成任务</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">查看所有已完成的资产生成、分镜图和视频任务</p>
          </div>
          
          <div className="flex space-x-3">
            {/* 标签页切换 */}
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                  activeTab === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                onClick={() => setActiveTab('all')}
              >
                全部
              </button>
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === 'asset'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                onClick={() => setActiveTab('asset')}
              >
                资产
              </button>
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === 'storyboard'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                onClick={() => setActiveTab('storyboard')}
              >
                分镜
              </button>
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                  activeTab === 'video'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                onClick={() => setActiveTab('video')}
              >
                视频
              </button>
            </div>
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
                placeholder="搜索任务编号、名称、制作人..."
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
                  <option value="已完成">已完成</option>
                  <option value="已通过">已通过</option>
                  <option value="已锁定">已锁定</option>
                  <option value="已交付">已交付</option>
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
                    任务名称
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell"
                  >
                    任务类型
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
                    相关信息
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell"
                  >
                    完成时间
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
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => handleTaskSelect(task)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getTaskIcon(task.type)}
                          <div className="ml-1">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {task.name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">
                              {task.code}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        {getTaskTypeInfo(task)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={task.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                        <div className="flex items-center text-sm text-gray-900 dark:text-white">
                          <User className="w-3.5 h-3.5 mr-1.5 text-gray-500 dark:text-gray-400" />
                          {task.maker}
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        {getTaskMetaInfo(task)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                        <div className="text-sm text-gray-900 dark:text-white">{task.completedAt}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTaskSelect(task);
                          }}
                          className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                        >
                          <Eye className="w-4 h-4 mr-1.5" />
                          查看详情
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                      <div className="flex flex-col items-center">
                        <CheckCircle2 className="w-10 h-10 mb-2 text-gray-300 dark:text-gray-600" />
                        <p>暂无已完成任务</p>
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
      
      {/* 预览模态框 */}
      {isPreviewModalOpen && selectedTask && (
        <PreviewModal 
          isOpen={isPreviewModalOpen}
          onClose={() => setIsPreviewModalOpen(false)}
          task={selectedTask}
        />
      )}
    </div>
  );
};

export default CompletedTasks;