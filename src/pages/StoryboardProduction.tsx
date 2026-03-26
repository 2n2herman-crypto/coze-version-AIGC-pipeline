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
  RotateCw,
  Crop
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

// 分镜图生成任务类型定义
interface StoryboardTask {
  id: string;
  code: string;
  level: 'P0' | 'P1' | 'P2';
  description: string;
  shotType: string;
  relatedEpisode: string;
  relatedShotId: string;
  relatedAssets: string[];
  status: '待生成' | '生成中' | '待审核' | '修改中' | '已锁定' | '废弃';
  maker: string;
  reviewer: string;
  versionCount: number;
  lastUpdated: string;
}

// Mock数据：分镜图生成任务列表
const mockStoryboardTasks: StoryboardTask[] = [
  {
    id: 'sb-001',
    code: 'SB-SC01-SH01',
    level: 'P0',
    description: '主角在太空船内部操作控制台的场景，展现紧张感',
    shotType: '特写',
    relatedEpisode: '第一集',
    relatedShotId: 'SHOT-001',
    relatedAssets: ['主角-星际探险家', '太空船-主舰'],
    status: '待生成',
    maker: '张小明',
    reviewer: '李导演',
    versionCount: 0,
    lastUpdated: '2026-03-25 10:00'
  },
  {
    id: 'sb-002',
    code: 'SB-SC01-SH02',
    level: 'P0',
    description: '从太空俯瞰神秘星球，展示整个星球的地形地貌',
    shotType: '全景',
    relatedEpisode: '第一集',
    relatedShotId: 'SHOT-002',
    relatedAssets: ['神秘星球表面', '太空船-主舰'],
    status: '生成中',
    maker: '王小红',
    reviewer: '王美术',
    versionCount: 2,
    lastUpdated: '2026-03-25 11:30'
  },
  {
    id: 'sb-003',
    code: 'SB-SC02-SH10',
    level: 'P0',
    description: '主角与外星生物首次接触的场景，充满神秘感',
    shotType: '中景',
    relatedEpisode: '第二集',
    relatedShotId: 'SHOT-010',
    relatedAssets: ['主角-星际探险家', '外星生物-智慧种族', '外星村落'],
    status: '待审核',
    maker: '张小明',
    reviewer: '李导演',
    versionCount: 3,
    lastUpdated: '2026-03-25 09:45'
  },
  {
    id: 'sb-004',
    code: 'SB-SC02-SH11',
    level: 'P1',
    description: '外星村落的全景展示，建筑风格奇特',
    shotType: '全景',
    relatedEpisode: '第二集',
    relatedShotId: 'SHOT-011',
    relatedAssets: ['外星村落', '外星建筑-圆顶'],
    status: '修改中',
    maker: '李小华',
    reviewer: '王美术',
    versionCount: 2,
    lastUpdated: '2026-03-25 13:20'
  },
  {
    id: 'sb-005',
    code: 'SB-SC03-SH15',
    level: 'P1',
    description: '太空船战斗场景，展示激烈的战斗画面',
    shotType: '远景',
    relatedEpisode: '第三集',
    relatedShotId: 'SHOT-015',
    relatedAssets: ['太空船-主舰', '激光枪-标准型'],
    status: '已锁定',
    maker: '王小红',
    reviewer: '李导演',
    versionCount: 4,
    lastUpdated: '2026-03-24 16:10'
  },
  {
    id: 'sb-006',
    code: 'SB-SC01-SH03',
    level: 'P2',
    description: '太空船内部走廊的场景，展示细节设计',
    shotType: '中景',
    relatedEpisode: '第一集',
    relatedShotId: 'SHOT-003',
    relatedAssets: ['太空船-主舰'],
    status: '废弃',
    maker: '李小华',
    reviewer: '王美术',
    versionCount: 1,
    lastUpdated: '2026-03-24 14:30'
  }
];

// 状态标签组件
const StatusBadge = ({ status }: { status: StoryboardTask['status'] }) => {
  const statusConfig = {
    '待生成': { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', icon: <Clock className="w-3.5 h-3.5" /> },
    '生成中': { color: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200', icon: <Clock className="w-3.5 h-3.5" /> },
    '待审核': { color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
    '修改中': { color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
    '已锁定': { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
    '废弃': { color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200', icon: <AlertTriangle className="w-3.5 h-3.5" /> }
  };

  const config = statusConfig[status];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.icon}
      <span className="ml-1">{status}</span>
    </span>
  );
};

// 分镜等级标签组件
const LevelBadge = ({ level }: { level: StoryboardTask['level'] }) => {
  const levelConfig = {
    'P0': { color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', label: 'P0-关键镜头' },
    'P1': { color: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200', label: 'P1-普通' },
    'P2': { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', label: 'P2-过场' }
  };

  const config = levelConfig[level];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
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

// 分镜头摄像机编辑组件
const CameraEditor = ({ 
  isOpen, 
  onClose, 
  initialImage, 
  onSave 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  initialImage: string;
  onSave: (result: string) => void; 
}) => {
  const [horizontal, setHorizontal] = useState(0);
  const [vertical, setVertical] = useState(0);
  const [scale, setScale] = useState(1);
  
  const handleSave = () => {
    // 模拟保存角度调整结果
    onSave(`${initialImage}?h=${horizontal}&v=${vertical}&s=${scale}`);
    toast.success('角度调整已保存！');
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-900 rounded-xl shadow-xl p-6 w-full max-w-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <h3 className="text-xl font-bold text-white">调整角度</h3>
            <span className="ml-2 text-xs bg-red-500 text-white px-1.5 py-0.5 rounded">限免</span>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* 球体网格预览区 */}
        <div className="bg-black rounded-lg p-4 mb-6 aspect-square relative">
          {/* 球体网格线 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-full h-full text-gray-700 opacity-30" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              {/* 经线和纬线网格 */}
              {[...Array(20)].map((_, i) => {
                const angle = (i * Math.PI) / 10;
                const r = 40;
                const cx = 50;
                const cy = 50;
                
                // 水平线
                const y = cy + r * Math.sin(angle);
                const lineLength = 2 * r * Math.cos(angle);
                
                // 垂直线
                const x = cx + r * Math.cos(angle);
                const verticalLength = 2 * r * Math.sin(angle);
                
                return (
                  <g key={i}>
                    <line
                      x1={cx - lineLength/2} y1={y}
                      x2={cx + lineLength/2} y2={y}
                      stroke="currentColor"
                      strokeWidth="0.5"
                    />
                    <line
                      x1={x} y1={cy - verticalLength/2}
                      x2={x} y2={cy + verticalLength/2}
                      stroke="currentColor"
                      strokeWidth="0.5"
                    />
                  </g>
                );
              })}
            </svg>
          </div>
          
          {/* 图片预览 */}
          <motion.div 
            className="absolute inset-0 flex items-center justify-center"
            style={{
              rotateY: `${horizontal}deg`,
              rotateX: `${-vertical}deg`,
              scale: scale
            }}
          >
            <div className="w-32 h-24 bg-white/80 shadow-lg overflow-hidden">
              <img 
                src={initialImage} 
                alt="分镜预览" 
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>
        
        {/* 控制滑块区域 */}
        <div className="space-y-6">
          {/* 水平旋转控制 */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-white">
                水平
              </label>
              <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded w-14 text-center">
                {horizontal}°
              </div>
            </div>
            <input
              type="range"
              min="-180"
              max="180"
              value={horizontal}
              onChange={(e) => setHorizontal(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              style={{
                background: 'linear-gradient(to right, #4B5563 0%, #4B5563 100%)'
              }}
            />
            {/* 滑块轨道和拇指 */}
            <style jsx>{`
              input[type="range"]::-webkit-slider-thumb {
                appearance: none;
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background: white;
                cursor: pointer;
              }
              input[type="range"]::-moz-range-thumb {
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background: white;
                cursor: pointer;
                border: none;
              }
            `}</style>
          </div>
          
          {/* 垂直旋转控制 */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-white">
                垂直
              </label>
              <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded w-14 text-center">
                {vertical}°
              </div>
            </div>
            <input
              type="range"
              min="-90"
              max="90"
              value={vertical}
              onChange={(e) => setVertical(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              style={{
                background: 'linear-gradient(to right, #4B5563 0%, #4B5563 100%)'
              }}
            />
          </div>
          
          {/* 缩放控制 */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-white">
                缩放
              </label>
              <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded w-14 text-center">
                {scale.toFixed(1)}x
              </div>
            </div>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              style={{
                background: 'linear-gradient(to right, #4B5563 0%, #4B5563 100%)'
              }}
            />
          </div>
          
          {/* 确认生成按钮 */}
          <button
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            确认生成
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// 分镜图手绘编辑组件
const StoryboardDrawingEditor = ({ 
  isOpen, 
  onClose, 
  initialImage, 
  onSave 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  initialImage: string;
  onSave: (result: string) => void; 
}) => {
  const [brushSize, setBrushSize] = useState(5);
  const [brushColor, setBrushColor] = useState('#ff0000');
  const [isDrawing, setIsDrawing] = useState(false);
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);
  
  useEffect(() => {
    if (isOpen && canvasRef && initialImage) {
      const ctx = canvasRef.getContext('2d');
      if (ctx) {
        const img = new Image();
        img.src = initialImage;
        img.onload = () => {
          canvasRef.width = img.width;
          canvasRef.height = img.height;
          ctx.drawImage(img, 0, 0);
        };
      }
    }
  }, [isOpen, initialImage, canvasRef]);
  
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef) return;
    
    const ctx = canvasRef.getContext('2d');
    if (ctx) {
      const rect = canvasRef.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineWidth = brushSize;
      ctx.strokeStyle = brushColor;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      setIsDrawing(true);
    }
  };
  
  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef) return;
    
    const ctx = canvasRef.getContext('2d');
    if (ctx) {
      const rect = canvasRef.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };
  
  const stopDrawing = () => {
    if (!canvasRef) return;
    
    const ctx = canvasRef.getContext('2d');
    if (ctx) {
      ctx.closePath();
      setIsDrawing(false);
    }
  };
  
  const handleSave = () => {
    if (!canvasRef) return;
    
    // 获取画布上的图片数据
    const dataURL = canvasRef.toDataURL();
    onSave(dataURL);
    toast.success('手绘编辑已保存！');
    onClose();
  };
  
  const handleClear = () => {
    if (!canvasRef || !initialImage) return;
    
    const ctx = canvasRef.getContext('2d');
    if (ctx) {
      const img = new Image();
      img.src = initialImage;
      img.onload = () => {
        ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);
        ctx.drawImage(img, 0, 0);
      };
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">分镜手绘编辑</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* 左侧工具栏 */}
          <div className="md:w-1/4 space-y-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">绘图工具</h4>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  画笔大小
                </label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={brushSize}
                  onChange={(e) => setBrushSize(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                  <span>1px</span>
                  <span>{brushSize}px</span>
                  <span>20px</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  画笔颜色
                </label>
                <input
                  type="color"
                  value={brushColor}
                  onChange={(e) => setBrushColor(e.target.value)}
                  className="w-full h-10 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
                />
              </div>
              
              <div className="pt-4 flex flex-col space-y-3">
                <button
                  onClick={handleClear}
                  className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium py-2 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                >
                  清除画布
                </button>
                <button
                  onClick={handleSave}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  保存编辑
                </button>
              </div>
            </div>
          </div>
          
          {/* 右侧画布区 */}
          <div className="md:w-3/4 bg-gray-100 dark:bg-gray-700 rounded-lg p-4 flex items-center justify-center overflow-auto">
            <canvas
              ref={setCanvasRef}
              className="border border-gray-300 dark:border-gray-600 cursor-crosshair"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// 分镜图生成操作页组件
const StoryboardCreationPage = ({ taskId, onClose }: { taskId: string, onClose: () => void }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [historyVersions, setHistoryVersions] = useState<Array<{
    id: string;
    version: number;
    thumbnail: string;
    createdAt: string;
  }>>([]);
  const [isCameraEditorOpen, setIsCameraEditorOpen] = useState(false);
  const [isDrawingEditorOpen, setIsDrawingEditorOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [selectedModel, setSelectedModel] = useState('SDXL 1.0');
  const [imageClicked, setImageClicked] = useState(false);
  
  // 模拟已生成的历史版本
  const mockHistoryVersions = [
    {
      id: 'v1',
      version: 1,
      thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=sci-fi%20spaceship%20control%20room%20interior%20shot%20close-up%20detailed%20digital%20art&sign=a7e3b5cdcc9a24e69942b50b4c3c7d11',
      createdAt: '2026-03-25 10:30'
    },
    {
      id: 'v2',
      version: 2,
      thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=sci-fi%20spaceship%20control%20room%20futuristic%20lighting%20close-up%20shot&sign=60d193183efedf7c6740ca92d9ea693c',
      createdAt: '2026-03-25 11:15'
    }
  ];
  
  // 可用模型列表
  const availableModels = [
    'SDXL 1.0',
    'Midjourney V6',
    'DALL-E 3',
    'Stable Diffusion 3'
  ];
  
  // 获取下一个任务
  const handleNextTask = () => {
    if (!selectedVersion) return;
    
    // 模拟获取当前任务在列表中的位置
    const currentTaskIndex = mockStoryboardTasks.findIndex(task => task.id === taskId);
    const nextTaskIndex = (currentTaskIndex + 1) % mockStoryboardTasks.length;
    
    if (nextTaskIndex !== currentTaskIndex) {
      // 关闭当前模态框并跳转到下一个任务
      onClose();
      setTimeout(() => {
        // 在实际应用中，这里应该是获取下一个任务并打开其编辑界面
        toast.success(`已跳转到下一个任务: ${mockStoryboardTasks[nextTaskIndex].code}`);
      }, 500);
    } else {
      toast.info('已经是最后一个任务了');
    }
  };
  
  useEffect(() => {
    // 模拟加载任务数据
    setHistoryVersions(mockHistoryVersions);
    setDescription('主角在太空船内部操作控制台的场景，展现紧张感，未来科技风格，蓝色灯光，细节丰富的控制面板');
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
        thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=sci-fi%20spaceship%20control%20room%20new%20version%20detailed%20artwork&sign=1ad64159ea50e5889b56f31618f2cd95',
        createdAt: new Date().toLocaleString('zh-CN')
      };
      
      setHistoryVersions([newVersion, ...historyVersions]);
      setPreviewImage(newVersion.thumbnail);
      setSelectedVersion(newVersion.id);
      setIsGenerating(false);
      
      toast.success('分镜图生成成功！');
    }, 2000);
  };
  
  const handlePublish = () => {
    if (!selectedVersion) {
      toast.error('请先选择一个版本进行发布');
      return;
    }
    
    toast.success('分镜图已提交审核！');
    setTimeout(() => {
      onClose();
    }, 1000);
  };
  
  const handleVersionSelect = (versionId: string, thumbnail: string) => {
    setSelectedVersion(versionId);
    setPreviewImage(thumbnail);
  };
  
  const handlePromptAssist = () => {
    // 模拟从项目管理-分镜描述自动生成
    const autoGeneratedPrompt = '主角在太空船内部操作控制台的场景，展现紧张感，未来科技风格，蓝色灯光，细节丰富的控制面板，主角穿着太空服，表情专注，背景有舷窗可以看到宇宙星空，控制面板上有闪烁的指示灯和全息投影。';
    
    setDescription(autoGeneratedPrompt);
    toast.success('已自动生成提示词！');
  };
  
  const handleDrawingEdit = () => {
    if (!previewImage) {
      toast.error('请先生成分镜图');
      return;
    }
    setIsDrawingEditorOpen(true);
  };
  
  const handleCameraEdit = () => {
    if (!previewImage) {
      toast.error('请先生成分镜图');
      return;
    }
    setIsCameraEditorOpen(true);
  };
  
  const handleCameraSave = (result: string) => {
    // 模拟保存角度调整后的图片
    setPreviewImage(result);
  };
  
  const handleDrawingSave = (result: string) => {
    // 模拟保存手绘编辑后的图片
    setPreviewImage(result);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 h-full flex flex-col"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">分镜图生成操作</h2>
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
                placeholder="详细描述您想要生成的分镜图..."
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
        
        {/* 中间画布区 */}
        <div className="flex flex-col">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">预览区</h3>
          <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex flex-col">
            {previewImage ? (
              <div className="flex-1 flex flex-col">
                {/* 预览图片区域 */}
                <div className="relative flex-1 flex items-center justify-center p-4">
                  <img 
                    src={previewImage} 
                    alt="分镜预览" 
                    className="max-w-full max-h-full object-contain cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setImageClicked(!imageClicked)}
                  />
                  {/* 图片工具栏 */}
                  <div className="absolute top-2 right-2 flex space-x-2 bg-white/80 dark:bg-gray-800/80 rounded-lg p-1 shadow-md">
                    <button 
                      onClick={handleDrawingEdit}
                      className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                      title="图片绘制编辑"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    {/* 移除右上角的相机编辑图标 */}
                    {/* 摄像机编辑功能现在通过点击图片后显示的下方按钮实现 */}
                  </div>
                </div>
                
                {/* 点击图片后显示的摄像机编辑按钮 */}
                <div className={`p-4 transition-all duration-300 ${
                  imageClicked ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
                }`}>
                  <button
                    onClick={handleCameraEdit}
                    className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium py-2.5 px-4 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center"
                  >
                    <RotateCw className="w-4 h-4 mr-2" />
                    调整摄像机角度
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8">
                <Image className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  生成后将在此处显示分镜图预览<br/>
                  <span className="text-xs mt-2 block">点击"生成"按钮开始创建分镜图</span>
                </p>
                <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                  提示：生成图片后，点击图片显示摄像机编辑按钮
                </div>
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
      
      {/* 摄像机编辑模态框 */}
      {previewImage && (
        <CameraEditor 
          isOpen={isCameraEditorOpen}
          onClose={() => setIsCameraEditorOpen(false)}
          initialImage={previewImage}
          onSave={handleCameraSave}
        />
      )}
      
      {/* 手绘编辑模态框 */}
      {previewImage && (
        <StoryboardDrawingEditor 
          isOpen={isDrawingEditorOpen}
          onClose={() => setIsDrawingEditorOpen(false)}
          initialImage={previewImage}
          onSave={handleDrawingSave}
        />
      )}
    </motion.div>
  );
};

// 主组件
const StoryboardProduction = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<StoryboardTask[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<StoryboardTask[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState<StoryboardTask | null>(null);
  const [isCreationPageOpen, setIsCreationPageOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    status: '' as StoryboardTask['status'] | '',
    level: '' as StoryboardTask['level'] | '',
    shotType: '' as string | '',
  });
  
  // 加载任务数据
  useEffect(() => {
    // 模拟API请求
    setTasks(mockStoryboardTasks);
    setFilteredTasks(mockStoryboardTasks);
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
    
    if (activeFilters.shotType) {
      result = result.filter(task => task.shotType === activeFilters.shotType);
    }
    
    setFilteredTasks(result);
  }, [tasks, searchQuery, activeFilters]);
  
  const handleTaskSelect = (task: StoryboardTask) => {
    setSelectedTask(task);
  };
  
  const handleCreateTask = () => {
    toast.success('新分镜任务创建成功！');
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
      shotType: '',
    });
    setSearchQuery('');
  };
  
  const handleTaskAction = (action: string, taskId: string) => {
    toast(`${action} - 任务ID: ${taskId}`);
  };

  const renderTaskActions = (task: StoryboardTask) => {
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
  
  // 获取所有镜头类型用于筛选
  const shotTypes = Array.from(new Set(tasks.map(task => task.shotType)));
  
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
                  item.id === 'storyboards' 
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
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">分镜图生成任务</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">管理和执行分镜图生成相关任务</p>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleCreateTask}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
            >
              <Plus className="mr-1.5 w-4 h-4" />
              新建分镜任务
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
                placeholder="搜索分镜编号、描述、制作人..."
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
                  <option value="待生成">待生成</option>
                  <option value="生成中">生成中</option>
                  <option value="待审核">待审核</option>
                  <option value="修改中">修改中</option>
                  <option value="已锁定">已锁定</option>
                  <option value="废弃">废弃</option>
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
                  <option value="P0">P0-关键镜头</option>
                  <option value="P1">P1-普通</option>
                  <option value="P2">P2-过场</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              
              <div className="relative">
                <select
                  value={activeFilters.shotType}
                  onChange={(e) => handleFilterChange('shotType', e.target.value)}
                  className="appearance-none block w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm pr-8"
                >
                  <option value="">全部镜头类型</option>
                  {shotTypes.map(type => (
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
                    分镜编号
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    分镜等级
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell"
                  >
                    镜头类型
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
                    版本数
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
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                          {task.shotType}
                        </span>
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
                        <div className="text-sm text-gray-900 dark:text-white">{task.versionCount}</div>
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
                        <Image className="w-10 h-10 mb-2 text-gray-300 dark:text-gray-600" />
                        <p>暂无符合条件的分镜图生成任务</p>
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
                <nav className="relative z-0 inline-flex rounded-md shadow-sm-space-x-px" aria-label="Pagination">
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
      
      {/* 分镜图生成操作页模态框 */}
      {isCreationPageOpen && selectedTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <StoryboardCreationPage 
              taskId={selectedTask.id}
              onClose={() => setIsCreationPageOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryboardProduction;