import React, { useState, useEffect, ReactNode } from "react";
import styled from "styled-components";
import { AiOutlineFile, AiOutlineFolder } from "react-icons/ai";

const StyledTree = styled.div`
  line-height: 1.5;
`;
const StyledFile = styled.div<{ isSelected: boolean }>`
  padding-left: 20px;
  display: flex;
  align-items: center;
  color: ${({ isSelected }) => (isSelected ? "blue" : "black")};
  cursor: pointer;
  span {
    margin-left: 5px;
  }
`;
const StyledFolder = styled.div<{ isSelected: boolean }>`
  padding-left: 20px;
  color: ${({ isSelected }) => (isSelected ? "blue" : "black")};

  .folder--label {
    display: flex;
    align-items: center;
    span {
      margin-left: 5px;
    }
  }

  .hidden-children {
    display: none;
  }
`;

type FileProps = {
  name: string;
  onSelect: (path: string, type: string, level: number) => void;
  selected: { path: string | null; type: string | null };
  path: string;
  level: number;
};

const File: React.FC<FileProps> = ({ name, onSelect, selected, path, level }) => {
  const isSelected = selected.path === path;

  const handleClick = () => {
    onSelect(path, "file", level);
  };

  return (
    <StyledFile isSelected={isSelected} onClick={handleClick}>
      <AiOutlineFile />
      <span>{name}</span>
    </StyledFile>
  );
};

type FolderProps = {
  name: string;
  children: ReactNode;
  onSelect: (path: string, type: string, level: number, isOpen?: boolean) => void;
  selected: { path: string | null; type: string | null };
  path: string;
  level: number;
  expandedFolders: string[];
  setExpandedFolders: React.Dispatch<React.SetStateAction<string[]>>;
};

const Folder: React.FC<FolderProps> = ({
  name,
  children,
  onSelect,
  selected,
  path,
  level,
  expandedFolders,
  setExpandedFolders,
}) => {
  const isFolderOpen = expandedFolders.includes(path);
  const isSelected = selected.path === path;

  const handleToggle = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    onSelect(path, "folder", level, !isFolderOpen);

    if (isFolderOpen) {
      setExpandedFolders((prevState) => prevState.filter((folderPath) => folderPath !== path));
    } else {
      setExpandedFolders((prevState) => [...prevState, path]);
    }
  };

  const childrenWithProps = React.Children.map(children, (child) => {
    if (child) {
      const childPath = `${path}/${(child as React.ReactElement).props.name}`;
      return React.cloneElement(child as React.ReactElement, {
        onSelect,
        selected,
        path: childPath,
        level: level + 1,
        expandedFolders,
        setExpandedFolders,
      });
    }
    return null;
  });

  return (
    <StyledFolder isSelected={isSelected}>
      <div className="folder--label" onClick={handleToggle}>
        <AiOutlineFolder />
        <span>{name}</span>
      </div>
      <div className={isFolderOpen ? "" : "hidden-children"}>{childrenWithProps}</div>
    </StyledFolder>
  );
};

type TreeNode = {
  type: "file" | "folder";
  name: string;
  size?: string;
  modified?: string;
  children?: TreeNode[];
};

type TreeProps = {
  children: ReactNode;
  onSelect: (path: string, type: string, level: number, isOpen?: boolean) => void;
  selected: { path: string | null; type: string | null };
  isExpanded: boolean;
  expandedFolders: string[];
  setExpandedFolders: React.Dispatch<React.SetStateAction<string[]>>;
};

const Tree: React.FC<TreeProps> & {
  File: typeof File;
  Folder: typeof Folder;
} = ({ children, onSelect, selected, isExpanded, expandedFolders, setExpandedFolders }) => {
  const childrenWithProps = React.Children.map(children, (child) => {
    if (child) {
      return React.cloneElement(child as React.ReactElement, {
        onSelect,
        selected,
        isExpanded,
        expandedFolders,
        setExpandedFolders,
      });
    }
    return null;
  });
  return <StyledTree>{childrenWithProps}</StyledTree>;
};
Tree.File = File;
Tree.Folder = Folder;

export default function App() {
      const [selected, setSelected] = useState({ path: null, type: null });
      const [isExpanded, setIsExpanded] = useState(false);
      const [lastClickedFolder, setLastClickedFolder] = useState(null);
      const [newNodeName, setNewNodeName] = useState("");
      const [newNodeType, setNewNodeType] = useState("file");
      const [expandedFolders, setExpandedFolders] = useState<string[]>([]);
      const [treeData, setTreeData] = useState<TreeNode[]>([
          {
              type: "folder",
              name: "project",
              children: [
                {
                  type: "folder",
                  name: "src",
                  children: [
                    { type: "file", name: "index.js", size: '1KB', modified: '2022-03-08 11:30:00'},
                    { type: "folder", name: "components", children: [{ type: 'file', name: 'Button.jsx', size: '2KB', modified: '2022-03-07 15:00:00'}, 
                    { type: 'file', name: 'Card.jsx', size: '3KB', modified: '2022-03-06 10:00:00'}, 
                    { type: 'folder', name: 'styles', children: [{ type: 'file', name: 'index.css', size: '1KB', modified: '2022-03-07 09:00:00' }, { type: 'file', name: 'components.css', size: '2KB', modified: '2022-03-06 12:00:00' }]}] },
                  ],
                },
                { type: 'folder', name: 'public', children: [{ type: 'file', name: 'index.html', size: '1KB', modified: '2022-03-08 10:00:00'}, { type: 'file', name: 'favicon.ico', size: '5KB', modified: '2022-03-07 16:00:00'}]},
                { type: "file", name: "package.json", size: '1KB', modified: '2022-03-08 12:00:00' },
                { type: "file", name: "README.md", size: '2KB', modified: '2022-03-08 13:00:00'}
              ],
            },
            
      ])
  
  
      useEffect(() => {
          console.log("Updated treeData (folder, open):", treeData);
        }, [treeData]);
  
      useEffect(() => {
          console.log(`🌳 treeData`, treeData)
      }, [treeData, setTreeData])
  
      const handleNewNodeNameChange = (e) => {
          setNewNodeName(e.target.value);
        };
        
        const handleNewNodeTypeChange = (e) => {
          setNewNodeType(e.target.value);
        };
  
  
      const handleNewNodeSubmit = (e) => {
          e.preventDefault();
          if (newNodeName === "") return;
        
    

          const newItem: TreeNode = {
            type: newNodeType as "file" | "folder",
            name: newNodeName,
            children: newNodeType === "folder" ? [] : undefined,
          };
        
          if (lastClickedFolder === null) {
            setTreeData((prevTreeData) => {
              const updatedTreeData = [...prevTreeData, newItem];
              console.log("Updated treeData:", updatedTreeData);
              return updatedTreeData;
            });
          } else {
            addItemToTreeData(treeData, lastClickedFolder, newItem);
          }
        
          setNewNodeName("");
        };
              
        
  
        function addItemToTreeData(prevTreeData, pathObj, item) {
          const deepClone = (obj) => JSON.parse(JSON.stringify(obj));
          const updatedTreeData = deepClone(prevTreeData);
        
          const addItem = (treeNodes, path) => {
            if (path.length === 0) {
              treeNodes.push(item);
              return;
            }
        
            const [currentPath, ...remainingPath] = path;
            const currentNode = treeNodes.find((child) => child.name === currentPath);
        
            if (currentNode) {
              addItem(currentNode.children, remainingPath);
            }
          };
        
          const pathArray = pathObj.split('/').filter((part) => part.length > 0);
          addItem(updatedTreeData, pathArray);
        
          console.log("addItemToTreeData updatedTreeData:", updatedTreeData);
          setTreeData(updatedTreeData);
        }
  
  
        const renderTree = (nodes = [], parentPath = "", level = 1) => {
          return nodes
            .filter((node) => node)
            .map((node) => {
              const currentPath = `${parentPath}/${node.name}`;
              if (node.type === "file") {
                return (
                  <Tree.File
                    key={currentPath}
                    name={node.name}
                    path={currentPath}
                    level={level}
                    onSelect={handleSelect}
                  />
                );
              } else if (node.type === "folder") {
                return (
                  <Tree.Folder
                    key={currentPath}
                    name={node.name}
                    path={currentPath}
                    level={level}
                    onSelect={handleSelect}
                  >
                    {renderTree(node.children, currentPath, level + 1)}
                  </Tree.Folder>
                );
              }
            });
        };
  
  
      const handleSelect = (path, type, level, isOpen) => {
          setSelected((prevState) => {
            // Deselect if the same item is clicked
            if (prevState.path === path) {
              return { path: null, type: null };
            }
            return { path, type, level, isOpen };
          });
        
          if (type === "folder") {
            setLastClickedFolder(path);
          }
        
          // Update the expandedFolders state
          if (type === "folder") {
            if (isOpen) {
              setExpandedFolders((prevState) => [...prevState, path]);
            } else {
              setExpandedFolders((prevState) =>
                prevState.filter((folderPath) => folderPath !== path)
              );
            }
          }
        };
      
        const handleExpandCollapse = () => {
          setIsExpanded((prevState) => {
            if (prevState) {
              // Collapse all folders
              setExpandedFolders([]);
              setLastClickedFolder(null);
            } else {
              // Expand all folders
              const allFolders = getAllFolders(treeData);
              setExpandedFolders(allFolders);
              setLastClickedFolder("");
            }
            return !prevState;
          });
        };
  
    const getAllFolders = (nodes, parentPath = "") => {
      return nodes.reduce((acc, node) => {
        const currentPath = `${parentPath}/${node.name}`;
        if (node.type === "folder") {
          const childFolders = getAllFolders(node.children, currentPath);
          return [...acc, currentPath, ...childFolders];
        }
        return acc;
      }, []);
    };
  
  
  
    return (
      <div className="App">
        <button onClick={handleExpandCollapse}>
          {isExpanded ? "Collapse All" : "Expand All"}
        </button>
  
          <form onSubmit={handleNewNodeSubmit}>
              <input
                  type="text"
                  placeholder="Enter file/folder name"
                  value={newNodeName}
                  onChange={handleNewNodeNameChange}
              />
              <select value={newNodeType} onChange={handleNewNodeTypeChange}>
                  <option value="file">File</option>
                  <option value="folder">Folder</option>
              </select>
              <button type="submit">Add</button>
              </form>
              <Tree onSelect={handleSelect} selected={selected} isExpanded={isExpanded} expandedFolders={expandedFolders} setExpandedFolders={setExpandedFolders}>
              {renderTree(treeData)}
              </Tree>
      </div>
    );
  }