import type { ReactNode } from 'react';
import {
  FiBarChart2,
  FiBookOpen,
  FiBox,
  FiClipboard,
  FiCornerUpLeft,
  FiCreditCard,
  FiDollarSign,
  FiDownload,
  FiEdit3,
  FiFileText,
  FiGitBranch,
  FiGrid,
  FiLayers,
  FiMap,
  FiPackage,
  FiPercent,
  FiPieChart,
  FiRotateCcw,
  FiSettings,
  FiShoppingCart,
  FiTarget,
  FiTrendingUp,
  FiUploadCloud,
  FiUsers,
} from 'react-icons/fi';

/** Pick a sidebar icon from menu label / path keywords. */
export function getMenuIcon(name?: string, path?: string): ReactNode {
  const n = `${name || ''} ${path || ''}`.toLowerCase();

  if (/(sales\s*return|return.*sales)/.test(n)) return <FiRotateCcw />;
  if (/(purchase\s*return|return.*purchase)/.test(n)) return <FiCornerUpLeft />;
  if (/sales|revenue|invoice/.test(n)) return <FiTrendingUp />;
  if (/purchase|procurement|requisition|po\b/.test(n)) return <FiShoppingCart />;
  if (/tender\s*cost|costing|cost\s*sheet/.test(n)) return <FiPieChart />;
  if (/tender/.test(n)) return <FiFileText />;
  if (/\blc\b|letter\s*of\s*credit|transactional\s*lc/.test(n))
    return <FiCreditCard />;
  if (/cheque|check\s*book/.test(n)) return <FiBookOpen />;
  if (/collection/.test(n)) return <FiDollarSign />;
  if (/payment/.test(n)) return <FiCreditCard />;
  if (/commission|incentive/.test(n)) return <FiPercent />;
  if (/stock|inventory|warehouse/.test(n)) return <FiPackage />;
  if (/import\s*in|import\s*lc/.test(n)) return <FiDownload />;
  if (/migrate|import$|data\s*migration/.test(n)) return <FiUploadCloud />;
  if (/report|analytics|dashboard/.test(n)) return <FiBarChart2 />;
  if (/chain\s*config|configuration|flow|reactflow/.test(n))
    return <FiGitBranch />;
  if (/available\s*chain|chain\s*status/.test(n)) return <FiLayers />;
  if (/team|member/.test(n)) return <FiUsers />;
  if (/buyer/.test(n)) return <FiTarget />;
  if (/region|district|map/.test(n)) return <FiMap />;
  if (/voucher/.test(n)) return <FiClipboard />;
  if (/edit/.test(n)) return <FiEdit3 />;
  if (/setting|config/.test(n)) return <FiSettings />;
  if (/box|pack/.test(n)) return <FiBox />;
  if (/all|template/.test(n)) return <FiGrid />;

  return <FiGrid />;
}
