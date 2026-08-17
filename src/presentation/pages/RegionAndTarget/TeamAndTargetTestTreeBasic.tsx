/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, ReactNode, ReactElement } from 'react';

type Props = {};

interface SimpleTreeViewProps {
  defaultExpandedItems?: string[];
  children: ReactNode; // The children can be any ReactNode
}

interface CustomTreeItemWithButtonProps {
  label: string;
  id: number;
  children?: ReactNode;
  expandedItems?: string[]; // This property will be passed down
  toggleItem?: (itemId: string) => void; // This function will be passed down
  focusedItemId?: string | null; // This property will be passed down
}

export const SimpleTreeView: React.FC<SimpleTreeViewProps> = ({
  defaultExpandedItems = [],
  children,
}) => {
  const [expandedItems, setExpandedItems] =
    useState<string[]>(defaultExpandedItems);
  const [focusedItemId, setFocusedItemId] = useState<string | null>(null);

  const toggleItem = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
    setFocusedItemId(itemId); // Set the clicked item as focused
  };

  return (
    <div className="tree-view">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          // Explicitly pass focusedItemId as undefined if it's null
          return React.cloneElement(
            child as ReactElement<CustomTreeItemWithButtonProps>,
            {
              expandedItems,
              toggleItem,
              focusedItemId: focusedItemId ?? undefined, // Use undefined instead of null
            }
          );
        }
        return child;
      })}
    </div>
  );
};

export const CustomTreeItemWithButton: React.FC<
  CustomTreeItemWithButtonProps
> = ({
  label,
  id,
  children,
  expandedItems = [],
  toggleItem,
  focusedItemId,
}) => {
  const isExpanded = expandedItems.includes(id.toString());
  const isFocused = focusedItemId === id.toString();

  return (
    <div className="tree-item m-1">
      {/* Header with Icon and Label */}
      <div
        className={`flex items-center cursor-pointer px-2 py-1 rounded-md transition-colors duration-300
            hover:bg-blue-100 active:bg-blue-200 focus:outline-none ${
              isFocused ? 'bg-blue-200' : ''
            }`}
        onClick={() => toggleItem?.(id.toString())}
        tabIndex={0} // To make it focusable for keyboard navigation
      >
        {/* Expand/Collapse Button */}
        <button
          type="button"
          className={`mr-2 transform ${
            isExpanded ? 'rotate-90' : ''
          } transition-transform duration-300`}
        >
          <i className="fas fa-chevron-circle-right text-[15px] text-blue-600" />
        </button>

        {/* Label */}
        <span className=" text-slate-800 text-[14px]">{label}</span>
      </div>

      {/* Content with Dashes */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        {/* Vertical Dashes */}
        <div className="relative">
          <div
            className={`border-l-2 border-dashed border-gray-400 ml-[14px] transition-all duration-500 ease-in-out ${
              isExpanded ? 'max-h-screen' : 'h-0'
            }`}
          >
            <div className="ml-3 text-sm text-gray-700">{children}</div>
          </div>
        </div>

        {/* Details */}
      </div>
    </div>
  );
};

const TeamAndTargetTestTree = (props: Props) => {
  const teamsInfo = [
    { teamId: 1, teamName: 'Team Alpha' },
    { teamId: 2, teamName: 'Team Beta' },
  ];

  return (
    <div className="m-10">
      <SimpleTreeView defaultExpandedItems={['0']}>
        {teamsInfo.map((teamRow) => (
          <CustomTreeItemWithButton
            key={teamRow.teamId}
            label={teamRow.teamName}
            id={teamRow.teamId}
          >
            <div className="ml-2 mt-1 text-sm text-gray-700">
              Team {teamRow.teamName} Details
              <input />
            </div>
          </CustomTreeItemWithButton>
        ))}
      </SimpleTreeView>
    </div>
  );
};

export default TeamAndTargetTestTree;
