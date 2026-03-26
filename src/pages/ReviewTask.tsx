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
  MessageSquare,
  CheckCircle,
  XCircle,
  FileText
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

// 定义共享的审核任务接口
interface BaseReviewTask {
  id: string;
  code: string;
  name: string;
  description: string;
  status: '待审核' | '已通过' | '已驳回';
  maker: string;
  reviewer: string;
  createdAt: string;
  lastUpdated: string;
}

// 资产审核任务接口
interface AssetReviewTask extends BaseReviewTask {
  type: 'asset';
  assetLevel: 'P0' | 'P1' | 'P2';
  assetType: '角色' | '场景' | '道具' | '服装';
  thumbnail: string;
  relatedEpisodes: string[];
  relatedShots: string[];
}

// 分镜图审核任务接口
interface StoryboardReviewTask extends BaseReviewTask {
  type: 'storyboard';
  storyboardLevel: 'P0' | 'P1' | 'P2';
  shotType: string;
  thumbnail: string;
  relatedEpisode: string;
  relatedShotId: string;
  versionCount: number;
}

// 视频审核任务接口
interface VideoReviewTask extends BaseReviewTask {
  type: 'video';
  videoLevel: 'S' | 'A' | 'B';
  videoType: '图生视频' | '文生视频' | '视频转视频' | '口型同步';
  thumbnail: string;
  duration: number;
  relatedEpisode: string;
  relatedShotId: string;
}

// 统一的审核任务类型
type ReviewTask = AssetReviewTask | StoryboardReviewTask | VideoReviewTask;

// Mock数据：资产审核任务
const mockAssetReviewTasks: AssetReviewTask[] = [
  {
    id: 'review-asset-001',
    type: 'asset',
    code: 'ASSET-003',
    name: '太空船-主舰',
    description: '主角的主要交通工具，具有流线型设计和先进的科技感',
    status: '待审核',
    maker: '张小明',
    reviewer: '王美术',
    createdAt: '2026-03-25 10:30',
    lastUpdated: '2026-03-25 10:30',
    assetLevel: 'P0',
    assetType: '场景',
    thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=futuristic%20spaceship%20exterior%20design%20detailed%20sci-fi&sign=c2ae4ee3205b68604221c5d6b91f0213',
    relatedEpisodes: ['第一集', '第二集', '第三集'],
    relatedShots: ['SH01', 'SH03', 'SH07', 'SH12']
  },
  {
    id: 'review-asset-002',
    type: 'asset',
    code: 'ASSET-005',
    name: '激光枪-标准型',
    description: '星际探险中使用的标准武器，具有未来感的设计和蓝色激光效果',
    status: '待审核',
    maker: '李小华',
    reviewer: '李导演',
    createdAt: '2026-03-25 09:15',
    lastUpdated: '2026-03-25 09:15',
    assetLevel: 'P1',
    assetType: '道具',
    thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=futuristic%20laser%20gun%20design%20scifi%20weapon&sign=bdfed5d95692596f5696b9217bf129d1',
    relatedEpisodes: ['第一集', '第二集'],
    relatedShots: ['SH02', 'SH04', 'SH06']
  }
];

// Mock数据：分镜图审核任务
const mockStoryboardReviewTasks: StoryboardReviewTask[] = [
  {
    id: 'review-sb-001',
    type: 'storyboard',
    code: 'SB-SC02-SH10',
    name: '主角与外星生物首次接触',
    description: '主角与外星生物首次接触的场景，充满神秘感',
    status: '待审核',
    maker: '张小明',
    reviewer: '李导演',
    createdAt: '2026-03-25 09:45',
    lastUpdated: '2026-03-25 09:45',
    storyboardLevel: 'P0',
    shotType: '中景',
    thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=sci-fi%20alien%20encounter%20scene%20medium%20shot%20futuristic&sign=587070266aa2a8103923752d1f37e19b',
    relatedEpisode: '第二集',
    relatedShotId: 'SHOT-010',
    versionCount: 3
  },
  {
    id: 'review-sb-002',
    type: 'storyboard',
    code: 'SB-SC01-SH02',
    name: '神秘星球全景',
    description: '从太空俯瞰神秘星球，展示整个星球的地形地貌',
    status: '待审核',
    maker: '王小红',
    reviewer: '王美术',
    createdAt: '2026-03-25 11:30',
    lastUpdated: '2026-03-25 11:30',
    storyboardLevel: 'P0',
    shotType: '全景',
    thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=exoplanet%20panoramic%20view%20from%20space%20scifi&sign=df92638e76fdfd1cbba1d4a94024cc4b',
    relatedEpisode: '第一集',
    relatedShotId: 'SHOT-002',
    versionCount: 2
  }
];

// Mock数据：视频审核任务
const mockVideoReviewTasks: VideoReviewTask[] = [
  {
    id: 'review-vd-001',
    type: 'video',
    code: 'VD-SC02-SH15-V2',
    name: '太空战斗场景',
    description: '太空战斗场景，展示激烈的飞船追逐和武器交火',
    status: '待审核',
    maker: '张小明',
    reviewer: '李导演',
    createdAt: '2026-03-25 10:20',
    lastUpdated: '2026-03-25 10:20',
    videoLevel: 'A',
    videoType: '视频转视频',
    thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=space%20battle%20scene%20spaceships%20fighting%20scifi&sign=c72a1cd1c082a5d3d02eff217311e4fb',
    duration: 15.6,
    relatedEpisode: '第三集',
    relatedShotId: 'SHOT-015'
  },
  {
    id: 'review-vd-002',
    type: 'video',
    code: 'VD-SC01-SH02-V2',
    name: '太空船降落',
    description: '太空船缓缓降落在神秘星球表面的过程，展示星球全貌',
    status: '待审核',
    maker: '王小红',
    reviewer: '李导演',
    createdAt: '2026-03-25 14:00',
    lastUpdated: '2026-03-25 14:00',
    videoLevel: 'S',
    videoType: '图生视频',
    thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=spaceship%20landing%20on%20alien%20planet%20scifi%20scene&sign=26f3fd6fad1ff0ddf445d92235d82046',
    duration: 8.5,
    relatedEpisode: '第一集',
    relatedShotId: 'SHOT-002'
  }
];

// 合并所有审核任务
const mockReviewTasks: ReviewTask[] = [
  ...mockAssetReviewTasks,
  ...mockStoryboardReviewTasks,
  ...mockVideoReviewTasks
];

// 状态标签组件
const StatusBadge = ({ status }: { status: BaseReviewTask['status'] }) => {
  const statusConfig = {
    '待审核': { color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
    '已通过': { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
    '已驳回': { color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', icon: <XCircle className="w-3.5 h-3.5" /> }
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

// 审核操作模态框组件
const ReviewModal = ({ 
  isOpen, 
  onClose, 
  task,
  onApprove,
  onReject
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  task: ReviewTask;
  onApprove: (comment: string) => void;
  onReject: (comment: string) => void;
}) => {
  const [comment, setComment] = useState('');
  
  const handleApprove = () => {
    onApprove(comment);
    onClose();
    setComment('');
  };
  
  const handleReject = () => {
    if (!comment.trim()) {
      toast.error('请填写驳回原因');
      return;
    }
    onReject(comment);
    onClose();
    setComment('');
  };
  
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
              </div><div>
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
          </div>
        );
      default:
        return null;
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
              审核任务 - {task.name}
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
                  
                  {renderTaskDetails()}
                </div>
              </div>
              
              {/* 评价输入 */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">评价与反馈</h3>
                <div className="space-y-3">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm h-32"
                    placeholder="请输入您的评价或修改建议..."
                  />
                </div>
              </div>
            </div>
            
            {/* 右侧：预览区 */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">作品预览</h3>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 flex items-center justify-center h-64 mb-4">
                {task.thumbnail ? (
                  <img 
                    src={task.thumbnail} 
                    alt={task.name} 
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <div className="text-center">
                    <Image className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      暂无预览图
                    </p>
                  </div>
                )}
              </div>
              
              {/* 操作按钮 */}
              <div className="pt-2 flex space-x-3">
                <button
                  onClick={handleApprove}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center text-sm"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  通过审核
                </button>
                <button
                  onClick={handleReject}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center text-sm"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  驳回修改
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )
  );
};

// 主组件函数
const ReviewTaskPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<ReviewTask[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<ReviewTask[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState<ReviewTask | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'asset' | 'storyboard' | 'video'>('all');
  const [activeFilters, setActiveFilters] = useState({
    status: '' as BaseReviewTask['status'] | '',
    type: '' as string | '',
  });
  
  // 加载任务数据
  useEffect(() => {
    // 模拟API请求
    setTasks(mockReviewTasks);
    setFilteredTasks(mockReviewTasks);
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
  
  const handleTaskSelect = (task: ReviewTask) => {
    setSelectedTask(task);
    setIsReviewModalOpen(true);
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
  
  const handleApproveTask = (comment: string) => {
    if (selectedTask) {
      // 模拟审核通过
      const updatedTasks = tasks.map(task => {
        if (task.id === selectedTask.id) {
          return {
            ...task,
            status: '已通过'
          };
        }
        return task;
      });
      
      setTasks(updatedTasks);
      toast.success(`任务 ${selectedTask.name} 已通过审核！`);
    }
  };
  
  const handleRejectTask = (comment: string) => {
    if (selectedTask) {
      // 模拟审核驳回
      const updatedTasks = tasks.map(task => {
        if (task.id === selectedTask.id) {
          return {
            ...task,
            status: '已驳回'
          };
        }
        return task;
      });
      
      setTasks(updatedTasks);
      toast.success(`任务 ${selectedTask.name} 已驳回，等待修改！`);
    }
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
  const getTaskTypeInfo = (task: ReviewTask) => {
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
            <AssetLevelBadge level={task.storyboardLevel} />
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
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
  
  // 根据任务类型获取相关数据（如时长、版本数）
  const getTaskMetaInfo = (task: ReviewTask) => {
    switch (task.type) {
      case 'storyboard':
        return (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            版本数: {task.versionCount}
          </div>
        );
      case 'video':
        return (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            时长: {task.duration}秒
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
              <span className="text-sm text-gray-700 dark:text-gray-300">李导演 (导演)</span>
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
                  item.id === 'reviews' 
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
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">审核任务</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">审核所有待处理的资产生成、分镜图和视频任务</p>
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
                  <option value="待审核">待审核</option>
                  <option value="已通过">已通过</option>
                  <option value="已驳回">已驳回</option>
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
                    提交时间
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
                        <div className="text-sm text-gray-900 dark:text-white">{task.createdAt}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTaskSelect(task);
                          }}
                          className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                        >
                          <MessageSquare className="w-4 h-4 mr-1.5" />
                          审核
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                      <div className="flex flex-col items-center">
                        <CheckCircle2 className="w-10 h-10 mb-2 text-gray-300 dark:text-gray-600" />
                        <p>暂无符合条件的审核任务</p>
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
      
      {/* 审核操作模态框 */}
      {isReviewModalOpen && selectedTask && (
        <ReviewModal 
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          task={selectedTask}
          onApprove={handleApproveTask}
          onReject={handleRejectTask}
        />
      )}
    </div>
  );
};

export default ReviewTaskPage;