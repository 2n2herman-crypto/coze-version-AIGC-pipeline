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
  AlertTriangle,
  Edit
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '@/contexts/authContext';

// 资产数据类型定义
interface Asset {
  id: string;
  name: string;
  level: 'P0' | 'P1' | 'P2';
  description: string;
  type: '角色' | '场景' | '道具' | '服装';
  episodes: string[];
  scenes: string[];
  shots: string[];
  status: '未开始' | '待制作' | '制作中' | '待审核' | '已通过' | '已驳回';
  maker: string;
  reviewer: string;
  tokenUsage: number;
}

// Mock数据
const mockAssets: Asset[] = [
  {
    id: 'asset-001',
    name: '主角-星际探险家',
    level: 'P0',
    description: '一位勇敢的星际探险家，身着未来科技感十足的太空服',
    type: '角色',
    episodes: ['第一集', '第二集', '第三集'],
    scenes: ['太空船内部', '神秘星球表面', '太空船战斗'],
    shots: ['SH01', 'SH02', 'SH05'],
    status: '待制作',
    maker: '张小明',
    reviewer: '李导演',
    tokenUsage: 0
  },
  {
    id: 'asset-002',
    name: '外星生物-智慧种族',
    level: 'P0',
    description: '友好的外星智慧生物，拥有独特的生理特征和文化',
    type: '角色',
    episodes: ['第二集', '第三集'],
    scenes: ['外星村落'],
    shots: ['SH10', 'SH15', 'SH20'],
    status: '制作中',
    maker: '王小红',
    reviewer: '李导演',
    tokenUsage: 2500
  },
  {
    id: 'asset-003',
    name: '太空船-主舰',
    level: 'P0',
    description: '主角的主要交通工具，具有流线型设计和先进的科技感',
    type: '场景',
    episodes: ['第一集', '第二集', '第三集'],
    scenes: ['太空船内部', '太空船战斗'],
    shots: ['SH01', 'SH03', 'SH07', 'SH12'],
    status: '待审核',
    maker: '张小明',
    reviewer: '王美术',
    tokenUsage: 5000
  },
  {
    id: 'asset-004',
    name: '神秘星球表面',
    level: 'P1',
    description: '一颗充满未知和神秘感的星球表面，有奇特的地形和植被',
    type: '场景',
    episodes: ['第二集', '第三集'],
    scenes: ['神秘星球表面'],
    shots: ['SH10', 'SH11', 'SH15', 'SH18'],
    status: '已通过',
    maker: '王小红',
    reviewer: '王美术',
    tokenUsage: 3200
  },
  {
    id: 'asset-005',
    name: '激光枪-标准型',
    level: 'P1',
    description: '星际探险中使用的标准武器，具有未来感的设计和蓝色激光效果',
    type: '道具',
    episodes: ['第一集', '第二集'],
    scenes: ['太空船战斗'],
    shots: ['SH02', 'SH04', 'SH06'],
    status: '已驳回',
    maker: '李小华',reviewer: '李导演',
    tokenUsage: 1800
  },
  {
    id: 'asset-006',
    name: '通讯器-wrist型',
    level: 'P2',
    description: '戴在手腕上的通讯设备，具有全息投影功能',
    type: '道具',
    episodes: ['第一集', '第二集', '第三集'],
    scenes: ['太空船内部', '神秘星球表面', '外星村落'],
    shots: ['SH01', 'SH03', 'SH05', 'SH08', 'SH12'],
    status: '未开始',
    maker: '',
    reviewer: '',
    tokenUsage: 0
  },
  {
    id: 'asset-007',
    name: '太空服-备用款',
    level: 'P2',
    description: '备用的太空服设计，与主太空服风格一致但有颜色差异',
    type: '服装',
    episodes: ['第三集'],
    scenes: ['太空船战斗'],
    shots: ['SH20', 'SH22'],
    status: '待制作',
    maker: '张小明',
    reviewer: '王美术',
    tokenUsage: 0
  }
];

// 状态标签组件
const StatusBadge = ({ status }: { status: Asset['status'] }) => {
  const statusConfig = {
    '未开始': { color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200', icon: <Clock className="w-3.5 h-3.5" /> },
    '待制作': { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', icon: <Clock className="w-3.5 h-3.5" /> },
    '制作中': { color: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200', icon: <Clock className="w-3.5 h-3.5" /> },
    '待审核': { color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
    '已通过': { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
    '已驳回': { color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', icon: <AlertTriangle className="w-3.5 h-3.5" /> }
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
const LevelBadge = ({ level }: { level: Asset['level'] }) => {
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
const TypeBadge = ({ type }: { type: Asset['type'] }) => {
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

// 创建子资产模态框
const CreateSubAssetModal = ({ 
  isOpen, 
  onClose, 
  parentAsset,
  onSubmit 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  parentAsset: Asset;
  onSubmit: (asset: { name: string, description: string, type: string }) => void; 
}) => {
  const [assetName, setAssetName] = useState('');
  const [assetDescription, setAssetDescription] = useState('');
  const [assetType, setAssetType] = useState('');
  
  const assetTypes = ['角色', '场景', '道具', '服装'];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (assetName.trim() && assetType) {
      onSubmit({
        name: assetName,
        description: assetDescription,
        type: assetType
      });
      onClose();
    } else {
      toast.error('请填写资产名称和选择资产类型');
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
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">创建子资产</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            为 <span className="font-medium text-blue-600 dark:text-blue-400">{parentAsset.name}</span> 创建子资产
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                资产名称
              </label>
              <input
                type="text"
                value={assetName}
                onChange={(e) => setAssetName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="如：头盔-探险家"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                资产类型
              </label>
              <select
                value={assetType}
                onChange={(e) => setAssetType(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">请选择资产类型</option>
                {assetTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                资产描述
              </label>
              <textarea
                value={assetDescription}
                onChange={(e) => setAssetDescription(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="详细描述子资产的设计要求..."
                rows={3}
              />
            </div>
            
            <div className="pt-2 flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                创建子资产
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

// 编辑制作人和审核人模态框
const EditAssignModal = ({ 
  isOpen, 
  onClose, 
  asset,
  onSubmit 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  asset: Asset;
  onSubmit: (data: { maker: string, reviewer: string }) => void; 
}) => {
  const [maker, setMaker] = useState(asset.maker);
  const [reviewer, setReviewer] = useState(asset.reviewer);
  
  const teamMembers = [
    '张小明', '王小红', '李小华', '李导演', '王美术'
  ];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (maker || reviewer) {
      onSubmit({
        maker,
        reviewer
      });
      onClose();
    } else {
      toast.error('请至少选择制作人或审核人');
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
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">编辑任务分配</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            为 <span className="font-medium text-blue-600 dark:text-blue-400">{asset.name}</span> 分配制作人和审核人
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                制作人
              </label>
              <select
                value={maker}
                onChange={(e) => setMaker(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">请选择制作人</option>
                {teamMembers.map((member) => (
                  <option key={member} value={member}>{member}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                审核人
              </label>
              <select
                value={reviewer}
                onChange={(e) => setReviewer(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">请选择审核人</option>
                {teamMembers.map((member) => (
                  <option key={member} value={member}>{member}</option>
                ))}
              </select>
            </div>
            
            <div className="pt-2 flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                确认分配
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

const AssetsList = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const [assets, setAssets] = useState<Asset[]>(mockAssets);
  const [isCreateSubAssetModalOpen, setIsCreateSubAssetModalOpen] = useState(false);
  const [isEditAssignModalOpen, setIsEditAssignModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; assetId: string } | null>(null);

  // 右键菜单处理
  const handleContextMenu = (e: React.MouseEvent, asset: Asset) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, assetId: asset.id });
    setSelectedAsset(asset);
  };

  // 关闭右键菜单
  const closeContextMenu = () => {
    setContextMenu(null);
  };

  // 创建子资产
  const handleCreateSubAsset = (e: React.MouseEvent) => {
    e.preventDefault();
    closeContextMenu();
    if (selectedAsset) {
      setIsCreateSubAssetModalOpen(true);
    }
  };

  // 处理子资产创建提交
  const handleCreateSubAssetSubmit = (asset: { name: string, description: string, type: string }) => {
    toast.success(`子资产 "${asset.name}" 创建成功！`);
    // 实际项目中这里会调用API创建子资产
  };

  // 编辑制作人和审核人
  const handleEditAssign = (e: React.MouseEvent) => {
    e.preventDefault();
    closeContextMenu();
    if (selectedAsset) {
      setIsEditAssignModalOpen(true);
    }
  };

  // 处理编辑分配提交
  const handleEditAssignSubmit = ({ maker, reviewer }: { maker: string, reviewer: string }) => {
    if (selectedAsset) {
      // 更新资产数据
      const updatedAssets = assets.map(asset => {
        if (asset.id === selectedAsset.id) {
          // 如果设置了制作人，状态从未开始变为待制作
          const newStatus = (maker && asset.status === '未开始') ? '待制作' : asset.status;
          return {
            ...asset,
            maker,
            reviewer,
            status: newStatus
          };
        }
        return asset;
      });
      
      setAssets(updatedAssets);
      setSelectedAsset({
        ...selectedAsset,
        maker,
        reviewer,
        status: (maker && selectedAsset.status === '未开始') ? '待制作' : selectedAsset.status
      });
      
      toast.success('任务分配已更新！');
    }
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
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
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
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">资产任务清单</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">管理项目的资产任务信息</p>
          </div>
          
          <div className="flex space-x-3">
            <button
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
              onClick={() => toast.success('创建新资产功能开发中')}
            >
              <PlusCircle className="mr-1.5 w-4 h-4" />
              创建新资产
            </button>
          </div>
        </div>
        
        {/* 资产列表表格 */}
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
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
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
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden xl:table-cell"
                  >
                    关联场次
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden xl:table-cell"
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
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    制作人
                    <Edit className="w-3 h-3 ml-1 inline" />
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    审核人
                    <Edit className="w-3 h-3 ml-1 inline" />
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell"
                  >
                    Token消耗量
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
                {assets.map((asset) => (
                  <tr
                    key={asset.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    onContextMenu={(e) => handleContextMenu(e, asset)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
                        <div className="font-medium text-gray-900 dark:text-white">{asset.name}</div>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs mt-0.5">
                        {asset.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <LevelBadge level={asset.level} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <TypeBadge type={asset.type} />
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <MultiValueBadge items={asset.episodes} />
                    </td>
                    <td className="px-6 py-4 hidden xl:table-cell">
                      <MultiValueBadge items={asset.scenes} />
                    </td>
                    <td className="px-6 py-4 hidden xl:table-cell">
                      <MultiValueBadge items={asset.shots} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={asset.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap cursor-pointer" onClick={(e) => {
                      e.stopPropagation();
                      setSelectedAsset(asset);
                      setIsEditAssignModalOpen(true);
                    }}>
                      <div className="flex items-center text-sm text-gray-900 dark:text-white">
                        <Users className="w-3.5 h-3.5 mr-1.5 text-gray-500 dark:text-gray-400" />
                        {asset.maker || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap cursor-pointer" onClick={(e) => {
                      e.stopPropagation();
                      setSelectedAsset(asset);
                      setIsEditAssignModalOpen(true);
                    }}>
                      <div className="flex items-center text-sm text-gray-900 dark:text-white">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-gray-500 dark:text-gray-400" />
                        {asset.reviewer || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <div className="text-sm text-gray-900 dark:text-white">{asset.tokenUsage}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          // 阻止默认右键菜单并显示自定义右键菜单
                          const rect = e.currentTarget.getBoundingClientRect();
                          setContextMenu({ x: rect.right, y: rect.top, assetId: asset.id });
                          setSelectedAsset(asset);
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
                  显示 <span className="font-medium">1</span> 到 <span className="font-medium">{assets.length}</span> 条，共 <span className="font-medium">{assets.length}</span> 条
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
                <p>• 右键点击资产，选择"创建子资产"可以为该资产添加相关联的子资产。</p>
                <p>• 点击制作人和审核人字段可以编辑任务分配，分配后任务状态会自动从未开始变为待制作。</p>
                <p>• Token消耗量会自动统计，用于后续成本核算。</p>
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
            onClick={handleCreateSubAsset}
          >
            创建子资产
          </button>
          <button
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={handleEditAssign}
          >
            编辑任务分配
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
      
      {/* 创建子资产模态框 */}
      {isCreateSubAssetModalOpen && selectedAsset && (
        <CreateSubAssetModal
          isOpen={isCreateSubAssetModalOpen}
          onClose={() => setIsCreateSubAssetModalOpen(false)}
          parentAsset={selectedAsset}
          onSubmit={handleCreateSubAssetSubmit}
        />
      )}
      
      {/* 编辑制作人和审核人模态框 */}
      {isEditAssignModalOpen && selectedAsset && (
        <EditAssignModal
          isOpen={isEditAssignModalOpen}
          onClose={() => setIsEditAssignModalOpen(false)}
          asset={selectedAsset}
          onSubmit={handleEditAssignSubmit}
        />
      )}
    </div>
  );
};

export default AssetsList;