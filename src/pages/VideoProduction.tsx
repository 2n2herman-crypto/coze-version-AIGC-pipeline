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
  FileText,
  Play,
  Pause,
  Cpu,
  Wrench,
  VideoOff,
  Download
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

// 视频生成任务类型定义
interface VideoTask {
  id: string;
  code: string;
  level: 'S' | 'A' | 'B';
  description: string;
  type: '图生视频' | '文生视频' | '视频转视频' | '口型同步';
  relatedEpisode: string;
  relatedShotId: string;
  relatedAssets: string[];
  status: '排队中' | '渲染中' | '后处理中' | '待审核' | '返工中' | '已交付' | '失败';
  maker: string;
  reviewer: string;
  duration: number;
  lastUpdated: string;
}

// Mock数据：视频生成任务列表
const mockVideoTasks: VideoTask[] = [
  {
    id: 'vd-001',
    code: 'VD-SC01-SH01-V3',
    level: 'A',
    description: '主角在太空船内部操作控制台的连续动作，表现紧张感',
    type: '图生视频',
    relatedEpisode: '第一集',
    relatedShotId: 'SHOT-001',
    relatedAssets: ['主角-星际探险家', '太空船-主舰'],
    status: '排队中',
    maker: '张小明',
    reviewer: '李导演',
    duration: 5.2,
    lastUpdated: '2026-03-25 14:00'
  },
  {
    id: 'vd-002',
    code: 'VD-SC01-SH02-V2',
    level: 'S',
    description: '太空船缓缓降落在神秘星球表面的过程，展示星球全貌',
    type: '图生视频',
    relatedEpisode: '第一集',
    relatedShotId: 'SHOT-002',
    relatedAssets: ['神秘星球表面', '太空船-主舰'],
    status: '渲染中',
    maker: '王小红',
    reviewer: '李导演',
    duration: 8.5,
    lastUpdated: '2026-03-25 13:30'
  },
  {
    id: 'vd-003',
    code: 'VD-SC02-SH10-V1',
    level: 'A',
    description: '主角与外星生物首次接触的对话场景，重点表现情感交流',
    type: '口型同步',
    relatedEpisode: '第二集',
    relatedShotId: 'SHOT-010',
    relatedAssets: ['主角-星际探险家', '外星生物-智慧种族', '外星村落'],
    status: '后处理中',
    maker: '李小华',
    reviewer: '王美术',
    duration: 12.8,
    lastUpdated: '2026-03-25 11:45'
  },
  {
    id: 'vd-004',
    code: 'VD-SC02-SH15-V2',
    level: 'A',
    description: '太空战斗场景，展示激烈的飞船追逐和武器交火',
    type: '视频转视频',
    relatedEpisode: '第三集',
    relatedShotId: 'SHOT-015',
    relatedAssets: ['太空船-主舰', '激光枪-标准型'],
    status: '待审核',
    maker: '张小明',
    reviewer: '李导演',
    duration: 15.6,
    lastUpdated: '2026-03-25 10:20'
  },
  {
    id: 'vd-005',
    code: 'VD-SC03-SH20-V1',
    level: 'B',
    description: '外星村落的日常生活场景，展示外星文明细节',
    type: '文生视频',
    relatedEpisode: '第二集',
    relatedShotId: 'SHOT-020',
    relatedAssets: ['外星村落', '外星生物-智慧种族', '外星建筑-圆顶'],
    status: '返工中',
    maker: '王小红',
    reviewer: '王美术',
    duration: 10.3,
    lastUpdated: '2026-03-25 09:10'
  },
  {
    id: 'vd-006',
    code: 'VD-SC01-SH05-V4',
    level: 'S',
    description: '主预告片核心镜头，展示故事高潮片段',
    type: '图生视频',
    relatedEpisode: '第三集',
    relatedShotId: 'SHOT-005',
    relatedAssets: ['主角-星际探险家', '太空船-主舰', '神秘星球表面'],
    status: '已交付',
    maker: '李小华',
    reviewer: '李导演',
    duration: 20.0,
    lastUpdated: '2026-03-24 16:45'
  },
  {
    id: 'vd-007',
    code: 'VD-SC02-SH12-V1',
    level: 'B',
    description: '测试样片，验证新模型效果',
    type: '文生视频',
    relatedEpisode: '第二集',
    relatedShotId: 'SHOT-012',
    relatedAssets: ['外星生物-智慧种族'],
    status: '失败',
    maker: '张小明',
    reviewer: '王美术',
    duration: 3.5,
    lastUpdated: '2026-03-24 15:30'
  }
];

// 状态标签组件
const StatusBadge = ({ status }: { status: VideoTask['status'] }) => {
  const statusConfig = {
    '排队中': { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', icon: <Clock className="w-3.5 h-3.5" /> },
    '渲染中': { color: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200', icon: <Clock className="w-3.5 h-3.5" /> },'后处理中': { color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200', icon: <Clock className="w-3.5 h-3.5" /> },
    '待审核': { color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
    '返工中': { color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
    '已交付': { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
    '失败': { color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', icon: <VideoOff className="w-3.5 h-3.5" /> }
  };

  const config = statusConfig[status];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.icon}
      <span className="ml-1">{status}</span>
    </span>
  );
};

// 视频等级标签组件
const LevelBadge = ({ level }: { level: VideoTask['level'] }) => {
  const levelConfig = {
    'S': { color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', label: 'S-主预告片' },
    'A': { color: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200', label: 'A-正片' },
    'B': { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', label: 'B-测试样片' }
  };

  const config = levelConfig[level];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
};

// 视频类型标签组件
const TypeBadge = ({ type }: { type: VideoTask['type'] }) => {
  const typeConfig = {
    '图生视频': { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
    '文生视频': { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
    '视频转视频': { color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
    '口型同步': { color: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200' }
  };

  const config = typeConfig[type];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {type}
    </span>
  );
};

// 多值标签组件（用于显示关联资产等）
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

// 视频播放器组件
const VideoPlayer = ({ videoSrc }: { videoSrc: string | null }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    // 实际项目中这里会控制视频播放/暂停
  };
  
  if (!videoSrc) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-700 rounded-lg">
        <div className="text-center p-8">
          <Film className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            生成后将在此处显示视频预览
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
      <div className="aspect-video bg-black flex items-center justify-center">
        <img 
          src={videoSrc.replace('video', 'image')} 
          alt="视频预览" 
          className="w-full h-full object-cover opacity-80"
        />
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/50 transition-colors"
        >
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            {isPlaying ? (
              <Pause className="w-8 h-8 text-white" />
            ) : (
              <Play className="w-8 h-8 text-white ml-1" />
            )}
          </div>
        </button>
      </div>
      
      {/* 视频控制栏 */}
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
            <Play className="w-5 h-5" />
          </button>
          <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
            <span className="text-sm">0:00 / 0:00</span>
          </button>
        </div>
        <div className="flex items-center space-x-3">
          <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// 视频生成操作页组件
const VideoCreationPage = ({ taskId, onClose }: { taskId: string, onClose: () => void }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);
  const [historyVersions, setHistoryVersions] = useState<Array<{
    id: string;
    version: number;
    thumbnail: string;
    createdAt: string;
  }>>([]);
  const [description, setDescription] = useState('');
  const [selectedModel, setSelectedModel] = useState('Runway Gen-2');
  
  // 模拟已生成的历史版本
  const mockHistoryVersions = [
    {
      id: 'v1',
      version: 1,
      thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=sci-fi%20spaceship%20control%20room%20video%20frame%20detailed%20futuristic%20lighting&sign=fb9c3ad1125d78eb1555cf3fe635159e',
      createdAt: '2026-03-25 10:30'
    },
    {
      id: 'v2',
      version: 2,
      thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=sci-fi%20spaceship%20control%20room%20video%20scene%20with%20character%20action&sign=b56df7f2af8e2e7ef3968fd2dfa30d0b',
      createdAt: '2026-03-25 11:15'
    }
  ];
  
  // 可用模型列表
  const availableModels = [
    'Runway Gen-2',
    'Pika Labs',
    'Kaiber AI',
    'Stable Video Diffusion'
  ];
  
  useEffect(() => {
    // 模拟加载任务数据
    setHistoryVersions(mockHistoryVersions);
    setDescription('主角在太空船内部操作控制台的连续动作，表现紧张感，未来科技风格，蓝色灯光，细节丰富的控制面板，主角穿着太空服，表情专注');
  }, [taskId]);
  
  const handleGenerate = () => {
    if (!description.trim()) {
      toast.error('请输入描述文本');
      return;
    }
    
    setIsGenerating(true);
    
    // 模拟生成过程
    setTimeout(() => {
      const newVersion = {
        id: `v${historyVersions.length + 1}`,
        version: historyVersions.length + 1,
        thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=sci-fi%20spaceship%20control%20room%20new%20video%20version%20action%20sequence&sign=54e8da20f6e2ea90ed0bae7eae98bc6e',
        createdAt: new Date().toLocaleString('zh-CN')
      };
      
      setHistoryVersions([newVersion, ...historyVersions]);
      setPreviewVideo(newVersion.thumbnail);
      setSelectedVersion(newVersion.id);
      setIsGenerating(false);
      
      toast.success('视频生成成功！');
    }, 3000);
  };
  
  const handlePublish = () => {
    if (!selectedVersion) {
      toast.error('请先选择一个版本进行发布');
      return;
    }
    
    toast.success('视频已提交审核！');
    setTimeout(() => {
      onClose();
    }, 1000);
  };
  
  const handleVersionSelect = (versionId: string, thumbnail: string) => {
    setSelectedVersion(versionId);
    setPreviewVideo(thumbnail);
  };
  
  const handlePromptAssist = () => {
    // 模拟从项目管理-分镜描述自动生成
    const autoGeneratedPrompt = '主角在太空船内部操作控制台的连续动作，表现紧张感，未来科技风格，蓝色灯光，细节丰富的控制面板，主角穿着太空服，表情专注，背景有舷窗可以看到宇宙星空，控制面板上有闪烁的指示灯和全息投影，主角进行一系列操作动作。';
    
    setDescription(autoGeneratedPrompt);
    toast.success('已自动生成提示词！');
  };
  
  const handleVideoEdit = () => {
    if (!previewVideo) {
      toast.error('请先生成视频');
      return;
    }
    toast.success('视频编辑功能开发中');
  };
  
  const handleLipSync = () => {
    if (!previewVideo) {
      toast.error('请先生成视频');
      return;
    }
    toast.success('视频对口型功能开发中');
  };
  
  const handleUpscale = () => {
    if (!previewVideo) {
      toast.error('请先生成视频');
      return;
    }
    toast.success('视频超分功能开发中');
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 h-full flex flex-col"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">视频生成操作</h2>
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
                首帧图片上传
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
                尾帧图片上传（可选）
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
                <option value="asset-001">主角-星际探险家</option>
                <option value="asset-003">太空船-主舰</option>
              </select>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  文本描述
                </label>
                <button 
                  onClick={handlePromptAssist}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  Prompt代写
                </button>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm h-28"
                placeholder="详细描述您想要生成的视频内容..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                模型选择
              </label>
              <select 
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              >
                {availableModels.map(model => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="pt-4 flex space-x-3">
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
        
        {/* 中间预览区 */}
        <div className="flex flex-col">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">预览区</h3>
          <div className="flex-1">
            <VideoPlayer videoSrc={previewVideo} />
          </div>
          
          {/* 工具栏 */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={handleVideoEdit}
              disabled={!previewVideo}
              className={`flex items-center px-3 py-2 border rounded-lg transition-colors text-sm ${
                previewVideo 
                  ? 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700' 
                  : 'border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
              }`}
            >
              <Wrench className="w-4 h-4 mr-1.5" />
              视频编辑
            </button>
            
            <button
              onClick={handleLipSync}
              disabled={!previewVideo}
              className={`flex items-center px-3 py-2 border rounded-lg transition-colors text-sm ${
                previewVideo 
                  ? 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700' 
                  : 'border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              视频对口型
            </button>
            
            <button
              onClick={handleUpscale}
              disabled={!previewVideo}
              className={`flex items-center px-3 py-2 border rounded-lg transition-colors text-sm ${
                previewVideo 
                  ? 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700' 
                  : 'border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
              }`}
            >
              <Cpu className="w-4 h-4 mr-1.5" />
              视频超分
            </button>
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
                  <div className="w-16 h-9 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden">
                    <img 
                      src={version.thumbnail} 
                      alt={`版本 ${version.version}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
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
   
  // 视频创建页面组件已包含 handleNextTask 函数
  // 此处为避免重复定义，已移除
};

// 主组件
const VideoProduction = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<VideoTask[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<VideoTask[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState<VideoTask | null>(null);
  const [isCreationPageOpen, setIsCreationPageOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    status: '' as VideoTask['status'] | '',
    level: '' as VideoTask['level'] | '',
    type: '' as VideoTask['type'] | '',
  });
  
  // 加载任务数据
  useEffect(() => {
    // 模拟API请求
    setTasks(mockVideoTasks);
    setFilteredTasks(mockVideoTasks);
  }, [projectId]);
  
  // 应用搜索和筛选
  useEffect(() => {
    let result = [...tasks];
    
    // 应用搜索
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        task => 
          task.code.toLowerCase().includes(query) || 
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
  
  const handleTaskSelect = (task: VideoTask) => {
    setSelectedTask(task);
  };
  
  const handleCreateTask = () => {
    toast.success('新视频任务创建成功！');
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

  const renderTaskActions = (task: VideoTask) => {
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
  
  // 获取所有视频类型用于筛选
  const videoTypes = Array.from(new Set(tasks.map(task => task.type)));
  
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
                  item.id === 'videos' 
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
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">视频生成任务</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">管理和执行视频生成相关任务</p>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleCreateTask}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
            >
              <Plus className="mr-1.5 w-4 h-4" />
              新建视频任务
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
                placeholder="搜索视频编号、描述、制作人..."
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
                  <option value="排队中">排队中</option>
                  <option value="渲染中">渲染中</option>
                  <option value="后处理中">后处理中</option>
                  <option value="待审核">待审核</option>
                  <option value="返工中">返工中</option>
                  <option value="已交付">已交付</option>
                  <option value="失败">失败</option>
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
                  <option value="S">S-主预告片</option>
                  <option value="A">A-正片</option>
                  <option value="B">B-测试样片</option>
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
                  {videoTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
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
                    视频编号
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    视频等级
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell"
                  >
                    视频类型
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell"
                  >
                    关联集
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden xl:table-cell"
                  >
                    关联资产
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
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell"
                  >
                    时长(秒)
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell"
                  >
                    最后更新
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
                              {task.code}
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
                        <div className="flex items-center text-sm text-gray-900 dark:text-white">
                          <FileText className="w-3.5 h-3.5 mr-1.5 text-gray-500 dark:text-gray-400" />
                          {task.relatedEpisode}
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden xl:table-cell">
                        <MultiValueBadge items={task.relatedAssets} />
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
                      <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                        <div className="flex items-center text-sm text-gray-900 dark:text-white">
                          <Users className="w-3.5 h-3.5 mr-1.5 text-gray-500 dark:text-gray-400" />
                          {task.reviewer}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                        <div className="text-sm text-gray-900 dark:text-white">{task.duration}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                        <div className="text-sm text-gray-900 dark:text-white">{task.lastUpdated}</div>
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
                    <td colSpan={11} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                      <div className="flex flex-col items-center">
                        <Film className="w-10 h-10 mb-2 text-gray-300 dark:text-gray-600" />
                        <p>暂无符合条件的视频生成任务</p>
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
      
      {/* 视频生成操作页模态框 */}
      {isCreationPageOpen && selectedTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <VideoCreationPage 
              taskId={selectedTask.id}
              onClose={() => setIsCreationPageOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoProduction;