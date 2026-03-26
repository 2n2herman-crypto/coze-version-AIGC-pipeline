import { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { 
  FileText, 
  Users, 
  Clock, 
  CheckCircle2, 
  MoreHorizontal,
  Film,
  Image,
  AlertTriangle
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '@/contexts/authContext';

// 镜头任务数据类型定义
interface ShotTask {
  id: string;
  shotName: string;
  shotDescription: string;
  shotType: string;
  episodes: string[];
  scenes: string[];
  assets: string[];
  maker: string;
  reviewer: string;
  taskType: '分镜图制作' | '分镜编辑' | '分镜视频制作' | '分镜视频编辑' | '分镜视频超分' | '视频对口型';
  status: '未开始' | '已发布' | '已审核' | '已完成';
  tokenUsage: number;
}

// Mock数据
const mockTasks: ShotTask[] = [
  {
    id: 'task-001',
    shotName: '特写-主角回头',
    shotDescription: '镜头从主角背后缓缓推进，最终定格在主角回头的表情上',
    shotType: '特写',
    episodes: ['第一集'],
    scenes: ['太空船内部'],
    assets: ['主角-星际探险家', '太空船-主舰'],
    maker: '张小明',
    reviewer: '李导演',
    taskType: '分镜图制作',
    status: '已发布',
    tokenUsage: 1200
  },
  {
    id: 'task-002',
    shotName: '全景-神秘星球',
    shotDescription: '从太空俯瞰神秘星球，展示整个星球的地形地貌',
    shotType: '全景',
    episodes: ['第一集'],
    scenes: ['神秘星球表面'],
    assets: ['神秘星球表面', '太空船-主舰'],
    maker: '王小红',
    reviewer: '王美术',
    taskType: '分镜图制作',
    status: '已审核',
    tokenUsage: 1800
  },
  {
    id: 'task-003',
    shotName: '推镜头-外星生物',
    shotDescription: '镜头从远处推向外星生物，逐渐清晰展示其外貌特征',
    shotType: '推镜头',
    episodes: ['第二集'],
    scenes: ['外星村落'],
    assets: ['外星生物-智慧种族', '外星村落'],
    maker: '李小华',
    reviewer: '李导演',
    taskType: '分镜视频制作',
    status: '未开始',
    tokenUsage: 0
  },
  {
    id: 'task-004',
    shotName: '摇镜头-外星村落全景',
    shotDescription: '镜头从左到右摇动，展示整个外星村落的布局和建筑风格',
    shotType: '摇镜头',
    episodes: ['第二集'],
    scenes: ['外星村落'],
    assets: ['外星村落', '外星建筑-圆顶', '外星生物-智慧种族'],
    maker: '张小明',
    reviewer: '王美术',
    taskType: '分镜编辑',
    status: '已完成',
    tokenUsage: 2500
  },
  {
    id: 'task-005',
    shotName: '近景-主角对话',
    shotDescription: '近景拍摄主角与外星生物的对话场景，重点展示表情交流',
    shotType: '近景',
    episodes: ['第二集'],
    scenes: ['外星村落'],
    assets: ['主角-星际探险家', '外星生物-智慧种族'],
    maker: '王小红',
    reviewer: '李导演',
    taskType: '视频对口型',
    status: '已发布',
    tokenUsage: 1500
  },
  {
    id: 'task-006',
    shotName: '远景-太空战斗',
    shotDescription: '远景展示太空船之间的激烈战斗场面',
    shotType: '远景',
    episodes: ['第三集'],
    scenes: ['太空船战斗'],
    assets: ['太空船-主舰', '激光枪-标准型'],
    maker: '李小华',
    reviewer: '王美术',
    taskType: '分镜视频超分',
    status: '未开始',
    tokenUsage: 0
  },
  {
    id: 'task-007',
    shotName: '移镜头-船舱内景',
    shotDescription: '镜头平滑移动，展示太空船内部的各个功能区域',
    shotType: '移镜头',
    episodes: ['第一集', '第三集'],
    scenes: ['太空船内部'],
    assets: ['太空船-主舰', '主角-星际探险家', '通讯器-wrist型'],
    maker: '张小明',
    reviewer: '李导演',
    taskType: '分镜视频编辑',
    status: '已完成',
    tokenUsage: 3000
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

// 任务类型标签组件
const TaskTypeBadge = ({ type }: { type: ShotTask['taskType'] }) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case '分镜图制作':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case '分镜编辑':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case '分镜视频制作':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case '分镜视频编辑':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      case '分镜视频超分':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case '视频对口型':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200';
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

// 任务状态标签组件
const StatusBadge = ({ status }: { status: ShotTask['status'] }) => {
  const statusConfig = {
    '未开始': { color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200', icon: <Clock className="w-3.5 h-3.5" /> },
    '已发布': { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', icon: <Clock className="w-3.5 h-3.5" /> },
    '已审核': { color: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
    '已完成': { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: <CheckCircle2 className="w-3.5 h-3.5" /> }
  };

  const config = statusConfig[status];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.icon}
      <span className="ml-1">{status}</span>
    </span>
  );
};

// 编辑制作人和审核人模态框
const EditAssignModal = ({ 
  isOpen, 
  onClose, 
  task,
  onSubmit 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  task: ShotTask;
  onSubmit: (data: { maker: string, reviewer: string }) => void; 
}) => {
  const [maker, setMaker] = useState(task.maker);
  const [reviewer, setReviewer] = useState(task.reviewer);
  
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
            为 <span className="font-medium text-blue-600 dark:text-blue-400">{task.shotName}</span> 分配制作人和审核人
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

const TasksList = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const [tasks, setTasks] = useState<ShotTask[]>(mockTasks);
  const [isEditAssignModalOpen, setIsEditAssignModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ShotTask | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; taskId: string } | null>(null);

  // 右键菜单处理
  const handleContextMenu = (e: React.MouseEvent, task: ShotTask) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, taskId: task.id });
    setSelectedTask(task);
  };

  // 关闭右键菜单
  const closeContextMenu = () => {
    setContextMenu(null);
  };

  // 编辑制作人和审核人
  const handleEditAssign = (e: React.MouseEvent) => {
    e.preventDefault();
    closeContextMenu();
    if (selectedTask) {
      setIsEditAssignModalOpen(true);
    }
  };

  // 处理编辑分配提交
  const handleEditAssignSubmit = ({ maker, reviewer }: { maker: string, reviewer: string }) => {
    if (selectedTask) {
      // 更新任务数据
      const updatedTasks = tasks.map(task => {
        if (task.id === selectedTask.id) {
          // 如果设置了制作人，状态从未开始变为已发布
          const newStatus = (maker && task.status === '未开始') ? '已发布' : task.status;
          return {
            ...task,
            maker,
            reviewer,
            status: newStatus
          };
        }
        return task;
      });
      
      setTasks(updatedTasks);
      setSelectedTask({
        ...selectedTask,
        maker,
        reviewer,
        status: (maker && selectedTask.status === '未开始') ? '已发布' : selectedTask.status
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
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
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
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">镜头任务</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">管理项目的镜头任务信息</p>
          </div>
          
          <div className="flex space-x-3">
            <button
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
              onClick={() => navigateToManagement('shots')}
            >
              <Film className="mr-1.5 w-4 h-4" />
              从镜头创建任务
            </button>
          </div>
        </div>
        
        {/* 任务列表表格 */}
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
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    制作人
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    审核人
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
                {tasks.map((task) => (
                  <tr
                    key={task.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    onContextMenu={(e) => handleContextMenu(e, task)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Image className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
                        <div className="font-medium text-gray-900 dark:text-white">{task.shotName}</div>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs mt-0.5">
                        {task.shotDescription}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <TaskTypeBadge type={task.taskType} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={task.status} />
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <MultiValueBadge items={task.episodes} />
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <MultiValueBadge items={task.scenes} />
                    </td>
                    <td className="px-6 py-4 hidden xl:table-cell">
                      <MultiValueBadge items={task.assets} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap cursor-pointer" onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTask(task);
                      setIsEditAssignModalOpen(true);
                    }}>
                      <div className="flex items-center text-sm text-gray-900 dark:text-white">
                        <Users className="w-3.5 h-3.5 mr-1.5 text-gray-500 dark:text-gray-400" />
                        {task.maker || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap cursor-pointer" onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTask(task);
                      setIsEditAssignModalOpen(true);
                    }}>
                      <div className="flex items-center text-sm text-gray-900 dark:text-white">
                        <Users className="w-3.5 h-3.5 mr-1.5 text-gray-500 dark:text-gray-400" />
                        {task.reviewer || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <div className="text-sm text-gray-900 dark:text-white">{task.tokenUsage}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          // 阻止默认右键菜单并显示自定义右键菜单
                          const rect = e.currentTarget.getBoundingClientRect();
                          setContextMenu({ x: rect.right, y: rect.top, taskId: task.id });
                          setSelectedTask(task);
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
                  显示 <span className="font-medium">1</span> 到 <span className="font-medium">{tasks.length}</span> 条，共 <span className="font-medium">{tasks.length}</span> 条
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
                <p>• 点击"从镜头创建任务"按钮可以返回镜头清单页面创建新的镜头任务。</p>
                <p>• 点击制作人和审核人字段可以编辑任务分配，分配后任务状态会自动从未开始变为已发布。</p>
                <p>• 镜头任务自动继承镜头的基本信息、关联集、关联场次和关联资产。</p>
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
          <button
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => {
              closeContextMenu();
              toast.success('标记完成功能开发中');
            }}
          >
            标记完成
          </button>
        </div>
      )}
      
      {/* 编辑制作人和审核人模态框 */}
      {isEditAssignModalOpen && selectedTask && (
        <EditAssignModal
          isOpen={isEditAssignModalOpen}
          onClose={() => setIsEditAssignModalOpen(false)}
          task={selectedTask}
          onSubmit={handleEditAssignSubmit}
        />
      )}
    </div>
  );
};

export default TasksList;